const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;

//requester, e_name, tagged (people: response), comments (timestamp: msg, commenter), timestamp of the event
const RequestSchema = new Schema({
  _id: Number,
  event: String,
  requester: String,
  tagged: {},
  date: String,
  channel: String,
  description: String,
  timestamp: String,
  urgency: String
});

module.exports = mongoose.model("Request", RequestSchema);
