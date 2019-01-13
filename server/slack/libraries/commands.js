const slack = require("slack");
const request = require("request");
const sendMessage = require("./sendMessage");
const { listBuilder } = require("./utilities");

const commands = ({ reqBody, command }) => {
  //send help
  if (command == "help") {
    const instruction =
      "Use the following commands:\n `/approve request` - to send a new request to a user for approval.\n `/approve list` - to see a list of your requests.\n `/approve help` - to see this instruction again!";

    const msg = {
      response_type: "ephemeral",
      text: instruction
    };

    sendMessage({ url: reqBody.response_url, msg });

    //send list
  } else if (command == "list") {
    const url = process.env.API_URL + "users/" + reqBody.user_id;
    const options = {
      uri: url,
      method: "GET",
      headers: {
        "access-key": process.env.ACCESS_KEY
      }
    };

    request(options, (err, resp, body) => {
      const data = JSON.parse(body);

      if (err || !data.successful) {
        console.log("fetching from requests api failed...");
      } else {
        var msg = listBuilder({ info: data.result });

        //need to figure out how to represent each request...
        //maybe just top 3 and link htem to the interface?

        //add notify api!!
        //open request: notify button, closed request: result

        sendMessage({ url: reqBody.response_url, msg });
      }
    });
  } else if (command == "request") {
    //open dialog

    const dial = {
      callback_id: "requestDialog",
      title: "Request a New Approval",
      submit_label: "Request",
      elements: [
        {
          type: "text",
          label: "Name",
          name: "name"
        },
        {
          type: "text",
          label: "Date",
          name: "date",
          placeholder: "year-month-day 24hour:min (ex. 2019-03-18 16:00)"
        },
        {
          label: "Tag a User",
          type: "select",
          name: "tagged",
          data_source: "users"
        },
        {
          label: "Urgency",
          type: "select",
          name: "urgency",
          options: [
            { label: "High", value: 3 },
            { label: "Medium", value: 2 },
            { label: "Low", value: 1 }
          ]
        },
        {
          type: "textarea",
          label: "Description",
          name: "description"
        }
      ]
    };

    slack.dialog
      .open({
        token:
          process.env.ENV === "development"
            ? process.env.DEV_OTOKEN
            : process.env.PROD_OTOKEN,
        dialog: dial,
        trigger_id: reqBody.trigger_id
      })
      .then(data => {
        console.log(data);
      })
      .catch(error => {
        console.log(error);
      });
  }
};

module.exports = commands;
