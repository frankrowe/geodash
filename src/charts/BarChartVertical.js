//BarChart extends Chart
GeoDash.BarChartVertical = ezoop.ExtendedClass(GeoDash.Chart, {
  className: 'BarChartVertical'
  , defaults: {
    x: 'x'
    , y: 'y'
    , barColors: ['#f00']
    , opacity: 0.7
    , drawX: true
    , drawY: true
    , xLabel: false
    , yLabel: false
    , percent: false
    , title: false
    , roundRadius: 3
    , highlight: false
    , verticalX: false
    , invert: false
    , roundRadius: 3
    , legendWidth: 80
    , legendPosition: 'middle'
    , legend: false
    , axisLabelPadding: 20
    , yaxisLabelPadding: 25
    , gdClass: 'chart-html vertical'
    , outerPadding: 0.5
    , hoverTemplate: "{{x}}: {{y}}"
    , formatter: d3.format(",")
    , margin: {
      top: 10
      , right: 10
      , bottom: 10
      , left: 10
    }
  }
  , initialize: function (el, options) {
  }
  , update: function (data) {
    var self = this
      , y = this.options.y
      , x = this.options.x

    this.data = data
    function makeValue(d, x, y) {
      if(d[y] != null){
        if(typeof d[y] === 'string') {
          d[y] = +d[y].replace(",", "")
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

    for(var i = 0; i < data.length; i++){
      var d = data[i]
        , total = 0
      if(typeof y == 'object') {
        this.stackNumber = y.length
        colordomain = y
        y.forEach(function(_y){
          var obj = makeValue(d, x, _y)
          tmpdata.push(obj)
          total += obj.y
        })
      } else {
        this.stackNumber = 1
        colordomain = [y]
        var obj = makeValue(d, x, y)
        tmpdata.push(obj)
        total += obj.y
      }
      tmpdata[i].total = total
    }
    this._data = tmpdata

    this.color = d3.scale.ordinal()
      .range(this.options.barColors)
      .domain(colordomain)

    this.x.domain(this._data.map(function (d) { return d.x }))

    var extent = d3.extent(this._data, function(d) { return d.total })
    if(extent[0] < 0){
      this.y.domain(extent)
    } else {
      this.y.domain([0, extent[1]])
    }

    this.updateChart()
    this.updateXAxis()
    this.updateYAxis()
    this.updateLegend()
  }
  , updateChart: function() {
    var self = this
      , y = 'y'
      , x = 'x'

    var bars = this.container.select(".bars")
      .selectAll(".bar")
      .data(this._data)

    bars.transition()
      .attr("geodash-id", function (d) { return d[x] })
      .style("left", function (d) { return self.x(d[x]) + 'px' })
      .style("width", self.x.rangeBand() + 'px')
      .style("bottom", function (d, i) {
        var bottom = 0
        if(d.y > 0){
          bottom = self.yrange - self.y(0)
        } else {
          bottom = self.yrange - self.y(d.y)
        }
        var stackPosition = i % self.stackNumber
        while(stackPosition > 0){
          var y = self._data[i - stackPosition].y
          bottom += parseInt(self.yrange - self.y(y))
          stackPosition--
        }
        bottom = parseInt(bottom)
        return bottom + 'px'

      })
      .style("height", function (d) {
        var height = 0
        if(d[y] > 0) {
          height = self.y(0) - self.y(d[y])
        } else {
          height = self.y(d[y]) - self.y(0)
        }
        return height + 'px'
      })
      .style("opacity", function(d){
        if(d[x] == self.options.highlight) return 1
        else return self.options.opacity
      })
      .style("background-color", function(d, i) { 
        return self.options.barColors[i%self.stackNumber]
      })
      .style("border-top-right-radius", function(d, i){
        var notend = (i + 1) % self.stackNumber
        if(notend) {
          return 0
        } else {
          if(d[y] > 0) {
            return self.options.roundRadius + 'px'
          } else {
            return 0
          }
        }
      })
      .style("border-top-left-radius", function(d, i){
        var notend = (i + 1) % self.stackNumber
        if(notend) {
          return 0
        } else {
          if(d[y] > 0) {
            return self.options.roundRadius + 'px'
          } else {
            return 0
          }
        }
      })
      .style("border-bottom-right-radius", function(d, i){
        var notend = (i + 1) % self.stackNumber
        if(notend) {
          return 0
        } else {
          if(d[y] < 0) {
            return self.options.roundRadius + 'px'
          } else {
            return 0
          }
        }
      })
      .style("border-bottom-left-radius", function(d, i){
        var notend = (i + 1) % self.stackNumber
        if(notend) {
          return 0
        } else {
          if(d[y] < 0) {
            return self.options.roundRadius + 'px'
          } else {
            return 0
          }
        }
      })
      .style("background-color", function(d, i) {
        return self.options.barColors[i%self.stackNumber]
      }, 'important')

    bars.enter().append("div")
      .attr("class", "bar")
      .attr("geodash-id", function (d) { return d[x] })
      .style("left", function (d) { return self.x(d[x]) + 'px' })
      .style("width", self.x.rangeBand() + 'px')
      .style("bottom", function (d, i) {
        var bottom = 0
        if(d.y > 0){
          bottom = self.yrange - self.y(0)
        } else {
          bottom = self.yrange - self.y(d.y)
        }
        var stackPosition = i % self.stackNumber
        while(stackPosition > 0){
          var y = self._data[i - stackPosition].y
          bottom += parseInt(self.yrange - self.y(y))
          stackPosition--
        }
        bottom = parseInt(bottom)
        return bottom + 'px'

      })
      .style("height", function (d) {
        var height = 0
        if(d[y] > 0) {
          height = self.y(0) - self.y(d[y])
        } else {
          height = self.y(d[y]) - self.y(0)
        }
        return height + 'px'
      })
      .style("opacity", function(d){
        if(d[x] == self.options.highlight) return 1
        else return self.options.opacity
      })
      .style("background-color", function(d, i) {
        return self.options.barColors[i%self.stackNumber]
      }, 'important')
      .style("border-top-right-radius", function(d, i){
        var notend = (i + 1) % self.stackNumber
        if(notend) {
          return 0
        } else {
          if(d[y] > 0) {
            return self.options.roundRadius + 'px'
          } else {
            return 0
          }
        }
      })
      .style("border-top-left-radius", function(d, i){
        var notend = (i + 1) % self.stackNumber
        if(notend) {
          return 0
        } else {
          if(d[y] > 0) {
            return self.options.roundRadius + 'px'
          } else {
            return 0
          }
        }
      })
      .style("border-bottom-right-radius", function(d, i){
        var notend = (i + 1) % self.stackNumber
        if(notend) {
          return 0
        } else {
          if(d[y] < 0) {
            return self.options.roundRadius + 'px'
          } else {
            return 0
          }
        }
      })
      .style("border-bottom-left-radius", function(d, i){
        var notend = (i + 1) % self.stackNumber
        if(notend) {
          return 0
        } else {
          if(d[y] < 0) {
            return self.options.roundRadius + 'px'
          } else {
            return 0
          }
        }
      })
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

    bars.exit().remove()
      
  }
  , mouseOver: function(d, i, el) {
    var self = this
      , y
      , x
      , output = ''

    var x = self._data[i].x
    var y = self._data[i].y
    if(typeof self.options.y == 'object') {
      x += ' ' + self.options.y[i % self.stackNumber]
    }
    if(y !== null) {
      y = self.options.formatter(y)
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
    if(d[self.options.x] == self.options.highlight) {
      opacity =  1
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
