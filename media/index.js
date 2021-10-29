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

mediaRouter.get("/:imdbID", async (req, res, next) => {
  try {
    const medias = await getMediaJson();
    const media = medias.find((p) => p.imdbID === req.params.imdbID);
    if (media) {
      res.send(media);
    } else {
      next(
        createHttpError(404, `Products with id ${req.params.imdbID} not found!`)
      );
    }
  } catch (error) {
    next(error);
  }
});

mediaRouter.get("/:imdbID/reviews", async (req, res, next) => {
  try {
    const reviews = await getReviewsJson();
    const reviewsByProductId = reviews.filter(
      (review) => review.imdbID === req.params.imdbID
    );
    if (reviewsByProductId.length) {
      res.send(reviewsByProductId);
    } else {
      next(createHttpError(404, `No reviews found for ${req.params.imdbID}`));
    }
  } catch (error) {
    next(error);
  }
});

mediaRouter.put(
  "/:imdbID",
  mediaValidationMiddlewares,
  async (req, res, next) => {
    try {
      const errorList = validationResult(req);
      if (errorList.isEmpty()) {
        const medias = await getReviewsJson();
        const index = medias.findIndex(
          (media) => media.imdbID === req.params.imdbID
        );
        const mediaToModify = medias[index];
        const updatedFields = { ...req.body, updatedDate: new Date() };
        const updatedMedia = { ...mediaToModify, ...updatedFields };
        medias[index] = updatedMedia;
        await writeMediaJson(medias);
        res.status(200).send({ imdbID: medias[index].imdbID });
      } else {
        next(createHttpError(400, { errorList }));
      }
    } catch (error) {
      next(error);
    }
  }
);

mediaRouter.delete("/:imdbID", async (req, res, next) => {
    try {
      const medias = await getReviewsJson();
      const remainingMedias = medias.filter(
        (media) => media.imdbID !== req.params.imdbID
      );
      await writeMediaJson(remainingMedias);
      res.status(204).send();
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
