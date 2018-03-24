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
var openRoom = require('../libraries/openRoom');
mongoose.connect('mongodb://edward&tom:cactes@ds255797.mlab.com:55797/approveme');

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
          //catch callback_id === "accept" or "decline"
    
            console.log("Payload: ",payload);
          
            Request.find({ event: payload.submission.name }, (err, result) => {
                if (err) {
                    console.log(err);
                }
                console.log(result)
              
                if (result.length != 0) {
                    console.log("The event is already in the database!!")
                    var msg = {
                        "errors": [{
                           "name": "name",
                           "error": "The name exists in the database already!"
                        }]
                    }
                    res.send(msg);
                  
                } else {
                    
                    res.status(200).end()
                  
                    var names = payload.submission.tagged;
                    var data = parseTags(names)
                    var obj = {};
                    for (var i=0; i<data.length; i++) {
                        obj[data[i]] = "pending";
                    }

                    console.log("people: ", obj);


                    if (payload.submission.comments) {
                        var comments = payload.submission.comments
                        var object = {};
                        object[payload.user.id] = comments
                        var time = Math.floor(Date.now() / 1000)
                        time = time.toString();
                        var temp = {}
                        temp[time] = object;
                    }

                    console.log("object: ", object)
                    console.log("time: ", temp)

                    var newData = {
                        "requester": payload.user.id,
                        "event": payload.submission.name,
                        "tagged": obj,
                        "date": payload.submission.date,
                        "comments": payload.submission.comments? [temp]:[],
                        "timestamp": Math.floor(Date.now() / 1000),
                        "urgency": payload.submission.urgency
                    }

                    console.log("result: ", newData);

                    var newRequest = new Request(newData);
                    newRequest.save((err, newRequest) => {
                        if (err) {
                          console.log(err);
                        }
                        console.log("Add to db! -> ", newRequest);

                        //now send the notification to tagged users
                        for (var j=0; j<data.length; j++) {
                            openRoom(data[j]).then(roomID => {
                              
                              //design the message (wip...)
                              //make the button for accept or decline unique ID
                              slack.chat.postMessage({token: process.env.BTOKEN, channel: roomID, text: "new request!"})
                            }) 
                        }

                    })
                }
            });
          
        }
    }
})

module.exports.router = router;
