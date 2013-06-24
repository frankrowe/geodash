//PieChart extends Chart

GeoDash.PieChart = ezoop.ExtendedClass(GeoDash.Chart, {
  className: 'PieChart',
  defaults: {
    label: 'label',
    value: 'value',
    colors: ["#f00", "#0f0", "#00f"],
    innerRadius: 10,
    opacity: 1,
    drawX: true,
    drawY: true,
    title: false,
    padding: 10
  },
  initialize: function (el, options) {

  },
  drawChart: function(){
    var self = this;

    this.width = (this.options.width === 'auto' || this.options.width === undefined ? parseInt(d3.select(this.el).style('width')) : this.options.width);
    this.height = (this.options.height === 'auto' || this.options.width === undefined ? parseInt(d3.select(this.el).style('height')) : this.options.height);
    this.width = this.width - this.options.padding*2;
    this.height = this.height - this.options.padding*2;
    if(this.options.title) {
      this.height  = this.height - 21;
    }

    this.radius = Math.min(this.width, this.height) / 2.2;

    this.color = d3.scale.ordinal()
      .range(this.options.colors);

    this.x = d3.scale.ordinal()
      .range([0, this.width-2]);

    this.y = d3.scale.linear()
      .range([this.height-2, 0]);

    this.xAxis = d3.svg.axis()
      .scale(this.x)
      .orient("bottom")
      .tickSize(11,0,0)
      .tickFormat(function(d){
        return '';
      });

    this.yAxis = d3.svg.axis()
      .scale(this.y)
      .orient("left")
      //.ticks(0)
      .tickSize(11, 0, 0)
      .tickFormat(function(d){
        return '';
      });

    this.arc = d3.svg.arc()
      .outerRadius(this.radius)
      .innerRadius(this.options.innerRadius);

    this.pie = d3.layout.pie()
      .sort(null)
      .value(function(d) { return d[self.options.value]; });

    this.svg = d3.select(this.el).append("svg")
      .attr("width", this.width)
      .attr("height", this.height)
      .append("g")
        .attr("transform", "translate(" + this.width / 2 + "," + this.height / 2 + ")");
  },
  update: function(data){
    var self = this;
    data.forEach(function(d) {
      d[self.options.value] = +d[self.options.value];
    });

    this.x.domain([0, 1]);
    this.y.domain([0, 1]);

    this.xAxis.tickValues([0, 1]);
    this.yAxis.tickValues([0, 0]);

    if(this.options.drawX){
      this.svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(" + (this.width/2)*-1 + "," + 0 + ")")
        .call(this.xAxis);
      this.svg.select('.x.axis').selectAll(".tick")
        .attr("transform", "translate(0,-5)");
    }


    if(this.options.drawY){
      this.svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + 0 + "," + (this.height/2)*-1 + ")")
        .call(this.yAxis);
      this.svg.select('.y.axis').selectAll(".tick")
        .attr("transform", "translate(5,0)");
    }

    var g = this.svg.selectAll(".arc")
        .data(this.pie(data))
        .enter().append("g")
          .attr("class", "arc");

    g.append("path")
      .attr("d", this.arc)
      .style("fill", function(d) { return self.color(d.data[self.options.label]); })
      .style("fill-opacity", this.options.opacity)
      .on('mouseover', function(d,i){
        d3.select(self.el).select('.hoverbox').html(d.value + '%');
        d3.select(this).style('fill-opacity', 1);
      })
      .on('mouseout', function(d,i){
        d3.select(self.el).select('.hoverbox').html('');
        d3.select(this).style('fill-opacity', self.options.opacity  );
      });
  }
});