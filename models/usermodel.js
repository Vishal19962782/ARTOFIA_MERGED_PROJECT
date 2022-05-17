const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userScema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: [true, "This field is compulsory"],
      index: { unique: false },
      match: [/^[a-zA-Z][a-zA-Z\s]*$/, "Enter a valid name"],
      minlength: [3, "please enter min 5 chars"],
    },
    lname: {
      type: String,
      required: false,
      index: { unique: false },
      match: [/^[a-zA-Z][a-zA-Z\s]*$/, "Enter a valid name"],
    },

    email: { type: String, required: true, index: { unique: true } },
    password: {
      type: String,
      required: true,
      minlength: [3, "Please enter a passowrd of atleast 5 chars"],
    },
    isBlocked: { type: Boolean, default: false },
    addressArray: [
      {
        address: { type: String, required: false },
        city: { type: String, required: false },
        state: { type: String, required: false },
        zip: { type: String, required: false },
        country: { type: String, required: false },
      },
    ],
    phoneNo: { type: String, required: true, index: { unique: false } },
    avatar: {
      type: String,
      required: false,
      index: { unique: false },
      default:
        "https://thumbs.dreamstime.com/b/default-avatar-profile-image-vector-social-media-user-icon-potrait-182347582.jpg",
    },
    Notification: [
      {
        postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
        notification: { type: String, required: true },
        date: { type: Date, default: Date.now() },
        status: { type: String },
        read: { type: Boolean, default: false },
        price: { type: Number, required: true },
      },
    ],
    role: { type: String, required: false, index: { unique: false } },
    isArtist: { type: Boolean, default: false },
    isAdmin: { type: Boolean, default: false },
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    orders: [{ orderId: String, orderName: String }],
    description: { type: String, required: false },
    tickets: [
      {
        ticketId: { type: mongoose.Schema.Types.ObjectId, ref: "TicketOrders" },
      },
    ],
    Notifications: [{ NotificationId: String, NotificationName: String }],
    bids: [
      {
        postId: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
        date: { type: Date, default: Date.now },
        price: String,
        Status: {
          type: String,
          enum: ["Bidding", "Accepted", "Sold", "Rejected"],
          default: "Bidding",
        },
      },
    ],
    dateOfCreation: { type: Date, default: Date.now },
  },
  { collection: "User" }
);

userScema.statics.adduser = function (
  { fname, lname, mail, password },
  callback
) {
  return User.create(
    {
      fname: fname,
      lname: lname,
      email: mail,
      password: bcrypt.hashSync(password, 10),
    },
    (err, result) => {
      if (err) {
        return callback(err, null);
      } else {
        return callback(null, result);
      }
    }
  );
};
userScema.statics.getuser = function ({ mail, password }, callback) {
  return User.findOne({ email: mail }, (err, result) => {
    if (err) {
      return callback(err, null);
    } else {
      if (result) {
        if (bcrypt.compareSync(password, result.password)) {
          return callback(null, result);
        } else {
          return callback(null, null);
        }
      } else {
        return callback(null, null);
      }
    }
  });
};

const User = mongoose.model("User", userScema);
module.exports = User;
