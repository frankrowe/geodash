//PieChart extends Chart

GeoDash.PieChart = function(el, options) {
  this.defaults = {
    label: 'label',
    value: 'value',
    colors: ["#f00", "#0f0", "#00f"],
    innerRadius: 10
  };
  GeoDash.Chart.call(this, el, options);
}

GeoDash.PieChart.prototype = new GeoDash.Chart();

GeoDash.PieChart.prototype.constructor = GeoDash.PieChart;

GeoDash.PieChart.prototype.drawChart = function(){
  var self = this;
  this.width = (this.options.width === 'auto' || this.options.width === undefined ? $(this.el).width() : this.options.width),
  this.height = (this.options.height === 'auto' || this.options.width === undefined ? $(this.el).height() : this.options.height),
  this.radius = Math.min(this.width, this.height) / 2;

  this.color = d3.scale.ordinal()
      .range(this.options.colors);

  this.arc = d3.svg.arc()
      .outerRadius(this.radius)
      .innerRadius(this.options.innerRadius);

  this.pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d[self.options.value]; });

  this.svg = d3.select(this.el).append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
    .append("g")
      .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
}

GeoDash.PieChart.prototype.update = function(data){
  var self = this;
  data.forEach(function(d) {
    d[self.options.value] = +d[self.options.value];
  });

  var g = this.svg.selectAll(".arc")
      .data(this.pie(data))
    .enter().append("g")
      .attr("class", "arc");

  g.append("path")
    .attr("d", this.arc)
    .style("fill", function(d) { return self.color(d.data[self.options.label]); })
    .on('mouseover', function(d,i){
      $(self.el).parent().find('.hover-box').html(d.value + '%');
    })
    .on('mouseout', function(d,i){
      $(self.el).parent().find('.hover-box').html('');
    });
}