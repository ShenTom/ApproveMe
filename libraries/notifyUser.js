var slack = require('slack');

//im.open + chat.postMessage (work in progress...)

const notifyUser = function (userID, data) {
  
  
    slack.im.open({token: process.env.BTOKEN, user: userID})
      .then(room => {
      
        console.log("Open room: ", room);
        if (room.okay == false) {
            console.log("invalid username...");
            return
        } else {
          
          
          slack.users.info({token: process.env.BTOKEN, user: data.requester})
            .then(requester => {
            
            
              var txt1 = "New Request: " + data.event;
              var txt2 = requester.user.profile.real_name + " has requested the event- " + data.event 
                  + ". Let " + requester.user.profile.real_name + " know what you think!"
              

              var attachments = [{
                        "title": txt1,
                        "text": txt2,
                        "callback_id": "approve/decline",
                        "color": "#3AA3E3",
                        "attachment_type": "default",
                        "fields": [
                          {
                            "title": "Requester",
                            "value": requester.user.profile.real_name,
                            "short": true
                          },
                          {
                            "title": "Event",
                            "value": data.event,
                            "short": true
                          },
                          {
                            "title": "Date",
                            "value": data.date
                          },
                          {
                            "title": "Urgency",
                            "value": data.urgency
                          },
                          {
                            "title": "Comments",
                            "value": "Default comment"
                          }
                        ], 
                        "actions": [{
                                "name": "approve",
                                "text": "Approve",
                                "style": "primary",
                                "type": "button",
                                "value": data.event,
                                "confirm": {
                                  "title": "Confirm",
                                  "text": "Approving this event?",
                                  "ok_text": "Yes",
                                  "dismiss_text": "No"
                                }
                            },
                            {
                                "name": "decline",
                                "text": "Decline",
                                "style": "danger",
                                "type": "button",
                                "value": data.event,
                                "confirm": {
                                  "title": "Confirm",
                                  "text": "Declining this event?",
                                  "ok_text": "Yes",
                                  "dismiss_text": "No"
                                }
                            }
                        ]
              }]

              slack.chat.postMessage({token: process.env.BTOKEN, channel: room.channel.id, text: "", attachments: attachments});
              
          })
        }
      
    }).catch(error => {console.log(error)})
}


module.exports = notifyUser;