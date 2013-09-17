//BarChart extends Chart
GeoDash.TableChart = ezoop.ExtendedClass(GeoDash.Chart, {
  className: 'TableChart',
  defaults: {

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
    this.formatPercent = d3.format(".0%");
    this.formatLarge = d3.format("s");
    this.formatComma = d3.format(",");
    this.table = d3.select(this.el).append("table")
      .attr("width", this.width + this.margin.left + this.margin.right)
      //.attr("height", this.height + this.margin.top + this.margin.bottom)
      .attr("class", "table table-condensed table-bordered tablechart-svg");

    this.tbody = this.table.append("tbody");
  },
  update: function (data) {
    var self = this;
    var rows = this.tbody.selectAll("tr")
      .data(data);

    rows.enter()
      .append("tr");

    rows.exit().remove();

    var cells = rows.selectAll("td")
      .data(function(row) {
        return self.options.columns.map(function(column) {
          return {column: column, value: row[column]};
        });
      });

    cells.transition()
      .text(function(d) { 
        var display = '';
        if(parseFloat(d.value) > 0 && parseFloat(d.value) <= 1 && self.options.percent) {
          display = self.formatPercent(d.value); //value is percent
        } else if(isNaN(parseFloat(d.value))){
          display = d.value; //value is string
        } else {
          display = self.formatComma(d.value); //value is number
        }
        return display;
      });

    cells.enter()
      .append("td")
        .text(function(d) { 
          var display = '';
          if(parseFloat(d.value) > 0 && parseFloat(d.value) <= 1 && self.options.percent) {
            display = self.formatPercent(d.value); //value is percent
          } else if(isNaN(parseFloat(d.value))){
            display = d.value; //value is string
          } else {
            display = self.formatComma(d.value); //value is number
          }
          return display;
        });

    cells.exit().remove();
    
    return this;
  }
});
