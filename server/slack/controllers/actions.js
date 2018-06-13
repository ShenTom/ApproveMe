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
var parseDate = require('../libraries/parseDate');
var notifyUser = require('../libraries/notifyUser');
var notifyRequester= require('../libraries/notifyRequester');
mongoose.connect('mongodb://edward&tom:cactes@ds255797.mlab.com:55797/approveme');

var respond = require('../libraries/respond.js');
var Request = require('../models/requests.js');

router.get('/',function(req, res){
    res.send("actions");
});


router.post('/', urlencodedParser, (req, res) =>{
    var payload = JSON.parse(req.body.payload) // parse URL-encoded payload JSON string
    
    if (payload.token !== process.env.ATOKEN) {
        res.sendStatus(500);
      
    } else {
        if (payload.callback_id === 'requestDialog') {
    
            console.log("Payload: ",payload);
          
            if (parseDate(payload.submission.date) == false) {
              
              console.log("The date format is incorrect.")
              var msg = {
                  "errors": [{
                     "name": "name",
                     "error": "The date format is incorrect."
                  }]
              }
              res.status(401).send(msg);

            } else {

                res.status(200).end()

                var names = payload.submission.tagged;
                var data = parseTags(names)
                var obj = {};
                for (var i=0; i<data.length; i++) {
                    obj[data[i]] = 1;
                }

                console.log("people: ", obj);

  //                     if (payload.submission.comments) {
  //                         var comments = payload.submission.comments
  //                         var object = {};
  //                         object[payload.user.id] = comments
  //                         var time = Math.floor(Date.now() / 1000)
  //                         time = time.toString();
  //                         var temp = {}
  //                         temp[time] = object;
  //                     }

  //                     console.log("object: ", object)
  //                     console.log("time: ", temp)

                var urgency = parseInt(payload.submission.urgency);

                console.log("Urgency (int): ", urgency)

                var newData = {
                    "requester": payload.user.id,
                    "event": payload.submission.name,
                    "channel": payload.channel.id,
                    "tagged": obj,
                    "date": payload.submission.date,
                    "description": payload.submission.description,
                    "urgency": urgency
                }

                console.log("result: ", newData);
              
                var url = process.env.API_URL + '/requests/';
                var options = {
                    uri: url,
                    method: 'POST',
                    headers: {
                        'Content-type': 'application/json',
                        'access-key': process.env.ACCESS_KEY
                    },
                    json: newData
                }
                
                request(options, (err, resp, body)=> {
                  var data = JSON.parse(body);
        
                  if (err || !data.successful) {
                    console.log("fetching from requests api failed...");

                  } else {

                    console.log("POST new request successfully");
                    
                    //This is supposed to be on the api side
                    notifyRequester(newData.requester, newData, "created");

                  }
                  
                });
              
            }
          
        } else if(payload.callback_id == 'requester') {
          console.log("Requester Payload: ", payload);
          
          Request.findOne({ event: payload.actions[0].value }, (err, result) => {
            if (err) {
                console.log(err);
            }
            console.log(result);
            
            var temp = Object.keys(result.tagged);
            
            for (var i=0; i<temp.length; i++) {
              if (result.tagged[temp[i]] == 0) {
                notifyUser(temp[i], result);
              }
            }
            var msg = [{
              "text": "You have nudged the unresponsive tagged user(s)!",
              "color": "#3AA3E3",
              "attachment_type": "default"
            }]
            slack.chat.postMessage({token: process.env.BTOKEN, channel: payload.channel.id, text: "", attachments: msg});
              
          })
            
          
        
        } else if(payload.callback_id === 'approve/decline') {
            console.log("Approve Payload: ",payload);
          
            //update the database
            var data = respond(payload.actions[0].value, payload.user.id, payload.actions[0].name);
              
            console.log("recorded from action page...")
            console.log(data)
            //update the text in the slack inbox at the end
            var txt1 = "New request: " + payload.actions[0].value;
            var txt2 = "Your response has been recorded. You have " + payload.actions[0].name + "d this event!"

            var attachments = [{
                        "title": txt1,
                        "text": txt2,
                        "color": "#3AA3E3",
                        "attachment_type": "default"
            }]
            slack.chat.update({token: process.env.BTOKEN, channel: payload.channel.id, text: "", ts: payload.message_ts, attachments: attachments}) 

        }
    }
})

module.exports.router = router;
