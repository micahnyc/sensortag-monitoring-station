var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var Mixed = mongoose.Schema.Types.Mixed;
var uristring = 'mongodb://localhost/sensor-tag';

mongoose.connect(uristring, function (err, res) {
  if (err) {
    console.log ('ERROR connecting to: ' + uristring + '. ' + err);
  }
});

mongoose.model('reading', new Schema({
	tagid: { type: String},
	humidity: {type: Number},
	humidityTemperature: {type: Number},
	irObjectTemperature: {type: Number},
	irAmbientTemperature: {type: Number},
	pressure: {type: Number},
	lux: {type: Number},
	time: {type: Date, default: Date.now}
}));
var ReadingModel = mongoose.model('reading');

module.exports.newReading = function(data, callback) {
	var reading = new ReadingModel(data);
	reading.save(callback);
};

module.exports.getReadings = function(limit, offset, callback) {
	ReadingModel.find().skip(offset).limit(limit).exec(callback);
};

