// server.js
// where your node app starts

// init project
var express = require('express')
var request = require('request')
var bodyParser = require('body-parser')
var slack = require('slack')
var helmet = require('helmet')
var app = express();

app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use( bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use( helmet() );

app.get('/', function (req, res) {
	res.send('Hello World!');

});

app.use('/sendNotifications', require('./controllers/sendNotifications').router);
app.use('/approve', require('./controllers/approve').router);
app.use('/decline', require('./controllers/decline').router);
app.use('/actions', require('./controllers/actions').router);
app.use('/slack', require('./controllers/slack').router);
app.use('/requests', require('./controllers/requests').router);

// listen for requests :)
var listener = app.listen(process.env.PORT, function () {
  console.log('Your app is listening on port ' + listener.address().port);
});
