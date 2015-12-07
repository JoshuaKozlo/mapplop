var headlineState = document.getElementById('nav-headline');
alert('some-unique-string')
var isMobile = {
    Android: function() {
        return navigator.userAgent.match(/Android/i);
    },
    BlackBerry: function() {
        return navigator.userAgent.match(/BlackBerry/i);
    },
    iOS: function() {
        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
    },
    Opera: function() {
        return navigator.userAgent.match(/Opera Mini/i);
    },
    Windows: function() {
        return navigator.userAgent.match(/IEMobile/i);
    },
    any: function() {
        return (isMobile.Android() || isMobile.BlackBerry() || isMobile.iOS() || isMobile.Opera() || isMobile.Windows());
    }
};

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
      return d.properties.venue_count * projection.scale() * .0003 + .4;
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

var sg = g.append('g');

var cg = g.append('g');

d3.json("/static/json/USA.json", function(us) {
  sg.selectAll(".state")
      .data(topojson.feature(us, us.objects.ne_10m_USA_states).features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", function(d) {
        return 'state ' + d.id
      })
      .on("click", stateClicked);
});

if(isMobile.any() == null) {

    d3.json('/getCities/', function(city) {
      cg.selectAll('.city')
        .data(city.features)
      .enter().append('path')
        .attr('d', path)
        .attr('class', function(d) {
          return 'city ' + d.properties.name;
        })
        .attr('fill', '#C54B51')
        .on('click', cityClicked)
        .append('title')
          .text(function(d) { return d.properties.name; });

      cg.selectAll('.place-label')
          .data(city.features)
        .enter().append('text')
          .style('color', 'red')
          .style('font-size', '1rem')
          .attr('class', 'place-label')
          .attr('transform', function(d) { return "translate(" + projection(d.geometry.coordinates) + ")";})
          .attr("dx", ".1rem")
          .text(function(d) {
            if (d.properties.population > 500000) {
              return d.properties.name;
            } 
          })

    });
}

d3.select(window).on('resize', resize);

function stateClicked(d) {
  if (activeState.node() === this && activeCity.node() === null) return reset();
  activeCity.classed('activeCity', false)
  activeCity = d3.select(null);
  activeState.classed("activeState", false);
  activeState = d3.select(this).classed("activeState", true);
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
  getVenues('state', d);
  cg.selectAll('.place-label')
    .style('font-size', 1.5 / scale + 'rem')
}


function cityClicked(d) {
  if (activeCity.node() === this) {
      return;
  } else {
      activeCity.classed('activeCity', false);
      activeCity = d3.select(this).classed('activeCity', true);
      headlineState.innerHTML = d.properties.name + ', ' + d.properties.state;
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

  headlineState.innerHTML = 'United States';
  getVenues('US');
  cg.selectAll('.place-label')
    .style('font-size', '1rem')
}

function resize() {
  width = parseInt(d3.select('.map').style('width'));
  width = width - margin.left - margin.right;
  height = width * mapRatio;

  projection 
    .translate([width / 2, height / 2])
    .scale(width);

  path.pointRadius(function(d) {
      return d.properties.venue_count * projection.scale() * .0003;
    });

  svg
    .style('width', width + 'px')
    .style('height', height + 'px');

  svg.select('rect')
    .attr('width', width)
    .attr('height', height);

  g.selectAll('.state').attr('d', path);
  g.selectAll('.city').attr('d', path);
  g.selectAll('.place-label')
    .attr('transform', function(d) { 
      return "translate(" + projection(d.geometry.coordinates) + ")"; 
  });
  reset();
}


function layoutUS(d) {
  var state,
      city;

  $('.data').empty();
  
  for (i = 0; i < d.length; i++) {
    if (d[i].city_state[1] === state && d[i].city_state[0] === city) {
      $('.' + row).append(venueDiv(d[i]));
    } 
    else {
      city = d[i].city_state[0];
      state = d[i].city_state[1];
      row = 'row-' + i;

      $('.data').append( "<h1 class='city-state col-xs-12'>- " + d[i].city_state[0] + ', ' + d[i].city_state[1] + " -</h1>");
      $('.data').append( "<div class='row " + row + "'></div>" )
      $('.' + row).append(venueDiv(d[i]));

    };
  }
  $('.venue:only-child').addClass('col-lg-offset-4');
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

function venueDiv(d) {
  var fullAddress = d.street + ' ' + d.city_state[0] + ' ' + d.city_state[1];
  var gmap = 'https://www.google.com/maps/place/' + fullAddress.split(' ').join('+'); 
  var div = '<div class="venue col-lg-4 col-md-6 col-xs-12 col-centered">' +
              '<h1>' + d.name + '</h1>' +
              '<a target="_blank" href="http://www.' + d.website + '">' +
                '<img class="center-block" src="' + d.image + '">' +
              '</a>' +
              '<a target="_blank" href="' + gmap + '">' +
                '<h2 class="street">-' + d.street + '-</h2>' +
              '</a>' +
            '</div>'
  return div
}

$(document).ready(function(){
    getVenues('US');   
});
