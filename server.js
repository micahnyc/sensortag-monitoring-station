var express = require('express'),
    bodyParser = require('body-parser'),
    model = require('./model');
    sensors = require('./sensor-controller');

var app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));


app.get('/data', function (req, res){
    //TODO: currently this just brings the most recent 500 readings. 
    //there must be something smarter we can do here
    model.getReadings(500, 0, function (error, data) {
        if (error != null) {
            res.status(500).send({});
        } else {
            res.send({"readings":data});
        }
    });
});

app.listen(3000);

