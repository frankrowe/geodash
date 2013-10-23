//BarChart extends Chart
GeoDash.BarChartHTML = ezoop.ExtendedClass(GeoDash.Chart, {
  className: 'BarChartHorizontal',
  defaults: {
    x: 'x',
    y: 'y',
    barColors: ['#f00'],
    opacity: 0.7,
    drawX: false,
    drawY: false,
    percent: false,
    money: false,
    title: false,
    roundRadius: 3,
    highlight: [],
    verticalX: false,
    invert: false,
    barHeight: 0,
    padding: 1,
    numberTicks: 10,
    yWidth: 80
  },
  initialize: function (el, options) {

  },
  drawChart: function () {
    var self = this;
    this.margin = { top: 10, right: 10, bottom: 10, left: 10 };
    this.width = (this.options.width === 'auto' || this.options.width === undefined ? parseInt(d3.select(this.el).style('width')) : this.options.width) - this.margin.left - this.margin.right,
    this.height = (this.options.height === 'auto' || this.options.height === undefined ? parseInt(d3.select(this.el).style('height')) : this.options.height) - this.margin.top - this.margin.bottom;
    if (this.options.title) {
      this.height = this.height - 30;
    }

    this.formatPercent = d3.format(".2%");
    this.formatPercentAxisLabel = d3.format("p");
    this.formatMoney = d3.format("$");
    this.formatLarge = d3.format("s");
    this.formatComma = d3.format(",.2f");

    this.x = d3.scale.linear()
      .range([10, this.width - this.options.yWidth]).nice();

    this.y = d3.scale.ordinal()
      .rangeRoundBands([0, this.height], 0.05, 0);

    this.svg = d3.select(this.el).append("div")
      .attr("class", "geodash barchart-html")
      .style("width", this.width + this.margin.right + "px")
      .style("margin-top", this.margin.top + "px")
      .style("margin-bottom", this.margin.bottom + "px")
      .style("margin-left", this.margin.left + "px");

    this.xAxisElement = this.svg.append("div")
      .attr("class", "x axis")
      .style("margin-left", this.options.yWidth + "px");

    this.yAxisElement = this.svg.append("div")
      .attr("class", "y axis")
      .style("padding-bottom", this.options.padding + "px")
      .style("padding-top", this.options.padding + 15 + "px");

    this.svg.append("div")
      .attr("class", "bars")
      .style("margin-left", this.options.yWidth + "px")
      .style("padding-bottom", this.options.padding + "px")
      .style("padding-top", this.options.padding + 15 + "px");

    d3.select(self.el).append('div').attr('class', 'hoverbox');

  },
  update: function (data) {
    var self = this;
    this.data = data;
    var y = this.options.y;
    var x = this.options.x;
    data.forEach(function (d) {
      if(d[x] != null){
        d[x] = +d[x];
      }
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
      .attr("geodash-id", function (d) { return d[y]; })
      .style("left", function(d) {
        var xposition = self.x(Math.min(0, d[x]));
        if(xposition === self.x(0)) {
          xposition += 1;
        }
        return xposition + 'px';;
      })
      .style("margin-top", function (d, i) { 
        return self.options.padding + 'px';
      })
      .style("width", function(d) {
        var w = Math.abs(self.x(d[x]) - self.x(0));
        return w + 'px';
      })
      .style("height", function(d){
        return self.options.barHeight + "px";
      })
      .style("opacity", function(d){
        for(var i = 0; i < self.options.highlight.length; i++){
          if(self.options.highlight[i] == d[y]) return 1;
        }
        return self.options.opacity;
      })
      .style("border-top-right-radius", function(d){
        var r = 0;
        var xposition = self.x(Math.min(0, d[x]));
        if(xposition >= self.x(0)) {
          r = self.options.roundRadius;
        }
        return r + 'px';
      })
      .style("border-bottom-right-radius", function(d){
        var r = 0;
        var xposition = self.x(Math.min(0, d[x]));
        if(xposition >= self.x(0)) {
          r = self.options.roundRadius;
        }
        return r + 'px';
      })
      .style("border-top-left-radius", function(d){
        var r = 0;
        var xposition = self.x(Math.min(0, d[x]));
        if(xposition < self.x(0)) {
          r = self.options.roundRadius;
        }
        return r + 'px';
      })
      .style("border-bottom-left-radius", function(d){
        var r = 0;
        var xposition = self.x(Math.min(0, d[x]));
        if(xposition < self.x(0)) {
          r = self.options.roundRadius;
        }
        return r + 'px';
      })
      .style("background-color", function(d) { return self.color(d[y]); })

    bars.enter().append("div")
      .attr("class", "bar")
      .attr("geodash-id", function (d) { return d[y]; })
      .style("left", function(d) {
        var xposition = self.x(Math.min(0, d[x]));
        if(xposition === self.x(0)) {
          xposition += 1;
        }
        return xposition + 'px';;
      })
      .style("margin-top", function (d, i) { 
        return self.options.padding + 'px';
      })
      .style("width", function(d) {
        var w = Math.abs(self.x(d[x]) - self.x(0));
        return w + 'px';
      })
      .style("height", function(d){
        return self.options.barHeight + "px";
      })
      .style("opacity", function(d){
        for(var i = 0; i < self.options.highlight.length; i++){
          if(self.options.highlight[i] == d[y]) return 1;
        }
        return self.options.opacity;
      })
      .style("border-top-right-radius", function(d){
        var r = 0;
        var xposition = self.x(Math.min(0, d[x]));
        if(xposition >= self.x(0)) {
          r = self.options.roundRadius;
        }
        return r + 'px';
      })
      .style("border-bottom-right-radius", function(d){
        var r = 0;
        var xposition = self.x(Math.min(0, d[x]));
        if(xposition >= self.x(0)) {
          r = self.options.roundRadius;
        }
        return r + 'px';
      })
      .style("border-top-left-radius", function(d){
        var r = 0;
        var xposition = self.x(Math.min(0, d[x]));
        if(xposition < self.x(0)) {
          r = self.options.roundRadius;
        }
        return r + 'px';
      })
      .style("border-bottom-left-radius", function(d){
        var r = 0;
        var xposition = self.x(Math.min(0, d[x]));
        if(xposition < self.x(0)) {
          r = self.options.roundRadius;
        }
        return r + 'px';
      })
      .style("background-color", function(d) { return self.color(d[y]); });

    bars.exit().remove();

    if(this.options.drawX){
      var ticks = this.x.ticks(self.options.numberTicks);
      var tickElements = this.xAxisElement
        .selectAll(".tick")
        .data(ticks);

      tickElements.transition()
        .style("left", function(d) {
          return self.x(d) + 'px';
        });

      var newTicks = tickElements.enter().append('div')
        .attr("class", "tick")
        .style("left", function(d) {
          return self.x(d) + 'px';
        })
        .style("height", "100%");

      tickElements.exit().remove();

      newTicks
        .append('div')
        .attr("class", "gd-label")
        .text(function(d){
          var label = '';
          if (self.options.percent) {
            label = self.formatPercentAxisLabel(d);
            var x = parseFloat(label);
            if(x%1 < .001 && x%1 > 0){
              x = x.toFixed(0);
              label = x + "%";
            }
          } else {
            label = self.formatLarge(d);
            if (self.options.money) {
              label = '$' + label;
            }
          }
          return label;
        })
        .style("margin-left", function(d){
          //center labels using negative left margin
          var width = d3.select(this).style('width');
          var m = (parseInt(width)/2*-1);
          return m + 'px';
        });

      newTicks
        .append('div')
        .attr("class", "line")
        .style("height", "100%");
    }

    if (this.options.drawY) {
      var labels = this.y.domain();
      var labelElements = this.yAxisElement
        .selectAll(".gd-label")
        .data(labels);

      labelElements.transition()
        .style("margin-top", function (d, i) { 
          return self.options.padding + 'px';
        })
        .style("height", function(d){
          return self.options.barHeight + "px";
        })
        .style("line-height", function(d){
          return self.options.barHeight + "px";
        })
        .style("padding-right", function(d, i){
          var value = self.data[i][x];
          var width = parseInt(d3.select(self.el).select('.bars').style("width"));
          var barw = Math.abs(self.x(value) - self.x(0));
          var left = self.x(Math.min(0, value));
          var p = (width - left) + 2;
          return p + "px";
        })
        .text(function(d){
          return d;
        });


      labelElements.enter().append('div')
        .attr("class", "gd-label")
        .style("margin-top", function (d, i) { 
          return self.options.padding + 'px';
        })
        .style("height", function(d){
          return self.options.barHeight + "px";
        })
        .style("line-height", function(d){
          return self.options.barHeight + "px";
        })
        .style("padding-right", function(d, i){
          var value = self.data[i][x];
          var width = parseInt(d3.select(self.el).select('.bars').style("width"));
          var barw = Math.abs(self.x(value) - self.x(0));
          var left = self.x(Math.min(0, value));
          var p = (width - left) + 2;
          return p + "px";
        })
        .text(function(d){
          return d;
        })
        .on('mouseover', function (d, i) {
          var label = d;
          var value = self.data[i][x];
          var bar = d3.select(self.el).selectAll('.bar')[0][i];
          d3.select(bar).style('opacity', 0.9);
          var format = '';
          if(value !== null){
            if (self.options.percent) {
              format = self.formatPercent(value);
            } else {
              format = self.formatComma(value);
              var f = parseFloat(format);
              if(f%1 === 0){
                format = format.split(".")[0];
              }
              if (self.options.money) {
                format = '$' + format;
              }
            }
          } else {
            format = 'No Data';
          }
          d3.select(self.el).select('.hoverbox').html(label + ': ' + format);
          d3.select(self.el).select('.hoverbox').transition().style('display', 'block');
        }).on('mouseout', function (d, i) {
          var opacity = self.options.opacity;
          for(var j = 0; j < self.options.highlight.length; j++){
            if(self.options.highlight[j] == d) opacity =  1;
          }
          var bar = d3.select(self.el).selectAll('.bar')[0][i];
          d3.select(bar).style('opacity', opacity);
          d3.select(self.el).select('.hoverbox').transition().style('display', 'none');
        });

      labelElements.exit().remove();
    }
  },
  setColor: function(colors) {
    this.options.barColors = colors;
  }
});
