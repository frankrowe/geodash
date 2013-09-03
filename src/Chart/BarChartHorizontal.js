//BarChart extends Chart
GeoDash.BarChartHorizontal = ezoop.ExtendedClass(GeoDash.Chart, {
  className: 'BarChartHorizontal',
  defaults: {
    x: 'x',
    y: 'y',
    barColors: ['#f00'],
    opacity: 0.7,
    drawX: false,
    percent: false,
    title: false,
    roundRadius: 0,
    highlight: false,
    verticalX: false
  },
  initialize: function (el, options) {

  },
  drawChart: function () {
    var self = this;
    var padding = 10;
    this.margin = { top: 20, right: 10, bottom: 20, left: 40 };
    this.width = (this.options.width === 'auto' || this.options.width === undefined ? parseInt(d3.select(this.el).style('width')) : this.options.width) - this.margin.left - this.margin.right,
    this.height = (this.options.height === 'auto' || this.options.height === undefined ? parseInt(d3.select(this.el).style('height')) : this.options.height) - this.margin.top - this.margin.bottom;
    if (this.options.title) {
      this.height = this.height - 21;
    }
    this.formatPercent = d3.format(".0%");
    this.formatLarge = d3.format("s");
    this.formatComma = d3.format(",");

    // this.x = d3.scale.ordinal()
    //   .rangeRoundBands([0, this.width], 0.05, 0.5);

    this.x = d3.scale.linear()
      .range([0, this.width]);

    // this.y = d3.scale.linear()
    //   .range([this.height, 0]);

    this.y = d3.scale.ordinal()
      .rangeRoundBands([0, this.height], 0.05, 0.1);

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("top")
      .tickSize(this.height * -1, 0, 0)
      .tickFormat(function(d){
        return self.formatLarge(d);
      });

    // this.yAxis = d3.svg.axis()
    //   .scale(this.y)
    //   .orient("left")
    //   .ticks(4)
    //   .tickSize(this.width * -1, 0, 0)
    //   .tickFormat(function(d){
    //     return self.formatLarge(d);
    //   });

    // if (this.options.percent) {
    //   this.yAxis.tickFormat(this.formatPercent);
    // }

    this.svg = d3.select(this.el).append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .attr("class", "barchart-svg")
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.svg.append("g")
      .attr("class", "y axis");


    this.xAxisElement = this.svg.append("g")
      .attr("class", "x axis");

    this.svg.append("g")
      .attr("class", "bars");

    d3.select(self.el).append('div').attr('class', 'hoverbox');

    // var bgcolor = d3.rgb(d3.select(this.el).style("background")).toString();
    // this.xAxisElement.append('rect')
    //   .attr("width", this.width)
    //   .attr("height", this.height)
    //   .attr("transform", "translate(0,1)")
    //   .style("fill", bgcolor);
  },
  update: function (data) {
    var self = this;

    var y = this.options.y;
    var x = this.options.x;
    data.forEach(function (d) {
      d[y] = +d[y];
    });

    this.color = d3.scale.ordinal()
      .range(this.options.barColors);

    this.x.domain(d3.extent(data, function(d) { return d[y]; }));
    this.y.domain(data.map(function(d) { return d[x]; }));

    var bars = this.svg.select(".bars")
      .selectAll(".bar")
      .data(data);

    bars.transition()
      .attr("x", function(d) { return self.x(Math.min(0, d[y])); })
      .attr("y", function(d) { return self.y(d[x]); })
      .attr("width", function(d) { return Math.abs(self.x(d[y]) - self.x(0)); })
      .attr("height", self.y.rangeBand())
      .style("fill", function(d) { return self.color(d[x]); })
      .style("fill-opacity", function(d){
        if(d[x] == self.options.highlight) return 1;
        else return self.options.opacity
      });

    bars.enter().append("rect")
      .attr("class", "bar")
      .attr("id", function (d) { return d[x]; })
      .attr("x", function(d) { return self.x(Math.min(0, d[y])); })
      .attr("width", function(d) { return Math.abs(self.x(d[y]) - self.x(0)); })
      .attr("y", function (d) { return self.y(d[y]); })
      .attr("rx", self.options.roundRadius)
      .attr("height", self.y.rangeBand())
      .style("fill-opacity", function(d){
        if(d[x] == self.options.highlight) return 1;
        else return self.options.opacity
      })
      .style("fill", function(d) { return self.color(d[x]); })
      .on('mouseover', function (d, i) {
        d3.select(this).style('fill-opacity', 1);
        d3.select(self.el).select('.hoverbox').html(d[x] + ': ' + (self.options.percent ? self.formatPercent(d[y]) : self.formatComma(d[y])));
        d3.select(self.el).select('.hoverbox').transition().style('display', 'block');
      }).on('mouseout', function (d, i) {
        var opacity = self.options.opacity;
        if(d[x] == self.options.highlight) opacity =  1;
        d3.select(this).style('fill-opacity', opacity);
        d3.select(self.el).select('.hoverbox').transition().style('display', 'none');
      });

    bars.exit().remove();

    if (this.options.drawX) {
      this.xAxisElement.call(this.xAxis);
      // if(this.options.verticalX){
      //   this.xAxisElement.selectAll('.tick').style('display', 'none');
      //   this.xAxisElement.selectAll('g').attr('transform', function(d){
      //     var translate = d3.select(this).attr('transform');
      //     translate = translate.replace('translate(', '');
      //     translate = translate.replace(')', '');
      //     var values = translate.split(',');
      //     var x = values[0] - 8;
      //     var y = -12;
      //     var new_translate = 'translate(' + x + ',' + y + ')';
      //     return new_translate;
      //     //d3.select(this).attr('transform', new_translate);
      //   });
      //   this.xAxisElement.selectAll("text")
      //     .style("text-anchor", "start")
      //     .style("fill", "#333")
      //     .attr("dx", "-.8em")
      //     .attr("dy", ".15em")
      //     .attr("transform", function(d) {
      //       return "rotate(-90)" 
      //     });
      // }
    } else {
      this.xAxisElement.selectAll('g').remove();
    }
  },
  setColor: function(colors) {
    this.options.barColors = colors;
  }
});
