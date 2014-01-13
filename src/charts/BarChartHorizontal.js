//BarChart extends Chart
GeoDash.BarChartHorizontal = ezoop.ExtendedClass(GeoDash.Chart, {
  className: 'BarChartHorizontal',
  defaults: {
    x: 'x'
    , y: 'y'
    , barColors: ['#f00']
    , opacity: 0.7
    , drawX: false
    , drawY: false
    , percent: false
    , money: false
    , title: false
    , roundRadius: 3
    , highlight: []
    , invert: false
    , barHeight: 0
    , padding: 2
    , numberTicks: 10
    , yWidth: 0
    , round: true
    , format: false
    , topPadding: 10
    , axisLabelPadding: 20
    , rightBarPadding: 10
    , outerPadding: 0.5
    , class: 'chart-html horizontal'
    , hoverTemplate: "{{y}}: {{x}}"
    , formatter: d3.format(",")
  }
  , initialize: function (el, options) {

  }
  , setXAxis: function() {
    var xrange = this.width
    if(this.options.drawY){
      xrange -= this.options.yWidth
    }
    if(this.options.yLabel) {
      xrange -= this.options.axisLabelPadding
    }
    this.xrange = xrange
    this.x = d3.scale.linear()
      .range([0, xrange- this.options.rightBarPadding]).nice()

  }
  ,setYAxis: function() {
    var yrange = this.height
    if(this.options.drawX) {
      yrange -= this.options.axisLabelPadding
    }
    if(this.options.xLabel){
      yrange -= this.options.axisLabelPadding
    }
    this.yrange = yrange
    this.y = d3.scale.ordinal()
      .rangeRoundBands([yrange, 0], 0.05, this.options.outerPadding)
  }
  , update: function (data) {
    var self = this

    if(this.options.barHeight !== 0) {
      var height = this.options.barHeight * data.length
        + this.options.padding * data.length
        + this.options.topPadding * 2
        if(this.options.drawX) {
          height += this.options.axisLabelPadding
        }
        if(this.options.xLabel) {
          height += this.options.axisLabelPadding
        }
      this.container.select('.bars')
        .style('height', height + 'px')
      this.setHeight()
      this.setYAxis()
    }

    var y = this.options.y
    var x = this.options.x

    for(var i = 0; i < data.length; i++){
      var d = data[i]
      if(d[x] != null){
        if(typeof d[x] === 'string') {
          d[x] = +d[x].replace(",", "")
        }
      }
    }
    this.data = data

    this.color = d3.scale.ordinal()
      .range(this.options.barColors)

    var extent = d3.extent(data, function(d) { return d[x] })
    if(extent[0] < 0){
      this.x.domain(extent)
    } else {
      this.x.domain([0, extent[1]])
    }
    
    this.y.domain(data.map(function(d) { return d[y] }))

    this.updateChart()
    this.updateXAxis()
    this.updateYAxis()
  }
  , updateChart: function() {
    var self = this
      , y = this.options.y
      , x = this.options.x
    
    var bars = this.container.select(".bars")
        .selectAll(".bar")
        .data(this.data)

    bars.transition()
      .attr("geodash-id", function (d) { return d[y] })
      .style("left", function(d) {
        var xposition = self.x(Math.min(0, d[x]))
        if(xposition === self.x(0)) {
          xposition += 1
        }
        return xposition + 'px'
      })
      .style("top", function(d, i) {
        var top = 0
        if(self.options.barHeight !== 0){
          top = self.options.barHeight * i
            + self.options.padding * i
            + self.options.topPadding
        } else {
          top = self.y(d[y])
        }
        return top + 'px'
      })
      .style("width", function(d) {
        var w = Math.abs(self.x(d[x]) - self.x(0))
        return w + 'px'
      })
      .style("height", function(d){
        if(self.options.barHeight !== 0){
          return self.options.barHeight + "px"
        } else {
          return self.y.rangeBand() + "px"
        }
      })
      .style("opacity", function(d){
        for(var i = 0; i < self.options.highlight.length; i++){
          if(self.options.highlight[i] == d[y]) return 1
        }
        return self.options.opacity
      })
      .style("border-top-right-radius", function(d){
        var r = 0
        var xposition = self.x(Math.min(0, d[x]))
        if(xposition >= self.x(0)) {
          r = self.options.roundRadius
        }
        return r + 'px'
      })
      .style("border-bottom-right-radius", function(d){
        var r = 0
          , xposition = self.x(Math.min(0, d[x]))
        if(xposition >= self.x(0)) {
          r = self.options.roundRadius
        }
        return r + 'px'
      })
      .style("border-top-left-radius", function(d){
        var r = 0
          , xposition = self.x(Math.min(0, d[x]))
        if(xposition < self.x(0)) {
          r = self.options.roundRadius
        }
        return r + 'px'
      })
      .style("border-bottom-left-radius", function(d){
        var r = 0
          , xposition = self.x(Math.min(0, d[x]))
        if(xposition < self.x(0)) {
          r = self.options.roundRadius
        }
        return r + 'px'
      })
      .style("background-color", function(d) { return self.color(d[y]) }, 'important')

    var barsenter = bars.enter().append("div")
      .attr("class", "bar")
      .attr("geodash-id", function (d) { return d[y] })
      .style("left", function(d) {
        var xposition = self.x(Math.min(0, d[x]))
        if(xposition === self.x(0)) {
          xposition += 1
        }
        return xposition + 'px'
      })
      .style("top", function(d, i) {
        var top = 0
        if(self.options.barHeight !== 0){
          top = self.options.barHeight * i
            + self.options.padding * i
            + self.options.topPadding
        } else {
          top = self.y(d[y])
        }
        return top + 'px'
      })
      .style("width", function(d) {
        var w = Math.abs(self.x(d[x]) - self.x(0))
        return w + 'px'
      })
      .style("height", function(d){
        if(self.options.barHeight !== 0){
          return self.options.barHeight + "px"
        } else {
          return self.y.rangeBand() + "px"
        }
      })
      .style("opacity", function(d){
        for(var i = 0; i < self.options.highlight.length; i++){
          if(self.options.highlight[i] == d[y]) return 1
        }
        return self.options.opacity
      })
      .style("border-top-right-radius", function(d){
        var r = 0
          , xposition = self.x(Math.min(0, d[x]))
        if(xposition >= self.x(0)) {
          r = self.options.roundRadius
        }
        return r + 'px'
      })
      .style("border-bottom-right-radius", function(d){
        var r = 0
          , xposition = self.x(Math.min(0, d[x]))
        if(xposition >= self.x(0)) {
          r = self.options.roundRadius
        }
        return r + 'px'
      })
      .style("border-top-left-radius", function(d){
        var r = 0
          , xposition = self.x(Math.min(0, d[x]))
        if(xposition < self.x(0)) {
          r = self.options.roundRadius
        }
        return r + 'px'
      })
      .style("border-bottom-left-radius", function(d){
        var r = 0
          , xposition = self.x(Math.min(0, d[x]))
        if(xposition < self.x(0)) {
          r = self.options.roundRadius
        }
        return r + 'px'
      })
      .style("-webkit-print-color-adjust", "exact")
      .style("background-color", function(d) { return self.color(d[y]) }, 'important')

    bars.exit().remove()

    barsenter
      .on('mouseover', function (d, i) {
        self.mouseOver(d, i)
      })
      .on('mouseout', function (d, i) {
        self.mouseOut(d, i)
      })
  }
  , updateXAxis: function() {
    var self = this
      , y = this.options.y
      , x = this.options.x

    if(this.options.drawX){
      var chartHeight = this.container.select('.bars').style('height')
      var ticks = this.x.ticks(self.options.numberTicks)
      var tickElements = this.xAxisElement
        .selectAll(".tick")
        .data(ticks)

      var ticks = tickElements.transition()
        .style("left", function(d) {
          var left = self.x(d)
          return left + 'px'
        })
        .style("height", function(){
          if(self.options.xLabel) {
            return self.height - self.options.axisLabelPadding + "px"
          } else {
            return self.height + "px"
          }
        })

      ticks.select('.gd-label')
        .text(function(d){
          var label = self.formatLarge(d)
          if (self.options.money) {
            label = '$' + label
          }
          if (self.options.percent) {
            label = label + '%'
          }
          return label
        })

      var newTicks = tickElements.enter().append('div')
        .attr("class", "tick")
        .style("left", function(d) {
          var left = self.x(d)
          return left + 'px'
        })
        .style("bottom", function(){
          if(self.options.yLabel) {
            return self.options.axisLabelPadding + 'px'
          }
        })
        .style("height", function(){
          if(self.options.xLabel) {
            return self.height - self.options.axisLabelPadding + "px"
          } else {
            return self.height + "px"
          }
        })

      tickElements.exit().remove()

      newTicks
        .append('div')
        .attr("class", "line")
        .style("height", "100%")

      newTicks
        .append('div')
        .attr("class", "gd-label")
        .text(function(d){
          var label = self.formatLarge(d)
          if (self.options.money) {
            label = '$' + label
          }
          if (self.options.percent) {
            label = label + '%'
          }
          return label
        })
        .style("bottom", "0px")
        .style("background", function(){
          var c = d3.select(self.el).style("background-color")
          return c
        })
        .style("margin-left", function(d){
          var width = d3.select(this).style('width')
          var m = (parseInt(width)/2*-1)
          return m + 'px'
        })
        .style("height", self.options.axisLabelPadding + 'px')
        .style("line-height", self.options.axisLabelPadding + 'px')
    }
  }
  , updateYAxis: function() {
    var self = this
      , y = this.options.y
      , x = this.options.x

    if (this.options.drawY) {
      var w = parseInt(d3.select(self.el).select('.bars').style("width"))
      if(!isNaN(w)) {
        barWidth = w
      }
      var labels = this.y.domain()

      var tickElements = this.yAxisElement
        .selectAll(".tick")
        .data(labels)

      var ticks = tickElements.transition()
        .style("top", function(d, i) {
          var top = 0
          if(self.options.barHeight !== 0){
            top = self.options.barHeight * i
              + self.options.padding * i
              + self.options.topPadding
          } else {
            top = self.y(d)
          }
          return top + 'px'
        })
        .style("right", function(d){
          return '0px'
        })
        .style("padding-right", function(d, i){
          var value = self.data[i][x]
            , left = self.x(Math.min(0, value))
            , p = (barWidth - left) + 2
          return p + "px"
        })
        .style("height", function(d){
          if(self.options.barHeight !== 0) {
            return self.options.barHeight + "px"
          } else {
            return self.y.rangeBand() + "px"
          }
        })
        .style("line-height", function(d){
          if(self.options.barHeight !== 0) {
            return self.options.barHeight + "px"
          } else {
            return self.y.rangeBand() + "px"
          }
        })
        .select('.gd-label')
          .text(function(d){
            return d
          })


      var newTicks = tickElements.enter().append('div')
        .attr("class", "tick")
        .style("top", function(d, i) {
          var top = 0
          if(self.options.barHeight !== 0){
            top = self.options.barHeight * i
              + self.options.padding * i
              + self.options.topPadding
          } else {
            top = self.y(d)
          }
          return top + 'px'
        })
        .style("right", function(d){
          return '0px'
        })
        .style("padding-right", function(d, i){
          var value = self.data[i][x]
            , left = self.x(Math.min(0, value))
            , p = (barWidth - left) + 2
          return p + "px"
        })
        .style("height", function(d){
          if(self.options.barHeight !== 0) {
            return self.options.barHeight + "px"
          } else {
            return self.y.rangeBand() + "px"
          }
        })
        .style("line-height", function(d){
          if(self.options.barHeight !== 0) {
            return self.options.barHeight + "px"
          } else {
            return self.y.rangeBand() + "px"
          }
        })
        .on('mouseover', function (d, i) {
          self.mouseOver(d, i, this)
        })
        .on('mouseout', function (d, i) {
          self.mouseOut(d, i, this)
        })
        .append('div')
          .attr("class", "gd-label")
          .text(function(d){
            return d
          })

      tickElements.exit().remove()
    }
  }
  , mouseOver: function(d, i, el) {
    var self = this
      , y
      , x
      , output = ''

    var x = self.data[i][self.options.x]
    var y = self.data[i][self.options.y]
    if(x !== null) {
      x = self.options.formatter(x)
      var view = {
        y: y
        , x: x
      }
      output = Mustache.render(self.options.hoverTemplate, view)
    } else {
      output = 'NA'
    }

    var bar = d3.select(self.container.selectAll('.bar')[0][i])
    bar.style('opacity', 0.9)

    self.container.select('.hoverbox')
      .html(output)

    self.container.select('.hoverbox')
      .transition()
      .style('display', 'block')
  }
  , mouseOut: function(d, i, el) {
    var self = this
    var opacity = self.options.opacity
    for(var j = 0; j < self.options.highlight.length; j++) {
      if(self.options.highlight[j] == d) opacity =  1
    }
  
    var bar = d3.select(self.container.selectAll('.bar')[0][i])
    bar.style('opacity', opacity)
    self.container.select('.hoverbox')
      .transition()
      .style('display', 'none')
  }
  , setColor: function(colors) {
    this.options.barColors = colors
  }
})
