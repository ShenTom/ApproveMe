var express = require('express');
var router = express.Router();
var request = require('request');
var bodyParser = require('body-parser');
var slack = require('slack');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var sendMessage = require('../libraries/sendMessage');
var commands = require('../libraries/commands');
mongoose.connect('mongodb://edward&tom:cactes@ds255797.mlab.com:55797/approveme');

var Request = require('../models/requests.js');


router.get('/',function(req, res){
    res.send("Slack command end point")
});

router.post('/', urlencodedParser, (req, res) =>{
    res.status(200).end() // best practice to respond with empty 200 status code
    var reqBody = req.body
    console.log(reqBody);
    
    var text = reqBody.text;
  
    var command = "";
  
    if (text == "") {
      command = "help";
      
    } else {
      
      var trimmed = text.trim();

      if (trimmed == "help") {
        command = "help"
      } else if (trimmed == "list") {
        command = "list"
      } else {
        var blocks = trimmed.split(" ");
        command = "request";
      }
      
    }
    console.log("command: ",command)
    if (blocks) {
      console.log("blocks: ", blocks)
    }  
  
    if (reqBody.token != process.env.ATOKEN){
      
        res.status(403).end("Access forbidden")
      
    } else {
      
        commands(reqBody, command);

    }
})

module.exports.router = router;
