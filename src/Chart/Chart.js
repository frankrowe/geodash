/*
Chart base class
*/
GeoDash.Chart = GeoDash.Class({
    className: 'Chart',
    initialize: function (el, options) {
        this.el = el;
        this.options = {};
        this.setOptions(options);
        this.makeTitle();
        this.drawChart();
    },
    setOptions: function (options) {
        for (var key in this.defaults) {
            if (this.defaults.hasOwnProperty(key)) {
                if (options[key] === undefined) {
                    options[key] = this.defaults[key];
                }
            }
        }
        this.options = options;
    },
    drawChart: function () { },
    update: function () { },
    makeTitle: function () {
        if (this.options.title) {
            var html = '<div class="title">';
            html += this.options.title;
            html += '</div>';
            d3.select(this.el).html(html);
        }
    }
});