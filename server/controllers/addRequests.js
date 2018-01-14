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
    res.send("addRequests");
});

router.post('/', urlencodedParser, (req, res) =>{
    res.status(200).end() // best practice to respond with empty 200 status code
    var reqBody = req.body
    console.log(reqBody);
    
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
      
        //checking if this channel is private and, if so, if everyone is in the channel
        //use groups.list to check if this channel is private
      
//         slack.groups.list({token: process.env.OTOKEN})
//           .then(data => {
//             console.log(data);
            
//             var privateChan = false;
          
//             for (var i=0; i < data.groups.length; i++) {
//                 if (data.groups[i].id === reqBody.channel_id) {
//                     privateChan = true;
//                     break;
//                 }
//             }
          
//             if (privateChan) {
//                 var temp = tagged;
              
//                 var members = [];
//                 slack.groups.info({token: process.env.OTOKEN, channel: reqBody.channel_id})
//                   .then(data => {
//                     members = data.group.members;
//                     console.log("members: ", members);
                  
//                     for (var x=0; x<members.length; x++) {
//                         slack.users.info({token: process.env.OTOKEN, user: members[x]})
//                           .then(data => {
//                           console.log(data);
//                           var name = data.user.name;
//                           console.log("Name: ", name);
//                           if (temp.indexOf(name) != -1) {
//                               temp.splice(temp.indexOf(name), 1);
//                           }
//                         })
//                         .catch(console.log);
//                         if (temp.length == 0) {
//                             break;
//                         }
//                     }

//                     if (temp.length != 0) {
//                         //send a message back saying someone you tagged is not in the private channel...
//                         var list = "";
//                         for (var j=0; j<temp.length;j++) {
//                             list += "@" + temp[j] + " ";
//                         }
//                         var message = {
//                             "text": 'These people you tagged are not in the private channel: ' + list,
//                             "replace_original": false
//                         }
//                         console.log('These people you tagged are not in the private channel: ' + list);
//                         sendMessageToSlackResponseURL(reqBody.response_url, message)
//                     }
                  
//                 }).catch(console.log)
              
              
//             } else {
      
                var message = {
                    "text": 'Hello',
                    "replace_original": false
                }
                var list = "";
                for (var j=0; j< tagged.length;j++) {
                    list += "@" + tagged[j] + " ";
                }
                const dial = {
                "callback_id": "requestDialog",
                "title": "Request a new approval",
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
              
//               }
//         })
//           .catch(data => {
//           console.log(data);
//         })

    }
})

module.exports.router = router;
