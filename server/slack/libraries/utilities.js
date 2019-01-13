const boardMember = ["U79456HA5"];

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

      let object = {
        title: txt,
        color: "#3AA3E3",
        attachment_type: "default",
        fields: [
          {
            title: "Date",
            value: data.date,
            short: true
          },
          {
            title: "Urgency",
            value: urgency,
            short: true
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
      "To approve/decline a request or to nudge an user, please go to the approveMe bot page. \n To start a new request, please use the `/approve [Tag users in your current channel]` command.",
    color: "#3AA3E3",
    attachment_type: "default"
  });

  return msg;
};

module.exports = { parseTags, listBuilder };
