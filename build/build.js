var fs = require('fs')
  , UglifyJS = require('uglify-js')
  , lesscss = require('less')

var result = UglifyJS.minify([
    "../src/lib/ezoop.js"
    , "../src/GeoDash.js"
    , "../src/Chart/Chart.js"
    , "../src/Chart/TableChart.js"
    , "../src/Chart/LineChart.js"
    , "../src/Chart/PieChart.js"
    , "../src/Chart/BarChartHorizontal.js"
    , "../src/Chart/BarChartVertical.js"
  ],{
    outSourceMap: "GeoDash.js.map"
    , output: { beautify: true}
})

fs.writeFile('../dist/GeoDash.min.js', result.code, function (err) {
  if (err) throw err
  console.log('../dist/GeoDash.min.js saved!')
})

var parser = new(lesscss.Parser)({
    paths: ['../src/Styles']
})

fs.readFile('../src/Styles/chart.less', 'utf8', function(err, less){
  parser.parse(less, function (err, tree) {
    if (err) { return console.error(err) }
    var css = tree.toCSS({ compress: true })
    fs.writeFile('../dist/GeoDash.min.css', css, function (err) {
      if (err) throw err
      console.log('../dist/GeoDash.min.css saved!')
    })
  })
})