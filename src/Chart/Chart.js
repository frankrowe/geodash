GeoDash.Chart = function() {
  this.el = el;
  this.options = options;
  this.drawChart();
}

GeoDash.Chart.prototype.drawChart = function(){
  var self = this;
  console.log('drawing');
  this.margin = {top: 20, right: 20, bottom: 30, left: 40},
      this.width = 300 - this.margin.left - this.margin.right,
      this.height = 200 - this.margin.top - this.margin.bottom;

  this.formatPercent = d3.format(".0%");

  this.x = d3.scale.ordinal()
      .rangeRoundBands([0, this.width], 0.05);

  this.y = d3.scale.linear()
      .range([this.height, 0]);

  this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom")
      .tickFormat(function(d){
        console.log(d);
        return '';
      });

  this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient("left")
      .ticks(1)
      .tickFormat(this.formatPercent);

  this.svg = d3.select('.chart1').append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
    .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");
}

GeoDash.Chart.prototype.update = function(data){
  var self = this;
  
  var y = this.options.y;
  var x = this.options.x;
  data.forEach(function(d) {
    d[y] = +d[y];
  });

  this.x.domain(data.map(function(d) { return d[x]; }));
  this.y.domain([0, d3.max(data, function(d) { return d[y]; })]);

  this.svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + this.height + ")")
      .call(this.xAxis);

  this.svg.append("g")
      .attr("class", "y axis")
      .call(this.yAxis)
    .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text("Frequency");

  this.svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return self.x(d[x]); })
      .attr("width", self.x.rangeBand())
      .attr("y", function(d) { return self.y(d[y]); })
      .attr("height", function(d) { return self.height - self.y(d[y]); })
      .style("fill", this.options.barColor);

}