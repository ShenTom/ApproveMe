var slack = require('slack');

//im.open + chat.postMessage (work in progress...)
//a msg telling the requester that the request has been sent + nudge option

const notifyRequester = function (userID, data, action) {
  
      
      slack.im.open({token: process.env.BTOKEN, user: userID})
      .then(room => {
      
        console.log("Open room: ", room);
        if (room.okay == false) {
            console.log("invalid username...");
            return
        } else {
          
          if (action == "updated") {
            
            slack.users.info({token: process.env.BTOKEN, user: data.resp_id})
              .then(tagged => {
              
            var title = "Update: " + data.event;
            var text = tagged.user.profile.real_name + " has " + data.resp + "d the event!";
            var attachments = [{
                          "title": title,
                          "text": text,
                          "color": "#36a64f",
                          "attachment_type": "default"}]
            
            slack.chat.postMessage({token: process.env.BTOKEN, channel: room.channel.id, text: "", attachments: attachments});
          
            })
      
          } else if (action == "created") {
          
          
            slack.users.info({token: process.env.BTOKEN, user: userID})
              .then(requester => {


                var txt1 = "New Request: " + data.event;
                var txt2 = "You have requested the event- " + data.event 
                    + "."

                var urgency = "High";

                if (data.urgency == "2") {
                    urgency = "Medium"
                } else if (data.urgency == "1") {
                    urgency = "Low";
                }

                var attachments = [{
                          "title": txt1,
                          "text": txt2,
                          "callback_id": "requester",
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
                              "value": urgency
                            },
                            {
                              "title": "Description",
                              "value": data.description
                            }
                          ], 
                          "actions": [{
                                  "name": "nudge",
                                  "text": "Nudge!",
                                  "style": "primary",
                                  "type": "button",
                                  "value": data.event,
                                  "confirm": {
                                    "title": "Confirm",
                                    "text": "Nudging the unresponsive tagged user(s)?",
                                    "ok_text": "Yes",
                                    "dismiss_text": "No"
                                  }
                              }
                          ]
                }]

                slack.chat.postMessage({token: process.env.BTOKEN, channel: room.channel.id, text: "", attachments: attachments});

            })
          }
        }
      
    }).catch(error => {console.log(error)})
    }
    



module.exports = notifyRequester;