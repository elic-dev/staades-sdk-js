/**
 * Staades SDK JS 2.0 Core
 */

var StaadesRequest = function() {

}

StaadesRequest.prototype.baseUrl = function(staadesObject) {
	return "http://api.staades.net/2.0/app/"+staadesObject.appKey;
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
		if (xhttp.readyState == 4 && xhttp.status == 400) {
			responseObject = JSON.parse(xhttp.responseText);
			staadesObject.errorResult(responseObject);
		}
	};

	xhttp.open("GET", this.baseUrl(staadesObject)+action, true);
	xhttp.setRequestHeader("apikey", staadesObject.apiKey);
	xhttp.send();

}