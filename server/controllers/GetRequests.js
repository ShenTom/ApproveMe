var express = require('express');
var router = express.Router();
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
mongoose.connect('mongodb://csc301:12345678@ds141185.mlab.com:41185/base');

var Room = require('../models/requests.js');


router.get('/',function(req, res){
  res.send("hel");
});

router.post('/', function(req, res) {
});

module.exports.router = router;
