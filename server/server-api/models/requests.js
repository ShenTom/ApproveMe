const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;

const RequestSchema = new Schema({
  _id: Number,
  event: String,
  requester: String,
  tagged: {},
  date: Number,
  channel: String,
  description: String,
  timestamp: Number,
  urgency: String
});

module.exports = mongoose.model("Request", RequestSchema);
