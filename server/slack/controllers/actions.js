const express = require("express");
const router = express.Router();
const moment = require("moment");
const request = require("request");
const bodyParser = require("body-parser");
const slack = require("slack");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const { parseTags } = require("../libraries/utilities");

router.get("/", function(req, res) {
  res.send("actions");
});

router.post("/", urlencodedParser, (req, res) => {
  var payload = JSON.parse(req.body.payload); // parse URL-encoded payload JSON string

  const a_token =
    process.env.ENV === "development"
      ? process.env.DEV_ATOKEN
      : process.env.PROD_ATOKEN;

  if (payload.token !== a_token) {
    return res.sendStatus(500);
  }

  if (payload.callback_id === "requestDialog") {
    console.log("Payload: ", payload);

    if (!moment(payload.submission.date).isValid()) {
      console.log("The date format is incorrect.");

      return res.status(401).send({
        errors: [
          {
            name: "name",
            error: "The date format is incorrect."
          }
        ]
      });
    }

    res.status(200).end();

    const data = parseTags({
      tagged: payload.submission.tagged,
      requester: payload.user.id
    });
    const obj = data.reduce((names, currName) => {
      names[currName] = 0;
      return names;
    }, {});

    console.log("people: ", obj);

    /* HIDE COMMENT FEATURE

    if (payload.submission.comments) {
      var comments = payload.submission.comments;
      var object = {};
      object[payload.user.id] = comments;
      var time = Math.floor(Date.now() / 1000);
      time = time.toString();
      var temp = {};
      temp[time] = object;
    }

    console.log("object: ", object);
    console.log("time: ", temp);
    */

    var urgency = parseInt(payload.submission.urgency);

    console.log("Urgency (int): ", urgency);

    var newData = {
      requester: payload.user.id,
      event: payload.submission.name,
      channel: payload.channel.id,
      tagged: obj,
      date: moment(payload.submission.date)
        .utc()
        .valueOf(),
      createdAt: moment()
        .utc()
        .valueOf(),
      description: payload.submission.description,
      urgency: urgency
    };

    console.log("result: ", newData);

    var url = process.env.API_URL;
    var options = {
      uri: url,
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "access-key": process.env.ACCESS_KEY
      },
      json: newData
    };

    request(options, (err, resp, data) => {
      if (err || data.successful == false) {
        console.log("fetching from requests api failed...");
      } else {
        console.log("POST new request successfully");
      }
    });

    /* HIDE NUDGE FEATURE

  } else if (payload.callback_id == "requester") {
    console.log("Requester Payload: ", payload);

    let url = process.env.API_URL + payload.actions[0].value;
    let options = {
      uri: url,
      method: "GET",
      headers: {
        "access-key": process.env.ACCESS_KEY
      }
    };

    request(options, (err, resp, body) => {
      let fetch = JSON.parse(body);

      if (fetch.successful == false || err) {
        console.log("failing... invalid id");
      } else {
        let result = fetch.result;
        console.log(result);

        let temp = Object.keys(result.tagged);

        for (var i = 0; i < temp.length; i++) {
          if (result.tagged[temp[i]] == 0) {
            var url =
              process.env.API_URL +
              payload.actions[0].value +
              "/users/" +
              temp[i];
            var options = {
              uri: url,
              method: "POST",
              headers: {
                "Content-type": "application/json",
                "access-key": process.env.ACCESS_KEY
              },
              json: { action: "sendNotification" }
            };

            request(options, (err, resp, data) => {
              console.log("resp:", data);

              if (err || data.successful == false) {
                console.log("fetching from requests api failed...");
              } else {
                console.log("Nudge successfully.");
              }
            });
          }
        }
        var msg = [
          {
            text: "You have nudged the unresponsive tagged user(s)!",
            color: "#3AA3E3",
            attachment_type: "default"
          }
        ];
        slack.chat.postMessage({
          token: process.env.ENV === "development"
              ? process.env.DEV_BTOKEN
              : process.env.PROD_BTOKEN,
          channel: payload.channel.id,
          text: "",
          attachments: msg
        });
      }
    });
  */
  } else if (payload.callback_id === "approve/decline") {
    console.log("Approve/decline Payload: ", payload);

    let url =
      process.env.API_URL +
      payload.actions[0].value +
      "/users/" +
      payload.user.id;

    let options = {
      uri: url,
      method: "POST",
      headers: {
        "Content-type": "application/json",
        "access-key": process.env.ACCESS_KEY
      },
      json: { action: payload.actions[0].name }
    };

    request(options, (err, resp, data) => {
      if (err || data.successful == false) {
        console.log("fetching from requests api failed...");
      } else {
        console.log("recorded from action page...");
        //update the text in the slack inbox at the end
        var txt1 = "New request: " + data.result.event;
        var txt2 =
          "Your response has been recorded. You have " +
          payload.actions[0].name +
          "d this event!";

        var attachments = [
          {
            title: txt1,
            text: txt2,
            color: "#3AA3E3",
            attachment_type: "default"
          }
        ];
        slack.chat.update({
          token:
            process.env.ENV === "development"
              ? process.env.DEV_BTOKEN
              : process.env.PROD_BTOKEN,
          channel: payload.channel.id,
          text: "",
          ts: payload.message_ts,
          attachments: attachments
        });
      }
    });
  }
});

module.exports.router = router;
