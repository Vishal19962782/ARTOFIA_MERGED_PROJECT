const express = require("express");
const router = express.Router();
const multer = require("multer");
const { verify } = require("../route/jwt-middleware/verify");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const mongoose = require("mongoose");
const EventControllers = require("../controllers/EventControllers");
require ("dotenv").config();
cloudinary.config({
  cloud_name: "artofia",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "EVENTS",
  },
});

const upload = multer({ storage: storage });
router.post("/AddEvent",verify,upload.single("image"), EventControllers.AddEvent);
router.get("/getEvents", EventControllers.getEvents);
module.exports = router;
