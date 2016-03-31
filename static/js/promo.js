var state = document.getElementById("state").innerHTML,
	city = document.getElementById("city").innerHTML,
	statefile = '/static/json/states/' + state + '.json'

var margin = {top: 10, left: 10, bottom: 10, right: 10},
    cachedWidth = $(window).width(),
    width = parseInt(d3.select('.map').style('width')),
    width = width - margin.left - margin.right,
    mapRatio = .2,
    height = width * mapRatio
    bound = null,
    translate = null,
    scale = null;

var projection = d3.geo.albersUsa()
    .scale(width)
    .translate([width / 2, height / 2]);


var path = d3.geo.path()
    .projection(projection)
    .pointRadius(1.5);

var svg = d3.select(".map").append("svg")
    .attr("width", width)
    .attr("height", height);

var g = svg.append("g")
    .style("stroke-width", ".07px");


d3.json(statefile, function(us) {
	    bounds = path.bounds(topojson.feature(us, us.objects.ne_10m_USA_states).features[0]),
      dx = bounds[1][0] - bounds[0][0],
      dy = bounds[1][1] - bounds[0][1],
      x = (bounds[0][0] + bounds[1][0]) / 2,
      y = (bounds[0][1] + bounds[1][1]) / 2,
      scale = .9 / Math.max(dx / width, dy / height),
      translate = [width / 2 - scale * x, height / 2 - scale * y];

	g.selectAll(".state")
      .data(topojson.feature(us, us.objects.ne_10m_USA_states).features)
    .enter().append("path")
      .attr("d", path)
      .attr("class", function(d) {
        return 'state ' + d.id
      })
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
});

getVenues(city,state);
getCity(city, state);

function getCity(city, state) {
	data = {'state' : state, 'city' : city}
	$.getJSON('/getCity/', data)
    .done(function( json ) {
     g.selectAll('.city')
      .data(json.features)
      .enter().append('path')
      .attr('d', path)
      .attr('class', function(d) {
        return 'city ' + d.properties.name;
      })
      .attr('fill', '#C54B51')
      .attr("transform", "translate(" + translate + ")scale(" + scale + ")");
  });
}

function getVenues(city, state) {
  var data = {'scale' : 'city', 'state' : state, 'city' : city}
  $.getJSON('/getVenues/', data)
    .done(function( json ) {
      layoutUS(json);
    });
}

function layoutUS(d) {
  var state,
      city;
  
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

function venueDiv(d) {
  var fullAddress = d.street + ' ' + d.city_state[0] + ' ' + d.city_state[1];
  var gmap = 'https://www.google.com/maps/place/' + fullAddress.split(' ').join('+'); 
  var div = '<div class="venue col-xs-4 col-centered">' +
              '<a target="_blank" href="http://www.' + d.website + '">' +
                '<h1>' + d.name + '</h1>' +
              '</a>' +
              
                  
                    '<img class="center-block" src="' + d.image + '">' +
                
              
                
              
              '<a target="_blank" href="' + gmap + '">' +
                '<h2 class="street">-' + d.street + '-</h2>' +
              '</a>' +
            '</div>'
  return div
}





