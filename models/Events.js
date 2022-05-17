const mongoose = require("mongoose");

const Event = new mongoose.Schema(
  {
  
    eventName: { type: String, required: true },
    eventOwner: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    noOfTickets: { type: Number, required: true },
    noOfTicketsSold: { type: Number, required: true,default:0 },
    eventDate: { type: Date, required: true },
    eventAddress: { type: String, required: true },
    // contactNumber: { type: Number, required: true },
    addedDate: { type: Date, default:Date.now() },
    ticketPrice: { type: Number, required: true },
    eventDescription: { type: String, required: true },
    eventImage: { type: String, required: true },
    eventBrief: { type: String, required: true },
    tickets:{type:mongoose.Schema.Types.ObjectId,ref:"TicketOrders"},
  },
  { timestamps: true },
  { collection: "Event" }
);
const Events = mongoose.model("Events", Event);
module.exports = Events;
 