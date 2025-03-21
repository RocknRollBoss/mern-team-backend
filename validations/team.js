import { body } from "express-validator";
export const teamValidation = [
  body("name", "Enter name ").isLength({ min: 3 }).isString(),
  body("age", "Enter age").isLength({ min: 1 }).isString(),
  body("address", "Incorrect address").optional().isString(),
  body("position", "Incorrect positional").optional().isString(),
  body("imageUrl", "Incorect image url").optional().isString(),
];
