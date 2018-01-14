var express = require('express');
var router = express.Router();
var request = require('request');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
mongoose.connect('mongodb://csc301:12345678@ds141185.mlab.com:41185/base');

var Request = require('../models/requests.js');


router.get('/',function(req, res){
    res.send("hel");
});

router.post('/', (req, res) => {
//open dialog
    
    res.status(200).end();
    var reqBody = req.body;
    var responseURL = reqBody.response_url;
    if (reqBody.token != "WuiZLem2MOFTzb37Be4m7r5w"){
        res.status(403).end("Access forbidden");
    } else {
        var message = {
            "text": "This is your first interactive message",
            "attachments": [
                {
                    "text": "Building buttons is easy right?",
                    "fallback": "Shame... buttons aren't supported in this land",
                    "callback_id": "button_tutorial",
                    "color": "#3AA3E3",
                    "attachment_type": "default",
                    "actions": [
                        {
                            "name": "yes",
                            "text": "yes",
                            "type": "button",
                            "value": "yes"
                        },
                        {
                            "name": "no",
                            "text": "no",
                            "type": "button",
                            "value": "no"
                        },
                        {
                            "name": "maybe",
                            "text": "maybe",
                            "type": "button",
                            "value": "maybe",
                            "style": "danger"
                        }
                    ]
                }
            ]
        };
        sendMessage(responseURL, message);
    }
});


function sendMessage(url, msg){
    var postOptions = {
        uri: url,
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        json: msg
    }
    
    request(postOptions, (error, resp, body) => {
        if (error) {
            console.log("Error sending message back to Slack!");
        }
    });
}

module.exports.router = router;
