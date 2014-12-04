
//LineChart extends Chart

GeoDash.LineChart = GeoDash.Chart.extend({
  options: {
    gdClass: 'chart-html linechart vertical'
    , colors: ['#d80000', '#006200']
    , interpolate: 'monotone'
    , dotRadius: 3
    , strokeWidth: 2
    , xInterval: false
    , xTimeInterval: false
    , dashed: false
    , time: true
    , xTickFormat: d3.time.format("%Y-%m-%d")
    , yTickFormat: d3.format(".2s")
    , outerPadding: 0
    , linePadding: 20
    , showArea: false
    , accumulate: false
  }
  , makeSVG: function() {
    var self = this
    this.svg = this.container.select('.bars')
      .append('svg')
      .attr("height", function(){
        return self.yrange + "px"
      })
      .attr("width", function(){
        return self.xrange + 'px'
      })
  }
  , update: function(data) {
    var self = this
      , y = this.options.y
      , x = this.options.x

    this.data = data

    var colordomain = []
    for(var i = 0; i < data.length; i++){
      if(typeof y == 'object') {
        this.stackNumber = y.length
        colordomain = y
      } else {
        this.stackNumber = 1
        colordomain = [y]
      }
    }

    this.color = d3.scale.ordinal()
      .range(this.options.colors)
      .domain(colordomain)

    this.linedata = []
    this.color.domain().map(function(name) {
      var values = []
      data.map(function(d) {
        var x = d[self.options.x]
          , y
        if(d[name] === null) {
          y = null
        } else {
          y = +d[name]
        }
        values.push({x: x, y: y})
      })
      var l = {
        name: name,
        values: values
      }
      self.linedata.push(l)
    })

    if (this.options.accumulate) {
      this.linedata.forEach(function(line) {
        var sums = []
        line.values.forEach(function(value, idx) {
          if (idx > 0) {
            line.values[idx].y += line.values[idx-1].y
          }
        })
      })
    }

    /*
      dashed: [{
        line: 0,
        span: {
          start: 0,
          howMany: 1
        }
      },{
        line: 1,
        span: {
          start: 0,
          howMany: 2
        }
      }]
    */
    if(this.options.dashed){
      this.options.dashed.forEach(function(dash_options, idx){
        var line = self.linedata[dash_options.line]
        if(typeof line !== 'undefined') {
          var linelength = line.values.length - 1
          var dashedline = {}
          dashedline.name = JSON.parse(JSON.stringify(line.name))
          dashedline.values = []
          dashedline.dashed = true
          var span = dash_options.span
          var end = span.start + span.howMany
          if(end > linelength) {
            end = linelength
          }
          for(var i = span.start; i <= end; i++) {
            dashedline.values.push({
              x: line.values[i].x,
              y: line.values[i].y
            })
          }
          if(span.start > 0) {
            var newline = {}
            newline.name = JSON.parse(JSON.stringify(line.name))
            newline.values = line.values.slice(0, span.start + 1)
            self.linedata.push(newline)
          }
          line.values = line.values.slice(span.start + span.howMany)
          self.linedata.push(dashedline)
        }
      })
    }
    
    //remove NaNs
    for(var i = 0; i < this.linedata.length; i++) {
      var one_line = []
      for(var j = 0; j < this.linedata[i].values.length; j++){
        var value = this.linedata[i].values[j].y
        if(!isNaN(value) && value !== null) one_line.push(this.linedata[i].values[j])
      }
      this.linedata[i].values = one_line
    }

    if(this.options.time){
      this.xLine = d3.time.scale()
        .range([0, this.xrange])
    } else {
      this.xLine = d3.scale.linear()
        .range([0, this.xrange])
    }
    this.xLine.domain(d3.extent(this.data, function(d) { return d[self.options.x] }))
    var xTicks = []
    if(this.options.xInterval) {
      xTicks = this.xLine.ticks(self.options.xInterval)
    } else {
      xTicks = this.xLine.ticks(data.length)
    }
    if(self.options.xTimeInterval) {
      xTicks = this.xLine.ticks(
        self.options.xTimeInterval.timePeriod
        , self.options.xTimeInterval.interval
      )
    }
    this.x.domain(xTicks)

    if(!this.options.xInterval && !this.options.xTimeInterval) {
      this.xLine.range([this.x.rangeBand()/2, this.xrange - this.x.rangeBand()/2])
    } else {
      this.xLine.range([this.options.linePadding, this.xrange - this.options.linePadding])
    }

    this.y.domain([
      d3.min(this.linedata, function(c) { return d3.min(c.values, function(v) { return v.y; }) }),
      d3.max(this.linedata, function(c) { return d3.max(c.values, function(v) { return v.y; }) })
    ])

    var ydomain = this.y.domain()

    var range = ydomain[1] - ydomain[0]
    var ypadding = range * .10
    var min = ydomain[0] - ypadding
    var max = ydomain[1] + ypadding
    this.y.domain([min, max])

    this.updateXAxis()
    this.updateYAxis()
    this.updateChart()
    this.updateLegend()
  }
  , updateChart: function() {
    var self = this

    this.color = d3.scale.ordinal()
      .range(this.options.colors)

    this.line = d3.svg.line()
      .interpolate(this.options.interpolate)
      .x(function(d) { 
        return self.xLine(d.x) 
      })
      .y(function(d) { return self.y(d.y) })

    this.area = d3.svg.area()
      .x(function(d) { 
        return self.xLine(d.x) 
      })
      .y0(this.yrange)
      .y1(function(d) { 
        return self.y(d.y) 
      })
      .interpolate(this.options.interpolate)

    var delay = function(d, i) { return i * 10 }

    if(this.options.showArea) {
      var areas = this.svg.selectAll(".area")
        .data(this.linedata)

      areas
        .enter()
        .append("path")
        .attr("class", "area")
        .attr('opacity', 0.1)
        .attr('fill', function(d) { return self.color(d.name) })
        .attr("d", function(d) { return self.area(d.values) })

      areas
        .transition()
        .duration(this.options.transitionDuration)
        .attr('fill', function(d) { return self.color(d.name) })
        .attr("d", function(d) { return self.area(d.values) })

      areas.exit().remove()
    }

    var line_groups = this.svg.selectAll(".line_group")
      .data(this.linedata)

    var lines = this.svg.selectAll(".chart-line")
      .data(this.linedata)

    lines
      .transition()
      .duration(this.options.transitionDuration)
      .attr("stroke", function(d) { return self.color(d.name) })
      .attr("d", function(d) { return self.line(d.values) })
      .attr("stroke-dasharray", function(d){
        if(d.dashed) return "4 3"
      })

    lines
      .enter()
      .append("g")
      .attr('class', function(d, i){
        return 'line_group line_group' + i
      })
      .append('path')
      .attr("class", "chart-line")
      .attr("d", function(d) { return self.line(d.values) })
      .attr("fill", "none")
      .attr("stroke", function(d) { return self.color(d.name) })
      .attr("stroke-width", self.options.strokeWidth)
      .attr("stroke-dasharray", function(d){
        if(d.dashed) return "4 3"
      })
      .attr("stroke-opacity", self.options.opacity)

    lines.exit().remove()
    line_groups.exit().remove()

    //dots
    for(var i = 0; i < this.linedata.length; i++) {
      var label = this.linedata[i].name
      var one_line = this.linedata[i].values;
      var dots = this.svg.select(".line_group" + i).selectAll('.dot')
          .data(one_line)

      dots
        .transition()
        .duration(this.options.transitionDuration)
        .attr("data", function(d){ return d.y; })
        .attr("fill", function(d) { return self.color(self.linedata[i].name); })
        .attr("cx", function(d) { return self.xLine(d.x)})
        .attr("cy", function(d) { return self.y(d.y); })

      dots.enter().append("circle")
        .attr("class", "dot")
        .attr("r", this.options.dotRadius)
        .attr("fill", function(d) { 
          return self.color(self.linedata[i].name); })
        .attr("fill-opacity", self.options.opacity)
        .attr("data", function(d){ return d.y; })
        .attr("label", function(d){ return label })
        .attr("cx", function(d) { return self.xLine(d.x) })
        .attr("cy", function(d) { return self.y(d.y); })

      dots.exit().remove()

      var dot_targets = this.svg.select(".line_group" + i).selectAll('.dot-target')
          .data(one_line)

      dot_targets
        .transition()
        .duration(this.options.transitionDuration)
        .attr("data", function(d){ return d.y; })
        .attr("cx", function(d) { return self.xLine(d.x)})
        .attr("cy", function(d) { return self.y(d.y); })

      dot_targets.enter().append("circle")
        .attr("class", "dot-target")
        .attr("r", 6)
        .attr("fill", '#333')
        .attr("fill-opacity", .2)
        .attr("data", function(d){ return d.y; })
        .attr("label", function(d){ return label })
        .on('mouseover', function(d, i) {self.mouseOver(d, i, this); })
        .on('mouseout', function(d, i) {self.mouseOut(d, i, this); })
        .attr("cx", function(d) { return self.xLine(d.x) })
        .attr("cy", function(d) { return self.y(d.y); })

      dot_targets.exit().remove()
    }
  }
  , updateXAxis: function() {
    var self = this
    if (this.options.drawX) {
      if(this.options.xInterval || this.options.xTimeInterval) {
        this.x.rangeRoundBands([this.options.linePadding, this.xrange - this.options.linePadding], 0.05, this.options.outerPadding)
      }  else {
        //this.x.rangeRoundBands([this.options.linePadding, this.xrange - this.options.linePadding], 0.05, this.options.outerPadding)
      }
      var labels = this.x.domain()
      var tickElements = this.xAxisElement
        .selectAll(".tick")
        .data(labels)

      var ticks = tickElements
        .transition()
        .duration(this.options.transitionDuration)
        .style("left", function (d) { return self.xLine(d) + 'px' })
        .style("bottom", function (d) {
          var b = self.height - self.yrange - self.options.axisLabelPadding
          return b + 'px'
        })

      ticks.select('.gd-label')
        .text(function(d){
          if(self.options.xTickFormat) {
            return self.options.xTickFormat(d)
          } else {
            return d
          }
        })
        .style("margin", function(d, i){
          var w = parseInt(d3.select(this).style('width'))
          var m = (w / 2) * -1
          return '0 0 0 ' + m + 'px'
        })

      var newTicks = tickElements.enter().append('div')
        .attr("class", "tick")
        .style("left", function (d) { return self.xLine(d) + 'px' })
        .style("bottom", function (d) {
          var b = self.height - self.yrange - self.options.axisLabelPadding
          return b + 'px'
        })
        .style("height", self.options.axisLabelPadding + 'px')

      tickElements.exit().remove()

      newTicks.append('div')
        .attr("class", "line")

      newTicks.append('div')
        .attr("class", "gd-label")
        .text(function(d){
          if(self.options.xTickFormat) {
            return self.options.xTickFormat(d)
          } else {
            return d
          }
        })
        .style("margin", function(d, i){
          var w = parseInt(d3.select(this).style('width'))
          var m = (w / 2) * -1
          return '0 0 0 ' + m + 'px'
        })
        // .on('mouseover', function (d, i) {
        //   if(!GeoDash.Browser.touch) {
        //     self.mouseOver(d, i, this)
        //   }
        // })
        // .on('mouseout', function (d, i) {
        //   if(!GeoDash.Browser.touch) {
        //     self.mouseOut(d, i, this)
        //   }
        // })
    }
  }
  , mouseOver: function(d, i, el){
    var self = this
      , output = ''

    if(d3.select(el).attr('class') === 'gd-label') {
      var x = d
      console.log(x, self.data[i])
      if(self.stackNumber > 1) {
        var y
        for (var j = 0; j < self.stackNumber; j++) {
          y = self.data[i][self.options.y[j]]
          output += makeLabel(x, y, self.options.y[j])
          output += '<br>'
        }
      } else {
        var y = self.data[i][self.options.y[0]]
        output = makeLabel(x, y)
      }
    } else {
      var y = d.y
      , x = d.x
      output = makeLabel(x, y)
    }

    function makeLabel(x, y, yLabel) {
      var label = ''

      if(self.options.labelFormat) {
        x = self.options.labelFormat(x)
      }

      if(y !== null) {
        y = self.options.valueFormat(y)
        if(yLabel) {
          y = yLabel + ': ' + y
        }
        var view = {
          y: y
          , x: x
        }
        label = Mustache.render(self.options.hoverTemplate, view)
      } else {
        label = 'NA'
      }
      return label
    }

    var el = d3.select(el)
    var selector = '.dot'
     + '[cx="' + el.attr('cx') + '"]'
     + '[cy="' + el.attr('cy') + '"]'
     + '[label="' + el.attr('label') + '"]'
     + '[data="' + el.attr('data') + '"]'
    var dot = self.container.select(selector)
    console.log(dot)
    dot.attr('r', this.options.dotRadius + 3)
    dot.style("fill-opacity", 0.9)

    if(self.options.hover) {
      self.container.select('.hoverbox')
        .html(output)

      self.container.select('.hoverbox')
        .style('display', 'block')
    }
  }
  , mouseOut: function(d, i, el){
    var self = this;
    var el = d3.select(el)
    var selector = '.dot'
     + '[cx="' + el.attr('cx') + '"]'
     + '[cy="' + el.attr('cy') + '"]'
     + '[label="' + el.attr('label') + '"]'
     + '[data="' + el.attr('data') + '"]'
    var dot = self.container.select(selector)
    
    // d3.select(el)
    dot
      .attr('r', this.options.dotRadius)
      .style("fill-opacity", self.options.opacity)
    self.container.select('.hoverbox')
      .style('display', 'none')
  }
});
