import express from "express";
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";
import uniqid from "uniqid";
import {
  getMediaJson,
  writeMediaJson,
  getReviewsJson,
} from "../lib/fs-tools.js";
import createHttpError from "http-errors";
import { mediaValidationMiddlewares } from "./validation.js";
import { validationResult } from "express-validator";

const mediaRouter = express.Router();

mediaRouter.get("/", async (req, res, next) => {
  try {
    const media = await getMediaJson();
    if (!media.lenght) {
      next(createHttpError(404, "No media has been found."));
    }
    if (req.query.Type) {
      const filteredMedia = media.fileter((media) =>
        media.Type.toLowerCase().includes(req.query.Type)
      );
      res.send(filteredMedia);
    } else {
      res.send(media);
    }
  } catch (error) {
    next(error);
  }
});

mediaRouter.post("/", mediaValidationMiddlewares, async (req, res, next) => {
  try {
    const errorList = validationResult(req);
    if (errorList.isEmpty()) {
      const media = await getMediaJson();
      const newMedia = {
          imdbID: uniqid(),
          ...req.body,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      media.push(newMedia);
      await writeMediaJson(media);
      res.status(201).send({ imdbID: newMedia.imdbID });
    } else {
      next(createHttpError(400, { errorList }));
    }
  } catch (error) {
    next(error);
  }
});

export default mediaRouter;
