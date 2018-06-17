var express = require('express');
var router = express.Router();
var request = require('request');
var bodyParser = require('body-parser');
var slack = require('slack');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
var sendMessage = require('../libraries/sendMessage');
var commands = require('../libraries/commands');


router.post('/', urlencodedParser, (req, res) =>{
  
    if (req.body.token != process.env.ATOKEN){
      
      res.status(403).end("Access forbidden")
      
    } else {
      
      var reqBody = req.body
      console.log("slack post body:",reqBody);

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
          // var blocks = trimmed.split(" ");
          command = "request";
        }

      }
      
      // Do username check to see if it is in the channel
      //send error that the tagged ppl are not in the channel (wip..)
      
      console.log("command: ",command)
      
      res.status(200).end()
      
      commands(reqBody, command);

    }
})

module.exports.router = router;
