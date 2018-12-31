const express = require("express");
const router = express.Router();
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });
const MongoClient = require("mongodb").MongoClient;
const mongoose = require("mongoose");
const notifyUser = require("../libraries/notifyUser");
const nextSeqVal = require("../libraries/nextSeqVal");
const notifyRequester = require("../libraries/notifyRequester");
mongoose.connect(process.env.DB_LOGIN);

const Request = require("../models/requests.js");

router.get("/", (req, res) => {
  res.header("Content-Type", "application/json");

  if (req.headers["access-key"] !== process.env.ACCESS_KEY) {
    return res
      .status(401)
      .send({ successful: false, result: "Wrong/no access key is given." });
  }

  Request.find((err, result) => {
    if (err) {
      const error = "Internal server error: " + err;

      return res.status(404).send({ successful: false, result: error });
    }

    const requests = {
      accepted: [],
      declined: [],
      pending: []
    };

    result.forEach(request => {
      let pending = false;
      let declined = false;

      for (let x in request.tagged) {
        if (request.tagged[x] == -1) {
          declined = true;
          break;
        } else if (request.tagged[x] == 0) {
          pending = true;
        }
      }

      if (!declined && !pending) {
        requests.accepted.push(request);
      } else if (declined) {
        requests.declined.push(request);
      } else if (pending) {
        requests.pending.push(request);
      }
    });

    return res.send({ successful: true, result: requests });
  });
});

router.get("/:req_id", (req, res) => {
  res.header("Content-Type", "application/json");

  if (req.headers["access-key"] !== process.env.ACCESS_KEY) {
    return res
      .status(401)
      .send({ successful: false, result: "Wrong/no access key is given." });
  }

  Request.findOne({ _id: req.params.req_id }, (err, result) => {
    if (err) {
      const error = "Internal server error: " + err;

      return res.status(404).send({ successful: false, result: error });
    }

    return result
      ? res.send({ successful: true, result: result })
      : res.status(404).send({ successful: false, result: "invalid id" });
  });
});

router.get("/users/:user_id", (req, res) => {
  res.header("Content-Type", "application/json");

  if (req.headers["access-key"] !== process.env.ACCESS_KEY) {
    return res.status(401).send("Wrong/no access key is given.");
  }

  const list = {
    requested: [],
    tagged: []
  };

  Request.find((err, result) => {
    if (err) {
      const error = "Internal server error: " + err;

      return res.status(404).send({ successful: false, result: error });
    }

    const target = req.params.user_id;

    result.forEach(item => {
      if (item.requester == target) {
        list.requested.push(item);
      }
      if (target in item.tagged) {
        list.tagged.push(item);
      }
    });

    return res.send({ successful: true, result: list });
  });
});

router.post("/", urlencodedParser, (req, res) => {
  res.header("Content-Type", "application/json");

  if (req.headers["access-key"] !== process.env.ACCESS_KEY) {
    return res
      .status(401)
      .send({ successful: false, result: "Wrong/no access key is given." });
  }
  console.log("post req.body: ", req.body);

  var body = req.body;

  const requirement = [
    "tagged",
    "event",
    "requester",
    "date",
    "description",
    "urgency"
  ];

  requirement.forEach(fieldName => {
    if (!(fieldName in body)) {
      return res.status(400).send({
        successful: false,
        result: "make sure all the correct fields are included in the json."
      });
    }
  });

  nextSeqVal("requestid")
    .then(seq_val => {
      var newData = {
        _id: seq_val,
        requester: body.requester,
        event: body.event,
        tagged: body.tagged,
        date: body.date,
        description: body.description,
        timestamp: Math.floor(Date.now() / 1000),
        urgency: body.urgency
      };

      console.log("new data parsed from body: ", newData);

      var newRequest = new Request(newData);

      return newRequest.save();
    })
    .then(newRequest => {
      console.log("Add to db! -> ", newRequest);

      res.status(201).send({ successful: true, result: newRequest });

      Object.keys(body.tagged).forEach(user => {
        notifyUser(user, newRequest)
          .then(succ => {
            if (!succ) {
              console.log("Notifying user not succ:", user);
            }
          })
          .catch(err => {
            console.log("Notifying user err: ", err);
          });
      });

      notifyRequester(newRequest.requester, newRequest, "created")
        .then(succ => {
          if (!succ) {
            console.log("Notifying requester not succ");
          }
        })
        .catch(err => {
          console.log("Notifying requester err: ", err);
        });
    })
    .catch(err => {
      if (err) {
        const error = "Internal server error: " + err;

        return res.status(404).send({ successful: false, result: error });
      }
    });
});

router.put("/:req_id", urlencodedParser, (req, res) => {
  res.header("Content-Type", "application/json");

  if (req.headers["access-key"] !== process.env.ACCESS_KEY) {
    return res
      .status(401)
      .send({ successful: false, result: "Wrong/no access key is given." });
  }

  console.log("put req.body: ", req.body);

  var body = req.body;

  const requirement = ["tagged", "event", "date", "description", "urgency"];

  const update = requirement.reduce((accumulator, currField) => {
    if (currField in body) {
      accumulator[currField] = body[currField];
    }
    return accumulator;
  }, {});

  if (update["description"]) {
    update["description"] += " (edited)";
  }

  console.log("new data parsed from body: ", update);

  Request.update({ _id: req.params.req_id }, update, (err, raw) => {
    if (err) {
      const error = "Internal server error: " + err;

      return res.status(404).send({ successful: false, result: error });
    }

    return res.status(200).send({ successful: true, result: update });
  });
});

router.delete("/:req_id", urlencodedParser, (req, res) => {
  res.header("Content-Type", "application/json");

  if (req.headers["access-key"] !== process.env.ACCESS_KEY) {
    return res
      .status(401)
      .send({ successful: false, result: "Wrong/no access key is given." });
  }

  Request.deleteOne({ _id: req.params.req_id }, (err, result) => {
    if (err) {
      const error = "Internal server error: " + err;

      return res.status(404).send({ successful: false, result: error });
    }

    return res.status(200).send({
      successful: true,
      result: "The request with this request id has been removed."
    });
  });
});

router.post("/:req_id/users/:user_id", urlencodedParser, (req, res) => {
  res.header("Content-Type", "application/json");

  if (req.headers["access-key"] !== process.env.ACCESS_KEY) {
    return res
      .status(401)
      .send({ successful: false, result: "Wrong/no access key is given." });
  }

  console.log("action body: ", req.body);

  const actions = ["approve", "decline", "sendNotification"];

  let action = req.body.action;

  const target = req.params.user_id;

  if (actions.indexOf(action) == -1) {
    return res.status(400).send({
      successful: false,
      result:
        "make sure the action is one of the following: approve, decline, & sendNotification."
    });
  }

  Request.findOne({ _id: req.params.req_id }, (err, result) => {
    if (err) {
      const error = "Internal server error: " + err;

      return res.status(404).send({ successful: false, result: error });
    }

    let tagged = result.tagged;

    if (!(req.params.user_id in tagged)) {
      return res
        .status(400)
        .send({ successful: false, result: "Invalid user_id is given." });
    }

    if (action == "approve") {
      if (tagged[target] == 1) {
        return res.status(400).send({
          successful: false,
          result: "This user has approved this request already."
        });
      }

      tagged[target] = 1;
      Request.update(query, { tagged: tagged }, (err, raw) => {
        if (err) {
          const error = "Internal server error: " + err;

          return res.status(404).send({ successful: false, result: error });
        }

        result.tagged = tagged;
        res.status(200).send({ successful: true, result: result });

        var data = {
          event: result.event,
          resp: action,
          resp_id: target,
          date: result.date
        };
        notifyRequester(result.requester, data, "updated")
          .then(succ => {
            if (!succ) {
              console.log("Notifying requester not succ:", result.requester);
            }
          })
          .catch(err => {
            console.log("Notifying requester err: ", err);
          });
      });
    } else if (action == "decline") {
      if (tagged[target] == -1) {
        return res.status(400).send({
          successful: false,
          result: "This user has declined this request already."
        });
      }

      tagged[target] = -1;
      Request.update(query, { tagged: tagged }, (err, raw) => {
        if (err) {
          const error = "Internal server error: " + err;

          return res.status(404).send({ successful: false, result: error });
        }

        result.tagged = tagged;
        res.status(200).send({ successful: true, result: result });

        var data = {
          event: result.event,
          resp: action,
          resp_id: target,
          date: result.date
        };
        notifyRequester(result.requester, data, "updated")
          .then(succ => {
            if (!succ) {
              console.log("Notifying requester not succ:", result.requester);
            }
          })
          .catch(err => {
            console.log("Notifying requester err: ", err);
          });
      });
    } else if (action == "sendNotification") {
      notifyUser(target, result)
        .then(succ => {
          return succ
            ? res.send({
                successful: true,
                message: "Notified the user!"
              })
            : res.status(404).send({
                successful: false,
                result: "Internal server error"
              });
        })
        .catch(err => {
          console.log("Notifying user err: ", err);
        });
    }
  });
});

module.exports.router = router;
