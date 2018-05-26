var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var urlencodedParser = bodyParser.urlencoded({ extended: false });
const MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var sendMessage = require('../libraries/sendMessage');
var parseTags = require('../libraries/parseTags');
var notifyUser = require('../libraries/notifyUser');
mongoose.connect('mongodb://edward&tom:cactes@ds255797.mlab.com:55797/approveme');

var Request = require('../models/requests.js');

router.get('/', (req, res) =>{ 
    Request.find((err, result) => {
        if (err) {
            console.log("error in get: ", err);
            res.status(404);
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
        
        res.set("Accept", "Application/Json");
        res.send(requests);
    });
});

router.get('/:user_id', (req, res) =>{ 
  
    var list = {
        "requested": [],
        "tagged": []
    }
    
    Request.find((err, result) => {
      
        if (err) {
          console.log("error in get with id: ", err);
          res.status(404);
        }
      
        var target = req.params.user_id;
      
      
        for (var i=0; i< result.length; i++) {
            if (result[i].requester == target) {
                list.requested.push(result[i]);
            }
            if (target in result[i].tagged) {
                list.tagged.push(result[i]);
            }
        }
      
        res.set("Accept", "Application/Json");
        res.send(list);
    });
});

router.post('/', urlencodedParser, (req, res) =>{

});

router.put('/:id', urlencodedParser, (req, res) => {

});

router.delete('/:id', urlencodedParser, (req, res) => {

});


module.exports.router = router;
