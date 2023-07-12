import { createRouter } from "next-connect";
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
    cb(null, "/tmp/");
  },
  filename: (req, file, cb) => {
    const newRegex = new RegExp(req.body.oldText, "gi");
    cb(null, file.originalname.replace(newRegex, req.body.newText));
  },
});
const upload = multer({ storage: storage });

const uploadFile = upload.array("files");
const router = createRouter();

router.use(uploadFile).post((req, res) => {
  const zip = new AdmZip();

  req.files.forEach((file) => {
    zip.addLocalFile(file.path);
  });

  fs.writeFileSync("/tmp/loveyou.zip", zip.toBuffer());
  const fileBuffer = fs.readFileSync("/tmp/loveyou.zip");

  res.setHeader("Content-Type", "application/zip");
  res.send(fileBuffer);
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
