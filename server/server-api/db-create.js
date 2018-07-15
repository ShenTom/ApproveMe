const MongoClient = require("mongodb").MongoClient;
var mongoose = require("mongoose");
mongoose.connect(process.env.DB_LOGIN);

var Counter = require("./models/counters.js");
var Request = require("./models/requests.js");

const nextSeqVal = require("./libraries/nextSeqVal");

const addNewRequest = function() {
  nextSeqVal("requestid")
    .then(num => {
      let event = "Fake Data " + num;
      let description = "Testing " + num;

      let requester = ["U79456HA5", "U7A5FL7P1"];

      let json = {
        _id: num,
        requester: requester[Math.round(Math.random())],
        event: event,
        channel: "C8RQUTLU9",
        tagged: {
          U79456HA5: 0,
          U7A5FL7P1: 0
        },
        date: "03-18-2018",
        description: description,
        timestamp: Math.floor(Date.now() / 1000),
        urgency: "2"
      };

      return new Promise((resolve, reject) => {
        var newRequest = new Request(json);
        newRequest.save((err, result) => {
          if (err) {
            console.log("Error adding new request:", err);
            reject(err);
          }
          resolve(result);
        });
      });
    })
    .catch(err => {
      if (err) console.log(err);
    });
};

const restartDB = function(num) {
  mongoose.connect(process.env.DB_LOGIN).dropDatabase(() => {
    for (let i = 0; i < num; i++) {
      addNewRequest()
        .then(result => {
          console.log("Added: ", result);
        })
        .catch(err => {
          console.log(err);
        });
    }
  });
};

restartDB(15);
