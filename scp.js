var map = L.map('map').setView([40.2838, -3.8215], 3); //16
var feature;
var levelTime;
var timeOut;
var gameSelected;
var photoPlace;
var coords;
var jugando = 0;
var j = 0;
var cont2 = -1;
var puntos = 0;
var numJuegos = 0;

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
			coords = data.juego[cont].coordinates;
			j = 0;
			load_images(levelTime);
		});
		//console.log("El photPlace es: " + photoPlace);
}

function hora(){
	var fecha = new Date()
	var hora = fecha.getHours()
	var minuto = fecha.getMinutes()
	var segundo = fecha.getSeconds()
	if (hora < 10) {hora = "0" + hora}
	if (minuto < 10) {minuto = "0" + minuto}
	if (segundo < 10) {segundo = "0" + segundo}
	var horita = hora + ":" + minuto + ":" + segundo
	return horita;
	tiempo = setTimeout('hora()',1000)
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

function calculatePos(){
	var size = $("#list li").length;
	$("#list li").each(function(){
		var num = $(this).attr("value");
		num = num - 1;
		$(this).attr("value", num);
		$(this).children("a").attr("href", "javascript:history.go("+num+")");
	});
}


$("#resultList").on('click', 'li', function (){
	var actualValue = $(this).attr("value");
	//$(this).remove();
	var size = $("#list li").length;

	var go = actualValue - numJuegos;
	console.log("go: " + go + ", actualvalue: " + actualValue + ", numjuegos " + numJuegos);
	numJuegos = actualValue;
	if(go != 0)
		history.go(go);

	// $("#list li").each(function(){
	// 	var num = $(this).attr("value");
	// 	if(num != actualValue){
	// 		num = num - actualValue;
	// 		$(this).attr("value", num);
	// 		$(this).children("a").attr("href", "javascript:history.go("+num+")");
	// 		alert("el IF");
	// 	}else{
	// 		//$("#puntos").empty();
	// 		alert("el ELSE");	
	// 	}
		
	// });

});

	// var size = $("#list li").length;
	// $("#list li").each(function(){
	// 	var num = $(this).attr("value");
	// 	num = num - 1;
	// 	$(this).attr("value", num);
	// 	$(this).children("a").attr("href", "javascript:history.go("+num+")");
	// });



$(document).ready(function() {
	
	// add an OpenStreetMap tile layer
	L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
	}).addTo(map);

	var popup = L.popup();

	function onMapClick(e) {
		//alert(e.latlng.toString());
		if(jugando == 1){
	    	
		    
		    console.log("fotos vistas: " + j);
		    var res = coords.split(","); 
		    var latlngDest = L.latLng(parseFloat(res[0]), parseFloat(res[1]));
		    var distance = e.latlng.distanceTo(latlngDest)/1000;
		    console.log("Distance (Km): " + distance);
		    puntos = (puntos + (distance * j));


		    $("#puntos").empty();
		    $("#puntos").append( "<p>","Puntos: ", puntos,"</p>" );
		    popup
		        .setLatLng(e.latlng)
		        .setContent("Distancia: " + distance.toFixed(3) + ", puntos acumulados: " + puntos)
		        .openOn(map);

		    $("#photo").empty();
		    clearInterval(timeOut);
		     j = 0;
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
					alert("Debes selecionar un nivel de dificultad.");
				else{
					var partir = gameSelected;
					console.log("antesssss: " + partir);
					var name = partir.split(".");
					var stateObj = { puntuacion: puntos, juego: gameSelected};
					console.log("namePPPP: " + name[0]);
					history.pushState(stateObj, "nombrePrueba", "?juego=" + name[0]);
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
			//quito el campos puntos?? y reinicio la puntiación??
			$("#puntos").empty();
			puntos = 0;
 		}

 	});

 	$('#buttonNuevo').click(function btnuevo(){
 		if(jugando == 0){
 			alert("Inicia primero un nuevo juego");
 		}else{
 			//guardo el hstory
			var partir = gameSelected;
			var name = partir.split(".");
			
			console.log("Puntos: "+ puntos);
			console.log("onpopostate1: " + gameSelected);
			var stateObj = { puntuacion: puntos, juego: gameSelected, level: levelTime};
			console.log(stateObj);
			console.log("comillas:" + name[0]);
			history.replaceState(stateObj, "nombrePrueba", "?juego="+name[0]);
			$("#list").append('<li value='+numJuegos+'><a><span class=\"tab\">'+ name[0] + ", hora: " + hora()+'</span></a></li>');
			numJuegos = numJuegos + 1;
 			jugando = 0;
 			puntos = 0;
 			levelTime = undefined;
			gameSelected = undefined;
 			clearInterval(timeOut);
			j = 0;
			$("#puntos").empty();
			$("#photo").empty();
			//calculatePos();
			//var stateObj = { puntuacion: 0, juego: ""};
			//history.pushState(stateObj, "nombrePrueba", "?juego=" + name[0]);	
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



	// $('#buttonSave').click(function btSave(){
	// 	var partir = gameSelected;
	// 	var name = partir.split(".");
	// 	console.log("onpopostate1: " + gameSelected);

	// 	var stateObj = { puntuacion: puntos, juego: gameSelected, level: levelTime};
	// 	console.log(stateObj);
	// 	history.pushState(stateObj, "nombrePrueba", name[0] + ".html");
	// 	$("#list").append('<li><a href="javascript:history.go(-1)"><span class="tab">'+ name[0] +'</span></li>');

	// });

	window.onpopstate = function(event){
		alert("location: " + document.location + ", state: " + JSON.stringify(event.state));
		$("#puntos").empty();
		puntos = parseFloat(JSON.stringify(event.state.puntuacion));
		$("#puntos").append("<p>","Puntos: ", parseFloat(JSON.stringify(event.state.puntuacion)),"</p>");
		gameSelected = (JSON.stringify(event.state.juego)).toString();
		var newStr = gameSelected.substring(0, gameSelected.length-1);
		newStr = newStr.substring(1, newStr.length);
		console.log(newStr);
		gameSelected = newStr;	
		levelTime = JSON.stringify(event.state.level);
		clearInterval(timeOut);
		j = 0;
		
		$("#photo").empty();
		jugando = 0;
		console.log(JSON.stringify(event.state.juego));

		//readJSON(JSON.stringify(event.state.juego));
	};
});