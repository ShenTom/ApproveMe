var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
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

router.get('/users/:user_id', (req, res) =>{ 
  
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
  
  if (req.headers['access-key'] !== process.env.ACCESS_KEY) {
    res.status(401).send({successful: false, result: "Wrong/no access key is given."});
    
  } else {
  
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
      
      nextSeqVal("requestid")
        .then(seq_val => {
        
        console.log("seq_val: ", seq_val);
        var newData = {
          "_id": seq_val,
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
            console.log("post error: ", err);
            console.log("post not executed!");
            res.status(404).send({successful: false, result: 'Internal server error'});

          } else {
            console.log("Add to db! -> ", newRequest);

            var resp = {successful: true, result: newData}

            res.status(201).send(resp);

            var users = Object.keys(body.tagged);
            for (var j=0; j<users.length; j++) {
              if (!(notifyUser(users[j], newData))) {
                console.log("notify user failed...");
              }
            }
          }

        })
      
      }).catch(err => {console.log("seq error:", err)})
    }
  }
});

router.put('/:req_id', urlencodedParser, (req, res) => {
  
  console.log("put req.body: ", req.body);
  
  var body = req.body;

  var requirement = ["tagged", "event", "requester", "date", "description", "urgency"];

  var update = {};
  
  var query = {_id: req.params.req_id};

  for (var i=0; i<requirement.length; i++) {
    if (requirement[i] in body) {
      update[requirement[i]] = body[requirement]
    }
  }
  
  Request.update(query, update, function (err, raw) {
    if (err) console.log("update fail: ", err);
  });

});

router.delete('/:req_id', urlencodedParser, (req, res) => {
  
  Request.remove({_id: req.params.req_id}, (err, res) => {
    if (err) console.log("delete error:", err);
  })
  
});

router.post('/:req_id/users/:user_id', urlencodedParser, (req, res) =>{

  if (req.headers['access-key'] !== process.env.ACCESS_KEY) {
    res.status(401).send({successful: false, result: "Wrong/no access key is given."});
    
  } else {
    
    console.log("action body: ", req.body);
    
    let actions = ['approve', 'decline', 'sendNotification'];
    
    let action = req.body.action;
    
    let target = req.params.user_id;
    
    let validAction = false;
    
    if (actions.indexOf(action) != -1) {
      validAction = true;
    }
    
    if (!validAction) {
      
      res.status(400).send({successful: false, result: "make sure the action is one of the following: approve, decline, & sendNotification."});
    
    } else {
      
      let query = {_id: req.params.req_id};
      
      Request.findOne(query, (err, result) => {
        if (err) {
          console.log("action error:", err);
          console.log("action not executed!");
          res.status(404).send({successful: false, result: 'Internal server error'});
          
        } else {
          
          let tagged = result.tagged;
          
          if (!(req.params.user_id in tagged)){
            res.status(400).send({successful: false, result: "Invalid user_id is given."});
          } else {
            
            if (action == "approve") {
              if (tagged[target] == -1 || tagged[target] == 0) {
                tagged[target] = 1;
                Request.update(query, {'tagged': tagged}, (err, raw) => {
                  if (err) {
                    console.log("action approve error:", err);
                    console.log("action approve not executed!");
                    res.status(404).send({successful: false, result: 'Internal server error'});
                  } else {
                    result.tagged = tagged
                    res.status(200).send({successful: true, result: result});
                  }
                });
              } else {
                res.status(400).send({successful: false, result: "This user has approved this request already."});
              }
            
            } else if (action == "decline") {
              if (tagged[target] == 1 || tagged[target] == 0) {
                tagged[target] = -1;
                Request.update(query, {'tagged': tagged}, (err, raw) => {
                  if (err) {
                    console.log("action decline error:", err);
                    console.log("action decline not executed!");
                    res.status(404).send({successful: false, result: 'Internal server error'});
                  } else {
                    result.tagged = tagged;
                    res.status(200).send({successful: true, result: result});
                  }
                });
              } else {
                res.status(400).send({successful: false, result: "This user has declined this request already."});
              }
            
            } else if (action == "sendNotification") {
              if (notifyUser(target, result)) {
                var resp = {"successful": true, "message": "Notified the user!"}
                res.send(resp);
              } else {
                console.log("notify user failed.");
                res.status(404).send({successful: false, result: 'Internal server error'});
              }
            }
          }
        }
      });
    }
  }
});

module.exports.router = router;
