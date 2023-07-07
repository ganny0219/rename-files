import { createRouter } from "next-connect";
import path from "path";
import multer from "multer";
import AdmZip from "adm-zip";
import * as fs from "fs";

export const config = {
  api: {
    externalResolver: true,
    bodyParser: false,
  },
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/love");
  },
  filename: (req, file, cb) => {
    const newRegex = new RegExp(req.body.oldText, "gi");
    cb(null, file.originalname.replace(newRegex, req.body.newText));
  },
});
const upload = multer({ storage: storage });

const uploadFile = upload.array("files");
const router = createRouter();

const cleanFile = (req, res, next) => {
  const filePath = path.join(process.cwd(), "public", "love");
  const files = fs.readdirSync("public/love");
  if (files.length != 0) {
    for (const file of files) {
      fs.unlinkSync(filePath + "/" + file);
    }
  }

  const zipPath = path.join(process.cwd(), "public", "loveyou.zip");

  const zipExist = fs.existsSync(zipPath);
  if (zipExist) {
    fs.unlinkSync(zipPath);
  }
  next();
};

router
  .use(cleanFile)
  .use(uploadFile)
  .post((req, res) => {
    const zip = new AdmZip();
    const zipPath = path.join(process.cwd(), "public", "loveyou.zip");

    req.files.forEach((file) => {
      zip.addLocalFile(file.path);
    });

    fs.writeFileSync(zipPath, zip.toBuffer());
    const fileBuffer = fs.readFileSync(zipPath);

    res.setHeader("Content-Type", "application/zip");
    res.send(fileBuffer);
  });

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
