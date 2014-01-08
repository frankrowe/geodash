/*
Chart base class
*/
GeoDash.Chart = ezoop.BaseClass({
  className: 'Chart'
  , initialize: function (el, options) {
    this.el = el
    this.options = {}
    this.setOptions(options)
    this.makeTitle()
    this.setUpChart()
    this.drawChart()
  }
  , setOptions: function (options) {
    for (var key in this.defaults) {
      if (this.defaults.hasOwnProperty(key)) {
        if (options[key] === undefined) {
          options[key] = this.defaults[key]
        }
      }
    }
    this.options = options
  }
  , setUpChart: function(){
    d3.select(this.el).style('position', 'relative')
  }
  , drawChart: function () {}
  , update: function () {}
  , makeTitle: function () {
    if (this.options.title) {
      var html = '<div class="geodash-title">'
        + this.options.title
        + '</div>'
      d3.select(this.el).html(html)
    }
  }
  ,getData: function() {
    return this.data
  }
  , setWidth: function () {
    this.width = parseInt(d3.select(this.el).style('width'))
    this.width = this.width - this.margin.left - this.margin.right
  }
  , setHeight: function() {
    this.height = parseInt(d3.select(this.el).style('height'))
    this.height = this.height - this.margin.top - this.margin.bottom
    if (this.options.title) {
      this.height = this.height - 30
    }

  }
})