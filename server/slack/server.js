// init project
const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const app = express();

const port = process.env.PORT || 3000;

app.use(bodyParser.json()); // to support JSON-encoded bodies
app.use(
  bodyParser.urlencoded({
    // to support URL-encoded bodies
    extended: true
  })
);
app.use(helmet());

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.use("/actions", require("./controllers/actions").router);
app.use("/slack", require("./controllers/slack").router);

const listener = app.listen(port, () => {
  console.log("Your app is listening on port " + listener.address().port);
});
