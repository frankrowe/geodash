//PieChart extends Chart

GeoDash.PieChart = GeoDash.Chart.extend({
  options: {
    gdClass: 'chart-html piechart-svg'
    , label: 'label'
    , value: 'value'
    , colors: ["#f00", "#0f0", "#00f"]
    , innerRadius: 10
    , padding: 10
    , yAxisWidth: 0
    , axisLabelPadding: 0
    , arclabels: false
    , arclabelsMin: 10
    , valueFormat: d3.format(',.0f')
    , formatPercent: d3.format('.2f')
    , hoverTemplate: "{{label}}: {{value}} ({{percent}}%)"
    , labelColor: "#ccc"
    , arcstrokewidth: 2
    , arcstrokecolor: '#fff'
    , abbreviate: false
    , total: false
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
      .append("g")
       .attr("transform", "translate(" + self.xrange / 2 + "," + self.yrange / 2 + ")")

    var diameter = Math.min(this.xrange, this.yrange)
    var radius = ( diameter / 2 ) - 4

    this.arc = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(this.options.innerRadius)

    this.pie = d3.layout.pie()
      .sort(null)
      .value(function(d) {
        return d[self.options.value]
      })

    this.setColor(this.options.colors)
  }
  , setColor: function(colors){
    this.options.colors = colors
    this.color = d3.scale.ordinal()
      .range(this.options.colors)
  }
  , update: function(data){
    var self = this

    var firstUpdate = false
    if (typeof this.data === 'undefined') {
      firstUpdate = true
    }

    var new_data = []
    if(!this.options.total) {
      this.total = 0
      data.forEach(function(d, i) {
        d[self.options.value] = +d[self.options.value]
        if(+d[self.options.value] > 0) {
          self.total += +d[self.options.value]
        }
        new_data.push(d)
      })
    } else {
      this.total = this.options.total
    }
    this.data = new_data

    var domain = []
    for (var i = 0; i < this.data.length; i++) {
      domain.push(this.data[i][this.options.label])
    }

    this.color.domain(domain)

    var empty = true
    this.data.forEach(function(d, i) {
      if (d[self.options.value] > 0) empty = false
    })
    if (!empty) {
      this.updateChart(firstUpdate)
    } else {
      this.emptyChart()
      this.updateLegend()
    }
  }
  , emptyChart: function() {
    var self = this
    this.svg.selectAll("path")
      .transition()
      .duration(this.options.transitionDuration)
      .attrTween("d", function (d, i) {
        return self.arcTweenOut(this, d)
      })
      .remove()
    this.svg.selectAll(".arc-text")
      .remove()
  }
  , updateChart: function(firstUpdate) {
    var self = this

    this.enterAntiClockwise = {
      startAngle: Math.PI * 2,
      endAngle: Math.PI * 2
    }

    var path = this.svg.selectAll("path")
      .data(this.pie(this.data))

    var enter = path.enter()
        .append("path")
        .attr("fill", function(d) { return self.color(d.data[self.options.label]) })
        .attr("fill-opacity", this.options.opacity)
        .attr("stroke-width", function(d) {
          var p = (d.value/self.total)*100
          if (p >= .1) {
            return self.options.arcstrokewidth
          } else {
            return 0
          }
        })
        .attr("stroke", this.options.arcstrokecolor)
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

    if (firstUpdate) {
      enter
        .attr("d", this.arc)
        .each(function(d) { this._current = d })
    } else {
      enter
        .attr("d", this.arc(this.enterAntiClockwise))
        .each(function (d) {
          this._current = {
            data: d.data,
            value: d.value,
            startAngle: self.enterAntiClockwise.startAngle,
            endAngle: self.enterAntiClockwise.endAngle
          }
        })
      path.exit()
        .transition()
        .duration(this.options.transitionDuration)
        .attrTween("d", function (d, i) {
          return self.arcTweenOut(this, d)
        })
        .remove()

      path
        .transition()
        .duration(this.options.transitionDuration)
        .attr("fill", function(d) { return self.color(d.data[self.options.label]) })
        .attrTween("d", function (d, i) {
          return self.arcTween(this, d)
        })
    }

    if(this.options.arclabels) {

      var makeLabel = function(d) {
        var p = (d.value/self.total)*100
        var label = ''
        if (p >= self.options.arclabelsMin) {
          label = d.data[self.options.label]
          if(self.options.abbreviate) {
            if(label.length > self.options.abbreviate) {
              label = label.substring(0, self.options.abbreviate) + '..'
            }
          }
        }
        return label
      }
      var t = self.svg.selectAll(".arc-text")
            .data(this.pie(this.data))

      t.select("text")
        .text(makeLabel)

      t
        .transition()
        .duration(this.options.transitionDuration)
        .select("text")
        .attr("transform", function(d) { return "translate(" + self.arc.centroid(d) + ")" })

      t
        .enter()
        .append("g")
        .attr("class", "arc-text")
        .append("text")
        .attr("transform", function(d) { return "translate(" + self.arc.centroid(d) + ")" })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("fill", self.options.labelColor)
        .text(makeLabel)

      t.exit().remove()
    }

    this.updateLegend()
  }
  , arcTween: function(path, d) {
    var self = this
    var i = d3.interpolate(path._current, d)
    path._current = i(0)
    return function(t) {
      return self.arc(i(t))
    }
  }
  , arcTweenOut: function(path, d) {
    var self = this
    var i = d3.interpolate(path._current, {startAngle: Math.PI * 2, endAngle: Math.PI * 2, value: 0})
    path._current = i(0)
    return function (t) {
      return self.arc(i(t))
    }
  }
  , mouseOver: function(d, i, el) {
    var self = this
    d3.select(el).style('fill-opacity', 1)
    if(self.options.hover) {
      var label = d.data[self.options.label]
      var value = self.options.valueFormat(d.value)
      var percent = self.options.formatPercent((d.value/self.total)*100)
      var view = {
        label: label
        , value: value
        , percent: percent
      }
      output = Mustache.render(self.options.hoverTemplate, view)
      self.container.select('.hoverbox').html(output)
      self.container.select('.hoverbox').style('display', 'block')
    }
  }
  , mouseOut: function(d, i, el) {
    var self = this
    self.container.select('.hoverbox').html('')
    self.container.select('.hoverbox').style('display', 'none')
    d3.select(el).style('fill-opacity', self.options.opacity)
  }
})
