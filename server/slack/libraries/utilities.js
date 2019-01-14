const moment = require("moment");

const boardMember = ["U79456HA5", "UC77Z97SL"];

const parseTags = ({ tagged, requester }) => {
  const result = [tagged];

  for (let index = 0; index < boardMember.length; index++) {
    let member = boardMember[index];

    if (member !== tagged && member !== requester) {
      result.push(member);
    }
  }

  console.log("User IDs: ", result);

  return result;
};

const timeConversion = ({ dateObj }) =>
  dateObj.toLocaleString("en-GB", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
    timeZoneName: "short",
    hour: "numeric",
    minute: "numeric",
    time: "numeric",
    timeZone: "America/Vancouver",
    hour12: false
  });

const listBuilder = ({ info }) => {
  let msg = {
    response_type: "ephemeral",
    text: "Here are your latest request and your latest tagged request!",
    attachments: []
  };

  for (let i = 0; i < 2; i++) {
    let data;
    if (i == 0) {
      data = info.requested[info.requested.length - 1];

      console.log("testing:", data);
      msg.attachments.push({
        text: "Latest requested:",
        color: "#3AA3E3",
        attachment_type: "default"
      });
    } else if (i == 1) {
      data = info.tagged[info.tagged.length - 1];

      msg.attachments.push({
        text: "Latest tagged:",
        color: "#3AA3E3",
        attachment_type: "default"
      });
    }

    if (data) {
      let urgency = "High";

      if (data.urgency == "2") {
        urgency = "Medium";
      } else if (data.urgency == "1") {
        urgency = "Low";
      }

      let txt = "Event: " + data.event;

      let eventDate = new Date(data.date);
      let createDate = new Date(data.timestamp);

      let object = {
        title: txt,
        color: "#3AA3E3",
        attachment_type: "default",
        fields: [
          {
            title: "Event Date",
            value: timeConversion({ dateObj: eventDate }),
            short: true
          },
          {
            title: "Urgency",
            value: urgency,
            short: true
          },
          {
            title: "Created At",
            value: timeConversion({ dateObj: createDate })
          },
          {
            title: "Description",
            value: data.description
          }
        ]
      };

      msg.attachments.push(object);
    } else {
      msg.attachments.push({
        text: "None :(",
        color: "#3AA3E3",
        attachment_type: "default"
      });
    }
  }

  msg.attachments.push({
    text:
      "To approve/decline a request, please go to the approveMe bot page. \n To start a new request, please use the `/approve request` command.",
    color: "#3AA3E3",
    attachment_type: "default"
  });

  return msg;
};

module.exports = { parseTags, listBuilder, timeConversion };
