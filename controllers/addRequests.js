var express = require('express');
var router = express.Router();
var request = require('request');
var bodyParser = require('body-parser');
var slack = require('slack');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var sendMessage = require('../libraries/sendMessage');
var parseTags = require('../libraries/parseTags');
var notifyUser = require('../libraries/notifyUser');
mongoose.connect('mongodb://edward&tom:cactes@ds255797.mlab.com:55797/approveme');

var Request = require('../models/requests.js');


router.get('/',function(req, res){
    res.send("Add a new request by sending requester_id, name, date, tagged user(s), urgency, and comments.");
});

router.post('/', urlencodedParser, (req, res) =>{
    
    console.log("req.query: ", req.query);
  
    var target = req.query;
  
    Request.find({'event': target.event},(err, result) => {
        if (err) {
          console.log(err);
        }
      
        if (result.length == 0) {
          console.log("Not in the database");
          
          var names = target.tagged;
          parseTags(names).then( data => {
              var obj = {};
              for (var i=0; i<data.length; i++) {
                  obj[data[i]] = "pending";
              }

              console.log("people: ", obj);


              if (target.comments) {
                  var comments = target.comments
                  var object = {};
                  object[target.sender_id] = comments
                  var time = Math.floor(Date.now() / 1000)
                  time = time.toString();
                  var temp = {}
                  temp[time] = object;
              }

              console.log("object: ", object)
              console.log("time: ", temp)

              var newData = {
                  "requester": target.requester,
                  "event": target.event,
                  "tagged": obj,
                  "date": target.date,
                  "comments": target.comments? [temp]:[],
                  "timestamp": Math.floor(Date.now() / 1000),
                  "urgency": target.urgency
              }

              console.log("result: ", newData);

              var newRequest = new Request(newData);
              newRequest.save((err, newRequest) => {
                  if (err) {
                    console.log(err);
                  }
                  console.log("Add to db! -> ", newRequest);

                  res.send("Add the new request successfully");
                
                  //send notifications to tagged users (wip...)
                  for (var j=0; j<data.length; j++) {
                      notifyUser(data[j], newData);
                  }
              })
          })
        }
      
    })
})

module.exports.router = router;
