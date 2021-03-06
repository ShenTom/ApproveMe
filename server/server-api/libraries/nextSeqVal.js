const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
mongoose.connect(
  process.env.ENV === "development" ? process.env.DEV_DB : process.env.PROD_DB
);

const Counter = require("../models/counters.js");

const nextSeqVal = sequenceName => {
  return new Promise((resolve, reject) => {
    Counter.findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { seq_val: 1 } },
      { upsert: true, new: true }
    )
      .then(res => {
        resolve(res.seq_val);
      })
      .catch(reject);
  });
};

module.exports = nextSeqVal;
