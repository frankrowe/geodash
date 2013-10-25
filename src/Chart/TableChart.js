//BarChart extends Chart
GeoDash.TableChart = ezoop.ExtendedClass(GeoDash.Chart, {
  className: 'TableChart',
  defaults: {
    highlight: []
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
      this.height = this.height - 30;
    }
    this.formatPercent = d3.format(".2%");
    this.formatPercentAxisLabel = d3.format(".0%");
    this.formatLarge = d3.format("s");
    this.formatComma = d3.format(",.2f");
    this.table = d3.select(this.el).append("table")
      .attr("width", this.width + this.margin.left + this.margin.right)
      //.attr("height", this.height + this.margin.top + this.margin.bottom)
      .attr("class", "table table-condensed table-bordered gd-table");

    this.tbody = this.table.append("tbody");
  },
  update: function (data) {
    var self = this;
    var rows = this.tbody.selectAll("tr")
      .data(data)
      .attr("style", function(d){
        var name = d[self.options.columns[0]];
        for(var i = 0; i < self.options.highlight.length; i++){
          if(self.options.highlight[i] == name) {
            return 'background:' + self.options.color;
          }
        }
        return '';
      });

    rows.enter()
      .append("tr")
      .attr("style", function(d){
        var name = d[self.options.columns[0]];
        for(var i = 0; i < self.options.highlight.length; i++){
          if(self.options.highlight[i] == name) {
            return 'background:' + self.options.color;
          }
        }
        return '';
      });

    rows.exit().remove();

    var cells = rows.selectAll("td")
      .data(function(row) {
        return self.options.columns.map(function(column) {
          return {column: column, value: row[column]};
        });
      });

    cells.transition()
      .text(function(d) { 
        return self.format(d);
      });

    cells.enter()
      .append("td")
      .text(function(d) { 
        return self.format(d);
      });

    cells.exit().remove();
    
    return this;
  },
  format: function(d){
    var display = '';
    var self = this;
    if(d.value === null) {
      display = 'No Data';
      return display;
    }
    if(parseFloat(d.value) > 0 && parseFloat(d.value) <= 1 && self.options.percent) {
      display = self.formatPercent(d.value); //value is percent
    } else if(isNaN(parseFloat(d.value))){
      display = d.value; //value is string
    } else {
      display = self.formatComma(d.value);
      var f = parseFloat(display);
      if(f%1 === 0){
        display = display.split(".")[0];
      }
      if (self.options.money) {
        display = '$' + display;
      }
    }
    return display;
  }
});
