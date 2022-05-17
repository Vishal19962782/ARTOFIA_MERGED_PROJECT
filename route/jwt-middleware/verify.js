const jwt = require("jsonwebtoken");
const message=require("../Sms Middleware/sms");

exports.verify = (req, res, next) => {
    const authheader = req.headers.accesstoken;
    if (authheader) {
      const token = authheader.split(" ")[1];
      jwt.verify(JSON.parse(token), process.env.JWT_KEY, (err, user) => {
        
        if (err) return res.status(403).json("token not valid");
        else req.headers.user =user.id;
        next();
      }); 
    } else {
        
      res.status(400).json({ message: "Not authenticated" });
    }
  };
exports.verifyArtist = (req, res, next) => {
    const authheader = req.headers.accesstoken;
    if (authheader) {
    //   
      const token = authheader.split(" ")[1];
      jwt.verify(JSON.parse(token), process.env.JWT_KEY, (err, user) => {
        if (err) return res.status(403).json("token not valid");
        else if (user.isArtist) {
          req.headers.user = user.id;
          next();
        } else {
          res.status(403).json("Not authorized");
        }
      });
    } else {
      res.status(400).json({ message: "Not authenticated" });
    }
  };
  exports.verifyAdmin = (req, res, next) => {
    const authheader = req.headers.accesstoken;
    if (authheader) {
    //   
      const token = authheader.split(" ")[1];
      jwt.verify(JSON.parse(token), process.env.JWT_KEY, (err, user) => {
        if (err) return res.status(403).json("token not valid");
        else if (user.isAdmin) {
          req.headers.user = user.id;
          next();
        } else {
          res.status(403).json("Not authorized");
        }
      });
    } else {
      res.status(400).json({ message: "Not authenticated" });
    }
  };