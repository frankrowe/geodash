var fs = require('fs'),
    UglifyJS = require('uglify-js');

var result = UglifyJS.minify(["../src/GeoDash.js", "../src/Chart/Chart.js"]);
fs.writeFile('../dist/GeoDash.min.js', result.code, function (err) {
  if (err) throw err;
  console.log('It\'s saved!');
});