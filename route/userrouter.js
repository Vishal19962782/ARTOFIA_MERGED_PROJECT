const express = require("express");
require("dotenv").config();
const session = require("express-session");
const { append, redirect, render, json } = require("express/lib/response");
const res = require("express/lib/response");
const router = express.Router();
const User = require("../models/usermodel");
const { check, validationResult } = require("express-validator");
const ratelimiter = require("express-rate-limit");
const user = new User();
const bcrypt = require("bcrypt");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");
const jwt = require("jsonwebtoken");
const { verify } = require("../route/jwt-middleware/verify");
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");
const mongoose = require("mongoose");
const multer = require("multer");
const UserControllers = require("../Controllers/UserControllers");
const TicketRoute = require("../route/TicketRoutes");
const otp = require("otp-generator");
const client = require("../Sms helpers/twilio");
const config = require("../twilioConfig.json");
cloudinary.config({
  cloud_name: "artofia",
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "DEV",
  },
});
const upload = multer({ storage: storage });
router.get("/", UserControllers.get);
router.post(
  "/",
  check("email").isEmail().withMessage("Enter a valid email address"),
  UserControllers.login
);

router.post(
  "/register",
  upload.single("image"),
  check("fname")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long"),
  check("lname")
    .isLength({ min: 3 })
    .withMessage("Last name must be at least 3 characters long"),
  check("email").isEmail().withMessage("Email is invalid"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  UserControllers.register
);
router.put("/addAddress", verify, UserControllers.addAddress);
router.get("/getUserInfo/:id", verify, UserControllers.getUserInfo);
router.get("/homepage", verify, UserControllers.homepage);
router.put("/updateUser", verify, UserControllers.updateUser);
router.get("/logout/", verify, UserControllers.logout);
router.post("/followUser/:id", verify, UserControllers.followUser);
router.post("/getOtp", UserControllers.getOtp);
router.post("/verifyOtp", UserControllers.verifyOtp);
router.put("/changePassword", UserControllers.changePassword);
router.put("/userPasswordChnage", verify, UserControllers.userPasswordChange);
router.post(
  "/updateProfileImage",
  verify,
  upload.single("file"),
  UserControllers.updateProfileImage
);
module.exports = router;
