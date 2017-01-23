/*
sensor-controller.js
• discover tags
• enabled services
• read data on timer

this module runs self contained, and doens't export any functions

*/

var discoveredTags = [];
var refreshInterval = null;

var SensorTag = require('sensortag');
var model = require("./model");

var initTags = function() {
	SensorTag.discoverAll(function (sensorTag) {
        console.log("discovered %s...", sensorTag.id);
        if (isNewSensor(sensorTag.id)) {
        	discoveredTags.push(sensorTag);
        	newTagDiscovered(sensorTag);
        }
    });
}

//internal
var newTagDiscovered = function(sensorTag) {
	//TODO - "genericize" this so that we can have a prettier function
	//TODO - some type of error handling
	sensorTag.connectAndSetUp(function (error) { 
		console.log("Connected to %s...", sensorTag.id);
		//enable services serially, currently we only enable the "weather" services
		sensorTag.enableHumidity(function (error) {
			if (error) {
				console.log("error enabling humidity");
			} else {
				//humidity enabled
				sensorTag.enableIrTemperature(function (error) {
					if (error) {
						console.log("error enabling ir temp");
					} else {
						sensorTag.enableBarometricPressure(function (error) {
							if (error) {
								console.log("error enabling barometric");
							} else {
								sensorTag.enableLuxometer(function (error) {
									if (error) {
										console.log("error enabling luxo jr");
									} else {
										console.log("services enabled");
									}
								});
							}
						});//end enable barometric
					}
				});//end enable ir
			}
		});//end enable humid
	});//end setup
}

var refreshTagData = function() {
	var sampleData = {};
	var tag = null;
	for (var i = 0; i < discoveredTags.length; i++) {
		tag = discoveredTags[i];
		sampleData.tagid = tag.id;
		//read services serially
		//TODO - cleanup in the same way as enabling the services
		tag.readHumidity(function (error, temperature, humidity) {
			console.log(tag.id, " humidity read with error:", error, " temp:", temperature, " humidity:", humidity);
			sampleData.humidity = humidity;
			sampleData.humidityTemperature = temperature;
			tag.readIrTemperature(function(error, objectTemperature, ambientTemperature) {
				console.log(tag.id, " irtemp read with error:", error, " objtemp:", objectTemperature, " ambtemp:", ambientTemperature);
				sampleData.irObjectTemperature = objectTemperature;
				sampleData.irAmbientTemperature = ambientTemperature;
				tag.readBarometricPressure(function(error, pressure) {
					console.log(tag.id, " baro read with error:", error, " pressure:", pressure);
					sampleData.pressure = pressure;
					tag.readLuxometer(function(error, lux) {
						console.log(tag.id, " lux read with error:", error, " lux:", lux);
						sampleData.lux = lux;
						tag.readBatteryLevel(function(error, batteryLevel) {
							console.log(tag.id, " battery read with error:", error, " level:", batteryLevel);
							sampleData.batteryLevel = batteryLevel;
							console.log("------SAMPLE DATA------");
							console.log(sampleData);
							console.log("------END DATA------");
							model.newReading(sampleData);
						});
					});
				});
			});

		});
	}
}

//helpers
var isNewSensor = function(id) {
	var newSensor = true;
	for(var i = 0; i < discoveredTags.length; i++) {
		if (discoveredTags[i].id == id) {
			newSensor = false;
		}
	}
	return newSensor;
}


//startup
initTags();

refreshInterval = setInterval(function() {
	refreshTagData();
}, 30000);