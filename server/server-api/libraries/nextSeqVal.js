const MongoClient = require("mongodb").MongoClient;
var mongoose = require("mongoose");
mongoose.connect(process.env.DB_LOGIN);

var Counter = require("../models/counters.js");

const nextSeqVal = function(sequenceName) {
  return new Promise((resolve, reject) => {
    Counter.findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { seq_val: 1 } },
      { upsert: true, new: true },
      (err, res) => {
        console.log("testing: ", res);
        if (err) {
          reject(err);
        }
        resolve(res.seq_val);
      }
    );
  });
};

module.exports = nextSeqVal;
