var express = require('express');
var router = express.Router();
var request = require('request');
var bodyParser = require('body-parser');
var slack = require('slack');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var sendMessage = require('../libraries/sendMessage');
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
            res.send('');
            // res.status(200).end()
    
            console.log(payload);
          
            //requester, e_name, tagged (people: response), comments (timestamp: msg, commenter), timestamp of the event, urgency
            var names = payload.submission.tagged;
            var people = [];
            while (names.indexOf("@") != names.lastIndexOf("@")) {
                var start = names.indexOf("@") + 1;
                var end = names.indexOf("@", start) -1;
                var obj = {};
                obj[names.slice(start, end)] = "N/A";
                people.push(obj);
                names = names.slice(end+1)
                console.log(names)
            }
            var obj = {};
            obj[names.slice(1)] = "N/A";
            people.push(obj);
            
            console.log("people: ", people);
            var comments = "";
            if (payload.submission.comments) {
                comments = payload.submission.comments
            }
            var object = {};
            object[payload.user.id] = comments
            var time = Math.floor(Date.now() / 1000)
            time = time.toString();
            var temp = {}
            temp[time] = object
            console.log("object: ", object)
            console.log("time: ", temp)
          
            var newData = {
                "requester": payload.user.id,
                "event": payload.submission.name,
                "tagged": people,
                "date": payload.submission.date,
                "comments": [temp],
                "timestamp": Math.floor(Date.now() / 1000),
                "urgency": payload.submission.urgency
            }
            
            console.log("result: ", newData);
          
        }
    }
})

module.exports.router = router;
