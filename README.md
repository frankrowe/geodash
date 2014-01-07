GeoDash.js
=======

A modern charting and mapping library for the web. (A D3 wrapper for lazy charts.)

http://apps.esrgc.org/dashboards/geodash/

This is an alpha build under heavy development. Expect API breaks in new versions.

![Image](test/geodashcharts2.png?raw=true)


Requirements
 - D3.js

#### Bar Chart
```javascript
var barchart = new GeoDash.BarChartVertical('.barchart', {
  x: 'name'
  , y: 'score'
  , barColors: ['#f00']
  , title: 'Horizontal Bar Chart'
  , drawX: true
  , drawY: true
  , verticalX: true
  , money: true
  , numberTicks: 5
  , yWidth: 6
})

var data = [
  {
    'name': 'steve'
    , 'score': 999999
  }
  ,{
    'name': 'woz'
    , 'score': 4
  }
  ,{
    'name': 'jonny'
    , 'score': 3
  }
]

barchart.update(data)
```

#### Line Chart
```javascript
var linechart = new GeoDash.LineChart(".linechart", {
  x: 'date'
  , y: 'numCats'
  , width: 'auto'
  , height: 'auto'
  , colors: ["#f00", "#00f"]
  , title: 'Line Chart'
  , interpolate: 'monotone'
  , dotRadius: 3
  , xInterval: 
})

var data = [
  {
    "date":"2011-01-01T05:00:00.000Z"
    , "numCats":159773
    , "goalCats": 100000
  }
  ,{
    "date":"2012-01-01T05:00:00.000Z"
    , "numCats":70920
    , "goalCats": 100000
  }
  ,{
    "date":"2013-01-01T05:00:00.000Z"
    , "numCats":97755
    , "goalCats": 100000
  }
]

linechart.update(data)
```

#### Pie Chart
```javascript
var piechart = new GeoDash.PieChart('.piechart', {
  label: 'source'
  , value: 'percent'
  , colors: ["#b30000", "#e60000", "#ff4d4d"]
  , opacity: 0.7
  , innerRadius: 10
  , title: 'Pie Chart'
  , hover: true
})

var data = [
  {
    "source":"lol",
    "percent":2
  }
  ,{
    "source":"cats",
    "percent":96
  }
  ,{
    "source":"#woah",
    "percent":2
  }
]

piechart.update(data)
```
