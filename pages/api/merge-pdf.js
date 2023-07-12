import AdmZip from "adm-zip";
import PDFMerger from "pdf-merger-js";
import * as fs from "fs";
import multer from "multer";
import { createRouter } from "next-connect";

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
  // fs.writeFileSync(`./public/loveyoupdf.zip`, zip.toBuffer());
  // const fileBuffer = fs.readFileSync(`./public/loveyoupdf.zip`);

  fs.writeFileSync(`/tmp/loveyoupdf.zip`, zip.toBuffer());
  const fileBuffer = fs.readFileSync(`/tmp/loveyoupdf.zip`);

  res.setHeader("Content-Type", "application/zip");
  res.send(fileBuffer);
});

export default router.handler({
  onError: (err, req, res) => {
    console.error(err.stack);
    res.status(err.statusCode || 500).end(err.message);
  },
});
