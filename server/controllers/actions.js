var express = require('express');
var router = express.Router();
var request = require('request');
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
mongoose.connect('mongodb://edward&tom:cactes@ds255797.mlab.com:55797/approveme');

var Request = require('../models/requests.js');

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

app.post('/', urlencodedParser, (req, res) =>{
//add to the database    

    res.status(200).end() // best practice to respond with 200 status
    var actionJSONPayload = JSON.parse(req.body.payload) // parse URL-encoded payload JSON string
    var message = {
        "text": actionJSONPayload.user.name+" clicked: "+actionJSONPayload.actions[0].name,
        "replace_original": false
    }
    sendMessage(actionJSONPayload.response_url, message)
})

module.exports.router = router;
