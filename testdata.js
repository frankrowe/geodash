function makeid() {
  var text = ''
    , possible = 'abcdefghijklmnopqrstuvwxyz';
  for( var i=0; i < 5; i++ ) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

function randomize(negatives) {
  var datalength = Math.floor((Math.random()*10)+1)
  var newdata = []
  for (var i = 0; i <= datalength; i++) {
    var obj = {}
    obj.value = Math.floor((Math.random()*100000)+1)
    obj.value2 = Math.floor((Math.random()*100000)+1)
    obj.value3 = Math.floor((Math.random()*100000)+1)
    obj.id = makeid()
    if (!negatives) {
      if (obj.value < 0) obj.value *= -1
      if (obj.value2 < 0) obj.value *= -1
      if (obj.value3 < 0) obj.value *= -1
    }
    newdata.push(obj)
  }
  var addnegative = Math.floor((Math.random()*4)+1)
  if(addnegative === 2) {
    newdata[Math.floor((Math.random()*datalength)+1)].value *= -1
  }
  return newdata
}

function pierandomize(data) {
  var newdata = []
  for (var i = 0; i < data.length; i++) {
    var obj = data[i]
    obj.value = Math.floor((Math.random()*100)+1)
    newdata.push(obj)
  }
  return newdata
}

function randomizeLine() {
  var newdata = linedata
  for (var i = 0; i < newdata.length; i++) {
    newdata[i].numCats = Math.floor((Math.random()*150000)+1)
  }
  return newdata
}

function sort(data){
  data.sort(function(a, b) {
    console.log(a, b)
    var atotal = a.value
    var btotal = b.value
    if (atotal > btotal)
      return 1
    if (atotal < btotal)
      return -1
    return 0
  })
  return data
}

window.onload = function() {
  document.getElementById('randomize4').onclick = function() {
    piechart.update(randomize(false))
    //piechart.update(piedata3)
  }

  document.getElementById('randomize').onclick = function() {
    barchartvertical2.update(randomize(true))
  }

  document.getElementById('sort').onclick = function() {
    var data = barchartvertical2.getData()
    barchartvertical2.update(sort(data))
  }

  document.getElementById('randomize2').onclick = function() {
    barcharthorizontal2.update(randomize(false))
  }

  document.getElementById('randomize3').onclick = function() {
    linechart2.update(randomizeLine())
  }

  $('.swatch').on('mouseover', function(){
    var color = $(this).attr('id')
    $('.swatch').removeClass('active')
    $(this).addClass('active')
    Dashboard.charts.forEach(function(chart){
      chart.setColor(Dashboard.colors[color])
      chart.refresh()
    })
  })
  $('.swatch').on('mouseout', function(){
    //$(this).removeClass('active')
  })
}

var verticaldata = [
  {
    'id': 'Mon',
    '2011': '42235.7',
    '2012': '42235.7',
    '2013': '42235.7'
  },
  {
    'id': 'Tue',
    '2011': '165113.8',
    '2012': '42235.7',
    '2013': '42235.7'
  },
  {
    'id': 'Wed',
    'geocode': '45',
    '2011': '64447.3',
    '2012': '42235.7',
    '2013': '42235.7'
  },
  {
    'id': 'Thu',
    '2011': '12444.0',
    '2012': '42235.7',
    '2013': '42235.7'
  },
  {
    'id': 'Fri',
    '2011': '22444.0',
    '2012': '42235.7',
    '2013': '42235.7'
  },
  {
    'id': 'Sat',
    '2011': '62444.0',
    '2012': '42235.7',
    '2013': '42235.7'
  },
  {
    'id': 'Sun',
    '2011': '92444.0',
    '2012': '42235.7',
    '2013': '42235.7'
  }
]

var piedata = [
  {
    'id':'lol',
    'value':33
  },
  {
    'id':'cats',
    'value':11
  },
  {
    'id':'cool',
    'value':2
  }
]

var piedata2 = [
  {
    'id':'lol',
    'value':33
  },
  {
    'id':'cats',
    'value':11
  },
  {
    'id':'cool',
    'value':6
  }
]

var piedata3 = [
  {
    'id':'lol',
    'value':33
  },
  {
    'id':'cats',
    'value':11
  },
  {
    'id':'cool',
    'value':6
  },
  {
    'id':'cool2',
    'value':14
  }
]

var parseDate = d3.time.format('%Y').parse
var linedata = [
  {
    'date':parseDate('2007'),
    'numCats':92817,
    'goalCats': 100000
  },
  {
    'date':parseDate('2008'),
    'numCats':82705,
    'goalCats': 100000
  },
  {
    'date':parseDate('2009'),
    'numCats':75920,
    'goalCats': 100000
  },
  {
    'date':parseDate('2010'),
    'numCats':76920,
    'goalCats': 100000
  },
  {
    'date':parseDate('2011'),
    'numCats':84123,
    'goalCats': 100000
  },
  {
    'date':parseDate('2012'),
    'numCats':99109,
    'goalCats': 100000
  },
  {
    'date':parseDate('2013'),
    'numCats':145897,
    'goalCats': 100000
  }
]

var horizontaldata = [
  {
    'geo': 'Allegany',
    'geocode': '1',
    '2011': '74,692',
    '2012': '73,692',
    '2013': '444403'
  },
  {
    'geo': 'Anne Arundel',
    'geocode': '3',
    '2011': '544403',
    '2012': '444403',
    '2013': '444403'
  },
  {
    'geo': 'Baltimore City',
    'geocode': '510',
    '2011': '619493',
    '2012': '519493',
    '2013': '444403'
  },
  {
    'geo': 'Baltimore',
    'geocode': '5',
    '2011': '809941',
    '2012': '709941',
    '2013': '444403'
  },
  {
    'geo': 'Calvert',
    'geocode': '9',
    '2011': '89256',
    '2012': '79256',
    '2013': '444403'
  },
  {
    'geo': 'Caroline',
    'geocode': '11',
    '2011': '32985',
    '2012': '22985',
    '2013': '444403'
  }
]