
var express = require('express')
var request = require('request')
var bodyParser = require('body-parser')
var slack = require('slack')


var app = express();
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
}));
app.use(express.json());       // to support JSON-encoded bodies
app.use(express.urlencoded());
app.use(express.static('public'))

app.get('/', function (req, res) {
	res.send('Hello World!');

});

// Route for get/Post requests for "rooms".
app.use('/actions', require('./controllers/actions').router);
app.use('/addRequests', require('./controllers/addRequests').router);
app.use('/getRequests', require('./controllers/GetRequests').router);


app.listen(3000, () => {
	console.log('listening on 3000')
})
