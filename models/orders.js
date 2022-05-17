const mongoose = require("mongoose");

const Order = new mongoose.Schema({
  amount: { type: Number, required: true },
  isPaid: { type: Boolean, required: true },
  razorpay: {
    orderId: String,
    paymentId: String,
    signature: String,
  },
  orderOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  orderDate: { type: Date, default: Date.now() },
  orderItem: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  itemType: { type: String, required: true },
});
const Orders = mongoose.model("Orders", Order);
module.exports = Orders;
