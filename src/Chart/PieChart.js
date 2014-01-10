//PieChart extends Chart

GeoDash.PieChart = ezoop.ExtendedClass(GeoDash.Chart, {
  className: 'PieChart'
  , defaults: {
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
    , hover: true
    , arclabels: false
    , class: 'chart-html piechart-svg'
    , formatHover: d3.format(',.0f')
    , formatPercent: d3.format('.2f')
    , labelColor: "#ccc"
    , legendWidth: 80
    , arcstroke: 2
  }
  , initialize: function (el, options) {
  }
  , setColors: function(colors){
    this.color = d3.scale.ordinal()
      .range(colors);
  }
  , update: function(data){
    var self = this

    var diameter = Math.min(this.width, this.height)
    if(this.options.legend) {
      diameter -= this.options.legendWidth
    }
    var radius = diameter / 2

    this.arc = d3.svg.arc()
      .outerRadius(radius)
      .innerRadius(this.options.innerRadius)

    this.pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d[self.options.value] })

    this.color = d3.scale.ordinal()
       .range(this.options.colors)

    this.total = 0
    data.forEach(function(d, i) {
      d[self.options.value] = +d[self.options.value]
      if(+d[self.options.value] < 0) {
        data.splice(i, 1)
      } else {
        self.total += +d[self.options.value]
      }
    })

    var g = this.svg.selectAll("path")
      .data(this.pie(data))

    g.style("fill", function(d) { return self.color(d.data[self.options.label]) })
      .attr("d", this.arc)

    g.enter()
      .append("path")
      .attr("class", "arc")
      .attr("d", this.arc)
      .style("fill", function(d) { return self.color(d.data[self.options.label]) })
      .style("fill-opacity", this.options.opacity)
      .style("stroke-width", this.options.arcstroke)
      .on('mouseover', function(d,i){
        d3.select(this).style('fill-opacity', 1)
        if(self.options.hover) {
          var label = d.data[self.options.label]
          var total = self.options.formatHover(d.value)
          var percent = self.options.formatPercent((d.value/self.total)*100)
          self.container.select('.hoverbox').html(label + ": " + total + ' (' + percent + '%)')
          self.container.select('.hoverbox').style('display', 'block')
        }
      })
      .on('mouseout', function(d,i){
        self.container.select('.hoverbox').html('')
        self.container.select('.hoverbox').style('display', 'none')
        d3.select(this).style('fill-opacity', self.options.opacity  )
      })

    g.exit().remove()

    if(this.options.arclabels) {
      var t = self.svg.selectAll(".arc-text")
            .data(this.pie(data))

      t.select("text")
        .attr("transform", function(d) { return "translate(" + self.arc.centroid(d) + ")"; })
        .text(function(d) { return d.data[self.options.label] + ' (' + d.value + ')' })

      t.enter().append("g")
        .attr("class", "arc-text")
        .append("text")
        .attr("transform", function(d) { return "translate(" + self.arc.centroid(d) + ")" })
        .attr("dy", ".35em")
        .style("text-anchor", "middle")
        .style("fill", self.options.labelColor)
        .text(function(d) { return d.data[self.options.label] + ' (' + d.value + ')' })

      t.exit().remove()
    }

    if(this.options.legend) {

      var block = {width: 10, height: 10, padding: 5}
      var padding = 3
      var legend = this.container.select('.legend')

      var legenditems = legend.selectAll(".legend-item")
          .data(this.color.domain().slice())

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
        .style("background", this.color)

      legenditem.append("div")
          .attr("class", "value")
          .style("width", this.options.legendWidth - block.width - padding + 'px')
          .style("padding-left", padding + 'px')
          .text(function(d) { return d })

      legenditems.exit().remove()

      var lHeight = parseInt(legend.style('height'))
      var middle = (this.height / 2) - (lHeight / 2)
      legend.style('top', middle + 'px')
    }
  }
});