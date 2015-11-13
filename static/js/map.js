var headlineState = document.getElementById('level1');

var margin = {top: 10, left: 10, bottom: 10, right: 10},
    width = parseInt(d3.select('.map').style('width'))
    width = width - margin.left - margin.right,
    mapRatio = .46,
    height = width * mapRatio,
    active = d3.select(null);

var projection = d3.geo.albersUsa()
    .scale(width)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection)
    .pointRadius(function(d) {
      return d.properties.venue_count * .75;
    });

var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height);

svg.append("rect")
    .attr("class", "background")
    .attr("width", width)
    .attr("height", height)
    .on("click", reset);

var g = svg.append("g")
    .style("stroke-width", ".07px");


d3.json("/static/json/USA.json", function(us) {
  g.selectAll(".state")
      .data(topojson.feature(us, us.objects.ne_10m_USA_states).features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", function(d) {
        return 'state ' + d.id
      })
      .on("click", clicked);

  // g.append("path")
  //     .datum(topojson.mesh(us, us.objects.ne_10m_USA_states, function(a, b) { return a !== b; }))
  //     .attr("class", "mesh")
  //     .attr("d", path);
});

d3.json('/getCities/', function(city) {
  g.selectAll('.city')
    .data(city.features)
  .enter().append('path')
    .attr('d', path)
    .attr('class', function(d) {
      return 'city ' + d.properties.name;
    })
    .attr('fill', '#C54B51')
    .on('mouseover', function(d) {
      headlineState.innerHTML = d.properties.name + ', ' + d.properties.state;
    })
});


// d3.json('/static/json/Roads.json', function(road) {
//   g.selectAll('.road')
//       .data(topojson.feature(road, road.objects.Interstate).features)
//     .enter().append('path')
//       .attr('d', path)
//       .attr('class', 'road')
//       .attr('fill', 'none')
//       .attr('stroke', '#FFF')
//       .attr('stroke-width', '.75px')
// });

d3.select(window).on('resize', resize);

function clicked(d) {
  if (active.node() === this) return reset();
  active.classed("active", false);
  active = d3.select(this).classed("active", true);
  // console.log(active.attr('class').split(' ')[1]);
  var bounds = path.bounds(d),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .9 / Math.max(dx / width, dy / height),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

  g.transition()
      .duration(1500)
      .style("stroke-width", .1 / scale + "px")
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");

  headlineState.innerHTML = d.properties.name;
  
}

function reset() {
  active.classed("active", false);
  active = d3.select(null);

  g.transition()
      .duration(1500)
      .style("stroke-width", ".07px")
      .attr("transform", "");

  headlineState.innerHTML = 'United States Of America';
}

function resize() {
  width = parseInt(d3.select('.map').style('width'));
  width = width - margin.left - margin.right;
  height = width * mapRatio;

  projection 
    .translate([width / 2, height / 2])
    .scale(width);

  svg
    .style('width', width + 'px')
    .style('height', height + 'px');

  svg.select('rect')
    .attr('width', width)
    .attr('height', height);

  g.selectAll('.state').attr('d', path);
  g.selectAll('.city').attr('d', path);

}

function getVenues(d) {
  $.getJSON('/getVenues/', { level : d })
    .done(function(json) {
      console.log(json);
      layoutUS(json)
    });
}




function layoutUS(d) {
  var state,
      city 
  
  for (i = 0; i < d.length; i++) {
    if (d[i].city_state[1] === state) {
      $('.list').append( "<h2 class='venue col-md-4'>" + d[i].name + "</h2>");
    } 
    else{
      state = d[i].city_state[1];
      $('.list').append( "<h1 class='venue col-md-12'>" + d[i].city_state[0] + ', ' + d[i].city_state[1] + "</h1>");
      $('.list').append( "<h2 class='venue col-md-4'>" + d[i].name + "</h2>");

    };
  }
}

getVenues('NY');