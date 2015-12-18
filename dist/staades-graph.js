/**
 * Staades SDK JS 2.0 Core
 */

var StaadesRequest = function() {

}

StaadesRequest.prototype.baseUrl = function(staadesObject) {
	// return "http://api.staades2.net/2.0/app/"+staadesObject.appKey;
	return "https://api.staades.net/2.0/app/"+staadesObject.appKey;
}

StaadesRequest.prototype.hash = function(string) {
	var hash = 0, i, chr, len;
	if (string.length == 0) return hash;
	for (i = 0, len = string.length; i < len; i++) {
		chr   = string.charCodeAt(i);
		hash  = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
}

StaadesRequest.prototype.call = function(staadesObject, action, callback) {

	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (xhttp.readyState == 4 && xhttp.status == 200) {
			// console.log(xhttp.responseText);
			responseObject = JSON.parse(xhttp.responseText);



			if (callback !== undefined) {
				callback(responseObject);
			} else {
				// depend on action do the callback
				staadesObject.valuesResult(responseObject);
			}
		}

		// handle errors
		if (xhttp.readyState == 4 && xhttp.status != 200) {
			responseObject = JSON.parse(xhttp.responseText);
			staadesObject.errorResult(xhttp.status, responseObject);
		}
	};

	xhttp.open("GET", this.baseUrl(staadesObject)+action, true);
	xhttp.setRequestHeader("apikey", staadesObject.apiKey);
	xhttp.send();

}
/**
 * Staades SDK JS 2.0 Graph
 */
var StaadesGraph = function(appKey, apiKey, options) {

	this.appKey = appKey;
	this.apiKey = apiKey;
	this.options = options;

	var hashString = appKey;

	this.containerId = Math.floor((Math.random() * 10000000) + 1);

	// display the loading container
	this.initGraphContainer();

	this.request = new StaadesRequest();

	if (this.options.idents) {
		for (var row in this.options.idents) {
			hashString += this.options.idents[row];
		}
	}

	// generate a hash for local browser storage
	this.containerHash = this.request.hash(hashString);

	// store this element
	window['staades'+this.containerId] = this;

	this.values();
};

StaadesGraph.prototype.errorResult = function(errorCode, result) {

	if (result.message !== undefined) {
		var element = document.getElementById(this.options.containerId);
		element.insertAdjacentHTML('beforeend','<span class="staades-graph-error">Response code: '+errorCode+', '+result.message+'</span>');
	}
}

StaadesGraph.prototype.values = function() {

	if (this.graphObject === undefined) {
		this.initGraphObject();
	}

	// remove old series
	this.resetGraphObject();

	var range        = localStorage.getItem('staades'+this.containerHash+'range');
	if (range == null) {
		range = '1m';
	}
	var display        = localStorage.getItem('staades'+this.containerHash+'display');
	if (display == null) {
		display = 'sum';
	}

	// active buttons
	// var buttonElements = document.getElementById(this.options.containerId).getElementsByClassName("staades-graph-range-btn");
	// for (var i=0; i<buttonElements.length;i++) {
	// 	 if (buttonElements[i].getAttribute('data-range') == range) {
	// 	 	buttonElements[i].setAttribute("class", "staades-graph-range-btn staades-active");
	// 	 } else {
	// 	 	buttonElements[i].setAttribute("class", "staades-graph-range-btn staades-invisible");
	// 	 }
	// }
	var buttonElements = document.getElementById(this.options.containerId).getElementsByClassName("staades-graph-diff-btn");
	for (var i=0; i<buttonElements.length;i++) {
		 if (buttonElements[i].getAttribute('data-diff') == display) {
		 	buttonElements[i].setAttribute("class", "staades-graph-diff-btn staades-active");
		 } else {
		 	buttonElements[i].setAttribute("class", "staades-graph-diff-btn");
		 }
	}

	if (this.options.idents) {
		for (var row in this.options.idents) {
			this.request.call(this,'/idents/'+this.options.idents[row]+'/aggregate/'+display+'?filter[range]='+range);
		}
	}

}

StaadesGraph.prototype.valuesResult = function(values) {

	// disable range buttons which can not be used
	// console.log(values.links.range5y);

	var range        = localStorage.getItem('staades'+this.containerHash+'range');
	if (range == null) {
		range = '1m';
	}

	var buttonElements = document.getElementById(this.options.containerId).getElementsByClassName("staades-graph-range-btn");
	for (var i=0; i<buttonElements.length;i++) {

		/**
		 * This is a proof of concept. The duplicated and weird code will be improved soon.
		 */
		if (buttonElements[i].getAttribute('data-range') == "1h") {
			if (values.links.range1h === undefined) {
				buttonElements[i].setAttribute("class", "staades-graph-range-btn staades-invisible");
			} else if (buttonElements[i].getAttribute('data-range') == range) {
				buttonElements[i].setAttribute("class", "staades-graph-range-btn staades-active");
			} else {
				buttonElements[i].setAttribute("class", "staades-graph-range-btn");
			}
		}

		if (buttonElements[i].getAttribute('data-range') == "1d") {
			if (values.links.range1d === undefined) {
				buttonElements[i].setAttribute("class", "staades-graph-range-btn staades-invisible");
			} else if (buttonElements[i].getAttribute('data-range') == range) {
				buttonElements[i].setAttribute("class", "staades-graph-range-btn staades-active");
			} else {
				buttonElements[i].setAttribute("class", "staades-graph-range-btn");
			}
		}

		if (buttonElements[i].getAttribute('data-range') == "1m") {
			if (values.links.range1m === undefined) {
				buttonElements[i].setAttribute("class", "staades-graph-range-btn staades-invisible");
			} else if (buttonElements[i].getAttribute('data-range') == range) {
				buttonElements[i].setAttribute("class", "staades-graph-range-btn staades-active");
			} else {
				buttonElements[i].setAttribute("class", "staades-graph-range-btn");
			}
		}


		if (buttonElements[i].getAttribute('data-range') == "1y") {
			if (values.links.range1y === undefined) {
				buttonElements[i].setAttribute("class", "staades-graph-range-btn staades-invisible");
			} else if (buttonElements[i].getAttribute('data-range') == range) {
				buttonElements[i].setAttribute("class", "staades-graph-range-btn staades-active");
			} else {
				buttonElements[i].setAttribute("class", "staades-graph-range-btn");
			}
		}

		if (buttonElements[i].getAttribute('data-range') == "5y") {
			if (values.links.range5y === undefined) {
				buttonElements[i].setAttribute("class", "staades-graph-range-btn staades-invisible");
			} else if (buttonElements[i].getAttribute('data-range') == range) {
				buttonElements[i].setAttribute("class", "staades-graph-range-btn staades-active");
			} else {
				buttonElements[i].setAttribute("class", "staades-graph-range-btn");
			}
		}
	}

	if (this.options.layout == 'highchart') {
		this.drawHighcartLineGraph(values);
	} else {
		// error missing layout
	}

}

StaadesGraph.prototype.initGraphContainer = function() {

	var element = document.getElementById(this.options.containerId);
	element.setAttribute("class", "staades-graph-container");
	element.setAttribute("data-staades-id", this.containerId);
	var innerHTML = '';
	
	// buttons
	innerHTML += '<div class="staades-graph-btns">';
	// range buttons
	innerHTML += '<div class="staades-graph-range-btns"><span class="staades-graph-range-btn staades-invisible" data-range="5y">5Y</span><span class="staades-graph-range-btn staades-invisible" data-range="1y">1Y</span><span class="staades-graph-range-btn" data-range="1m">1M</span><span class="staades-graph-range-btn" data-range="1d">1D</span><span class="staades-graph-range-btn" data-range="1h">1H</span></div>';
	// diff/sum/avg buttons
	innerHTML += '<div class="staades-graph-diff-btns"><span class="staades-graph-diff-btn staades-visible" data-diff="sum">&sum;</span><span class="staades-graph-diff-btn staades-visible" data-diff="diff">&Delta;</span>  </div>';

	innerHTML += ' </div>'; // staades-grpah-btns

	// graph
	innerHTML += '<div id="staades-chart-'+this.containerId+'" style="height: '+this.options.height+' "></div>';

	element.innerHTML = innerHTML;

	// listen to range buttons
	var buttonElements = document.getElementById(this.options.containerId).getElementsByClassName("staades-graph-range-btn");
	for (var i=0; i<buttonElements.length;i++) {
		buttonElements[i].addEventListener("click", function(btn) {
			StaadesGraphHandler.rangeBtnClicked(btn);
		});
	}

	// listen to diff/total buttons
	buttonElements = document.getElementById(this.options.containerId).getElementsByClassName("staades-graph-diff-btn");
	for (var i=0; i<buttonElements.length;i++) {
		buttonElements[i].addEventListener("click", function(btn) {
			StaadesGraphHandler.diffBtnClicked(btn);
		});
	}
}

StaadesGraph.prototype.initGraphObject = function() {

	if (this.options.layout == 'highchart') {
		this.initHighcartLineGraph();
	}
}

StaadesGraph.prototype.resetGraphObject = function() {

	if (this.options.layout == 'highchart') {
		
		while(this.graphObject.series.length > 0) {
	    	this.graphObject.series[0].remove(true);
		}
	}
}


/**
 * USER INTERACTIONS
 */
StaadesGraph.prototype.setDateIntervalRange = function(newRange) {

	// store for reload
	localStorage.setItem('staades'+this.containerHash+'range', newRange);

	this.values();
}
StaadesGraph.prototype.setDisplayModus = function(newModus) {

	// store for reload
	localStorage.setItem('staades'+this.containerHash+'display', newModus);

	this.values();
}

/**
 * LAYOUT HIGHCHART
 */

StaadesGraph.prototype.mapHighchartValues = function(values) {

	var serieData = [];
	var serieTitle = '';
	var granularityValue;
	var value;

	var displayModus = localStorage.getItem('staades'+this.containerHash+'display');
	if (displayModus ==null) {
		displayModus = 'total';
	}

	for (var row in values.data) {

		granularityValue = values.data[row].attributes.granularity_value.toString();
		serieTitle = values.data[row].attributes.ident_key;

		if (displayModus == null || displayModus == 'diff') {
			value = values.data[row].attributes.value_diff
		} else {
			value = values.data[row].attributes.value_sum
		}
		
		serieData.push([
			Date.UTC(
				granularityValue.substring(0,4),
				granularityValue.substring(4,6) - 1,
				granularityValue.substring(6,8),
				granularityValue.substring(8,10),
				granularityValue.substring(10,12)
			),
			value
		]);

	}

	serieData.sort(function (a,b) {
		if (a[0] > b[0]) return 1;
		if (a[0] < b[0]) return -1;
		return 0;
	});

	return {
		name: serieTitle,
		data: serieData,
		animation: false,
		marker: { radius: 2 }
	};

}


StaadesGraph.prototype.mapHighchartAggregateValues = function(values) {

	var serieData = [];

	for (var row in values.aggregates) {

		// @todo Atom datetime to JS date 
		var datestr = values.aggregates[row].date;

		var yy   = datestr.substring(0,4);
		var mo   = datestr.substring(5,7);
		var dd   = datestr.substring(8,10);
		var hh   = datestr.substring(11,13);
		var mi   = datestr.substring(14,16);
		var ss   = datestr.substring(17,19);
		// var tzs  = datestr.substring(19,20);
		// var tzhh = datestr.substring(20,22);
		// var tzmi = datestr.substring(23,25);

		serieData.push([
			Date.UTC(yy-0,mo-1,dd-0,hh-0,mi-0,ss-0),
			values.aggregates[row].value
		]);
	}


	serieData.sort(function (a,b) {
		if (a[0] > b[0]) return 1;
		if (a[0] < b[0]) return -1;
		return 0;
	});

	return {
		name: values.data.attributes.title,
		data: serieData,
		animation: false,
		marker: { radius: 2 }
	};

}


StaadesGraph.prototype.initHighcartLineGraph = function(values) {
	
	// console.log('init graphObject');

	var options = {
		chart: {
			renderTo: 'staades-chart-'+this.containerId,
			type: 'line',
		},
		title: {
			text: ''
		},
		xAxis: {
			// categories: [],
			type: 'datetime',
			dateTimeLabelFormats: { // don't display the dummy year
				millisecond: '%H:%M:%S',
				second: '%H:%M:%S',
				minute: '%H:%M',
				hour: '%H:%M',
				day: '%d.%b',
				week: '%d.%b',
				month: '%b %Y',
				year: '%Y'
			},
			title: {
				text: 'Date',
				enabled:false

			}
		},
		yAxis: {
			title: {
				enabled: false
			}
		},
		legend: {
			enabled: false
		},
		// title: false,
		loading: false,
		credits: {
			enabled: false
		}
	};

	this.graphObject = new Highcharts.Chart(options);

}

StaadesGraph.prototype.drawHighcartLineGraph = function(values) {
	
	// console.log('draw data');
	this.graphObject.addSeries(this.mapHighchartAggregateValues(values), false);
	this.graphObject.redraw();

}

/**
 * UI Frontend Handler
 */

StaadesGraphHandler = {
	rangeBtnClicked: function(event) {
		var staadesContainerId = event.target.parentElement.parentElement.parentElement.getAttribute('data-staades-id');
		var range = event.target.getAttribute('data-range');
		
		window['staades'+staadesContainerId].setDateIntervalRange(range);
	},
	diffBtnClicked: function(event) {
		var staadesContainerId = event.target.parentElement.parentElement.parentElement.getAttribute('data-staades-id');
		var diff = event.target.getAttribute('data-diff');
		
		window['staades'+staadesContainerId].setDisplayModus(diff);
	}
}