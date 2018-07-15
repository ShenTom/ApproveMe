var mongoose = require("mongoose");

//Define a schema
var Schema = mongoose.Schema;

var CounterSchema = new Schema({
  _id: String,
  seq_val: Number
});

module.exports = mongoose.model("Counter", CounterSchema);
