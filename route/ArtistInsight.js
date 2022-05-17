const express = require("express");
const router = express.Router();
const { verify } = require("../route/jwt-middleware/verify");
const User = require("../models/usermodel");
const Post = require("../models/post");
const Ticket = require("../models/TicketOrder");
const Orders = require("../models/orders");
const Events = require("../models/Events");
const { where } = require("../models/usermodel");
// ----------------------------EXPORTS--------------------------------------//
router.get("/", verify, async (req, res) => {
  const posts = await Post.find({ postOwner: req.headers.user });
  const events = await Events.find({ eventOwner: req.headers.user });
  let postRevenue = 0;
  await Orders.aggregate(
    [
      { $match: { itemOwner: { $in: [posts._id] } } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ],
    (err, result) => {
      if (err) throw err;
      postRevenue = result[0].total;
    }
  );
  let eventRevenue = 0;
  await Ticket.aggregate(
    [
      { $match: { itemOwner: { $in: [events._id] } } },
      { $group: { _id: null, total: { $sum: "$amount" },no:{$sum:1} } },
    ],
    (err, result) => {
      if (err) throw err;
      eventRevenue = {eventRevenue:result[0].total,no:result[0].no};
    }
  );
  console.log(postRevenue);
  res.json({ events, posts, postRevenue, eventRevenue });
});

module.exports = router;
