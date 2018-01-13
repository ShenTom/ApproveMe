var express = require('express');
var app = express();
var bodyParser = require('body-parser')
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

app.listen(3000, () => {
	console.log('listening on 3000')
})

app.use('/getRequests', require('./controllers/GetRequests').router);
