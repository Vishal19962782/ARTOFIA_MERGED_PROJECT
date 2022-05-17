const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./usermodel");

const postSchema = new mongoose.Schema(
  {
    postName: {
      type: String,
      required: [true, "This field is compulsory"],
      index: { unique: false },
      match: [/^[a-zA-Z][a-zA-Z\s]*$/, "Enter a valid name"],
      minlength: [3, "please enter min 5 chars"],
    },
    Status: { type: String,  enum: ['Bidding', 'Accepted', 'Sold','Rejected'],default: "Bidding" },
    postOwner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    soldTo:{type:mongoose.Schema.Types.ObjectId,ref:"User"},
    currentBid:{type:Number,required:true},
    postDescription: {
      type: String,
      required: true,
      index: { unique: false },
    },
    postCategory: {
      type: String,
      required: false,
      index: { unique: false },
    },
    Image: { type: String, required: true },
    postDate: {
      type: Date,
      required: false,
      index: { unique: false },
      default: Date.now,
    },
    postLikes: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
      },
    ],
    postComments: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        comment: { type: String, required: true },
        date: { type: Date, default: Date.now() },
      },
    ],
    minPrice: { type: Number, required: true },
    saleID:{type:mongoose.Schema.Types.ObjectId,ref:"Orders"},
    bids: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        bidPrice: { type: Number, required: true },
        date: { type: Date, default: Date.now() },
      },
    ],
  },
  { collection: "Post",timestamps:true }
);

const Post = mongoose.model("Post", postSchema);
module.exports = Post;
