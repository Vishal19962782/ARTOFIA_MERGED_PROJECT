const express = require("express");
const router = express.Router();
const multer = require("multer");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const mongoose = require("mongoose");
const PostControllers = require("../controllers/PostControllers");
const { verify } = require("../route/jwt-middleware/verify");
const Req = require("../models/Requests");
const User = require("../models/usermodel");
const config=require("../twilioConfig.json")
require("dotenv").config();
cloudinary.config({
  cloud_name: "artofia",
  api_key: config.CLOUDINARY_API_KEY, //process.env.CLOUDINARY_API_KEY,
  api_secret:config.CLOUDINARY_SECRET, //process.env.CLOUDINARY_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "Requests",
  },
});
const upload = multer({ storage: storage });
router.post("/", verify, upload.single("image"), (req, res) => {
  const request = new Req({
    userId: req.headers.user,
    description: req.body.Description,
    image: req.file.path,
  });
  request.save((err, doc) => {
    if (err) {
      res.status(400).send(err);
    } else {
      res.status(201).send(doc);
    }
  });
});
router.get("/", verify, (req, res) => {
  Req.find({})
    .populate("userId", "_id fname lname dateOfCreation avatar")
    .then((doc) => {
      res.send(doc);
    });
});
router.put("/AcceptRequest", verify, async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.body.userId, {
      $set: { isArtist: true, description: req.body.description },
    });
    const request = await Req.findByIdAndDelete(req.body.reqId);
    res.status(200).send("success");
  } catch (err) {
    res.status(400).send(err);
  }
});
router.put("/RejectRequest", verify, async (req, res) => {
  try {
    const request = await Req.findByIdAndUpdate(req.body.reqId, {
      $set: { status: "Rejected", description: req.body.description },
    });
    res.status(200).send("Rejected");
  } catch (err) {
    res.status(400).send(err);
  }
});
module.exports = router;
