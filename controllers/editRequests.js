var express = require('express');
var router = express.Router();
var request = require('request');
var bodyParser = require('body-parser');
var slack = require('slack');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var sendMessage = require('../libraries/sendMessage');
mongoose.connect('mongodb://edward&tom:cactes@ds255797.mlab.com:55797/approveme');

var Request = require('../models/requests.js');


router.get('/',function(req, res){
    res.send("Edit requests by sending request name and additional info that you want to update")
});

router.post('/', urlencodedParser, (req, res) =>{
    var target = req.query
    console.log("req: ", req)
  
    var list = []
    
    Request.find({'event': target.name}, (err, result) => {
        
      
        if (result.length == 0) {
            res.send("The request name does not exist in the database!")
        } else {
          
            var editable = true;
          
            for (var person in result[0].tagged ) {
                if (result[0].tagged[person] != "pending") {
                    editable = false;
                }
            }
            
            if (!editable) {
              
                res.send("This request is not editable because tagged user(s) have voted on the request already.");
              
            } else {
                if (target.requester) {
                    result[0].requester = target.requester;
                }

                if (target.event) {
                    result[0].event = target.event;
                }

                if (target.tagged) {
                    result[0].tagged = target.tagged;
                }

                if (target.urgency) {
                    result[0].urgency = target.urgency;
                }

                if (target.date) {
                    result[0].date = target.date;
                }

                if (target.timestamp) {
                    result[0].timestamp = target.timestamp;
                }

                if (target.comments) {
                    result[0].comments = target.comments;
                }

                result[0].save();
                res.send("Update info successfully!");
            }
        }
      
    });

});

module.exports.router = router;
