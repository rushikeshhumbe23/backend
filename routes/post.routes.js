const express = require("express");
const { auth } = require("../middleware/auth.middleware");

const { PostModel } = require("../models/post.models");
const { UserModel } = require("../models/user.models");

const postRouter = express.Router();
postRouter.use(auth);

postRouter.get("/", async (req, res) => {
  try {
    const allPost = await PostModel.find({ userID: req.body.userID });
    res.status(400).json(allPost);
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
});

postRouter.post("/create", async (req, res) => {
  try {
    const post = new PostModel(req.body);
    await post.save();
    res.status(200).json({ msg: "new post has been added", post });
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
});

postRouter.patch("/update/:postID", async (req, res) => {
  const { postID } = req.params;
  const userIDinuserDoc = req.body.userID;

  try {
    const post = await UserModel.findOne({ _id: postID });
    const userIDipostDoc = post.userID;
    if (userIDipostDoc == userIDinuserDoc) {
      await PostModel.findByIdAndUpdate({ _id: postID }, req.body);
      res.status(200).json({ msg: "post updated" });
    } else {
      res.status(200).json({ msg: "Not Authorized" });
    }
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
});

postRouter.delete("/delete/:postID", async (req, res) => {
  const { postID } = req.params;
  const userIDinuserDoc = req.body.userID;
  try {
    const post = await UserModel.findOne({ _id: postID });
    const userIDipostDoc = post.userID;
    if (userIDipostDoc == userIDinuserDoc) {
      await PostModel.findByIdAndDelete({ _id: postID });
      res.status(200).json({ msg: "post deleted" });
    } else {
      res.status(200).json({ msg: "Not Authorized" });
    }
  } catch (error) {
    res.status(400).json({ error: err.message });
  }
});
module.exports = {
  postRouter,
};
