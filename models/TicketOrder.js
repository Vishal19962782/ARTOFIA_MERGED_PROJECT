const mongoose = require("mongoose");

const TicketOrder = new mongoose.Schema({
  amount: { type: Number, required: true },
  isPaid: { type: Boolean, required: true },
  razorpay: {
    orderId: String,
    paymentId: String,
    signature: String,
  },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: "Events" },
  orderOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderDate: { type: Date, default: Date.now() },
  orderItem: { type: mongoose.Schema.Types.ObjectId, ref: "Events" },
  itemType: { type: String, required: true },
  noOfTickets: { type: Number, required: true },
});
const TicketOrders = mongoose.model("TicketOrders", TicketOrder);
module.exports = TicketOrders;