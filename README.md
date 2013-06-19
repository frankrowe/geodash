GeoDash
=======

A modern charting and mapping library for the web.

Requirements
 - D3.js

#### Bar Chart
```javascript
var barchart = new GeoDash.BarChart('.chart', {
  x: 'county',
  y: 'popchange',
  barColor: '#A8DBA8'
});
```

#### Line Chart
```javascript
var linechart = new GeoDash.LineChart(".chart", {
  x: 'date',
  y: 'stat',
  width: 'auto',
  height: 255,
  colors: ['#d80000', '#006200']
});
```

#### Example
```javascript
var data = [{
    'name': 'frank',
    'score': 999999
  },{
    'name': 'tu',
    'score': 4
  },{
    'name': 'josh',
    'score': 3
}];

var barchart = new GeoDash.BarChart('.chart', {
  x: 'name',
  y: 'score',
  barColor: '#f00'
});

barchart.update(data);
```
