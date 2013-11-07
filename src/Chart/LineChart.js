
//LineChart extends Chart

GeoDash.LineChart = ezoop.ExtendedClass(GeoDash.Chart, {
  className: 'LineChart',
  defaults: {
    x: 'x',
    y: 'y',
    width: 'auto',
    height: 'auto',
    colors: ['#d80000', '#006200'],
    interpolate: 'monotone',
    dotRadius: 3,
    title: false,
    opacity: 0.5,
    strokeWidth: 2,
    axisLabels: false,
    xInterval: 'auto',
    dashed: false,
    time: true
  },
  initialize: function (el, options) {

  },
  drawChart: function(){
    var self = this;

    this.margin = {top: 10, right: 20, bottom: 30, left: 50};
    this.width = (this.options.width === 'auto'  || this.options.width === undefined ? parseInt(d3.select(this.el).style('width')) : this.options.width) - this.margin.left - this.margin.right;
    this.height = (this.options.height === 'auto'  || this.options.height === undefined ? parseInt(d3.select(this.el).style('height')) : this.options.height) - this.margin.top - this.margin.bottom;
    if(this.options.title) {
      this.height  = this.height - 30;
    }
    this.formatComma = d3.format(",f.2");
    this.formatLarge = d3.format("s");

    if(this.options.time){
      this.x = d3.time.scale()
        .range([0, this.width]);
    } else {
      this.x = d3.scale.linear()
        .range([0, this.width]);
    }

    this.y = d3.scale.linear()
      .range([this.height, 0]);

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .tickSize(this.height*-1)
      .tickPadding(5)
      .orient("bottom");

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .tickSize(this.width*-1)
      .tickPadding(10)
      .orient("left")
      .tickFormat(function(d){
        return self.formatLarge(d);
      });

    this.color = d3.scale.ordinal()
    .range(this.options.colors);

    this.line = d3.svg.line()
      .interpolate(this.options.interpolate)
      .x(function(d) { return self.x(d.date); })
      .y(function(d) { return self.y(d.value); });

    var svg = d3.select(this.el).append("svg")
        .attr("width", this.width + this.margin.left + this.margin.right)
        .attr("height", this.height + this.margin.top + this.margin.bottom)
        .attr("class", "linechart-svg")
        .append("g")
          .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (this.height) + ")")
      .call(this.xAxis);

    svg.append("g")
      .attr("class", "y axis")
      .call(this.yAxis);

    if(self.options.axisLabels) {
      svg.select(".y.axis").append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("y", 0 - this.margin.left)
        .attr("x", 0 - this.height / 2)
        .attr("dy", "1em")
        .style("text-anchor", "middle")
        .text(self.options.yAxisLabel);
    }

    d3.select(self.el).append('div').attr('class', 'hoverbox');
  },
  hoverOnDot: function(d, i, dot){
    var self = this;
    var stat = this.formatComma(d.value);
    var x = 55 + this.x(d.date);
    var y = 25 + this.y(d.value);
    d3.select(dot).transition().attr('r', this.options.dotRadius + 3);

    var w = d3.select('.line')[0][0].getBBox().width;
    if(this.x(d.date) >= w) x -= 55;

    d3.select(self.el).select('.hoverbox').style('right', 'auto');
    d3.select(self.el).select('.hoverbox').style('left', x + 'px');
    d3.select(self.el).select('.hoverbox').style('top', y + 'px');
    d3.select(self.el).select('.hoverbox').html(stat);
    d3.select(self.el).select('.hoverbox').transition().style('display', 'inline');
  },
  hoverOffDot: function(d, i, dot){
    var self = this;
    d3.select(self.el).select('.hoverbox').transition().style('display', 'none');
    d3.select(dot).transition().attr('r', this.options.dotRadius);
  },
  setYAxisLabel: function(label) {
    var self = this;
    d3.select(self.el).select(".y.axis .axis-label").text(label);
  },
  update: function(data) {
    var self = this;

    this.color = d3.scale.ordinal()
    .range(this.options.colors);
    
    this.color.domain(d3.keys(data[0]).filter(function(key) { return key !== self.options.x; }));

    var linedata = this.color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          var date = d[self.options.x];
          var value;
          if(d[name] === null) {
            value = null;
          } else {
            value = +d[name];
          }
          return {date: date, value: value};
        })
      };
    });
    
    /*
      dashed: [{
        line: 0,
        span: [{
          start: 0,
          end: 1
        }]
      },{
        line: 1,
        span: [{
          start: 0,
          end: 2
        }]
      }]
    */
    if(this.options.dashed){
      var dashedlines = [];
      this.options.dashed.forEach(function(dash_options, idx){
        var line = linedata[dash_options.line];
        if(typeof line !== 'undefined'){
          var dashedline = {};
          dashedline.name = JSON.parse(JSON.stringify(line.name));
          dashedline.values = [];
          dashedline.dashed = true;
          dash_options.span.forEach(function(span, idx){
            for(var i = span.start; i <= span.end; i++){
              dashedline.values.push({
                date: line.values[i].date,
                value: JSON.parse(JSON.stringify(line.values[i].value))
              });
              if(i !== span.end) line.values[i].value = null;
            }
          });
          dashedlines.push(dashedline);
        }
      });
      dashedlines.forEach(function(dashedline){
        linedata.push(dashedline);
      });
    }
    
    //remove NaNs
    for(var i = 0; i < linedata.length; i++) {
      var one_line = [];
      for(var j = 0; j < linedata[i].values.length; j++){
        var value = linedata[i].values[j].value;
        if(!isNaN(value) && value !== null) one_line.push(linedata[i].values[j]);
      }
      linedata[i].values = one_line;
    }

    this.x.domain(d3.extent(data, function(d) { return d[self.options.x]; }));

    this.y.domain([
      d3.min(linedata, function(c) { return d3.min(c.values, function(v) { return v.value; }); }),
      d3.max(linedata, function(c) { return d3.max(c.values, function(v) { return v.value; }); })
    ]);

    var ydomain = this.y.domain();
    this.y.domain([
      ydomain[0] - ydomain[0]*.10,
      ydomain[1] + ydomain[1]*.10
    ]);

    var svg = d3.select(this.el + " svg g");

    if(self.options.xInterval == 'auto') {
      this.xAxis.ticks(data.length);
    } else {
      this.xAxis.ticks(self.options.xInterval);
    }

    svg.select(".y.axis").transition()
      .call(this.yAxis);

    svg.select(".x.axis").transition()
      .call(this.xAxis);

    var delay = function(d, i) { return i * 10; }

    var line_groups = svg.selectAll(".line_group")
      .data(linedata);

    var lines = svg.selectAll(".line")
      .data(linedata);

    lines.transition().duration(500).delay(delay)
      .style("stroke", function(d) { return self.color(d.name); })
      .style("stroke-dasharray", function(d){
        if(d.dashed) return "5, 5";
        else return "none";
      })
      .attr("d", function(d) { return self.line(d.values); });

    lines.enter()
      .append("g")
      .attr('class', function(d, i){
        return 'line_group line_group' + i;
      })
      .append('path')
      .attr("class", "line")
      .attr("d", function(d) { return self.line(d.values); })
      .style("stroke", function(d) { return self.color(d.name); })
      .style("stroke-width", self.options.strokeWidth)
      .style("stroke-dasharray", function(d){
        if(d.dashed) return "5, 5";
        else return "none";
      })
      .style("stroke-opacity", self.options.opacity);

    var exitdots = lines.exit().selectAll('.dot');
    lines.exit().remove();
    line_groups.exit().remove();

    //dots
    for(var i = 0; i < linedata.length; i++) {
      var one_line = linedata[i].values;
      var dots = svg.select(".line_group" + i).selectAll('.dot')
          .data(one_line);

      dots.transition().duration(500).delay(delay)
        .attr("data", function(d){ return d.value; })
        .style("fill", function(d) { return self.color(linedata[i].name); })
        .attr("cx", function(d) { return self.x(d.date); })
        .attr("cy", function(d) { return self.y(d.value); });

      dots.enter().append("circle")
        .attr("class", "dot")
        .attr("r", this.options.dotRadius)
        .style("fill", function(d) { return self.color(linedata[i].name); })
        .style("fill-opacity", self.options.opacity)
        .attr("data", function(d){ return d.value; })
        .on('mouseover', function(d, i) {self.hoverOnDot(d, i, this); })
        .on('mouseout', function(d, i) {self.hoverOffDot(d, i, this); })
        .attr("cx", function(d) { return self.x(d.date); })
        .attr("cy", function(d) { return self.y(d.value); });

      dots.exit().remove();
    }

  }
});
