var map = L.map('map').setView([40.2838, -3.8215], 3); //16
var feature;
var levelTime;
var timeOut;
var gameSelected;
var photoPlace;
var jugando = 0;
var j = 0;
var cont2 = -1;

function load_map() {
	map = new L.Map('map', {zoomControl: true});
	var osmUrl = 'http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
		osmAttribution = 'Map data &copy; 2012 <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
		osm = new L.TileLayer(osmUrl, {maxZoom: 18, attribution: osmAttribution});
	map.setView(new L.LatLng(51.538594, -0.198075), 12).addLayer(osm);
}

function readJSON(gameSelected){
	$.getJSON(gameSelected)
		.done(function(data){
			var cont = Math.floor(Math.random() * (4-0+1)) + 0;
			while(cont == cont2)
				cont = Math.floor(Math.random() * (4-0+1)) + 0;
			cont2 = cont;
			//console.log("photoPlace dentro: " + data.juego[cont].properties.name);
			photoPlace = data.juego[cont].properties.name;
			j = 0;
			load_images(levelTime);
		});
		//console.log("El photPlace es: " + photoPlace);
}

function load_images(levelTime){
	clearInterval(timeOut);
	var flickerAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
	console.log("photoPlace dentro: " + photoPlace);

	$.getJSON(flickerAPI, {
		tags: photoPlace,
		tagmode: "any",
		format: "json"
	})
		.done(function(data) {
			j = 0;
			clearInterval(timeOut);
			timeOut = setInterval(function(){
				$("#photo").empty();
				$("<img/>").attr("src", data.items[j].media.m).attr("alt",
					data.items[j].title).attr("title",
					data.items[j].title).appendTo("#photo");
					console.log("Fotos mostradas: " + j);
				j++;
				if(j == 10)
					clearInterval(timeOut);
				
			}, levelTime);
		});
}

	$('#games').on('change',function(){
		if(jugando == 0){
	    	var games = $(this).val();
	    	if(games == 'cities'){
	    		gameSelected = 'ciudades.json';
	    	}else if(games == 'stadiums'){
	    		gameSelected = 'estadios.json';
	    	}else{
	    		gameSelected = 'coches.json';
	    	}
	    	console.log("EL GAMESELECTED ES:" + gameSelected);
	    }else{
	    	alert("Debes terminar este juego para iniciar una nuevo");
	    }
    	// readJSON(gameSelected);
  //   	$.getJSON(gameSelected)
		// .done(function(data){
		// 	var cont = Math.floor(Math.random() * (4-0+1)) + 0;
		// 	console.log(data.juego[cont].properties.name);
		// 	photoPlace = data.juego[cont].properties.name;
		// });
	});

// function play(){
// 	if(gameSelected == undefined)
// 		alert("Debes selecionar un tipo de juego");
// 	if(levelTime == undefined)
// 		alert("Debes selecionar un nicel de dificultad.");
// 	console.log("gameSelected: " + gameSelected + ", Level: " + levelTime);
// }




$(document).ready(function() {
	
	// add an OpenStreetMap tile layer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	var popup = L.popup();

	function onMapClick(e) {
		//alert(e.latlng.toString());
		if(jugando == 1){
	    	popup
		        .setLatLng(e.latlng)
		        .setContent("Coordenadas chacho: " + e.latlng.toString())
		        .openOn(map);
		    clearInterval(timeOut);
		    console.log("fotos vistas: " + j);
		    j = 0;
		    $("#photo").empty();
		    readJSON(gameSelected);
		}else{
			popup
		        .setLatLng(e.latlng)
		        .setContent("Seleciona un nuevo juego y comienza a adivinar")
		        .openOn(map);
		}
	}

	map.on('click', onMapClick);

	// function onLocationFound(e) {
	//     var radius = e.accuracy / 2;

	//     L.marker(e.latlng).addTo(map)
	//         .bindPopup("You are within " + radius + " meters from this point").openPopup();

	//     L.circle(e.latlng, radius).addTo(map);
	// }

	// map.on('locationfound', onLocationFound);

	// function onLocationError(e) {
	//     alert(e.message);
	// }

	// map.on('locationerror', onLocationError);
 	$('#buttonPlay').click(function play(){
 		if(jugando == 0){
			if(gameSelected == undefined)
				alert("Debes selecionar un tipo de juego");
			else{
				if(levelTime == undefined)
					alert("Debes selecionar un nicel de dificultad.");
				else{
					readJSON(gameSelected);
					jugando = 1;
					//load_images(levelTime);
					// levelTime = undefined;
					// gameSelected = undefined;
				} // ¿pongo aqui levelTime y gameSelected a undefined?
			}
			console.log("gameSelected: " + gameSelected + ", Level: " + levelTime);
			
		}else{
			alert("Primero termina el juego actual pulsando en el boton Stop");
		}
	});

 	$('#buttonStop').click(function btStop(){
 		if(jugando == 0){
 			alert("Inicia primero un nuevo juego");
 		}else{
 			jugando = 0;
 			levelTime = undefined;
			gameSelected = undefined;
			clearInterval(timeOut);
			j = 0;
			$("#photo").empty();
 		}

 	});


	$('#level').on('change',function(){
    	var level = $(this).val();

    	if(level == 'easy'){
    		levelTime = 5000;
    	}else if(level == 'medium'){
    		levelTime = 3000;
    	}else{
    		levelTime = 1500;
    	}
    	console.log(level);
    	// if(gameSelected == undefined)
    	// 	alert("Debes selecionar un juego");
    	// else
    	// 	load_images(levelTime);
	});
});