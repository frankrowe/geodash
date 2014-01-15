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
    , xLabel: false
    , yLabel: false
    , percent: false
    , title: false
    , roundRadius: 3
    , highlight: false
    , verticalX: false
    , invert: false
    , roundRadius: 3
    , axisLabelPadding: 20
    , yaxisLabelPadding: 25
    , class: 'chart-html vertical'
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
      .attr("geodash-id", function (d) { return d[x] })
      .style("left", function (d) { return self.x(d[x]) + 'px' })
      .style("width", self.x.rangeBand() + 'px')
      .style("bottom", function (d) {
        var bottom = 0
        if(d[y] > 0){
          bottom = self.yrange - self.y(0)
        } else {
          bottom = self.yrange - self.y(d[y])
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
          bottom = self.yrange - self.y(0)
        } else {
          bottom = self.yrange - self.y(d[y])
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
        self.mouseOver(d, i, this)
      })
      .on('mouseout', function (d, i) {
        self.mouseOut(d, i, this)
      })
      .on('click', function (d, i) {
        //self.mouseOut(d, i, this)
        console.log('click')
      })

    bars.exit().remove()
  }
  , mouseOver: function(d, i, el) {
    var self = this
      , y
      , x
      , output = ''

    var x = self.data[i][self.options.x]
    var y = self.data[i][self.options.y]
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

    d3.select(el).style('opacity', 0.9)

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
  }
  , setColor: function(colors) {
    this.options.barColors = colors
  }
})
