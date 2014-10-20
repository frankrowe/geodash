//BarChart extends Chart
GeoDash.BarChartVertical = GeoDash.BarChart.extend({
  options: {
    gdClass: 'chart-html vertical'
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
      .range(this.options.colors)
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

    bars
      .transition()
      .duration(this.options.transitionDuration)
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
          var prev_height = (self.yrange - self.y(y))
          if(prev_height % 1 > 0.65) {
            prev_height = (prev_height > 0) ? parseInt(prev_height) + 1  : parseInt(prev_height) - 1
          } else {
            prev_height = parseInt(prev_height)
          }
          bottom += prev_height
          stackPosition--
        }

        if(bottom % 1 > 0.65) {
          bottom = (bottom > 0) ? parseInt(bottom) + 1  : parseInt(bottom) - 1
        } else {
          bottom = parseInt(bottom)
        }

        return bottom + 'px'
      })
      .style("height", function (d) {
        var height = 0
        if(d[y] > 0) {
          height = self.y(0) - self.y(d[y])
        } else {
          height = self.y(d[y]) - self.y(0)
        }
        if(height % 1 > 0.65) {
          height = (height > 0) ? parseInt(height) + 1  : parseInt(height) - 1
        } else {
          height = parseInt(height)
        }
        return height + 'px'
      })
      .style("opacity", function(d, i){
        for(var i = 0; i < self.options.highlight.length; i++){
          if(self.options.highlight[i] == d.y) return 1
        }
        return self.options.opacity
      })
      .style("background-color", function(d, i) { 
        console.log(i, self.stackNumber, i%self.stackNumber)
        return self.options.colors[i%self.stackNumber]
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
        if (self.stackNumber > 1) {
          return self.options.colors[i%self.stackNumber]
        } else {
          return self.options.colors[i%self.options.colors.length]
        }
      }, 'important')
      .select('.bar-label')
        .style("width", self.x.rangeBand() + 'px')
        .style("top", "-12px")
        .text(function(d){
          if(self.options.barLabels) {
            if (self.options.barLabelFormat) {
              return self.options.barLabelFormat(d.y)
            } else {
              return self.options.valueFormat(d.y)
            }
          }
        })

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
          var prev_height = (self.yrange - self.y(y))
          if(prev_height % 1 > 0.65) {
            prev_height = (prev_height > 0) ? parseInt(prev_height) + 1  : parseInt(prev_height) - 1
          } else {
            prev_height = parseInt(prev_height)
          }
          bottom += prev_height
          stackPosition--
        }

        if(bottom % 1 > 0.65) {
          bottom = (bottom > 0) ? parseInt(bottom) + 1  : parseInt(bottom) - 1
        } else {
          bottom = parseInt(bottom)
        }

        return bottom + 'px'

      })
      .style("height", function (d) {
        var height = 0
        if(d[y] > 0) {
          height = self.y(0) - self.y(d[y])
        } else {
          height = self.y(d[y]) - self.y(0)
        }
        if(height % 1 > 0.65) {
          height = (height > 0) ? parseInt(height) + 1  : parseInt(height) - 1
        } else {
          height = parseInt(height)
        }
        return height + 'px'
      })
      .style("opacity", function(d, i){
        if(i === self.options.highlight) return 1
        else return self.options.opacity
      })
      .style("background-color", function(d, i) {
        if (self.stackNumber > 1) {
          return self.options.colors[i%self.stackNumber]
        } else {
          return self.options.colors[i%self.options.colors.length]
        }
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
        self.setActiveBar(i, this)
      })
      .append('div')
        .attr('class', 'bar-label')
        .style("width", self.x.rangeBand() + 'px')
        .style("top", "-12px")
        .text(function(d){
          if(self.options.barLabels) {
            if (self.options.barLabelFormat) {
              return self.options.barLabelFormat(d.y)
            } else {
              return self.options.valueFormat(d.y)
            }
          }
        })
    bars.exit().remove()
  }
  , setActiveBar: function(i, el) {
    if(d3.select(el).attr('class') === 'gd-label') {
      i = i * this.stackNumber
    }
    var d = this._data[i];
    var el = d3.select(this.el).selectAll('.bar')[0][i]
    if(this.options.activeBar === i) {
      this.options.activeBar = -1
      this.mouseOut(d, i, el)
    } else {
      this.options.activeBar = i
      this.mouseOver(d, i, el)
    }
  }
  , mouseOver: function(d, i, el) {
    var self = this
      , y
      , x
      , output = ''

    if(d3.select(el).attr('class') === 'gd-label') {
      y = 0
      var start = i * self.stackNumber
      for (var j = start; j < start + self.stackNumber; j++) {
        y += self._data[j].y
      }
      x = self._data[start].x
    } else {
      y = self._data[i].y
      x = self._data[i].x
      if(typeof self.options.y == 'object') {
        x += ' ' + self.options.y[i % self.stackNumber]
      }
    }

    if(y !== null) {
      y = self.options.valueFormat(y)
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
        if(i !== self.options.activeBar) return self.options.opacity
        else return 1
      })
    if(self.options.hover) {
      d3.select(el).style('opacity', 1)

      self.container.select('.hoverbox')
        .html(output)

      self.container.select('.hoverbox')
        .transition()
        .duration(this.options.transitionDuration)
        .style('display', 'block')
    }
  }
  , mouseOut: function(d, i, el) {
    var self = this
    var opacity = self.options.opacity
    if(d[self.options.x] == self.options.highlight) {
      opacity =  1
    }
    if(d3.select(el).attr('class') === 'bar') {
      d3.select(el).style('opacity', opacity)
    }
    self.container.select('.hoverbox')
      .transition()
      .duration(this.options.transitionDuration)
      .style('display', 'none')
    if(self.options.activeBar >= 0){
      var activeEl = self.container.selectAll('.bar')[0][self.options.activeBar]
      self.mouseOver(d, self.options.activeBar, activeEl)
    }
  }
})
