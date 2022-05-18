const Post = require("../models/post");
const User = require("../models/usermodel");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
const Cryptr = require("cryptr");
require("dotenv").config();
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const multer = require("multer");
const router = require("../route/Posts");
const message = require("../route/Sms Middleware/sms");
const otp = require("otp-generator");
const client = require("../Sms helpers/twilio"); //twilio client
const config=require("../twilioConfig.json")
exports.get = (req, res) => {
  res.send("working");
};
exports.login = async (req, res) => {
  const { errors } = validationResult(req);
  const { email, password } = req.body;
  console.log(email, password);
  const user = await User.findOne({
    email: new RegExp("^" + email.toLowerCase(), "i"),
  }).lean();
  if (errors.length == 0) {
    if (!user) {
      res.status(401).json({ message: "No account found" });
    } else {
      if (user.isBlocked) {
        res.status(403).json({ message: "User blocked by admin" });
      } else if (
        !user.isBlocked &&
        (await bcrypt.compare(password, user.password))
      ) {
        const accesstoken = jwt.sign(
          {
            id: user._id,
            email: user.email,
            isArtist: user.isArtist,
            isAdmin: user.isAdmin,
          },
          process.env.JWT_KEY
        );
        req.session.user = user.email;
        req.session.usertype = "user";
        res.status(200).json({ id: user._id, token: accesstoken });
      } else {
        res.status(401).json({ message: "invalid username or password" });
      }
    }
  } else {
    res.status(401).json({ message: "Invalid Email Address", succ: "" });
  }
};
exports.register = async (req, res) => {
  const { errors } = validationResult(req);
  const hashpass = await bcrypt.hash(req.body.password, 10).then((message) => {
    return message;
  });

  if (!errors.length) {
    try {
      const result = await client.verify
        .services(config.TWILIO_SERVICES_KEY)
        .verificationChecks.create({
          to: "+" + req.body.phoneNo,
          code: req.body.Otp,
        })
        .then((verification_check) => {
          return verification_check.status;
        });

      if (result != "approved") {
        throw new Error("OTP not verified");
      }

      await User.create({
        fname: req.body.fname,
        lname: req.body.lname,
        email: req.body.email,
        password: hashpass,
        phoneNo: req.body.phoneNo,
        avatar: req?.file?.path,
      }).then((messages) => {
        res.json("Success");
      });
    } catch (err) {
      if (err.code == 11000) {
        res.status(200).send({ message: "User already exists", code: 300 });
      } else {
        res.status(200).send({ message: "Invalid OTP", code: 304 });
      }
      // else {
      //   res.redirect("/route");
      // }
    }
  }
};
exports.addAddress = async (req, res) => {
  {
    const updated = await User.findByIdAndUpdate(
      req.headers.user,
      { $push: { addressArray: req.body } },
      { new: true }
    );
    if (updated) res.status(200).json(updated);
  }
};
exports.getUserInfo = (req, res) => {
  User.findById(req.params.id)
    .select("-password")
    .populate({
      path: "posts",
    })
    .then((user) => {
      res.status(200).json(user);
    });
};
exports.homepage = async (req, res) => {
  if (req.headers.user) {
    const founduser = await User.findOne({ _id: req.headers.user }).lean();
    if (founduser) {
      res.status(200).json(founduser);
    }
  } else {
    res.status(404).json({ message: "User not found" });
  }
};
exports.updateUser = async (req, res) => {
  const hashpass = await bcrypt.hash(req.body.password, 10);

  try {
    const newDetails = await User.findOneAndUpdate(
      { _id: req.headers.user },
      { ...req.body, password: hashpass },
      { new: true }
    );
    res.status(200).json(newDetails);
  } catch (err) {
    res.status(404).json({ message: "user not found" });
  }
};
exports.followUser = async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id);

    const user = await User.updateOne(
      { _id: req.headers.user, following: { $nin: [id] } },
      { $push: { following: id } },
      { new: true }
    );
    if (user.matchedCount) {
      const user2 = await User.updateOne(
        { _id: id, followers: { $nin: [req.headers.user] } },
        { $push: { followers: req.headers.user } },
        { new: true }
      );
    }
    if (!user.matchedCount) {
      const unfollow = await User.updateOne(
        { _id: req.headers.user, following: { $in: [id] } },
        { $pull: { following: id } },
        { new: true }
      );
      const unfollow2 = await User.updateOne(
        { _id: id, followers: { $in: [req.headers.user] } },
        { $pull: { followers: req.headers.user } },
        { new: true }
      );
    }
    const updatedUser = await User.findById(req.headers.user);
    res.status(200).json(updatedUser);
  } catch (err) {
    res.status(404).json({ message: "user not found" });
  }
};
exports.getOtp=async (req, res) => {
  try {
    const user = req.body.phoneNo
      ? ""
      : await User.findOne({ email: req.body.email });

    const phoneNo = req.body.phoneNo ? req.body.phoneNo : "+" + user.phoneNo;
    const token = jwt.sign(
      { phoneNo: phoneNo, userId: user._id },
      "secretOtpkey",
      {
        expiresIn: "1h",
      }
    );
      console.log("trying otp");
    client.verify
      .services(config.TWILIO_SERVICES_KEY)
      .verifications.create({ to: phoneNo, channel: "sms" })
      .then((verify) => {
        console.log(verify);
        res.status(200).json({ token, message: `OTP sent to ${phoneNo}` });
      })
      .catch((err) => {
        console.error(err);
        res.status(403).send("Error while sending otp");
      });
  } catch (err) {
    console.log(err);
    res.status(403).send("Error while sending otp");
  }
}
exports.verifyOtp =  async (req, res) => {
  const number = jwt.verify(req.body.token, "secretOtpkey", (err, decoded) => {
    if (err) {
      res.status(200).json({ message: "invalid otp" });
    } else {
      return decoded;
    }
  });

  client.verify
    .services(config.TWILIO_SERVICES_KEY)
    .verificationChecks.create({ to: number.phoneNo, code: req.body.otp })
    .then((verification_check) => {
      if (verification_check.status !== "approved") {
        throw new Error("invalid otp");
      }
      const token = jwt.sign(
        { phoneNo: number, userId: number.userId },
        "secretOtpkey",
        { expiresIn: "1h" }
      );
      res.status(200).send(token);
    })
    .catch((e) => {
      res.status(400).json({ message: "invalid otp" });
    });
}
exports.changePassword= async (req, res) => {
  jwt.verify(req.body.token, "secretOtpkey", async (err, decoded) => {
    try {
      if (err) throw new Error("invalid otp");
      const hashpass = await bcrypt
        .hash(req.body.password, 10)
        .then((message) => {
          return message;
        });

      const user = await User.findByIdAndUpdate(
        decoded.userId,
        { password: hashpass },
        { new: true }
      );

      res.status(200).json({ message: "password changed successfully" });
    } catch (e) {
      res.status(400).json({ message: "invalid otp" });
    }
  });
}
exports.userPasswordChange= async (req, res) => {
  const hashpass = await bcrypt.hash(req.body.password, 10);
  user
    .findByIdAndUpdate(req.headers.user, { password: hashpass })
    .then((user) => {
      res.status(200).json({ message: "password changed successfully" });
    });
}
exports.logout= (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      res.status(403).send("Error while logingout..!, Try again");
    } else {
      res.status(200).redirect("/");
    }
  });
}
exports.updateProfileImage=async (req, res) => {
  await User.findByIdAndUpdate(req.headers.user, {
    avatar: req.file.path,
  });
  res.status(200).json({
    message: "profile image updated successfully",
    image: req.file.path,
  });
}