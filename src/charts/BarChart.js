//BarChart extends Chart
GeoDash.BarChart = GeoDash.Chart.extend({
  options: {
    activeBar: -1
    , colors: ['#f00']
    , percent: false
    , title: false
    , money: false
    , opacity: 0.7
    // border-radius value to round bars
    , roundRadius: 3
    // bars to highlight
    , highlight: []
    // add label to end of bar
    , barLabels: false
    // padding before and after bars. used in d3.scale.ticks
    , outerPadding: 0.5
  }
})
