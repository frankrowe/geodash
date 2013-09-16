//BarChart extends Chart
GeoDash.BarChartHorizontal = ezoop.ExtendedClass(GeoDash.Chart, {
  className: 'BarChartHorizontal',
  defaults: {
    x: 'x',
    y: 'y',
    barColors: ['#f00'],
    opacity: 0.7,
    drawX: false,
    drawY: false,
    percent: false,
    title: false,
    roundRadius: 3,
    highlight: false,
    verticalX: false,
    invert: false
  },
  initialize: function (el, options) {

  },
  drawChart: function () {
    var self = this;
    var padding = 10;
    this.margin = { top: 20, right: 10, bottom: 20, left: 10 };
    this.width = (this.options.width === 'auto' || this.options.width === undefined ? parseInt(d3.select(this.el).style('width')) : this.options.width) - this.margin.left - this.margin.right,
    this.height = (this.options.height === 'auto' || this.options.height === undefined ? parseInt(d3.select(this.el).style('height')) : this.options.height) - this.margin.top - this.margin.bottom;
    if (this.options.title) {
      this.height = this.height - 21;
    }
    
    this.formatPercent = d3.format(".0%");
    this.formatLarge = d3.format("s");
    this.formatComma = d3.format(",");

    this.x = d3.scale.linear()
      .range([0, this.width]);

    this.y = d3.scale.ordinal()
      .rangeRoundBands([0, this.height], 0.05);

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("top")
      .tickSize(this.height * -1, 0, 0)
      .tickFormat(function(d){
        return self.formatLarge(d);
      });

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient("left")
      //.ticks(4)
      .tickSize(0, 0, 0)
      .tickFormat(function(d){
        return d;
      });

    if (this.options.percent) {
      this.xAxis.tickFormat(this.formatPercent);
    }

    this.svg = d3.select(this.el).append("svg")
      .attr("width", this.width + this.margin.left + this.margin.right)
      .attr("height", this.height + this.margin.top + this.margin.bottom)
      .attr("class", "barchart-svg")
      .append("g")
      .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");

    this.xAxisElement = this.svg.append("g")
      .attr("class", "x axis");

    this.svg.append("g")
      .attr("class", "bars");

    this.yAxisElement = this.svg.append("g")
      .attr("class", "y axis");

    d3.select(self.el).append('div').attr('class', 'hoverbox');

  },
  update: function (data) {
    var self = this;

    var y = this.options.y;
    var x = this.options.x;
    data.forEach(function (d) {
      d[x] = +d[x];
    });

    this.color = d3.scale.ordinal()
      .range(this.options.barColors);

    var extent = d3.extent(data, function(d) { return d[x]; });
    if(extent[0] < 0){
      this.x.domain(extent);
    } else {
      this.x.domain([0, extent[1]]);
    }
    
    this.y.domain(data.map(function(d) { return d[y]; }));

    var bars = this.svg.select(".bars")
      .selectAll(".bar")
      .data(data);

    bars.transition()
      .attr("id", function (d) { return d[y]; })
      .attr("x", function(d) { 
        var xposition = self.x(Math.min(0, d[x]));
        if(xposition >= self.x(0)) {
          xposition -= self.options.roundRadius
        }
        return xposition;
      })
      .attr("y", function (d) { return self.y(d[x]); })
      .attr("width", function(d) { 
        var w = Math.abs(self.x(d[x]) - self.x(0));
        w += self.options.roundRadius;
        return w;
      })
      .attr("height", self.y.rangeBand())
      .attr("rx", self.options.roundRadius)
      .style("fill", function(d) { return self.color(d[y]); })
      .style("fill-opacity", function(d){
        if(d[y] == self.options.highlight) return 1;
        else return self.options.opacity
      });

    bars.enter().append("rect")
      .attr("class", "bar")
      .attr("id", function (d) { return d[y]; })
      .attr("x", function(d) {
        var xposition = self.x(Math.min(0, d[x]));
        if(xposition >= self.x(0)) {
          xposition -= self.options.roundRadius
        }
        return xposition;
      })
      .attr("y", function (d) { return self.y(d[y]); })
      .attr("width", function(d) {
        var w = Math.abs(self.x(d[x]) - self.x(0));
        w += self.options.roundRadius;
        return w;
      })
      .attr("rx", self.options.roundRadius)
      .attr("height", self.y.rangeBand())
      .style("fill-opacity", function(d){
        if(d[y] == self.options.highlight) return 1;
        else return self.options.opacity
      })
      .style("fill", function(d) { return self.color(d[y]); })
      .on('mouseover', function (d, i) {
        d3.select(this).style('fill-opacity', 1);
        d3.select(self.el).select('.hoverbox').html(d[y] + ': ' + (self.options.percent ? self.formatPercent(d[x]) : self.formatComma(d[x])));
        d3.select(self.el).select('.hoverbox').transition().style('display', 'block');
      }).on('mouseout', function (d, i) {
        var opacity = self.options.opacity;
        if(d[y] == self.options.highlight) opacity =  1;
        d3.select(this).style('fill-opacity', opacity);
        d3.select(self.el).select('.hoverbox').transition().style('display', 'none');
      });

    bars.exit().remove();


    //cut off rounded corners on one end
    var bgcolor = d3.rgb(d3.select(this.el).style("background-color")).toString();
    var hiders = this.svg.select(".bars")
      .selectAll(".hider")
      .data(data);

    hiders.transition()
      .attr("width", self.options.roundRadius*2)
      .attr("height", self.y.rangeBand())
      .attr("x", self.x(0))
      .attr("y", function (d) { return self.y(d[y]); })
      .attr('transform', function(d){
        var xposition = self.x(Math.min(0, d[x]));
        if(xposition < self.x(0)) {
          return 'translate(0, 0)';
        } else {
          return 'translate(' + self.options.roundRadius*2*-1 + ', 0)';
        }
      });

    hiders.enter().append("rect")
      .attr("class", "hider")
      .attr("width", self.options.roundRadius*2)
      .attr("height", self.y.rangeBand())
      .attr("x", self.x(0))
      .attr("y", function (d) { return self.y(d[y]); })
      .style("fill-opacity", 1)
      .style("fill", bgcolor)
      .attr('transform', function(d){
        var xposition = self.x(Math.min(0, d[x]));
        if(xposition < self.x(0)) {
          return 'translate(0, 0)';
        } else {
          return 'translate(' + self.options.roundRadius*2*-1 + ', 0)';
        }
      });

    hiders.exit().remove();

    //draw zero line
    this.yAxisElement
      .append("line")
      .attr("class", "line")
      .attr("x1", self.x(0))
      .attr("x2", self.x(0))
      .attr("y2", self.height);

    if (this.options.drawX) {
      this.xAxisElement.call(this.xAxis);
    } else {
      this.xAxisElement.selectAll('g').remove();
    }

    if(this.options.drawY){
      this.y.domain(data.map(function(d) { return d[y]; }));
      this.yAxisElement.call(this.yAxis);
      this.yAxisElement.selectAll("text")
        .style("text-anchor", "start")
        .style("fill", function(d){
          if(self.options.invert) {
            return "#fff";
          } else {
            return "#333";
          }
        })
        .attr("x", "2")
        .attr("y", "0");
    } else {
      this.yAxisElement.selectAll('g').remove();
    }
  },
  setColor: function(colors) {
    this.options.barColors = colors;
  }
});
