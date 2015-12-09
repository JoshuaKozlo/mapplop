$.ajax({
	method: "GET",
	url: 'https://s3.amazonaws.com/mapplopstaticmedia/static/json/statelist.json'
}).done(function( data ){
	for (var i = 0; i < data.length; i++) {
		$("select").append('<option>' + data[i].name + '</option>');
	};
})


