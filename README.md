GeoDash.js
=======

An interactive chart library.
Builit on d3.js.

http://apps.esrgc.org/dashboards/geodash/

This is an alpha build under heavy development. Expect API breaks in new versions.

![Image](test/geodashcharts3.png?raw=true)


#### Bar Chart
```javascript
var barchartvertical = new GeoDash.BarChartVertical('.barchartvertical', {
  x: 'id'
  , y: ['2011', '2012', '2013']
  , barColors: ["#ef3b2c","#cb181d","#a50f15"]
  , title: 'Vertical Bar Chart'
})

var verticaldata = [
  {
    "id": "Mon",
    "2011": "42235.7",
    "2012": "42235.7",
    "2013": "42235.7"
  },
  {
    "id": "Tue",
    "2011": "165113.8",
    "2012": "42235.7",
    "2013": "42235.7"
  }
]

barchartvertical.update(verticaldata)
```

#### Line Chart
```javascript
var linechart = new GeoDash.LineChart(".linechart", {
  x: 'date'
  , y: ['numCats', 'goalCats']
  , colors: colors
  , title: 'Line Chart'
  , interpolate: 'monotone'
  , xInterval: 5
  , xFormat: d3.time.format("%Y")
  , dashed: [{
    line: 0,
    span: {
      start: 1,
      howMany: 3
    }
  }]
})

var parseDate = d3.time.format("%Y").parse
var linedata = [
  {
    "date":parseDate("2007"),
    "numCats":92817,
    "goalCats": 100000
  },
  {
    "date":parseDate("2008"),
    "numCats":82705,
    "goalCats": 100000
  }
]

linechart.update(linedata)
```

#### Pie Chart
```javascript
var piechart = new GeoDash.PieChart('.piechart', {
  label: 'id'
  , value: 'value'
  , colors: colors
  , opacity: 0.8
  , legend: true
  , title: 'Pie Chart'
})

var piedata = [
  {
    "id":"lol",
    "value":33
  },
  {
    "id":"cats",
    "value":11
  },
  {
    "id":"cool",
    "value":2
  }
]

piechart.update(piedata)
```
