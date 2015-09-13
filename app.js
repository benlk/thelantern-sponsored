// copied from http://bl.ocks.org/llimllib/841dd138e429bb0545df
var rows = []
var formatdate = d3.time.format("%b. %d, %Y");
var formatdateold = d3.time.format("%b %d %Y");
var count = {
	'ad' : 0,
	'announcement' : 0,
	'opinion' : 0,
	'news' : 0,
	'retweet' : 0
}

d3.csv("data.csv", function(error, csv) {
	csv.forEach(function(row) {
		t = parseInt(row.date);
		t = new Date (t*1000);
		row.dt = t;
		row.date = formatdate(t);

		rows.push(row);
		
		switch(row.type) {
			case 'news':
				count['news']++;
				break;
			case 'ad':
				count['ad']++;
				break;
			case 'announcement':
				count['announcement']++;
				break;
			case 'retweet':
				count['retweet']++;
				break;
			case 'opinion':
				count['opinion']++;
				break;
		}
		row.link = '<a href="' + row.url + '"/>' + row.url.replace(/^.*\//, '') + '</a>';

		row.ratio = d3.round((count.ad / (count.news + count.retweet + count.opinion )), 3);
	});

	var table = d3.select('#thingoo').append('table');
		thead = table.append('thead');
		tbody = table.append('tbody');

	thead.append('th').text("Date");
	thead.append('th').text('Tweet');
	thead.append('th').text('Type');
	thead.append('th').text('Ratio');
	thead.append('th').text('');

	var tr = tbody.selectAll('tr')
		.data(rows)
		.enter().append('tr')
		.attr('class', function(d) { return d.type; });

	var td = tr.selectAll('td')
		.data(function(d) { return [d.date, d.link, d.type, d.ratio]; })
		.enter().append("td").html(function(d) { return d; });

	var width = 80,
		height = d3.select("table tbody")[0][0].clientHeight,
		mx = 10,
		radius = 2;

	// Now add the chart column
	d3.select("#thingoo tbody tr").append("td")
		.attr("id", "chart")
		.attr("width", width);

	var chart = d3.select("#chart").append("svg")
		.attr('class', 'chart')
		.attr('width', width)
		.attr('height', height);

	var maxRatio = 0;
	var minRatio = Number.MAX_VALUE;
	for (i=0; i < rows.length; i++) {
		if (rows[i].ratio > maxRatio) { maxRatio = rows[i].ratio; }
		if (rows[i].ratio < minRatio) { minRatio = rows[i].ratio; }
	}

	var dates = rows.map(function(d) { return d.dt;});

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
		.attr('stroke-width', 1);

	chart.selectAll(".line")
		.data(rows)
		.enter().append("line")
		.attr("x1", function(d) { return xscale(d.ratio); })
		.attr("y1", function(d) { return yscale(d.dt) + yscale.rangeBand()/2; })
		.attr("x2", function(d,i) { return rows[i+1] ? xscale(rows[i+1].ratio) : xscale(d.ratio); })
		.attr("y2", function(d,i) { return rows[i+1] ? yscale(rows[i+1].dt) + yscale.rangeBand()/2 : yscale(d.dt) + yscale.rangeBand()/2; })
		.attr('stroke', '#777')
		.attr('stroke-width', 1);

	var pt = chart.selectAll(".pt")
		.data(rows)
		.enter().append("g")
		.attr("class", "pt")
		.attr("transform", function(d) { return "translate(" + xscale(d.ratio) + "," + (yscale(d.dt) + yscale.rangeBand()/2) + ")"; });

	pt.append("circle")
		.attr("cx", 0)
		.attr("cy", 0)
		.attr("r", radius)
		.attr("opacity", .5)
		.attr("fill", "#ff0000");
	
	// Add the ratio to the text of the story.
	d3.select('#current').text( rows[Object.keys(rows)[Object.keys(rows).length -1]].ratio);
	// That isn't valid for _all_ objects, but it's true because of the order of elements put into the object from the spreadsheet.
});
