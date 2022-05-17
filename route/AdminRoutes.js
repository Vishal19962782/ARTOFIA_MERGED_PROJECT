const express = require("express");
const { find } = require("../models/usermodel");
const adminrouter = express.Router();
const User = require("../models/usermodel");
const Post = require("../models/post");
const Admin = require("../models/adminmodel");
const { verifyAdmin } = require("../route/jwt-middleware/verify");
// app.use("/api/admin",adminRoutes)

adminrouter.get("/getUserInfos",verifyAdmin, async (req, res) => {
  try {
    const user = await User.find().select("-password ");
    res.send(user);
  } catch (err) {
    res.send(err);
  }
});
adminrouter.put("/blockUser", verifyAdmin, async (req, res) => {
  console.log("ADMIN TRIED TO BLOVK");
  const user = await User.findById(req.body.id).select("isBlocked");
  if (user.isBlocked) {
    await User.updateOne({ _id: req.body.id }, { isBlocked: false });
    res.send("false");
  } else {
    await User.updateOne({ _id: req.body.id }, { isBlocked: true });
    res.send("true");
  }
});
adminrouter.get("/getPostInfos", verifyAdmin, async (req, res) => {
  try {
    const post = await Post.find()
      .select("-postDescription -createdAt -updatedAt -__v")
      .populate("postOwner", "fname lname avatar");
    res.send(post);
  } catch (err) {
    res.send(err);
  }
});
adminrouter.get("/getUserInfo/:id", verifyAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    res.status(200).json(user);
  } catch (err) {}
});
module.exports = adminrouter;
