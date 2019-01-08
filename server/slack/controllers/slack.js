const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const commands = require("../libraries/commands");

router.post("/", urlencodedParser, (req, res) => {
  if (req.body.token != process.env.ATOKEN) {
    res.status(403).end("Access forbidden");
  } else {
    res.status(200).end();

    const reqBody = req.body;
    console.log("slack post body:", reqBody);

    const { text } = reqBody;

    let command;

    if (text == "") {
      command = "help";
    } else {
      let trimmed = text.trim();

      if (trimmed == "help") {
        command = "help";
      } else if (trimmed == "list") {
        command = "list";
      } else {
        // var blocks = trimmed.split(" ");
        command = "request";
      }
    }

    // Do username check to see if it is in the channel
    //send error that the tagged ppl are not in the channel (wip..)

    console.log("command: ", command);

    commands({ reqBody, command });
  }
});

module.exports.router = router;
