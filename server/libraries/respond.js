var sendMessage = require("./sendMessage");
var slack = require('slack');
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
mongoose.connect('mongodb://edward&tom:cactes@ds255797.mlab.com:55797/approveme');
var notifyRequester= require('../libraries/notifyRequester');

var Request = require('../models/requests.js');


const respond = function (event, resp_id, resp) {
  
  return new Promise((resolve, reject) => {
      Request.findOne({'event': event}, (err, result) => {
          if (err) {
              console.log(err);
          }

          console.log("query: ", result);

          if (typeof result == 'undefined') {
              console.log("Error: invalid request name.");
              reject("Error: invalid request name.");

          } else {
              if (!resp_id in result.tagged) {
                  console.log("Error: the user with the user ID is not tagged.")
                  reject("Error: the user with the user ID is not tagged.");

              } else {
                  if (resp == "approve") {
                      if (result.tagged[resp_id] == 1 || result.tagged[resp_id] == 0) {
                          result.tagged[resp_id] = 2;
                          Request.update({'event': event}, {'tagged': result.tagged}, function (err, raw) {
                              if (err) console.log(err);
                              resolve("Approve successfully!");
                          });
                          
                      } else {
                          resolve("Already approved the event.");
                      }
                  } else if (resp == "decline") {

                      if (result.tagged[resp_id] == 1 || result.tagged[resp_id] == 2) {
                          result.tagged[resp_id] = 0;
                          Request.update({'event': event}, {'tagged': result.tagged}, function (err, raw) {
                              if (err) console.log(err);
                              resolve("Decline successfully!");
                          });
                      } else {
                          resolve("Already declined the event.");
                      }
                  }
                
                  //data = resp, resp_id, event
                  var data = {"event": event, "resp": resp, "resp_id": resp_id};
                  notifyRequester(result.requester, data, "updated");
              }
            
              
          }
      })  
  }) 
}

module.exports = respond;