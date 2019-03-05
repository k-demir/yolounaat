const express = require("express");
const path = require("path");
var CronJob = require("cron").CronJob;
let info = require("./getInformation");

const app = express();
const port = process.env.PORT || 3001;

if (process.env.NODE_ENV === 'production') {
	app.use(express.static(path.join(__dirname, '../client/build')));
}

new CronJob('0 0 * * * *', function() {
	info = require("./getInformation");
}).start();

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get("/api/foods", (req, res) => {
  res.send(info);
})

app.get('*', (req, res) => {
	res.sendFile(path.join(__dirname, '../client/build/index.html'));
});

app.listen(port, () => console.log("Server running on port " + port));
