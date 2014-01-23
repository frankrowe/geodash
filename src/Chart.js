/*
Chart base class
*/

GeoDash.Chart = ezoop.BaseClass({
  className: 'Chart'
  , defaults: {
    
  }
  , initialize: function (el, options) {
    this.el = el
    this.options = {}
    this.activeBar = -1
    this.setOptions(options)
    this.makeTitle()
    this.setUpChart()
    this.drawChart()
  }
  , setOptions: function (options) {
    for (var key in this.defaults) {
      if (this.defaults.hasOwnProperty(key)) {
        if (options[key] === undefined) {
          options[key] = this.defaults[key]
        }
      }
    }
    this.options = options
  }
  , setUpChart: function(){
    d3.select(this.el).style('position', 'relative')
  }
  , drawChart: function () {
    var self = this
      , padding = 10

    this.setWidth()
    this.setHeight()
    this.setXAxis()
    this.setYAxis()

    this.formatPercent = d3.format(".0%")
    this.formatLarge = d3.format("s")
    this.formatComma = d3.format(",")
    this.formatPercentAxisLabel = d3.format("p")
    this.formatMoney = d3.format("$")

    this.container = d3.select(this.el).append("div")
      .attr("class", function() {
        return "geodash " + self.options.class
      })
      .style("width", this.width + "px")
      .style("height", this.height + "px")
      .style("margin-top", this.options.margin.top + "px")
      .style("margin-bottom", this.options.margin.bottom + "px")
      .style("margin-left", this.options.margin.left + "px")
      .style("margin-right", this.options.margin.right + "px")


    this.xAxisElement = this.container.append("div")
      .attr("class", "x axis")
      .style("margin-left", function(){
        return self.marginleft + 'px'
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
      .style("margin-left", function(){
        return self.marginleft + 'px'
      })

    if(this.options.legend) {
      this.container.append('div')
        .attr('class', 'legend')
        .style("width", this.options.legendWidth + 'px')
        .style("background", function(){
          var c = d3.select(self.el).style("background-color")
          return c
        })
    }

    if(this.className === 'LineChart') {
      this.svg = this.container.select('.bars')
        .append('svg')
    }
    if(this.className === 'PieChart') {
      this.svg = this.container.select('.bars')
        .append('svg')
        .append("g")
         .attr("transform", "translate(" + self.xrange / 2 + "," + this.height / 2 + ")")
    }

    this.container.append('div')
      .attr('class', 'hoverbox')
  }
  , updateChart: function() {
  }
  , setXAxis: function() {
    var xrange = this.width
      , marginleft = 0
    if(this.options.legend) {
      xrange -= this.options.legendWidth
    }
    if(this.options.drawY) {
      xrange -= this.options.yaxisLabelPadding
      marginleft += this.options.yaxisLabelPadding
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
    if(this.options.xLabel) {
      yrange -= this.options.axisLabelPadding
    }
    if(this.options.drawX){
      yrange -= this.options.axisLabelPadding
    }
    this.yrange = yrange
    this.y = d3.scale.linear()
      .range([yrange, 0])
  }
  , updateYAxis: function() {
    var self = this
    if (this.options.drawY) {
      var ticks = this.y.ticks()
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
        .style("left", function(){
          if(self.options.yLabel) {
            return self.options.axisLabelPadding + 'px'
          }
        })
        .style("width", function(){
          
          // return self.xrange + self.marginleft + 'px'
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
        .style("width", self.options.yaxisLabelPadding + 'px')
        .style("background", function(){
          var c = d3.select(self.el).style("background-color")
          return c
        })
    }
  }
  , updateXAxis: function() {
    var self = this
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
          if(self.options.xFormat) {
            return self.options.xFormat(d)
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
        .style("margin-left", function(d, i){
          var m = self.x.rangeBand() / 2
          return m + 'px'
        })

      newTicks.append('div')
        .attr("class", "gd-label")
        .text(function(d){
          if(self.options.xFormat) {
            return self.options.xFormat(d)
          } else {
            return d
          }
        })

    }
  }
  , updateLegend: function() {
    if(this.options.legend) {

      var block = {width: 10, height: 10, padding: 5}
      var padding = 3
      var legend = this.container.select('.legend')

      var d = this.color.domain().slice().reverse()
      
      var legenditems = legend.selectAll(".legend-item")
          .data(d)

      var t = legenditems.select('.value')
        .text(function(d) { return d })

      var legenditem = legenditems.enter()
          .append('div')
          .attr('class', 'legend-item')

      legenditem.append("div")
        .attr("class", "swatch")
        .style('float', 'left')
        .style("width", block.width + 'px')
        .style("height", block.height + 'px')
        .style("margin-left", padding + 'px')
        .style("background", this.color)

      legenditem.append("div")
          .attr("class", "value")
          .style("width", this.options.legendWidth - block.width - padding*2 + 'px')
          .style("padding-left", padding + 'px')
          .text(function(d) { return d })

      legenditems.exit().remove()


      if(this.options.legendPosition == 'middle') {
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
  , makeTitle: function () {
    if (this.options.title) {
      var html = '<div class="geodash-title">'
        + this.options.title
        + '</div>'
      d3.select(this.el).html(html)
    }
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
      this.height = this.height - 30
    }
  }
  , setYAxisLabel: function(label) {
    this.container.select(".y.axis .yAxisLabel .gd-label").text(label)
  }
  , setXAxisLabel: function(label) {
    this.container.select(".y.axis .xAxisLabel .gd-label").text(label)
  }
})