var sendMessage = require("./sendMessage");
var slack = require('slack');
var request = require('request');
var listBuilder = require('../libraries/listBuilder');


const commands = function (reqBody, command) {
  
  var instruction = "Use the following commands:\n `/approve [Tag users in your current channel]` - to send a new request to tagged users for approval.\n `/approve list` - to see a list of your requests.\n `/approve help` - to see this instruction again!"
  
  //send help
  if (command == "help") {
      var msg = {
         "response_type": "ephemeral",
         "text": instruction
      }
      sendMessage(reqBody.response_url, msg)
    
  //send list
  } else if (command == "list") {
    
      var url = process.env.API_URL + 'users/' + reqBody.user_id;
      var options = {
          uri: url,
          method: 'GET',
          headers: {
              'access-key': process.env.ACCESS_KEY
          }
      }

      request(options, (err, resp, body)=> {
        
        var data = JSON.parse(body);
        
        if (err || !data.successful) {
          console.log("fetching from requests api failed...");
          
        } else {

          var msg = listBuilder(data.result);
              
          //need to figure out how to represent each request...
          //maybe just top 3 and link htem to the interface?

          //add notify api!!
          //open request: notify button, closed request: result

          sendMessage(reqBody.response_url, msg);
          
        }
      
      });
    
  } else if (command == "request") {
      var blocks = reqBody.text.trim().split(" ");
    
      console.log(blocks)
    
      var list = "";
      for (var j=0; j< blocks.length;j++) {
          list += blocks[j] + " ";
      }
  
      //open dialog
    
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
            "placeholder": "month-day-year (ex. 03-18-2018)"
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
              { label: 'High', value: 3 },
              { label: 'Medium', value: 2 },
              { label: 'Low', value: 1 },
            ],
          },
          {
            "type": "textarea",
            "label": "Description",
            "name": "description"
          }
        ]
      }

      slack.dialog.open({token: process.env.OTOKEN ,dialog: dial, trigger_id: reqBody.trigger_id})
        .then( data => {console.log(data)})
        .catch(error => {console.log(error)})
    
  }
  
  
}

module.exports = commands;