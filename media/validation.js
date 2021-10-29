import { body } from "express-validator";

export const mediaValidationMiddlewares = [
  body("Title").exists().withMessage("Title is required!"),
  body("Year").exists().withMessage("Year is required!"),
  body("Type").exists().withMessage("Type is required!"),
  body("Poster").exists().withMessage("Poster is required!"),
];
