var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var sendMessage = require('../libraries/sendMessage');
var parseTags = require('../libraries/parseTags');
var nextSeqVal = require('../libraries/nextSeqVal');
mongoose.connect(process.env.DB_LOGIN);

var Request = require('../models/requests.js');

router.get('/', (req, res) =>{ 
    Request.find((err, result) => {
        if (err) {
            console.log("error in get: ", err);
            res.status(404);
        }
        var requests = {
            "accepted": [],
            "declined": [],
            "pending": []
        }
        
        for (var i=0; i<result.length; i++) {
            var pending = false;
            var declined = false;
            
            for (var x in result[i].tagged) {
                if (result[i].tagged[x] == "declined") {
                    declined = true;
                    break;
                } else if (result[i].tagged[x] == "pending") {
                    pending = true;
                }
            }
          
            if (!declined && !pending) {
                requests.accepted.push(result[i]);
            } else if (declined) {
                requests.declined.push(result[i]);
            } else if (pending) {
                requests.pending.push(result[i]);
            }
        }
        
        res.set("Accept", "Application/Json");
        res.send(requests);
    });
});

router.get('/:user_id', (req, res) =>{ 
  
    var list = {
        "requested": [],
        "tagged": []
    }
    
    Request.find((err, result) => {
      
        if (err) {
          console.log("error in get with id: ", err);
          res.status(404);
        }
      
        var target = req.params.user_id;
      
      
        for (var i=0; i< result.length; i++) {
            if (result[i].requester == target) {
                list.requested.push(result[i]);
            }
            if (target in result[i].tagged) {
                list.tagged.push(result[i]);
            }
        }
      
        res.set("Accept", "Application/Json");
        res.send(list);
    });
});

router.post('/', urlencodedParser, (req, res) =>{
  
  console.log("post req.body: ", req.body);
  
  var body = req.body;

  var requirement = ["tagged", "event", "requester", "date", "description", "urgency"];

  var passed = true;

  for (var i=0; i<requirement.length; i++) {
    if (!(requirement[i] in body)) {
      passed = false;
      break;
    }
  }

  if (!passed) {
    
    res.status(400).send({successful: false, result: "make sure all the correct fields are included in the json."})

  } else {
    
    var newData = {
      "_id": nextSeqVal("requestid"),
      "requester": body.requester,
      "event": body.event,
      "tagged": body.tagged,
      "date": body.date,
      "description": body.description,
      "timestamp": Math.floor(Date.now() / 1000),
      "urgency": body.urgency
    }

    console.log("new data parsed from body: ", newData);
      
    var newRequest = new Request(newData);
    newRequest.save((err, newRequest) => {
      if (err) {
        console.log(err);
      }
      console.log("Add to db! -> ", newRequest);

      var resp = {successful: true, result: newData}

      res.status(201).send(resp);

      var users = Object.keys(body.tagged);
      //send notifications to tagged users (wip...)
      for (var j=0; j<users.length; j++) {
          notifyUser(users[j], newData);
      }
    })
  }
});

router.put('/:id', urlencodedParser, (req, res) => {

});

router.delete('/:id', urlencodedParser, (req, res) => {

});


module.exports.router = router;
