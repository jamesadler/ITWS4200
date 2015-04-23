/* James Adler
 * ITWS-4200 Lab 2
 */

var API_KEY = "da5cb76dcc378f13b43c39f9c2cff6e7";

function fixDate(oldDate){
	var date = new Date(oldDate*1000);

	var hour = date.getHours();
	var minutes = date.getMinutes();
	var ampm = "";

	if(hour<12){
		ampm = "am";
	} else {
		ampm = "pm";
		hour = hour - 12;
	}

	return hour+":"+minutes+" "+ampm;
}

function changeWeatherBG(weatherCode){
	var other = false;

	// changes code to general code.
	if(weatherCode == "03" || weatherCode == "04"){
		weatherCode == "02";
	} else if(weatherCode == "10"){
		weatherCode == "09";
	}

	if(weatherCode == "01"){
		$("html").css('background-image','url(./Clear_sky.jpg)');
		$(".container").css("background-color","transparent");
		
	} else if(weatherCode == "02") {
		$("html").css('background-image','url(./Cloudy_sky.jpg)');
		$(".container").css("background-color","#A5AAA6");

	} else if(weatherCode == "09") {
		$("html").css('background-image','url(./raining.jpg)');
		$(".container").css("background-color","#BDC8DA");

	} else if(weatherCode == "11") {
		$("html").css('background-image','url(./thunder.jpg)');
		$(".container").css("background-color","#D0B5B4");

	} else if(weatherCode == "13") {
		$("html").css('background-image','url(./snowing.jpg)');
		$(".container").css("background-color","#C0C9D6");

	} else if(weatherCode == "50") {
		$("html").css('background-image','url(./mist.jpg)');
		$(".container").css("background-color","#8D9B9C");

	} else {
		$("html").css('background-image','none');
		$("html").css('background-color','purple');
		$(".container").css("background-color","turquoise");
		other = true;
	}

	// Changes text color for the header and 'change background'
	if(weatherCode == "01" || weatherCode == "02") {
		$("header, #weatherBG_lbl").css("color", "#000");
	} else {
		$("header, #weatherBG_lbl").css("color", "#fff");
	}

	// Sets the value of the 'change background' select
	$("#weatherBG").val(weatherCode);
	// If weatherCode is unknown, set to 99
	if(other)	$("#weatherBG").val("99");
}

function getWeatherData(position){

	$.getJSON("http://api.openweathermap.org/data/2.5/weather", {
		lat: position.coords.latitude,
		lon: position.coords.longitude,
		units: "imperial",
		APIID: API_KEY
	}).done(function(data){
		$("#loading").hide();
		$("#currentWeather, #moreWeather").show();

		var currentTemp = Math.round(data.main.temp);
		var weather = data.weather[0];
		var weatherIcon = weather.icon;
		var weatherCode = weatherIcon.substring(0,2);

		var weatherDesc = weather.description;

		$("#weatherIcon").html("<img src='http://openweathermap.org/img/w/"+weatherIcon+".png'/>");

		$("#city").html(data.name);
		$("#currentTemp").html(currentTemp);
		$("#weatherType").html(weatherDesc);

		$("#sunrise").html(fixDate(data.sys.sunrise));
		$("#sunset").html(fixDate(data.sys.sunset));

		$("#wind").html(data.wind.speed+" mps");

		$("#moreInfo").attr("href","http://openweathermap.org/city/"+data.id);

		// weatherCode = "80"; // used for testing
		changeWeatherBG(weatherCode);
		
	});
}

$(document).ready(function(){

	$("#currentWeather, #moreWeather").hide();

	if (navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(getWeatherData);
  } else {
    $("#weatherData").html("Geolocation is not supported by this browser.");
  }

  $("#weatherBG").change(function(){
  	changeWeatherBG(this.value);
  });

});