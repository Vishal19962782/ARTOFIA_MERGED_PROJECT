const express = require("express");
const router = express.Router();
const User = require("../models/usermodel");
const Post = require("../models/post");
const Order = require("../models/orders");
const Ticket = require("../models/TicketOrder");
const events = require("events");

router.get("/", (req, res) => {
  Post.aggregate([
    {
      $project: {
        count: { $size: "$postLikes" },
        postOwner: 1,
        img: "$Image",
        name: "$postName",
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
    // { $lookup: { from: "User", localField: "_id", foreignField: "Ima" } },
  ])
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {});
});
router.get("/trendingArtsits", (req, res) => {
  User.aggregate([
    {
      $match: { isArtist: true },
    },
    {
      $project: {
        count: { $sum: { $size: "$followers", $size: "$posts" } },
        postOwner: 1,
        img: "$avatar",
        name: "$fname",
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
  ])
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {});
});
router.get("/userVSartist", async (req, res) => {
  const result = await User.aggregate([
    { $group: { _id: "$isArtist", count: { $sum: 1 } } },
  ]);
  res.json(result);
});
router.get("/PostStatusData", async (req, res) => {
  const result = await Post.aggregate([
    { $group: { _id: "$Status", count: { $sum: 1 } } },
  ]);
  res.json(result);
});
router.get("/SalesPerMonth", (req, res) => {
  Order.aggregate([
    {
      $group: {
        _id: {
          year: { $year: "$orderDate" },
          month: { $month: "$orderDate" },
        },
        count: { $sum: 1 },
      },
    },
  ]).then((data) => {
    res.json(data);
  });
});
router.get("/userPerMonth", async (req, res) => {
  try {
    const user = await User.aggregate([
      {
        $group: {
          _id: {
            isArtist: "$isArtist",
            year: { $year: "$dateOfCreation" },
            month: { $month: "$dateOfCreation" },
          },
          count: { $sum: 1 },
        },
      },
      {
        $sort: { "_id.isArtist": 1 },
      },
    ]);
    res.json(user);
  } catch (err) {
    res.json(err);
  }
});
router.get("/getInfos", async (req, res) => {
  const noOfUser = await User.find().count();
  const TotalRevenue = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  const TicketRevenue = await Ticket.aggregate([
    { $group: { _id: null, total: { $sum: "$amount" } } },
  ]);
  res.json({ noOfUser, TotalRevenue, TicketRevenue });
});
module.exports = router;
