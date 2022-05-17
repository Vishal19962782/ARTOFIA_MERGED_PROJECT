const mongoose = require("mongoose");
const adminScema = new mongoose.Schema(
  {
    username: { type: String, required: [true], index: { unique: true } },
    password: { type: String, required: true },
  },
  { collection: "admin" }
);
const Admin = mongoose.model("Admin", adminScema);
module.exports = Admin;
