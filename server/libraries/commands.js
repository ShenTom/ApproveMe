var sendMessage = require("./sendMessage");
var slack = require('slack');


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

      var list = {
        "requested": [],
        "tagged": []
      }
      
      Request.find((err, result) => {
      
        if (err) {
          console.log(err);
        }
      
        var target = reqBody.user_id;
      
        for (var i=0; i< result.length; i++) {
            if (result[i].requester == target) {
                list.requested.push(result[i]);
            }
            if (target in result[i].tagged) {
                list.tagged.push(result[i]);
            }
        }

        var msg = {
            "response_type": "ephemeral",
            "attachments": [{
                "text": "Here are your requests!",
                "callback_id": "userRequests",
                "color": "#3AA3E3",
                "attachment_type": "default"
            }]
        }
        //need to figure out how to represent each request...
        //maybe just top 3 and link htem to the interface?
        
        sendMessage(reqBody.response_url, msg);
      
      });
    
  } else if (command == "request") {
      var blocks = reqBody.text.trim().split(" ");
    
    
    
      //send error that the tagged ppl are not in the channel
  
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
  
  
}


module.exports = commands;