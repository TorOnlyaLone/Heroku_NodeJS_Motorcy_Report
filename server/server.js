/* global process */

var express = require('express');
var bodyParser = require('body-parser');

var app = express();
app.set('port', (process.env.PORT || 5000));
app.use(express.static("client"));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));

app.listen(app.get('port'), function () {
  console.log('App Running on localhost:', app.get('port'));
  console.log("Motorcycle Report Start");
  console.log("_____________________");
  console.log("");
});
