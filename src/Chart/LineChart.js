
//LineChart extends Chart

GeoDash.LineChart = function(el, options) {
  this.defaults = {
    x: 'x',
    y: 'y',
    width: 'auto',
    height: 'auto',
    colors: ['#d80000', '#006200'],
    interpolate: 'monotone',
    dotRadius: 3,
    title: false
  };
  GeoDash.Chart.prototype.initialize.call(this, el, options);
}

GeoDash.LineChart = GeoDash.Class.inherit(GeoDash.LineChart, GeoDash.Chart);

GeoDash.LineChart.prototype.drawChart = function(){
  var self = this;

  this.margin = {top: 10, right: 20, bottom: 30, left: 50};
  this.width = (this.options.width === 'auto'  || this.options.width === undefined ? parseInt(d3.select(this.el).style('width')) : this.options.width) - this.margin.left - this.margin.right;
  this.height = (this.options.height === 'auto'  || this.options.height === undefined ? parseInt(d3.select(this.el).style('height')) : this.options.height) - this.margin.top - this.margin.bottom;
  if(this.options.title) {
    this.height  = this.height - 21;
  }

  this.x = d3.time.scale()
      .range([0, this.width]);

  this.y = d3.scale.linear()
      .range([this.height, 0]);

  this.xAxis = d3.svg.axis()
      .scale(this.x)
      .tickSize(this.height*-1)
      .orient("bottom");

  this.yAxis = d3.svg.axis()
      .scale(this.y)
      .tickSize(this.width*-1)
      .orient("left");

  this.color = d3.scale.ordinal()
     .range(this.options.colors);

  this.line = d3.svg.line()
      .interpolate(this.options.interpolate)
      .x(function(d) { return self.x(d.date); })
      .y(function(d) { return self.y(d.value); });

  this.formatComma = d3.format(",");

  var svg = d3.select(this.el).append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (this.height) + ")")
      .call(this.xAxis);

  svg.append("g")
      .attr("class", "y axis")
      .call(this.yAxis);
}

GeoDash.LineChart.prototype.hoverOnDot = function(d, i, dot){
  var self = this;
  var stat = this.formatComma(d.value);
  var x = 55 + this.x(d.date);
  var y = 45 + this.y(d.value);
  d3.select(dot).transition().attr('r', this.options.dotRadius + 3);
  
  //get width of x-axis, so labels don't go off the edge
  var w = d3.select('.line')[0][0].getBBox().width;
  if(this.x(d.date) >= w) x -= 55;

  d3.select(self.el).select('.hoverbox').style('left', x + 'px');
  d3.select(self.el).select('.hoverbox').style('top', y + 'px');
  d3.select(self.el).select('.hoverbox').html(stat);
  d3.select(self.el).select('.hoverbox').transition().style('display', 'block');
  //d3.select(self.el).select('.hoverbox').transition().style('opacity', '1');
}

GeoDash.LineChart.prototype.hoverOffDot = function(d, i, dot){
  var self = this;
  d3.select(self.el).select('.hoverbox').transition().style('display', 'none');
  //d3.select(self.el).select('.hoverbox').transition().style('opacity', '0');
  d3.select(dot).transition().attr('r', this.options.dotRadius);
}

GeoDash.LineChart.prototype.update = function(data) {
  var self = this;

  this.color.domain(d3.keys(data[0]).filter(function(key) { return key !== self.options.x; }));

  var linedata = this.color.domain().map(function(name) {
    return {
      name: name,
      values: data.map(function(d) {
        return {date: d[self.options.x], value: +d[name]};
      })
    };
  });

  this.x.domain(d3.extent(data, function(d) { return d[self.options.x]; }));

  this.y.domain([
    d3.min(linedata, function(c) { return d3.min(c.values, function(v) { return v.value; }); }),
    d3.max(linedata, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
  ]);

  var svg = d3.select(this.el + " svg g");

  this.xAxis.ticks(data.length);

  svg.select(".y.axis").transition()
    .call(this.yAxis);

  svg.select(".x.axis").transition()
    .call(this.xAxis);

  var delay = function(d, i) { return i * 10; }


  var lines = svg.selectAll(".line")
    .data(linedata);

  lines
    .transition().duration(500).delay(delay)
    .attr("d", function(d) { return self.line(d.values); });

  lines
    .enter().append('path')
      .attr("class", "line")
      .attr("d", function(d) { return self.line(d.values); })
      .style("stroke", function(d) { return self.color(d.name); });

  //dots
  for(var i = 0; i < linedata.length; i++) {
    var one_line = linedata[i].values;
    var dots = svg.selectAll(".dotset" + i)
        .data(one_line);

    dots
      .transition().duration(500).delay(delay)
      .attr("data", function(d){ return d.value; })
      .attr("cx", function(d) { return self.x(d[self.options.x]); })
      .attr("cy", function(d) { return self.y(d.value); });

    dots
      .enter().append("circle")
        .attr("class", "dot dotset" + i)
        .attr("r", this.options.dotRadius)
        .style("fill", function(d) { return self.color(linedata[i].name); })
        .attr("data", function(d){ return d.value; })
        .on('mouseover', function(d, i) {self.hoverOnDot(d, i, this); })
        .on('mouseout', function(d, i) {self.hoverOffDot(d, i, this); })
        .attr("cx", function(d) { return self.x(d[self.options.x]); })
        .attr("cy", function(d) { return self.y(d.value); });
  }
}
