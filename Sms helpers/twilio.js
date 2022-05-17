const twilio = require("twilio");
const config = require("../twilioConfig.json");

const accountSid = "ACb6d16ead3d036b7334a32a89619f8a6e";
const authToken = "7905fb88df75aa8cbf5864b295688c88";

const client = new twilio(config.TWILIO_ACC_SID, config.TWILIO_AUTH_TOKEN);
module.exports = client;
