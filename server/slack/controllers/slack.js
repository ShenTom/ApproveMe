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

    switch (text) {
      case "list": {
        commands({ reqBody, command: "list" });
        return;
      }
      case "request": {
        commands({ reqBody, command: "request" });
        return;
      }
      case "help": {
        commands({ reqBody, command: "help" });
        return;
      }
      default: {
        commands({ reqBody, command: "help" });
        return;
      }
    }
  }
});

module.exports.router = router;
