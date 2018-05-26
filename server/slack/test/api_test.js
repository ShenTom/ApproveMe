var request = require('request');


var options = {
  uri: 'https://approve-me.glitch.me/addRequests',
  method: 'POST',
  json: {
    "requester": "U79456HA5",
    "event": "Testing Add feature",
    "channel": "C8RQUTLU9",
    "tagged": {
        "U79456HA5": 2,
        "U7A5FL7P1": 1
    },
    "date": "03-18-2018",
    "description": "Testingggg",
    "urgency": "2"
  },
  headers: {
    'Content-type': 'application/json'
  },
};

request(options, function (error, response, body) {
  if (!error) {
    console.log("status code: ", response.statusCode);
    console.log("body: ", body);
  }
});

console.log("running...");

//request.get('https://approve-me.glitch.me/getRequests', (err, resp, body) => {
//    var data = JSON.parse(body);
//    console.log("all request: ", data);
//})
