const express = require("express");
const adminrouter = express.Router();
const Admin = require("../models/adminmodel");
const User = require("../models/usermodel");
const bcrypt = require("bcrypt");
const { escapeRegExpChars } = require("ejs/lib/utils");
const { check, validationResult } = require("express-validator");
const session = require("express-session");
const { append } = require("express/lib/response");
const functions = require("./function");
const { findByIdAndUpdate, findByIdAndDelete } = require("../models/usermodel");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("myTotalySecretKey");
const req = require("express/lib/request");
const jwt = require("jsonwebtoken");

adminrouter.get("/", (req, res) => {
  
  if (req.session.usertype == "admin") {
    res.status(403).redirect("admin/homepage");
  } else {
    res.status(200).send("adminlogin", { err: "" });
  }
});
const verify = (req, res, next) => {
  const authheader = req.headers.accesstoken;

  if (authheader) {
    
    const token = authheader.split(" ")[1];
    
    jwt.verify(JSON.parse(token), process.env.JWT_KEY, (err, user) => {
      
      if (err) return res.status(403).json("token not valid");
      else req.user = user;
      next();
    });
  } else {
    res.status(400).json({ message: "Not authenticated" });
  }
};

adminrouter.post("/", async (req, res) => {
  
  const { username, password } = req.body;
  const user = await Admin.findOne({ email: username }).lean();
  if (!user) {
    res.status(203).render("adminlogin", { err: "No account found" });
  } else {
    if (password == user.password) {
      const accesstoken = jwt.sign({ email: username }, process.env.JWT_KEY);
      req.session.Isadmin = username;
      req.session.usertype = "admin";
      res.status(200).json({ accesstoken, usertype: "admin" });
    } else {
      res.status(401).json({ err: "Wrong username or password" });
    }
  }
});
// adminrouter.use((req, res, next) => {
//   if (!req.session.Isadmin) {
//     
//     
//     res.status(200).redirect("/admin");
//   } else next();
// });
adminrouter.get("/add-user", (req, res) => {
  res.status(200).render("admincreate", { err: "", errors: 0 });
});
adminrouter.post(
  "/add-user",
  check("fname")
    .isLength({ min: 3 })
    .withMessage("First name must be at least 3 characters long"),
  check("lname")
    .isLength({ min: 3 })
    .withMessage("Last name must be at least 3 characters long"),
  check("mail").isEmail().withMessage("Email is invalid"),
  check("password")
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long"),
  async (req, res) => {
    
    const { errors } = validationResult(req);
    const { fname, lname, mail, password } = req.body;
    const hashpass = await bcrypt.hash(password, 10).then((message) => {
      return message;
    });
    if (!errors.length) {
      try {
        await User.create({
          fname: fname,
          lname: lname,
          email: mail,
          password: hashpass,
        }).then((message) => {
          req.session.message = "User created successfully";
          res.status(201).json("User created successfully");
        });
      } catch (err) {
        
        if (err.code == 11000) {
          
          
          err.message = "User already exists";
          res.status(409).json({ err: err.message });
        } else if (err) {
          res.status(400).render("admincreate", {
            err: "Please enter valid details",
            errors,
          });
        } else {
          res.redirect("/route");
        }
      }
    } else {
      
      res.status(400).render("admincreate", { err: "", errors });
    }
  }
);
adminrouter.get("/homepage", async (req, res) => {
  
  await User.find({})
    .sort({ fname: 1 })
    .collation({ locale: "en" })
    .then((userobj) => {
      
      res.status(200).json(userobj);
    })
    .catch((e) => {
      res.json(e);
    });
});
adminrouter.get("/find", async (req, res) => {
  
  const userobj = await User.find({
    fname: new RegExp(req.query.iofield, "i"),
  }).lean();
  
  const a = [1, 2, 3, 4, 5, 6, 7, 8, 9];
  res.status(200).render("searchpage", { userobj });
});
adminrouter.get("/:id", async (req, res) => {
  const user = await User.findOne({ _id: req.params.id })
    .then((message) => {
      res.status(200).render("adminupdate", { message });
    })
    .catch((err) => {
      res.status(404).send(err);
    });
});
adminrouter.put("/:id", async (req, res) => {
  
  const { fname, lname, mail } = req.body;
  try {
    await User.updateOne(
      { _id: req.params.id },
      { fname: fname, lname: lname, email: mail }
    ).then((message) => {
      req.session.message = "Updated successfully";
      res.status(200).json("success");
    });
  } catch (err) {
    
    if (err.code == 11000) {
      err.message = "User already exists";
    }
    res.status(409).json(err);
  }
});
adminrouter.patch("/:id", async (req, res) => {
  
  

  try {
    const user = await User.findOne({ _id: req.params.id });
    
    if (user.isBlocked) {
      await User.updateOne({ _id: req.params.id }, { isBlocked: false }).then(
        (message) => {
          res.status(200).json("false");
        }
      );
    } else {
      await User.updateOne({ _id: req.params.id }, { isBlocked: true }).then(
        (message) => {
          res.status(200).json("true");
        }
      );
    }
  } catch (error) {
    res.status(400).json(error);
  }
});
adminrouter.delete("/:id", async (req, res) => {
  
  await User.findByIdAndDelete(req.params.id);
  const users = await User.find({});
  res.status(202).json(users);
});

module.exports = adminrouter;
