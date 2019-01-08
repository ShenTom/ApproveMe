var slack = require("slack");

//im.open + chat.postMessage

const notifyUser = (userID, data) => {
  return new Promise((resolve, reject) => {
    slack.im
      .open({ token: process.env.BTOKEN, user: userID })
      .then(room => {
        console.log("Open room: ", room);
        if (room.okay == false) {
          console.log("invalid username...");
          return reject("invalid username");
        }

        return Promise.all([
          Promise.resolve(room.channel.id),
          slack.users.info({
            token: process.env.BTOKEN,
            user: data.requester
          })
        ]);
      })
      .then(([channel_id, requester]) => {
        var txt1 = "New Request: " + data.event;
        var txt2 =
          requester.user.profile.real_name +
          " has requested the event- " +
          data.event +
          ". Let " +
          requester.user.profile.real_name +
          " know what you think!";

        var urgency = "High";

        if (data.urgency == "2") {
          urgency = "Medium";
        } else if (data.urgency == "1") {
          urgency = "Low";
        }

        var attachments = [
          {
            title: txt1,
            text: txt2,
            callback_id: "approve/decline",
            color: "#3AA3E3",
            attachment_type: "default",
            fields: [
              {
                title: "Requester",
                value: requester.user.profile.real_name,
                short: true
              },
              {
                title: "Event",
                value: data.event,
                short: true
              },
              {
                title: "Date",
                value: data.date
              },
              {
                title: "Urgency",
                value: urgency
              },
              {
                title: "Description",
                value: data.description
              }
            ],
            actions: [
              {
                name: "approve",
                text: "Approve",
                style: "primary",
                type: "button",
                value: data.event,
                confirm: {
                  title: "Confirm",
                  text: "Approving this event?",
                  dismiss_text: "No",
                  ok_text: "Yes"
                }
              },
              {
                name: "decline",
                text: "Decline",
                style: "danger",
                type: "button",
                value: data.event,
                confirm: {
                  title: "Confirm",
                  text: "Declining this event?",
                  dismiss_text: "No",
                  ok_text: "Yes"
                }
              }
            ]
          }
        ];

        return slack.chat.postMessage({
          token: process.env.BTOKEN,
          channel: channel_id,
          text: "",
          attachments: attachments
        });
      })
      .then(chat => {
        resolve(chat.ok);
      })
      .catch(reject);
  });
};

module.exports = notifyUser;
