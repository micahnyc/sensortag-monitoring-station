document.addEventListener("DOMContentLoaded", function() {

	console.log("loadingData");
	var xhr = new XMLHttpRequest();
	xhr.open("GET","/data",true);
	xhr.onreadystatechange = function() {
  		if( xhr.readyState == 4) {
    		if( xhr.status == 200) {
    			console.log(xhr);
      			var json = eval("("+this.responseText+")");
				console.log("loadded");
				console.log(json);

				var parseDate = d3.time.format("%Y-%m-%dT%H:%M:%S.%LZ").parse;
				var humidityItems = [];
				var humidityTemperatureItems = [];
				var irObjectTemperatureItems = [];
				var irAmbientTemperatureItems = [];
				var pressureItems = [];
				var luxItems = [];
				var batteryLevelItems = [];
				var readings = json.readings.reverse();
				for (var i = 0; i < readings.length; i++) {
					var reading = readings[i];
					var readingDate = parseDate(reading.time);
					humidityItems.push({date: readingDate, value: reading.humidity});
					humidityTemperatureItems.push({date: readingDate, value: reading.humidityTemperature});
					irObjectTemperatureItems.push({date: readingDate, value: reading.irObjectTemperature});
					irAmbientTemperatureItems.push({date: readingDate, value: reading.irAmbientTemperature});
					pressureItems.push({date: readingDate, value: reading.pressure});
					luxItems.push({date: readingDate, value: reading.lux});
					batteryLevelItems.push({date: readingDate, value: reading.batteryLevel});
				}
				drawChart("humidity", humidityItems);
				drawChart("humidityTemperature", humidityTemperatureItems);
				drawChart("irObjectTemperature", irObjectTemperatureItems);
				drawChart("irAmbientTemperature", irAmbientTemperatureItems);
				drawChart("pressure", pressureItems);
				drawChart("lux", luxItems);
				drawChart("battery level", batteryLevelItems);
    		}
    		else alert("HTTP error "+xhr.status+" "+xhr.statusText);
  		}
	}
	xhr.send();
});

function drawChart(label, items) {
	var margin = {top: 20, right: 60, bottom: 30, left: 20},
			    width = 960 - margin.left - margin.right,
			    height = 500 - margin.top - margin.bottom;

				var x = d3.time.scale().range([0, width]);
				var y = d3.scale.linear().range([height, 0]);
				var xAxis = d3.svg.axis().scale(x).orient("bottom").tickSize(-height, 0).tickPadding(6);
				var yAxis = d3.svg.axis().scale(y).orient("right").tickSize(-width).tickPadding(6);
				var area = d3.svg.area().interpolate("step-after").x(function(d) { return x(d.date); }).y0(y(0)).y1(function(d) { return y(d.value); });
				var line = d3.svg.line().interpolate("step-after").x(function(d) { return x(d.date); }).y(function(d) { return y(d.value); });

				var svg = d3.select("body").append("svg").attr("width", width + margin.left + margin.right).attr("height", height + margin.top + margin.bottom).append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
				var zoom = d3.behavior.zoom().on("zoom", draw);

				function draw() {
				  svg.select("g.x.axis").call(xAxis);
				  svg.select("g.y.axis").call(yAxis);
				  svg.select("path.area").attr("d", area);
				  svg.select("path.line").attr("d", line);
				}

				var gradient = svg.append("defs").append("linearGradient").attr("id", "gradient").attr("x2", "0%").attr("y2", "100%");
				gradient.append("stop").attr("offset", "0%").attr("stop-color", "#fff").attr("stop-opacity", .5);
				gradient.append("stop").attr("offset", "100%").attr("stop-color", "#999").attr("stop-opacity", 1);
				svg.append("clipPath").attr("id", "clip").append("rect").attr("x", x(0)).attr("y", y(1)).attr("width", x(1) - x(0)).attr("height", y(0) - y(1));
				svg.append("g").attr("class", "y axis").attr("transform", "translate(" + width + ",0)");
				svg.append("path").attr("class", "area").attr("clip-path", "url(#clip)").style("fill", "url(#gradient)");
				svg.append("g").attr("class", "x axis").attr("transform", "translate(0," + height + ")");
				svg.append("path").attr("class", "line").attr("clip-path", "url(#clip)");
				svg.append("rect").attr("class", "pane").attr("width", width).attr("height", height).call(zoom);

				svg.append("text").attr("class", "x label").attr("text-anchor", "end").attr("x", width).attr("y", height - 6).text(label);


				var startDate = items[0].date
				var endDate = items[items.length-1].date
				x.domain([startDate, endDate]);
				y.domain([0, d3.max(items, function(d) { return d.value; })]);
				zoom.x(x);
				svg.select("path.area").data([items]);
				svg.select("path.line").data([items]);
  				draw()
}