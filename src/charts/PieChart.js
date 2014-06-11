//PieChart extends Chart

GeoDash.PieChart = GeoDash.Chart.extend({
  options: {
    label: 'label'
    , value: 'value'
    , colors: ["#f00", "#0f0", "#00f"]
    , innerRadius: 10
    , opacity: 1
    , drawX: false
    , drawY: false
    , title: false
    , padding: 10
    , legend: false
    , legendPosition: 'middle'
    , hover: true
    , arclabels: false
    , gdClass: 'chart-html piechart-svg'
    , valueFormat: d3.format(',.0f')
    , formatPercent: d3.format('.2f')
    , hoverTemplate: "{{label}}: {{value}} ({{percent}}%)"
    , labelColor: "#ccc"
    , legendWidth: 80
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
  }
  , setColors: function(colors){
    this.color = d3.scale.ordinal()
      .range(colors);
  }
  , update: function(data){
    //if(GeoDash.Browser.ielt9) return
    var self = this

    var diameter = Math.min(this.xrange, this.yrange)
    var radius = ( diameter / 2 ) - 4

    this.arc = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(this.options.innerRadius)

    this.pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d[self.options.value] })


    if(!this.options.total) {
      this.total = 0
      data.forEach(function(d, i) {
        d[self.options.value] = +d[self.options.value]
        if(+d[self.options.value] < 0) {
          data.splice(i, 1)
        } else {
          self.total += +d[self.options.value]
        }
      })
    } else {
      this.total = this.options.total
    }
    this.data = data
    this.updateChart()
  }
  , updateChart: function() {
    var self = this
    
    this.color = d3.scale.ordinal()
       .range(this.options.colors)

    var g = this.svg.selectAll(".arc")
      .data(this.pie(this.data))

    g.select('path')
      .style("fill", function(d) { return self.color(d.data[self.options.label]) })
      .attr("d", this.arc)

    g.enter()
      .append("g")
      .attr("class", "arc")
      .append("path")
      .attr("d", this.arc)
      .attr("fill", function(d) { return self.color(d.data[self.options.label]) })
      .attr("fill-opacity", this.options.opacity)
      .attr("stroke-width", this.options.arcstrokewidth)
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

    g.exit().remove()

    if(this.options.arclabels) {
      var t = self.svg.selectAll(".arc-text")
            .data(this.pie(this.data))

      t.select("text")
        .attr("transform", function(d) { return "translate(" + self.arc.centroid(d) + ")"; })
        .text(function(d) {
          var label = d.data[self.options.label]
          if(self.options.abbreviate) {
            if(label.length > self.options.abbreviate) {
              label = label.substring(0, self.options.abbreviate) + '..'
            }
          }
          return label + ' (' + d.value + ')' 
        })

      t.enter().append("g")
        .attr("class", "arc-text")
        .append("text")
        .attr("transform", function(d) { return "translate(" + self.arc.centroid(d) + ")" })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("fill", self.options.labelColor)
        .text(function(d) {
          var label = d.data[self.options.label]
          if(self.options.abbreviate) {
            if(label.length > self.options.abbreviate) {
              label = label.substring(0, self.options.abbreviate) + '..'
            }
          }
          return label + ' (' + d.value + ')' 
        })

      t.exit().remove()
    }

    this.updateLegend()
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
});