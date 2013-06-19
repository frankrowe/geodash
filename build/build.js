var fs = require('fs'),
    UglifyJS = require('uglify-js'),
    lesscss = require('less');

var result = UglifyJS.minify(["../src/GeoDash.js", "../src/Chart/Chart.js", "../src/Chart/BarChart.js", "../src/Chart/LineChart.js"], {
  outSourceMap: "GeoDash.js.map",
  output: { beautify: true}
});
fs.writeFile('../dist/GeoDash.min.js', result.code, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});

fs.writeFile('../dist/GeoDash.js.map', result.map, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});

fs.readFile('../src/Styles/chart.less', 'utf8', function(err, less){
  lesscss.render(less, function (e, css) {
    fs.writeFile('../dist/GeoDash.min.css', css, function (err) {
      if (err) throw err;
      console.log('It\'s saved!');
    });
  });
})