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

var respond = require('../libraries/respond.js');
var Request = require('../models/requests.js');


router.get('/',function(req, res){
    res.send("Decline requests by sending event name and user_id!")
});

router.post('/', urlencodedParser, (req, res) =>{
    var target = req.query
    console.log("target: ", target)
    
    respond(target.event, target.user_id, "decline")
      .then(data => {
        res.send(data);
    })

});

module.exports.router = router;
