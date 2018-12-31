// init project
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const app = express();

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);
app.use(helmet());

app.get("/", function(req, res) {
  res.send("Hello World!");
});

app.use("/requests", require("./controllers/requests").router);

// listen for requests :)
const listener = app.listen(process.env.PORT, function() {
  console.log("Your app is listening on port " + listener.address().port);
});
