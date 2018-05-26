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

var respond = require("../libraries/respond.js");
var Request = require('../models/requests.js');

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/',function(req, res){
    res.send("Accept requests by sending event name and user_id!")
});

router.post('/', urlencodedParser, (req, res) =>{
    var target = req.query
    console.log("target: ", target)
    
    respond(target.event, target.user_id, "approve")
      .then(data => {
        res.set("Accept", "Application/Json");
        var resp = {"successful": true, "message": data}
        res.send(resp);
    })

});

module.exports.router = router;
