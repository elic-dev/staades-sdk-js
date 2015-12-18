# Staades JavaScript SDK (v2.0)

This library is in alpha stadium to test the exisiting possibilities.

## Create an application on Staades

In order to draw graphs and display data you need to create an application on [Staades.net](https://staades.net). 


## Install the library

    $ bower install staades-sdk-js

The graph requires [HighchartJS](http://www.highcharts.com) to be loaded as well. Depending on your setup you can add a standalone or jQuery based version.

### Basic example

Add your application key, api key and the ident key which you want to show.

	<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
	<script src="https://code.highcharts.com/highcharts.js"></script>
	
	<script src="https://code.staades.net/staades-graph.min.js"></script>
	<link rel="stylesheet" href="http://code.staades.net/staades-graph.min.css">

	<div id="graph-container"></div>

	<script type="text/javascript">

		$(function () {

			var staadesGraph = new StaadesGraph(
				'yourappkey',
				'yourapikey', {
					containerId: 'graph-container',
					layout: 'highchart',
					width: '100%',
					height: '200px',
					idents: [
						'YourIdent.key'
					]
				}
			);
		});

	</script>


