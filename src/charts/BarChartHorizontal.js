//BarChart extends Chart
GeoDash.BarChartHorizontal = ezoop.ExtendedClass(GeoDash.Chart, {
  className: 'BarChartHorizontal',
  defaults: {
    x: 'x'
    , y: 'y'
    , barColors: ['#f00']
    , opacity: 0.7
    , drawX: true
    , drawY: true
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
    , legendWidth: 80
    , legendPosition: 'middle'
    , legend: false
    , rightBarPadding: 10
    , outerPadding: 0.5
    , class: 'chart-html horizontal'
    , hoverTemplate: "{{y}}: {{x}}"
    , formatter: d3.format(",")
    , xFormat: false
    , margin: {
      top: 10
      , right: 10
      , bottom: 10
      , left: 10
    }
  }
  , initialize: function (el, options) {

  }
  , setXAxis: function() {
    var xrange = this.width
      , marginleft = 0
    if(this.options.legend) {
      xrange -= this.options.legendWidth
    }
    if(this.options.drawY){
      xrange -= this.options.yWidth
      marginleft += this.options.yWidth
    }
    if(this.options.yLabel) {
      xrange -= this.options.axisLabelPadding
      marginleft += this.options.axisLabelPadding
    }
    this.xrange = xrange
    this.marginleft = marginleft
    this.x = d3.scale.linear()
      .range([0, xrange- this.options.rightBarPadding]).nice()

  }
  , setYAxis: function() {
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
    this.data = data

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

    function makeValue(d, x, y) {
      if(d[x] != null){
        if(typeof d[x] === 'string') {
          d[x] = +d[x].replace(",", "")
        }
      }
      var obj = {
        x: d[x],
        y: d[y]
      }
      return obj
    }

    var tmpdata = []
      , y = this.options.y
      , x = this.options.x
      , colordomain = []

    data.reverse()
    for(var i = 0; i < data.length; i++){
      var d = data[i]
        , total = 0
      if(typeof x == 'object') {
        this.stackNumber = x.length
        colordomain = x
        x.forEach(function(_x){
          var obj = makeValue(d, _x, y)
          tmpdata.push(obj)
          total += obj.x
        })
      } else {
        this.stackNumber = 1
        colordomain = [x]
        var obj = makeValue(d, x, y)
        tmpdata.push(obj)
        total += obj.x
      }
      tmpdata[i].total = total
    }
    this._data = tmpdata

    this.color = d3.scale.ordinal()
      .range(this.options.barColors)
      .domain(colordomain)

    var extent = d3.extent(this._data, function(d) { return d.total })
    if(extent[0] < 0){
      this.x.domain(extent)
    } else {
      this.x.domain([0, extent[1]])
    }

    this.y.domain(this._data.map(function(d) { return d.y }))

    this.updateChart()
    this.updateXAxis()
    this.updateYAxis()
    this.updateLegend()
  }
  , updateChart: function() {
    var self = this
      , y = this.options.y
      , x = this.options.x
    
    var bars = this.container.select(".bars")
        .selectAll(".bar")
        .data(this._data)

    bars.transition()
      .attr("geodash-id", function (d) { return d.y })
      .style("left", function(d, i) {
        var left = self.x(Math.min(0, d.x))
        var stackPosition = i % self.stackNumber
        while(stackPosition > 0){
          var x = self._data[i - stackPosition].x
          left +=self.x(x)
          stackPosition--
        }
        left += 1
        return left + 'px'
      })
      .style("top", function(d, i) {
        var top = 0
        if(self.options.barHeight !== 0){
          top = self.options.barHeight * i
            + self.options.padding * i
            + self.options.topPadding
        } else {
          top = self.y(d.y)
        }
        return top + 'px'
      })
      .style("width", function(d) {
        var w = Math.abs(self.x(d.x) - self.x(0))
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
          if(self.options.highlight[i] == d.y) return 1
        }
        return self.options.opacity
      })
      .style("border-top-right-radius", function(d, i){
        var notend = (i+1) % self.stackNumber
        if(notend) {
          return 0
        } else {
          var r = 0
            , xposition = self.x(Math.min(0, d.x))
          if(xposition >= self.x(0)) {
            r = self.options.roundRadius
          }
          return r + 'px'
        }
      })
      .style("border-bottom-right-radius", function(d, i){
        var notend = (i+1) % self.stackNumber
        if(notend) {
          return 0
        } else {
          var r = 0
            , xposition = self.x(Math.min(0, d.x))
          if(xposition >= self.x(0)) {
            r = self.options.roundRadius
          }
          return r + 'px'
        }
      })
      .style("border-top-left-radius", function(d, i){
        var notend = (i+1) % self.stackNumber
        if(notend) {
          return 0
        } else {
          var r = 0
            , xposition = self.x(Math.min(0, d.x))
          if(xposition < self.x(0)) {
            r = self.options.roundRadius
          }
          return r + 'px'
        }
      })
      .style("border-bottom-left-radius", function(d, i){
        var notend = (i+1) % self.stackNumber
        if(notend) {
          return 0
        } else {
          var r = 0
            , xposition = self.x(Math.min(0, d.x))
          if(xposition < self.x(0)) {
            r = self.options.roundRadius
          }
          return r + 'px'
        }
      })
      .style("background-color", function(d, i) {
        return self.options.barColors[i%self.stackNumber]
      }, 'important')

    var barsenter = bars.enter().append("div")
      .attr("class", "bar")
      .attr("geodash-id", function (d) { return d.y })
      .style("left", function(d, i) {
        var left = self.x(Math.min(0, d.x))
        var stackPosition = i % self.stackNumber
        while(stackPosition > 0){
          var x = self._data[i - stackPosition].x
          left += parseInt(self.x(x))
          stackPosition--
        }
        left += 1
        left = parseInt(left)
        return left + 'px'
      })
      .style("top", function(d, i) {
        var top = 0
        if(self.options.barHeight !== 0){
          top = self.options.barHeight * i
            + self.options.padding * i
            + self.options.topPadding
        } else {
          top = self.y(d.y)
        }
        return top + 'px'
      })
      .style("width", function(d) {
        var w = Math.abs(self.x(d.x) - self.x(0))
        w = parseInt(w)
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
          if(self.options.highlight[i] == d.y) return 1
        }
        return self.options.opacity
      })
      .style("border-top-right-radius", function(d, i){
        var notend = (i+1) % self.stackNumber
        if(notend) {
          return 0
        } else {
          var r = 0
            , xposition = self.x(Math.min(0, d.x))
          if(xposition >= self.x(0)) {
            r = self.options.roundRadius
          }
          return r + 'px'
        }
      })
      .style("border-bottom-right-radius", function(d, i){
        var notend = (i+1) % self.stackNumber
        if(notend) {
          return 0
        } else {
          var r = 0
            , xposition = self.x(Math.min(0, d.x))
          if(xposition >= self.x(0)) {
            r = self.options.roundRadius
          }
          return r + 'px'
        }
      })
      .style("border-top-left-radius", function(d, i){
        var notend = (i+1) % self.stackNumber
        if(notend) {
          return 0
        } else {
          var r = 0
            , xposition = self.x(Math.min(0, d.x))
          if(xposition < self.x(0)) {
            r = self.options.roundRadius
          }
          return r + 'px'
        }
      })
      .style("border-bottom-left-radius", function(d, i){
        var notend = (i+1) % self.stackNumber
        if(notend) {
          return 0
        } else {
          var r = 0
            , xposition = self.x(Math.min(0, d.x))
          if(xposition < self.x(0)) {
            r = self.options.roundRadius
          }
          return r + 'px'
        }
      })
      .style("-webkit-print-color-adjust", "exact")
      .style("background-color", function(d, i) {
        return self.options.barColors[i%self.stackNumber]
      }, 'important')

    bars.exit().remove()

    barsenter
      .on('mouseover', function (d, i) {
        if(!GeoDash.Browser.touch) {
          self.mouseOver(d, i, this)
        }
      })
      .on('mouseout', function (d, i) {
        if(!GeoDash.Browser.touch) {
          self.mouseOut(d, i, this)
        }
      })
      .on('click', function (d, i) {
        if(self.activeBar === i) {
          self.activeBar = -1
          self.mouseOut(d, i, this)
        } else {
          self.activeBar = i
          self.mouseOver(d, i, this)
        }
      })
  }
  , updateXAxis: function() {
    var self = this
      // , y = this.options.y
      // , x = this.options.x
      , y = 'y'
      , x = 'x'

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
          if(self.options.xFormat) {
            return self.options.xFormat(d)
          } else {
            var label = self.formatLarge(d)
            if (self.options.money) {
              label = '$' + label
            }
            if (self.options.percent) {
              label = label + '%'
            }
            return label
          }
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
          if(self.options.xFormat) {
            return self.options.xFormat(d)
          } else {
            var label = self.formatLarge(d)
            if (self.options.money) {
              label = '$' + label
            }
            if (self.options.percent) {
              label = label + '%'
            }
            return label
          }
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
      , y = 'y'
      , x = 'x'

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
          var value = self._data[i][x]
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
          .style("height", function(d){
            if(self.options.barHeight !== 0) {
              return self.options.barHeight + "px"
            } else {
              return self.y.rangeBand() + "px"
            }
          })
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
          var value = self._data[i][x]
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
        .append('div')
          .attr("class", "gd-label")
          .style("height", function(d){
            if(self.options.barHeight !== 0) {
              return self.options.barHeight + "px"
            } else {
              return self.y.rangeBand() + "px"
            }
          })
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

    var x = self._data[i].x
    var y = self._data[i].y
    if(typeof self.options.x == 'object') {
      y += ' ' + self.options.x[i % self.stackNumber]
    }
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
    self.container.selectAll('.bar')
      .style('opacity', function(d, i) {
        if(i !== self.activeBar) return self.options.opacity
        else return 1
      })
    d3.select(el).style('opacity', 1)

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
    d3.select(el).style('opacity', opacity)
    self.container.select('.hoverbox')
    .transition()
    .style('display', 'none')
    if(self.activeBar >= 0){
      var activeEl = self.container.selectAll('.bar')[0][self.activeBar]
      self.mouseOver(d, self.activeBar, activeEl)
    }
  }
  , setColor: function(colors) {
    this.options.barColors = colors
  }
})
