import express from "express";
import { SaveMarkDownText, UploadFileAndConvertToText } from "../controllers";
import multer, { diskStorage } from "multer";

const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files");
  },

  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "_" + file.originalname
    );
  },
});

const file = multer({ storage: storage });

const router = express.Router();

router.post("/upload-file", file.single("file"), UploadFileAndConvertToText);

router.get("/save-markdown-text", SaveMarkDownText);

export { router as FileRoute };
