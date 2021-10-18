import { Request, Response } from "express";
import multer from "multer";
import { nanoid } from "nanoid";
import path from "path";

import { ENV } from "./environment";
import logger from "./logger";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    if (!ENV.MEDIAS_FOLDER)
      throw new Error("Can't accept uploads without medias folder defined");

    cb(null, path.resolve(__dirname, ENV.MEDIAS_FOLDER as string));
  },
  filename: function (req, file, cb) {
    cb(null, [nanoid(50), file.originalname].join("_"));
  },
});

const upload = multer({
  storage: storage,
}).array("file", 1);

export const uploadMiddleware = async (
  req: Request,
  res: Response
): Promise<void> => {
  const filename = await new Promise((resolve, reject) => {
    upload(req, res, function (error: unknown) {
      if (error) {
        logger.error("Error uploading media", { error });
        reject(error);
      }

      const [file] = req.files as Express.Multer.File[];

      resolve(file.filename);
    });
  });

  res.send(filename);
};
