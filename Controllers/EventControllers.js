const Events = require("../models/Events");

exports.AddEvent = async (req, res) => {
  const obj = {
    eventName: req.body.eventName,
    eventOwner: req.headers.user,
    noOfTickets: req.body.noOfTickets,
    eventDate: req.body.eventDate,
    eventAddress: req.body.eventAddress,
    ticketPrice: req.body.ticketPrice,
    eventDescription: req.body.eventDescription,
    eventImage: req.file.path,
    eventBrief: req.body.eventBrief,
  };
  const event = await Events.create(obj);

  res.send(event);
};
exports.getEvents = async (req, res) => {
  const events = await Events.find()
    .populate("eventOwner", "_id fname lname avatar")
    .sort({ eventDate: -1 });
  res.send(events);
};
