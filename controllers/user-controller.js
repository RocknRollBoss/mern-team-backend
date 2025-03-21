import UserModel from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";

export const register = async (req, res) => {
  try {
    const { email, fullName, avatarUrl, password } = req.body;
    const salt = await bcrypt.genSalt(10);
    const hash = await bcrypt.hash(password, salt);
    const doc = new UserModel({
      email,
      fullName,
      avatarUrl,
      passwordHash: hash,
    });
    const user = await doc.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      "key12345",
      {
        expiresIn: "7d",
      }
    );
    const { passwordHash, ...data } = user._doc;

    res.json({ ...data, token });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to register" });
  }
};

export const login = async (req, res) => {
  try {
    const findUser = await UserModel.findOne({ email: req.body.email });

    if (!findUser) {
      return res.status(404).json({
        message: "user not found",
      });
    }

    const isCorrectPassword = await bcrypt.compare(
      req.body.password,
      findUser._doc.passwordHash
    );

    if (!isCorrectPassword) {
      return res.status(400).json({
        message: "Incorrect password or login",
      });
    }

    const token = jwt.sign(
      {
        _id: findUser._id,
      },
      "key12345",
      {
        expiresIn: "30d",
      }
    );

    const { passwordHash, ...data } = findUser._doc;

    res.json({
      ...data,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "failed to login",
    });
  }
};

export const getCurrent = async (req, res) => {
  try {
    const user = await UserModel.findById(req.userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const { passwordHash, ...data } = user._doc;

    res.json(data);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Incorect",
    });
  }
};
