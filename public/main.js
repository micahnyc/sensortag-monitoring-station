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


				var newItems = [];
				for (var i = 0; i < json.readings.length; i++) {
					var newItem = {};
					newItem.x = i;
					newItem.y = json.readings[i].humidityTemperature;
					newItems.push(newItem);
				}
				console.log(newItems);

				var svg = d3.select("svg"),
    				margin = {top: 20, right: 20, bottom: 30, left: 50},
    				width = +svg.attr("width") - margin.left - margin.right,
    				height = +svg.attr("height") - margin.top - margin.bottom,
    				g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

				// var strictIsoParse = d3.utcParse("%Y-%m-%dT%H:%M:%S.%LZ");
				var x = d3.scaleLinear().rangeRound([0, width]);
				var y = d3.scaleLinear().rangeRound([height, 0]);

				var line = d3.line().x(function(d) { return x(d.x); }).y(function(d) { return y(d.y); });

				// x.domain(newItems.map(function(d) { return d.x; }));
			  	x.domain([0, newItems.length]);
			  	y.domain([0, maxY]);

				var maxY = d3.max(newItems, function(d) { return d.y; });
				console.log("maxy", maxY);
			  	y.domain([0, maxY]);

				g.append("g").attr("class", "axis axis--x").attr("transform", "translate(0," + height + ")").call(d3.axisBottom(x));
  				g.append("g").attr("class", "axis axis--y").call(d3.axisLeft(y).ticks(10, "%")).append("text").attr("transform", "rotate(-90)").attr("y", 6).attr("dy", "0.71em").attr("text-anchor", "end").text("Frequency");

  				g.selectAll(".bar").data(newItems).enter().append("rect").attr("class", "bar")
      				.attr("x", function(d) { return x(d.x); })
      				.attr("y", function(d) { return y(d.y); })
      				.attr("width", 10)
      				.attr("height", function(d) { return height - y(d.y); });
    		}
    		else alert("HTTP error "+xhr.status+" "+xhr.statusText);
  		}
	}
	xhr.send();
});