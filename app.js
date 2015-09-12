// copied from http://bl.ocks.org/llimllib/841dd138e429bb0545df
var rows = []
var formatdate = d3.time.format("%b.%d, $Y");
var count = {
	'sponsored' : 0,
	'announcement' : 0,
	'news' : 0,
	'retweet' : 0
}

d3.csv("data.csv", function(error, csv) {
	csv.forEach(function(row) {
		row.date = parseFloat(row.date).toFixed(1);
		rows.push(row);
		
		switch(row.type) {
			case 'news':
				count['news']++;
				break;
			case 'sponsored':
				count['sponsored']++;
				break;
			case 'announcement':
				count['announcement']++;
				break;
			case 'retweet':
				count['retweet']++;
				break;
		}

		row.ratio = count.sponsored / (count.news + count.retweet);
	});

	var table = d3.select('#thingoo').append('table');
		thead = table.append('thead');
		tbody = table.append('tbody');

	thead.append('th').text("Date");
	thead.append('th').text('Tweet');
	thead.append('th').text('Type');
	thead.append('th').text('Ratio');
	thead.append('th').text('');

	var tr = tbody.selectAll('tr').data(rows).enter().append('tr');

	var td = tr.selectAll('td')
		.data(function(d) { return [d.date, d.link, d.type, d.ratio]; })
		.enter().append("td").text(function(d) { return d; });

	console.log( d3.select("table")[0]);

	var width = 80,
		height = d3.select("table")[0][0].clientHeight,
		mx = 10,
		radius = 2;

	// Now add the chart column
	d3.select("#table tbody tr").append("td")
		.attr("id", "chart")
		.attr("width", width)
		.attr("height", height);

	var maxRatio = 0;
	var minRatio = Number.MAX_VALUE;
	for (i=0; i < rows.length; i++) {
		if (rows[i].ratio > maxRatio) { maxRatio = rows[i].ratio; }
		if (rows[i].ratio < minRatio) { minRatio = rows[i].ratio; }
	}

	var dates = rows.map(function(t) { return t.date;});

	var xscale = d3.scale.linear()
		.domain([minRatio, maxRatio])
		.range([mx, width-mx])
		.nice();

	var yscale = d3.scale.ordinal()
		.domain(dates)
		.rangeBands([0,height]);

	chart.selectAll(".xasislabel")
		.data(xscale.ticks(2))
		.enter().append("text")
		.attr("class", "xaxislabel")
		.attr("x", function(d) { return xscale(d); })
		.attr("y", 10)
		.attr("text-anchor", "middle")
		.text(String)

	chart.selectAll(".xaxistick")
		.data(xscale.ticks(2))
		.enter().append("line")
		.attr('x1', function(d) { return xscale(d); })
		.attr('x2', function(d) { return xscale(d); })
		.attr('y1', 10)
		.attr('y2', height)
		.attr('stroke', '#ddd')
		.attr('stroke-width', 2);

	chart.selectAll(".line")
		.data(rows)
		.enter().append("line")
		.attr("x1", function(d) { return xscale(d.ratio); })
		.attr("y1", function(d) { return yscale(d.date) + yscale.rangeBand()/2; })
		.attr("x2", function(d,i) { return rows[i+1] ? xscale(rows[i+1].ratio) : xscale(d.ratio); })
		.attr("y2", function(d,i) { return rows[i+1] ? yscale(rows[i+1].date) + yscale.rangeBand()/2 : yscale(d.date) + yscale.rangeBand()/2; })
		.attr('stroke', '#777')
		.attr('stroke-width', 1);

	var pt = chart.selectAll(".pt")
		.data(rows)
		.enter().append("g")
		.attr("class", "pt")
		.attr("transform", function(d) { return "translate(" + xscale(d.ratio) + "," + (yscale(d.date) + yscale.rangeBand()/2) + ")"; });

	pt.append("circle")
		.attr("cx", 0)
		.attr("cy", 0)
		.attr("r", radius)
		.attr("opacity", .5)
		.attr("fill", "#ff0000");
});
