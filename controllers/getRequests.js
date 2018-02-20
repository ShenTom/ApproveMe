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

router.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

router.get('/',function(req, res){
    Request.find((err, result) => {
        if (err) {
            console.log(err);
        }
        var requests = {
            "accepted": [],
            "declined": [],
            "pending": []
        }
        
        for (var i=0; i<result.length; i++) {
            var pending = false;
            var declined = false;
            
            for (var x in result[i].tagged) {
                if (result[i].tagged[x] == "declined") {
                    declined = true;
                    break;
                } else if (result[i].tagged[x] == "pending") {
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
        
        res.send(requests);
    })
  
});

router.post('/', urlencodedParser, (req, res) =>{
    
    console.log("req.query: ", req.query);
  
    
  
    var list = {
        "requested": [],
        "tagged": []
    }
    
    Request.find((err, result) => {
      
        if (err) {
          console.log(err);
        }
      
        var target = req.query.user_id;
      
      
        for (var i=0; i< result.length; i++) {
            if (result[i].requester == target) {
                list.requested.push(result[i]);
            }
            if (target in result[i].tagged) {
                list.tagged.push(result[i]);
            }
        }
      
        console.log("Send to HTTP: ", list);
        res.set("Accept", "Application/Json");
        res.send(list);
      
    });

});

module.exports.router = router;
