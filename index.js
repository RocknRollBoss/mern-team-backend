import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { loginValidation, registerValidation } from "./validations/auth.js";
import checkAuth from "./utils/checkAuth.js";
import validateErrors from "./utils/validateErrors.js";
import { register, login, getCurrent } from "./controllers/user-controller.js";
import {
  create,
  getAll,
  getOne,
  remove,
  update,
} from "./controllers/team-controller.js";
import { teamValidation } from "./validations/team.js";
dotenv.config();
async function start() {
  try {
    await mongoose.connect(process.env.MONGO);
    app.listen(process.env.PORT, () =>
      console.log(`server start in port ${process.env.PORT}`)
    );
  } catch (error) {
    console.log(error);
  }
}

start();

const app = express();

app.use(express.json());
app.use(cors());
app.post("/auth/register", registerValidation, validateErrors, register);
app.post("/auth/login", loginValidation, validateErrors, login);
app.get("/auth/current", checkAuth, getCurrent);
app.post("/team", checkAuth, teamValidation, validateErrors, create);
app.get("/team", getAll);
app.get("/team/:id", getOne);
app.delete("/team/:id", checkAuth, remove);
app.patch("/team/:id", checkAuth, teamValidation, validateErrors, update);
