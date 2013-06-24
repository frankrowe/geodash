GeoDash.js
=======

A modern charting and mapping library for the web. (A D3 wrapper for lazy charts.)

![Image](test/geodashcharts.png?raw=true)


Requirements
 - D3.js

#### Bar Chart
```javascript
var barchart = new GeoDash.BarChart('.barchart', {
  x: 'name',
  y: 'score',
  barColor: '#f00'
});

var data = [{
    'name': 'steve',
    'score': 999999
  },{
    'name': 'woz',
    'score': 4
  },{
    'name': 'jonny',
    'score': 3
}];

barchart.update(data);
```

#### Line Chart
```javascript
var linechart = new GeoDash.LineChart(".linechart", {
  x: 'date',
  y: 'numCats',
  width: 'auto',
  height: 255,
  colors: ['#d80000', '#006200'],
  interpolate: 'monotone',
  dotRadius: 3
});

var data = [{
    "date":"2011-01-01T05:00:00.000Z",
    "numCats":159773
  },{
    "date":"2012-01-01T05:00:00.000Z",
    "numCats":70920
  },{
    "date":"2013-01-01T05:00:00.000Z",
    "numCats":97755
}];

linechart.update(data);
```

#### Pie Chart
```javascript
var piechart = new GeoDash.PieChart('.piechart', {
  label: 'source',
  value: 'percent',
  colors: ["#d80000", "#0B6909", "#EDD70A"],
  innerRadius: 10
});

var data = [{
    "source":"lol",
    "percent":2
  },{
    "source":"cats",
    "percent":96
  },{
    "source":"#woah",
    "percent":2
}];

piechart.update(data);
```
