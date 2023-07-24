import { createRouter } from "next-connect";
import multer from "multer";
import AdmZip from "adm-zip";
import * as fs from "fs";
import path from "path";
import { google } from "googleapis";

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "/tmp/");
    // cb(null, "public/");
  },
  filename: (req, file, cb) => {
    const newRegex = new RegExp(req.body.oldText, "gi");
    cb(null, file.originalname.replace(newRegex, req.body.newText));
  },
});
const upload = multer({ storage: storage });

const uploadFile = upload.array("files");
const router = createRouter();

router.use(uploadFile).post(async (req, res) => {
  const zip = new AdmZip();

  for (const file of req.files) {
    zip.addLocalFile(file.path);
  }

  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/drive"],
    keyFile: path.join(process.cwd(), "credentials.js"),
  });

  const driver = google.drive({ version: "v3", auth });

  fs.writeFileSync("/tmp/loveyou.zip", zip.toBuffer());
  const fileBuffer = fs.createReadStream("/tmp/loveyou.zip");
  // fs.writeFileSync("public/loveyou.zip", zip.toBuffer());
  // const fileBuffer = fs.createReadStream("public/loveyou.zip");

  await driver.files.create({
    requestBody: {
      name: "loveyou.zip",
      parents: ["1b5nnmBFayrG-Bkb2n8oEBUe4ufZtTchF"],
    },
    media: {
      mimeType: "application/zip",
      body: fileBuffer,
    },
  });

  res.setHeader("Content-Type", "application/zip");
  res.status(201).send();
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
