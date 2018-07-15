var mongoose = require("mongoose");

//Define a schema
var Schema = mongoose.Schema;

//requester, e_name, tagged (people: response), comments (timestamp: msg, commenter), timestamp of the event
var RequestSchema = new Schema({
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
