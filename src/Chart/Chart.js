GeoDash.Chart = function(el, options) {
  this.el = el;
  this.setOptions(options);
  this.drawChart();
}

GeoDash.Chart.prototype.setOptions = function(options) {
  for (var key in this.defaults) {
    if (this.defaults.hasOwnProperty(key)) {
      if(options[key] === undefined) {
        options[key] = this.defaults[key];
      }
    }
  }
  this.options = options;
}

GeoDash.Chart.prototype.drawChart = function() {};

GeoDash.Chart.prototype.update = function() {};