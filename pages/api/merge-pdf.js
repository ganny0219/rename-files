import AdmZip from "adm-zip";
import PDFMerger from "pdf-merger-js";
import * as fs from "fs";
import multer from "multer";
import { createRouter } from "next-connect";
import { google } from "googleapis";
import path from "path";

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};
const router = createRouter();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // cb(null, `./public`);
    cb(null, "/tmp/");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});
const upload = multer({ storage: storage });
const uploadFields = upload.fields([
  { name: "listFiles" },
  { name: "addFiles" },
]);

router.use(uploadFields).post(async (req, res) => {
  const zip = new AdmZip();
  for (const listFile of req.files.listFiles) {
    const merger = new PDFMerger();
    await merger.add(listFile.path);

    for (const addFile of req.files.addFiles) {
      await merger.add(addFile.path);
    }
    const mergedBuffer = await merger.saveAsBuffer();
    zip.addFile(listFile.originalname, Buffer.from(mergedBuffer, "utf8"));
  }

  const auth = await google.auth.getClient({
    scopes: ["https://www.googleapis.com/auth/drive"],
    keyFile: path.join(process.cwd(), "credentials.json"),
  });

  const driver = google.drive({ version: "v3", auth });

  fs.writeFileSync(`/tmp/loveyoupdf.zip`, zip.toBuffer());
  const fileBuffer = fs.createReadStream(`/tmp/loveyoupdf.zip`);

  // fs.writeFileSync(`./public/loveyoupdf.zip`, zip.toBuffer());
  // const fileBuffer = fs.createReadStream(`./public/loveyoupdf.zip`);
  await driver.files.create({
    requestBody: {
      name: "loveyoupdf.zip",
      parents: ["1b5nnmBFayrG-Bkb2n8oEBUe4ufZtTchF"],
    },
    media: { mimeType: "application/zip", body: fileBuffer },
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
