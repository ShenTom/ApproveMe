var express = require("express");
var router = express.Router();
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const MongoClient = require("mongodb").MongoClient;
var mongoose = require("mongoose");
var notifyUser = require("../libraries/notifyUser");
var nextSeqVal = require("../libraries/nextSeqVal");
var notifyRequester = require("../libraries/notifyRequester");
mongoose.connect(process.env.DB_LOGIN);

var Request = require("../models/requests.js");

router.get("/", (req, res) => {
  res.header("Content-Type", "application/json");

  if (req.headers["access-key"] !== process.env.ACCESS_KEY) {
    return res
      .status(401)
      .send({ successful: false, result: "Wrong/no access key is given." });
  }

  Request.find((err, result) => {
    if (err) {
      console.log("error in get: ", err);

      return res
        .status(404)
        .send({ successful: false, result: "Internal server error" });
    }

    const requests = {
      accepted: [],
      declined: [],
      pending: []
    };

    // TODO: use .map or forEach
    for (let i = 0; i < result.length; i++) {
      let pending = false;
      let declined = false;

      for (let x in result[i].tagged) {
        if (result[i].tagged[x] == -1) {
          declined = true;
          break;
        } else if (result[i].tagged[x] == 0) {
          pending = true;
        }
      }

      if (!declined && !pending) {
        requests.accepted.push(result[i]);
      } else if (declined) {
        requests.declined.push(result[i]);
      } else if (pending) {
        requests.pending.push(result[i]);
      }
    }

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
      console.log("error in get: ", err);
      return res
        .status(404)
        .send({ successful: false, result: "Internal server error" });
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
      console.log("error in get with id: ", err);
      return res
        .status(404)
        .send({ successful: false, result: "Internal server error" });
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
      console.log("seq_val: ", seq_val);
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

      // TODO: promise chain
      newRequest.save((err, newRequest) => {
        if (err) {
          console.log("post error: ", err);
          console.log("post not executed!");
          return res
            .status(404)
            .send({ successful: false, result: "Internal server error" });
        }

        console.log("Add to db! -> ", newRequest);

        res.status(201).send({ successful: true, result: newData });

        Object.keys(body.tagged).forEach(user => {
          notifyUser(user, newData)
            .then(succ => {
              if (!succ) {
                console.log("Notifying user not succ:", users[j]);
              }
            })
            .catch(err => {
              console.log("Notifying user err: ", err);
            });
        });

        notifyRequester(newData.requester, newData, "created")
          .then(succ => {
            if (!succ) {
              console.log("Notifying requester not succ:", users[j]);
            }
          })
          .catch(err => {
            console.log("Notifying requester err: ", err);
          });
      });
    })
    .catch(err => {
      console.log("seq error:", err);
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

  var query = { _id: req.params.req_id };

  update["description"] += " (edited)";

  console.log("new data parsed from body: ", update);

  Request.update(query, update, (err, raw) => {
    return err
      ? res
          .status(404)
          .send({ successful: false, result: "Internal server error" })
      : res.status(200).send({ successful: true, result: update });
  });
});

router.delete("/:req_id", urlencodedParser, (req, res) => {
  if (req.headers["access-key"] !== process.env.ACCESS_KEY) {
    res
      .status(401)
      .send({ successful: false, result: "Wrong/no access key is given." });
  } else {
    Request.deleteOne({ _id: req.params.req_id }, (err, result) => {
      if (err) {
        console.log("delete error:", err);
        console.log("delete not executed!");
        res
          .status(404)
          .send({ successful: false, result: "Internal server error" });
      } else {
        res.status(200).send({
          successful: true,
          result: "The request with this request id has been removed."
        });
      }
    });
  }
});

router.post("/:req_id/users/:user_id", urlencodedParser, (req, res) => {
  if (req.headers["access-key"] !== process.env.ACCESS_KEY) {
    res
      .status(401)
      .send({ successful: false, result: "Wrong/no access key is given." });
  } else {
    console.log("action body: ", req.body);

    let actions = ["approve", "decline", "sendNotification"];

    let action = req.body.action;

    let target = req.params.user_id;

    let validAction = false;

    if (actions.indexOf(action) != -1) {
      validAction = true;
    }

    if (!validAction) {
      res.status(400).send({
        successful: false,
        result:
          "make sure the action is one of the following: approve, decline, & sendNotification."
      });
    } else {
      let query = { _id: req.params.req_id };

      Request.findOne(query, (err, result) => {
        if (err) {
          console.log("action error:", err);
          console.log("action not executed!");
          res
            .status(404)
            .send({ successful: false, result: "Internal server error" });
        } else {
          let tagged = result.tagged;

          if (!(req.params.user_id in tagged)) {
            res
              .status(400)
              .send({ successful: false, result: "Invalid user_id is given." });
          } else {
            if (action == "approve") {
              if (tagged[target] == -1 || tagged[target] == 0) {
                tagged[target] = 1;
                Request.update(query, { tagged: tagged }, (err, raw) => {
                  if (err) {
                    console.log("action approve error:", err);
                    console.log("action approve not executed!");
                    res.status(404).send({
                      successful: false,
                      result: "Internal server error"
                    });
                  } else {
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
                          console.log(
                            "Notifying requester not succ:",
                            result.requester
                          );
                        }
                      })
                      .catch(err => {
                        console.log("Notifying requester err: ", err);
                      });
                  }
                });
              } else {
                res.status(400).send({
                  successful: false,
                  result: "This user has approved this request already."
                });
              }
            } else if (action == "decline") {
              if (tagged[target] == 1 || tagged[target] == 0) {
                tagged[target] = -1;
                Request.update(query, { tagged: tagged }, (err, raw) => {
                  if (err) {
                    console.log("action decline error:", err);
                    console.log("action decline not executed!");
                    res.status(404).send({
                      successful: false,
                      result: "Internal server error"
                    });
                  } else {
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
                          console.log(
                            "Notifying requester not succ:",
                            result.requester
                          );
                        }
                      })
                      .catch(err => {
                        console.log("Notifying requester err: ", err);
                      });
                  }
                });
              } else {
                res.status(400).send({
                  successful: false,
                  result: "This user has declined this request already."
                });
              }
            } else if (action == "sendNotification") {
              notifyUser(target, result)
                .then(succ => {
                  if (succ) {
                    res.send({
                      successful: true,
                      message: "Notified the user!"
                    });
                  } else {
                    console.log("notify user failed.");
                    res.status(404).send({
                      successful: false,
                      result: "Internal server error"
                    });
                  }
                })
                .catch(err => {
                  console.log("Notifying user err: ", err);
                });
            }
          }
        }
      });
    }
  }
});

module.exports.router = router;
