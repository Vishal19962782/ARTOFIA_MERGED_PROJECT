const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const User = require("../models/usermodel");
const razorpay = require("razorpay");
const TicketOrders = require("../models/TicketOrder");
const { verify } = require("../route/jwt-middleware/verify");
const Events = require("../models/Events");
const pdfService = require("../services/pdfService");

const instance = new razorpay({
  key_id: "rzp_test_gVMs3K2VHziBgg",
  key_secret: "En9MCIqEhetQB0KmlpSJsBHy",
});

router.get("/getRazorpayKey", (req, res) => {
  res.status(200).send(instance.key_id);
});
router.post("/order", verify, (req, res) => {
  instance.orders
    .create({
      amount: req.body.amount,
      currency: "INR",
    })
    .then((response) => {
      res.send(response);
    })
    .catch((err) => {
      res.send(err);
    });
});
router.post("/payOrder", verify, async (req, res) => {
  try {
    const { amount, razorpayPaymentId, razorpayOrderId, razorpaySignature } =
      req.body;
    const newOrder = TicketOrders({
      isPaid: true,
      amount: amount,
      razorpay: {
        orderId: razorpayOrderId,
        paymentId: razorpayPaymentId,
        signature: razorpaySignature,
      },
      orderOwner: req.headers.user,
      orderItem: req.body.orderItem,
      noOfTickets: req.body.noOfTickets,
      itemType: "Event",
    });
    const order = await newOrder.save();

    const user = await User.findOneAndUpdate(
      { _id: req.headers.user },
      { $push: { tickets: order._id } }
    );
    const event = await Events.findByIdAndUpdate(req.body.orderItem, {
      $inc: { noOfTicketsSold: req.body.noOfTickets },
      $push: { tickets: order._id },
    });

    res.send("Success");
  } catch (err) {
    console.error(err);
    res.send(err);
  }
});
router.get("/getOrder", verify, async (req, res) => {
  
  try {
    const order = await TicketOrders.find({ orderOwner: req.headers.user })
      .populate("orderItem")
      .populate("orderOwner", "fname lname avatar email ");
    res.send(order);
  } catch (err) {
    console.error(err);
    res.send(err);
  }
});
router.get("/downloadTicket/:id", async (req, res) => {
  try {
    const order = await TicketOrders.findById(req.params.id)
      .populate("orderItem")
      .populate("orderOwner", "fname lname avatar email ");
    const stream = res.writeHead(200, {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="ticket.pdf"',
    });
    pdfService.buildPDF(
      order,
      (chunk) => stream.write(chunk),
      () => stream.end()
    );
  } catch (err) {
    console.error(err);
  }
});
module.exports = router;
