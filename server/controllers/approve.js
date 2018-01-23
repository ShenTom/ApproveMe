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
    res.send("Accept requests by sending request name and user ID!")
});

router.post('/', urlencodedParser, (req, res) =>{
    var target = req.query
    console.log("target: ", target)
    
    Request.find({'event': target.event}, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result);
      
        if (!target.user_id in result[0].tagged) {
            console.log("Error: the user with the user ID is not tagged.")
            res.send("Error: the user with the user ID is not tagged.")
        } else {
            if (result[0].tagged[target.user_id] == "pending" || result[0].tagged[target.user_id] == "declined") {
                result[0].tagged[target.user_id] = "approved";
                result[0].save();
                res.send("Approve successfully!");
            } else {
              res.send("Already approved the event.");
            }
        }
      
    });

});

module.exports.router = router;
