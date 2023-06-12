const express = require("express");
const bcrypt = require("bcrypt");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const { UserModel } = require("../models/user.models");

const userRouter = express.Router();

userRouter.post("/register", async (req, res) => {
  const { password, name, email, gender, age, city, is_married } = req.body;
  const alreadyUser = await UserModel.findOne({ email });
  if (alreadyUser) {
    res.status(200).json({ msg: "User already exist, please login" });
  } else {
    try {
      bcrypt.hash(password, 5, async (err, hash) => {
        if (err) {
          res.status(200).json({ error: err.message });
        } else {
          const user = new UserModel({
            password: hash,
            name,
            email,
            gender,
            age,
            city,
            is_married,
          });
          await user.save();
          res.status(200).json({
            msg: "new user has been added succssfully",
            user: req.body,
          });
        }
      });
    } catch (error) {
      res.status(400).json({ error: err.message });
    }
  }
});

userRouter.post("/login", async (req, res) => {
  const { password, email } = req.body;
  try {
    const user = await UserModel.findOne({ email });
    if (user) {
      bcrypt.compare(password, user.password, (err, result) => {
        if (result) {
          let token = jwt.sign({ userID: user._id }, process.env.secret, {
            expiresIn: 60 * 60 * 60 * 24 * 7,
          });
          res.status(200).json({ msg: "Login successfull", token });
        } else {
          res.status(200).json({ msg: "Wrong Cridentials" });
        }
      });
    } else {
      res.status(200).json({ msg: "user does not exist" });
    }
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = {
  userRouter,
};
