/*
Chart base class
*/

GeoDash.Chart = GeoDash.Class.extend({
  options: {
    // class to assign chart container
    gdClass: 'chart-html'
    , margin: {
      top: 10
      , right: 10
      , bottom: 10
      , left: 10
    }
    , x: 'x'
    , y: 'y'
    , width: 'auto'
    , height: 'auto'
    , drawX: true
    , drawY: true
    , xLabel: false
    , yLabel: false
    , opacity: 1
    // toggle mouseover popups
    , hover: true
    // draw legend
    , legend: false
    , legendWidth: 80
    // position of legend. top, middle, bottom, inside
    , legendPosition: 'middle'
    // width of y axis label, height of x axis label
    , axisLabelPadding: 20
    // width of y axis scale
    , yAxisWidth: 25
    // number of ticks on y axis (approx)
    , yTicksCount: 10
    // number of ticks on x axis (approx)
    , xTicksCount: 10
    // template that appears on mouse over
    , hoverTemplate: "{{x}}: {{y}}"
    // format x axis tick marks
    , xTickFormat: false
    // format y axis tick marks
    , yTickFormat: d3.format(".2s")
    // format values in labels
    , valueFormat: d3.format(",")
    // format labels in axis
    , labelFormat: d3.time.format("%Y-%m-%d")

    , transitionDuration: 500
  }
  , initialize: function (el, options) {
    this.el = el
    options = GeoDash.setOptions(this, options)
    this.drawChart()
  }
  , drawChart: function () {
    var self = this
      , padding = 10

    this.setWidth()
    this.setHeight()
    this.setXAxis()
    this.setYAxis()

    this.formatPercent = d3.format(".0%")
    this.formatLarge = d3.format(".1s")
    this.formatComma = d3.format(",")
    this.formatPercentAxisLabel = d3.format("p")
    this.formatMoney = d3.format("$")

    d3.select(this.el).html(null)

    this.container = d3.select(this.el).append("div")
      .attr("class", function() {
        var c = "geodash " + self.options.gdClass
        if(GeoDash.Browser.ielt9) {
          c += ' geodash-oldie'
        }
        return c
      })
      .style("width", this.width + "px")
      .style("height", this.height + "px")
      .style("margin", function(){
        var m = self.options.margin.top + "px " +
          self.options.margin.right + "px " +
          self.options.margin.bottom + "px " +
          self.options.margin.left + "px"
        return m
      })

    if (this.options.title) {
      this.container.append('div')
        .attr('class', 'geodash-title')
        .html(this.options.title)
    }

    this.xAxisElement = this.container.append("div")
      .attr("class", "x axis")
      .style("margin", function(){
        return "0 0 0 " + self.marginleft + 'px'
      })
      .style("width", function(){
        return self.xrange + 'px'
      })

    if(self.options.xLabel) {
      this.xAxisElement.append("div")
        .attr("class", "xAxisLabel")
        .style("height", this.options.axisLabelPadding + 'px')
        .append("div")
        .attr("class", "gd-label")
        .style("line-height", this.options.axisLabelPadding + 'px')
        .text(this.options.xLabel)
    }

    this.yAxisElement = this.container.append("div")
      .attr("class", "y axis")
      .style("width", function(){
        return self.xrange + self.marginleft + 'px'
      })

    if(self.options.yLabel) {
      this.yAxisElement.append("div")
        .attr("class", "yAxisLabel")
        .style("height", this.options.axisLabelPadding + 'px')
        .style("width", this.height + 'px')
        .append("div")
        .attr("class", "gd-label")
        .style("line-height", this.options.axisLabelPadding + 'px')
        .text(this.options.yLabel)
    }

    this.container.append("div")
      .attr("class", "bars")
      .style("height", function(){
        return self.yrange + "px"
      })
      .style("width", function(){
        return self.xrange + 'px'
      })
      .style("margin", function(){
        return "0 0 0 " + self.marginleft + 'px'
      })

    if(this.options.legend) {
      var d = this.container.append('div')
        .attr('class', 'legend')
        .style("background", function(){
          var c = d3.select(self.el).style("background-color")
          return c
        })

      if (this.options.legendWidth !== 'auto') {
        d.style("width", this.options.legendWidth + 'px')
      }

    }

    this.makeSVG()

    this.container.append('div')
      .attr('class', 'hoverbox')
  }
  , makeSVG: function() {}
  , updateChart: function() {
  }
  , setXAxis: function() {
    var xrange = this.width
      , marginleft = 0
    if(this.options.legend && this.options.legendPosition !== 'inside' && this.options.legendWidth !== 'auto') {
      xrange -= (this.options.legendWidth + 10)
    }
    if(this.options.drawY) {
      xrange -= this.options.yAxisWidth
      marginleft += this.options.yAxisWidth
    }
    if(this.options.yLabel) {
      xrange -= this.options.axisLabelPadding
      marginleft += this.options.axisLabelPadding
    }
    this.xrange = xrange
    this.marginleft = marginleft
    this.x = d3.scale.ordinal()
      .rangeRoundBands([0, xrange], 0.05, this.options.outerPadding)
  }
  , setYAxis: function() {
    var yrange = this.height
    var topPadding = 0
    if(this.options.xLabel) {
      yrange -= this.options.axisLabelPadding
    }
    if(this.options.drawX){
      yrange -= this.options.axisLabelPadding
    }
    if(this.options.barLabels){
      topPadding = 15
    }
    this.yrange = yrange
    this.y = d3.scale.linear()
      .range([yrange, topPadding])
  }
  , updateYAxis: function() {
    var self = this
    if (this.options.drawY) {
      var ticks = this.y.ticks(self.options.yTicksCount)

      var tickElements = this.yAxisElement
        .selectAll(".tick")
        .data(ticks)

      var ticks = tickElements
        .transition()
        .duration(this.options.transitionDuration)
        .style("top", function(d) {
          return self.y(d)  + 'px'
        })

      var used = []
      ticks.select('.gd-label')
        .text(function(d){
          var label
          if(self.options.yTickFormat) {
            label = self.options.yTickFormat(d)
          } else {
            label = d
          }
          if (self.options.money) {
            label = '$' + label
          }
          if (self.options.percent) {
            label = label + '%'
          }
          if(used[used.length-1] !== label || used.length == 0){
            used.push(label)
            return label
          } else return ''
        })

      var newTicks = tickElements.enter().append('div')
        .attr("class", "tick")
        .style("top", function(d) {
          return self.y(d) + 'px'
        })
        .style("left", function(){
          if(self.options.yLabel) {
            return self.options.axisLabelPadding + 'px'
          }
        })
        .style("width", function(){
          if(self.options.yLabel) {
            return self.width - self.options.axisLabelPadding + "px"
          } else {
            return self.width + "px"
          }
        })

      tickElements.exit().remove()

      newTicks
        .append('div')
        .attr("class", "line")
        .style("width", function() {
          return self.width - self.marginleft - 5 + 'px'
        })
        .style("margin", function(d){
          var m = self.marginleft + 5
          if (self.options.yLabel) {
            m -= self.options.axisLabelPadding
          }
          return '0 0 0 ' + m + 'px'
        })


      newTicks
        .append('div')
        .attr("class", "gd-label")
        .text(function(d){
          var label
          if(self.options.yTickFormat) {
            label = self.options.yTickFormat(d)
          } else {
            label = d
          }
          if (self.options.money) {
            label = '$' + label
          }
          if (self.options.percent) {
            label = label + '%'
          }
          if(used[used.length-1] !== label || used.length == 0){
            used.push(label)
            return label
          } else return ''
        })
        .style("margin", function(d){
          var h = d3.select(this).style('height')
          var m = (parseInt(h)/2*-1)
          return m + 'px' + ' 0 0 0'
        })
        .style("width", self.options.yAxisWidth + 'px')
    }
  }
  , updateXAxis: function() {
    var self = this
    if (this.options.drawX) {
      var labels = this.x.domain()
      var tickElements = this.xAxisElement
        .selectAll(".tick")
        .data(labels)

      var ticks = tickElements
        .transition()
        .duration(this.options.transitionDuration)
        .style("left", function (d) { return self.x(d) + 'px' })
        .style("width", self.x.rangeBand() + 'px')

      ticks.select('.line')
        .style("margin", function(d, i){
          var m = self.x.rangeBand() / 2
          return '0 0 0 ' + m + 'px'
        })
      ticks.select('.gd-label')
        .text(function(d){
          if(self.options.xTickFormat) {
            return self.options.xTickFormat(d)
          } else {
            return d
          }
        })

      var newTicks = tickElements.enter().append('div')
        .attr("class", "tick")
        .style("left", function (d) { return self.x(d) + 'px' })
        .style("width", self.x.rangeBand() + 'px')
        .style("bottom", function (d) {
          var b = self.height - self.yrange - self.options.axisLabelPadding
          return b + 'px'
        })
        .style("height", self.options.axisLabelPadding + 'px')

      tickElements.exit().remove()

      newTicks.append('div')
        .attr("class", "line")
        .style("margin", function(d, i){
          var m = self.x.rangeBand() / 2
          return '0 0 0 ' + m + 'px'
        })

      newTicks.append('div')
        .attr("class", "gd-label")
        .style("line-height", self.options.axisLabelPadding + 'px')
        .text(function(d){
          if(self.options.xTickFormat) {
            return self.options.xTickFormat(d)
          } else {
            return d
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
    }
  }
  , updateLegend: function() {
    var self = this
    if(this.options.legend) {
      var block = {width: 10, height: 10, padding: 5}
      var padding = 5
      var legend = this.container.select('.legend')

      var d = this.color.domain()//.slice().reverse()

      var legenditems = legend.selectAll(".legend-item")
          .data(d)

      legenditems.select('.value')
        .text(function(d) { return d })

      legenditems.select('.swatch')
        .style("background", this.color)

      var legenditem = legenditems.enter()
          .append('div')
          .attr('class', 'legend-item')

      legenditem.append("div")
        .attr("class", "swatch")
        .style("width", block.width + 'px')
        .style("height", block.height + 'px')
        .style("background", this.color)

      var value = legenditem.append("div")
          .attr("class", "value")
          .text(function(d) { return d })

      if (this.options.legendWidth !== 'auto') {
        value.style("width", this.options.legendWidth - block.width - padding*2 - block.padding + 'px')
      }

      legenditems.exit().remove()

      if(this.options.legendPosition == 'middle' || this.options.legendPosition == 'inside') {
        var lHeight = parseInt(legend.style('height'))
        var middle = (this.height / 2) - (lHeight / 2)
        legend.style('top', middle + 'px')
      } else if(this.options.legendPosition == 'top') {
        legend.style('top', '0px')
      } else if(this.options.legendPosition == 'bottom') {
        legend.style('bottom', '0px')
      }
      
    }
  }
  , update: function () {
  }
  , refresh: function() {
    this.updateChart()
  }
  , getData: function() {
    return this.data
  }
  , setWidth: function () {
    this.width = parseInt(d3.select(this.el).style('width'))
    this.width = this.width - this.options.margin.left - this.options.margin.right
  }
  , setHeight: function() {
    if(this.options.barHeight !== 0 
      && typeof this.options.barHeight != 'undefined') {
      d3.select(this.el).style('height', 'auto')
    }
    this.height = parseInt(d3.select(this.el).style('height'))
    this.height = this.height - this.options.margin.top - this.options.margin.bottom
    if (this.options.title) {
      this.height = this.height - 20
    }
  }
  , setYAxisLabel: function(label) {
    this.container.select(".y.axis .yAxisLabel .gd-label").text(label)
  }
  , setXAxisLabel: function(label) {
    this.container.select(".y.axis .xAxisLabel .gd-label").text(label)
  }
  , setColor: function(colors) {
    this.options.colors = colors
  } 
})