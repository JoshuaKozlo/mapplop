var headlineState = document.getElementById('level1');

var margin = {top: 10, left: 10, bottom: 10, right: 10},
    width = parseInt(d3.select('.map').style('width'))
    width = width - margin.left - margin.right,
    mapRatio = .46,
    height = width * mapRatio,
    activeState = d3.select(null);
    activeCity = d3.select(null);

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
      .on("click", stateClicked);

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
    .on('click', cityClicked)
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


function stateClicked(d) {
  if (activeState.node() === this) return reset();
  activeCity.classed('activeCity', false)
  activeCity = d3.select(null);
  activeState.classed("activeState", false);
  activeState = d3.select(this).classed("activeState", true);
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

  headlineState.innerHTML = '<a href="#top">' + d.properties.name + '</a>';
  getVenues('state', d);
}


function cityClicked(d) {
  if (activeCity.node() === this) {
      return;
  } else {
      activeCity.classed('activeCity', false)
      activeCity = d3.select(this).classed('activeCity', true);
      headlineState.innerHTML = '<a href="#top">' + d.properties.name + ', ' + d.properties.state + '</a>';
  }
  getVenues('city', d);
}

function reset() {
  activeCity.classed('activeCity', false)
  activeCity = d3.select(null);
  activeState.classed("activeState", false);
  activeState = d3.select(null);

  g.transition()
      .duration(1500)
      .style("stroke-width", ".07px")
      .attr("transform", "");

  headlineState.innerHTML = '<a href="#top">United States Of America</a>';
  getVenues('US');
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


function layoutUS(d) {
  var state,
      city

  $('.data').empty();
  
  for (i = 0; i < d.length; i++) {
    if (d[i].city_state[1] === state && d[i].city_state[0] === city) {
      $('.' + row).append( "<h2 class='venue col-md-4 col-xs-12 col-centered'>" + d[i].name + "</h2>");
    } 
    else {
      city = d[i].city_state[0];
      state = d[i].city_state[1];
      row = 'row-' + i

      $('.data').append( "<h1 class='city-state col-xs-12'>~ " + d[i].city_state[0] + ', ' + d[i].city_state[1] + " ~</h1>");
      $('.data').append( "<div class='row " + row + "'></div>" )
      $('.' + row).append( "<h2 class='venue col-md-4 col-xs-12 col-centered'>" + d[i].name + "</h2>");

    };
  }
}



function getVenues(level, d) {
  var data
  if ( level === 'US' ) {
    data = {'scale' : 'US'}
  } else if ( level === 'state' ) {
    data = {'scale' : 'state', 'state' : d.id}
  } else {
    data = {'scale' : 'city', 'state' : d.properties.state, 'city' : d.properties.name}
  }
  $.getJSON('/getVenues/', data)
    .done(function( json ) {
      layoutUS(json);
    });
}


getVenues('US');



