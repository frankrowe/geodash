//BarChart extends Chart
GeoDash.BarChartVertical = ezoop.ExtendedClass(GeoDash.Chart, {
  className: 'BarChartVertical'
  , defaults: {
    x: 'x'
    , y: 'y'
    , barColors: ['#f00']
    , opacity: 0.7
    , drawX: false
    , drawY: false
    , percent: false
    , title: false
    , roundRadius: 3
    , highlight: false
    , verticalX: false
    , invert: false
    , roundRadius: 3
  }
  , initialize: function (el, options) {

  }
  , setWidth: function () {
    this.width = parseInt(d3.select(this.el).style('width'))
    this.width = this.width - this.margin.left - this.margin.right
  }
  , setHeight: function() {
    this.height = parseInt(d3.select(this.el).style('height'))
    this.height = this.height - this.margin.top
    if (this.options.title) {
      this.height = this.height - 30
    }
  }
  , drawChart: function () {
    var self = this
      , padding = 10

    this.margin = { 
      top: 10
      , right: 10
      , bottom: 20
      , left: 10
    }

    this.setWidth()
    this.setHeight()

    this.formatPercent = d3.format(".0%")
    this.formatLarge = d3.format("s")
    this.formatComma = d3.format(",")

    this.x = d3.scale.ordinal()
      .rangeRoundBands([0, this.width], 0.05, 0.5)

    this.y = d3.scale.linear()
      .range([this.height - this.margin.bottom, 0])

    this.container = d3.select(this.el).append("div")
      .attr("class", "geodash barchart-html vertical")
      .style("width", this.width + "px")
      .style("height", this.height + "px")
      .style("margin-top", this.margin.top + "px")
      .style("margin-left", this.margin.left + "px")
      .style("margin-right", this.margin.right + "px")

    this.xAxisElement = this.container.append("div")
      .attr("class", "x axis")

    this.yAxisElement = this.container.append("div")
      .attr("class", "y axis")

    this.container.append("div")
      .attr("class", "bars")
      .style("height", this.height - this.margin.bottom + "px")

    this.container.append('div')
      .attr('class', 'hoverbox')

  }
  , cleanData: function (data) {
    var y = this.options.y
      , x = this.options.x

    for(var i = 0; i < data.length; i++){
      var d = data[i]
      if(d[y] != null){
        if(typeof d[y] === 'string') {
          d[y] = +d[y].replace(",", "")
        }
      }
    }
    return data
  }
  , update: function (data) {
    var self = this
      , y = this.options.y
      , x = this.options.x

    this.data = data = this.cleanData(data)

    this.color = d3.scale.ordinal()
      .range(this.options.barColors)

    this.x.domain(data.map(function (d) { return d[x] }))

    var extent = d3.extent(data, function(d) { return d[y] })
    if(extent[0] < 0){
      this.y.domain(extent)
    } else {
      this.y.domain([0, extent[1]])
    }

    var bars = this.container.select(".bars")
      .selectAll(".bar")
      .data(data)

    bars.transition()
      .attr("geodash-id", function (d) { return d[x] })
      .style("left", function (d) { return self.x(d[x]) + 'px' })
      .style("width", self.x.rangeBand() + 'px')
      .style("bottom", function (d) {
        var bottom = 0
        if(d[y] > 0){
          bottom = self.height - self.margin.bottom - self.y(0)
        } else {
          bottom = self.height - self.margin.bottom - self.y(d[y])
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
        return height + 'px'
      })
      .style("opacity", function(d){
        if(d[x] == self.options.highlight) return 1
        else return self.options.opacity
      })
      .style("background-color", function(d) { return self.color(d[x]) })
      .style("border-top-right-radius", function(d){
        if(d[y] > 0) {
          return self.options.roundRadius + 'px'
        } else {
          return 0
        }
      })
      .style("border-top-left-radius", function(d){
        if(d[y] > 0) {
          return self.options.roundRadius + 'px'
        } else {
          return 0
        }
      })
      .style("border-bottom-right-radius", function(d){
        if(d[y] < 0) {
          return self.options.roundRadius + 'px'
        } else {
          return 0
        }
      })
      .style("border-bottom-left-radius", function(d){
        if(d[y] < 0) {
          return self.options.roundRadius + 'px'
        } else {
          return 0
        }
      })
      .style("background-color", function(d) { return self.color(d[x]) })

    bars.enter().append("div")
      .attr("class", "bar")
      .attr("geodash-id", function (d) { return d[x] })
      .style("left", function (d) { return self.x(d[x]) + 'px' })
      .style("width", self.x.rangeBand() + 'px')
      .style("bottom", function (d) {
        var bottom = 0
        if(d[y] > 0){
          bottom = self.height - self.margin.bottom - self.y(0)
        } else {
          bottom = self.height - self.margin.bottom - self.y(d[y])
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
        return height + 'px'
      })
      .style("opacity", function(d){
        if(d[x] == self.options.highlight) return 1
        else return self.options.opacity
      })
      .style("background-color", function(d) { return self.color(d[x]) })
      .style("border-top-right-radius", function(d){
        if(d[y] > 0) {
          return self.options.roundRadius + 'px'
        } else {
          return 0
        }
      })
      .style("border-top-left-radius", function(d){
        if(d[y] > 0) {
          return self.options.roundRadius + 'px'
        } else {
          return 0
        }
      })
      .style("border-bottom-right-radius", function(d){
        if(d[y] < 0) {
          return self.options.roundRadius + 'px'
        } else {
          return 0
        }
      })
      .style("border-bottom-left-radius", function(d){
        if(d[y] < 0) {
          return self.options.roundRadius + 'px'
        } else {
          return 0
        }
      })
      .on('mouseover', function (d, i) {
        self.barMouseOver(d, i, this)
      }).on('mouseout', function (d, i) {
        self.barMouseOut(d, i, this)
      })

    bars.exit().remove()

    if (this.options.drawY) {
      var ticks = this.y.ticks()
      console.log(ticks)
      var tickElements = this.yAxisElement
        .selectAll(".tick")
        .data(ticks)

      var ticks = tickElements.transition()
        .style("top", function(d) {
          return self.y(d)  + 'px'
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
        .style("top", function(d) {
          return self.y(d) + 'px'
        })
        .style("width", "100%")

      tickElements.exit().remove()

      newTicks
        .append('div')
        .attr("class", "line")
        .style("width", "100%")

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
        .style("margin-top", function(d){
          var h = d3.select(this).style('height')
          var m = (parseInt(h)/2*-1)
          return m + 'px'
        })
    }

    if (this.options.drawX) {
      var labels = this.x.domain()
      var tickElements = this.xAxisElement
        .selectAll(".tick")
        .data(labels)

      var ticks = tickElements.transition()
        .style("left", function (d) { return self.x(d) + 'px' })
        .style("width", self.x.rangeBand() + 'px')

      ticks.select('.line')
        .style("margin-left", function(d, i){
          var m = self.x.rangeBand() / 2
          return m + 'px'
        })
      ticks.select('.gd-label')
        .text(function(d){
          return d
        })

      var newTicks = tickElements.enter().append('div')
        .attr("class", "tick")
        .style("left", function (d) { return self.x(d) + 'px' })
        .style("width", self.x.rangeBand() + 'px')
        .style("bottom", function (d) { return '0px' })
        .style("height", self.margin.bottom + 'px')

      tickElements.exit().remove()

      newTicks.append('div')
        .attr("class", "line")
        .style("margin-left", function(d, i){
          var m = self.x.rangeBand() / 2
          return m + 'px'
        })

      newTicks.append('div')
        .attr("class", "gd-label")
        .text(function(d){
          return d
        })

    }
  }
  ,barMouseOver: function(d, i, el) {
    var self = this

    d3.select(el).style('opacity', 1)
    var text = d[self.options.x] + ': '
    if(self.options.percent) {
      text += self.formatPercent(d[self.options.y])
    } else {
      text += self.formatComma(d[self.options.y])
    }
    self.container.select('.hoverbox')
      .html(text)

    self.container.select('.hoverbox')
      .transition()
      .style('display', 'block')
  }
  ,barMouseOut: function(d, i, el) {
    var self = this
    var opacity = self.options.opacity
    if(d[self.options.x] == self.options.highlight) {
      opacity =  1
    }
    d3.select(el).style('opacity', opacity)
    self.container.select('.hoverbox')
      .transition()
      .style('display', 'none')
  }
  , setColor: function(colors) {
    this.options.barColors = colors
  }
})
