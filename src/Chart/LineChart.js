
//LineChart extends Chart

GeoDash.LineChart = ezoop.ExtendedClass(GeoDash.Chart, {
  className: 'LineChart',
  defaults: {
    x: 'x'
    , y: 'y'
    , width: 'auto'
    , height: 'auto'
    , colors: ['#d80000', '#006200']
    , interpolate: 'monotone'
    , dotRadius: 3
    , title: false
    , opacity: 0.5
    , strokeWidth: 2
    , drawX: true
    , drawY: true
    , xLabel: false
    , yLabel: false
    , xInterval: 'auto'
    , dashed: false
    , time: true
    , axisLabelPadding: 20
    , yaxisLabelPadding: 25
    , class: 'chart-html linechart vertical'
    , xFormat: d3.time.format("%Y-%m-%d")
    , outerPadding: 0
  }
  , initialize: function (el, options) {
  }
  , update: function(data) {
    var self = this
    this.data = data
    this.color = d3.scale.ordinal()
      .range(this.options.colors)
    
    this.color.domain(d3.keys(data[0]).filter(function(key) { return key !== self.options.x }))

    this.linedata = this.color.domain().map(function(name) {
      return {
        name: name,
        values: data.map(function(d) {
          var date = d[self.options.x]
          var value
          if(d[name] === null) {
            value = null
          } else {
            value = +d[name]
          }
          return {date: date, value: value}
        })
      }
    })
    
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
        var line = self.linedata[dash_options.line];
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
        self.linedata.push(dashedline);
      });
    }
    
    //remove NaNs
    for(var i = 0; i < this.linedata.length; i++) {
      var one_line = []
      for(var j = 0; j < this.linedata[i].values.length; j++){
        var value = this.linedata[i].values[j].value
        if(!isNaN(value) && value !== null) one_line.push(this.linedata[i].values[j])
      }
      this.linedata[i].values = one_line
    }

    if(this.options.time){
      this.xLine = d3.time.scale()
        .range([0, this.xrange]);
    } else {
      this.xLine = d3.scale.linear()
        .range([0, this.xrange]);
    }
    this.xLine.domain(d3.extent(this.data, function(d) { return d[self.options.x] }))
    if(self.options.xInterval == 'auto') {
      this.xLine.ticks(data.length);
    } else {
      this.xLine.ticks(self.options.xInterval);
    }

    this.x.domain(this.xLine.ticks())

    this.y.domain([
      d3.min(this.linedata, function(c) { return d3.min(c.values, function(v) { return v.value; }) }),
      d3.max(this.linedata, function(c) { return d3.max(c.values, function(v) { return v.value; }) })
    ])

    var ydomain = this.y.domain()
    this.y.domain([
      ydomain[0] - ydomain[0]*.10,
      ydomain[1] + ydomain[1]*.10
    ])

    this.updateChart()
    this.updateXAxis()
    this.updateYAxis()

  }
  , updateChart: function() {
    var self = this

    this.line = d3.svg.line()
      .interpolate(this.options.interpolate)
      .x(function(d) { return self.x(d.date) + self.x.rangeBand()/2 })
      .y(function(d) { return self.y(d.value) })

    var delay = function(d, i) { return i * 10 }

    var line_groups = this.svg.selectAll(".line_group")
      .data(this.linedata)

    var lines = this.svg.selectAll(".line")
      .data(this.linedata)

    lines.transition()
      //.duration(500).delay(delay)
      .style("stroke", function(d) { return self.color(d.name) })
      .style("stroke-dasharray", function(d){
        if(d.dashed) return "5, 5"
        else return "none"
      })
      .attr("d", function(d) { return self.line(d.values); })

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
    for(var i = 0; i < this.linedata.length; i++) {
      var one_line = this.linedata[i].values;
      var dots = this.svg.select(".line_group" + i).selectAll('.dot')
          .data(one_line);

      dots.transition().duration(500).delay(delay)
        .attr("data", function(d){ return d.value; })
        .style("fill", function(d) { return self.color(self.linedata[i].name); })
        .attr("cx", function(d) { return self.x(d.date) + self.x.rangeBand()/2 })
        .attr("cy", function(d) { return self.y(d.value); });

      dots.enter().append("circle")
        .attr("class", "dot")
        .attr("r", this.options.dotRadius)
        .style("fill", function(d) { return self.color(self.linedata[i].name); })
        .style("fill-opacity", self.options.opacity)
        .attr("data", function(d){ return d.value; })
        .on('mouseover', function(d, i) {self.mouseOver(d, i, this); })
        .on('mouseout', function(d, i) {self.mouseOut(d, i, this); })
        .attr("cx", function(d) { return self.x(d.date) + self.x.rangeBand()/2 })
        .attr("cy", function(d) { return self.y(d.value); });

      dots.exit().remove();
    }
  }
  , mouseOver: function(d, i, el){
    var self = this;

    d3.select(el).transition().attr('r', this.options.dotRadius + 3);

    var text = ''
    if(self.options.xFormat) {
      text = self.options.xFormat(d.date)
    } else {
      text = d.date
    }
    text += ': '

    if(self.options.percent) {
      text += self.formatPercent(d.value)
    } else {
      text += self.formatComma(d.value)
    }
    self.container.select('.hoverbox')
      .html(text)

    self.container.select('.hoverbox')
      .transition()
      .style('display', 'block')
  }
  , mouseOut: function(d, i, el){
    var self = this;
    // d3.select(self.el).select('.hoverbox').transition().style('display', 'none');
    d3.select(el).transition().attr('r', this.options.dotRadius);
    self.container.select('.hoverbox')
      .transition()
      .style('display', 'none')
  }
});
