var express = require('express');
var router = express.Router();
var request = require('request');
var bodyParser = require('body-parser');
var slack = require('slack');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var sendMessage = require('../libraries/sendMessage');
var parseTags = require('../libraries/parseTags');
var notifyUser = require('../libraries/notifyUser');
mongoose.connect('mongodb://edward&tom:cactes@ds255797.mlab.com:55797/approveme');

var Request = require('../models/requests.js');


router.get('/',function(req, res){
    res.send("Send a notification about an event to the tagged user by posting the user_id and the event name.");
});

router.post('/', urlencodedParser, (req, res) =>{
    
    console.log("req.query: ", req.query);
  
    var target = req.query;
  
    Request.findOne({'event': target.event}, (err, result) => {
        notifyUser(target.user_id, result);
        var resp = {"successful": true, "message": "Notified the user!"}
        res.send(resp);
    })
})

module.exports.router = router;
