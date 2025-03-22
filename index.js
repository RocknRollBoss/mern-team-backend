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
const port = process.env.PORT || 3000;
async function start() {
  try {
    await mongoose.connect(process.env.MONGO);
    app.listen(port, () => {
      console.log(`Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

start();

const app = express();

app.get("/", (req, res) => {
  res.send("Hello, Vercel!");
});

app.use(express.json());

app.use(
  cors({
    origin: "https://mern-team-45hlub63i-rocknrolls-projects.vercel.app",
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"],
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.post("/auth/register", registerValidation, validateErrors, register);
app.post("/auth/login", loginValidation, validateErrors, login);
app.get("/auth/current", checkAuth, getCurrent);
app.post("/team", checkAuth, teamValidation, validateErrors, create);
app.get("/team", getAll);
app.get("/team/:id", getOne);
app.delete("/team/:id", checkAuth, remove);
app.patch("/team/:id", checkAuth, teamValidation, validateErrors, update);

export default app;
