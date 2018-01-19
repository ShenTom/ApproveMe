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
      
        //get the tagged users in a list
        var tagged = [];
      
        var users = reqBody.text;
        if (users.indexOf("@") == users.lastIndexOf("@")) {
            tagged.push(users.slice(1))
        } else {
            while (users.indexOf("@") != users.lastIndexOf("@")) {
                var start = users.indexOf("@") + 1
                var end = users.indexOf("@", start) -1
                tagged.push(users.slice(start, end))
                users = users.slice(end+1)
            }
          tagged.push(users.slice(1))
        }
      
        console.log("Tagged: ", tagged);

      
                
        var list = "";
        for (var j=0; j< tagged.length;j++) {
            list += "@" + tagged[j] + " ";
        }
        const dial = {
        "callback_id": "requestDialog",
        "title": "Request a New Approval",
        "submit_label": "Request",
        "elements": [
          {
            "type": "text",
            "label": "Name",
            "name": "name"
          },
          {
            "type": "text",
            "label": "Date",
            "name": "date",
            "placeholder": "ex. Mar 18, 2018"
          },
          {
            "label": "Tagged",
            "type": "text",
            "name": "tagged",
            "placeholder": list,
            "value": list
          },
          {
            label: 'Urgency',
            type: 'select',
            name: 'urgency',
            options: [
              { label: 'High', value: 'High' },
              { label: 'Medium', value: 'Medium' },
              { label: 'Low', value: 'Low' },
            ],
          },
          {
            "type": "textarea",
            "label": "Comments",
            "name": "comments",
            "optional": true
          }
        ]
      }

      slack.dialog.open({token: process.env.OTOKEN ,dialog: dial, trigger_id: reqBody.trigger_id})
        .then( data => {console.log(data)})
        .catch(error => {console.log(error)})

    }
})

module.exports.router = router;
