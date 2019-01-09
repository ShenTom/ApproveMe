const slack = require("slack");
const { roomOpener, userQuery } = require("./utilities");

//im.open + chat.postMessage
//a msg telling the requester that the request has been sent + nudge option

const notifyRequesterUpdated = ({ userId, data }) => {
  return new Promise((resolve, reject) => {
    roomOpener({ userId })
      .then(room => {
        console.log("Open room: ", room);
        if (room.okay == false) {
          console.log("invalid username...");
          return reject("invalid username");
        }

        return Promise.all([
          Promise.resolve(room.channel.id),
          userQuery({ userId: data.resp_id })
        ]);
      })
      .then(([channel_id, tagged]) => {
        var title = "Update: " + data.event + "  (" + data.date + ")";
        var text =
          tagged.user.profile.real_name +
          " has " +
          data.resp +
          "d the request!";
        var attachments = [
          {
            title: title,
            text: text,
            color: "#36a64f",
            attachment_type: "default"
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

const notifyRequesterCreated = ({ userId, data }) => {
  return new Promise((resolve, reject) => {
    roomOpener({ userId }).then(room => {
      console.log("Open room: ", room);
      if (room.okay == false) {
        console.log("invalid username...");
        return reject("invalid username");
      }

      return Promise.all([
        Promise.resolve(room.channel.id),
        userQuery({ userId })
      ])
        .then(([channel_id, requester]) => {
          var txt1 = "New Request: " + data.event;
          var txt2 = "You have requested the event- " + data.event + ".";

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
              callback_id: "requester",
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
                  name: "nudge",
                  text: "Nudge!",
                  style: "primary",
                  type: "button",
                  value: data._id,
                  confirm: {
                    title: "Confirm",
                    text: "Nudging the unresponsive tagged user(s)?",
                    ok_text: "Yes",
                    dismiss_text: "No"
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
  });
};

const notifyUser = ({ userId, data }) => {
  return new Promise((resolve, reject) => {
    roomOpener({ userId })
      .then(room => {
        console.log("Open room: ", room);
        if (room.okay == false) {
          console.log("invalid username...");
          return reject("invalid username");
        }

        return Promise.all([
          Promise.resolve(room.channel.id),
          userQuery({ userId: data.requester })
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
                value: data._id,
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
                value: data._id,
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

module.exports = { notifyRequesterUpdated, notifyRequesterCreated, notifyUser };
