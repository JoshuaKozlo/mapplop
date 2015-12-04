$.ajax({
	method: "GET",
	url: '/static/json/statelist.json'
}).done(function( data ){
	for (var i = 0; i < data.length; i++) {
		$("select").append('<option>' + data[i].name + '</option>');
	};
})


