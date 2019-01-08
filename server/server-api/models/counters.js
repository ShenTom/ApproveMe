const mongoose = require("mongoose");

//Define a schema
const Schema = mongoose.Schema;

const CounterSchema = new Schema({
  _id: String,
  seq_val: Number
});

module.exports = mongoose.model("Counter", CounterSchema);
