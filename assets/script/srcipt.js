var city=""; 
var url="";
var APIkey="";
var queryurl ="";
var currenturl = "";
var citiesDiv = document.querySelector('#btnContainer');
var cities = []; 

start(); 
btnFunction(); 
search(); 

function start(){
    var saved_cities = JSON.parse(localStorage.getItem("cities"));
    if (saved_cities !== null){
        cities = saved_cities;
    }   
    prependBtns(); 
}

function storeCities(){
    localStorage.setItem("cities", JSON.stringify(cities)); 
}

function prependBtns(){
    citiesDiv.innerHTML = ""; 
    if(cities == null){
        return;
    }
    var choices = [...new Set(cities)];
    for(var i=0; i < choices.length; i++){
        var cityName = choices[i]; 

        var btn = document.createElement("button");
        btn.textContent = cityName; 
        btn.setAttribute("class", "addedBtns"); 

        citiesDiv.appendChild(btn);
        btnFunction();
      }
    }

function btnFunction(){
$(".addedBtns").on("click", function(event){

    event.preventDefault();
    city = $(this).text().trim();
APIcalls(); 
});
}

function search() {
$("#searchbtn").on("click", function(event){
    event.preventDefault();
    city = $(this).prev().val().trim();
    
    cities.push(city);

    if(cities.length > 8){
        cities.shift();
    }
    if (city == ""){
        return; 
    }

    APIcalls();
    storeCities(); 
    prependBtns();
});
}
function APIcalls(){
    
    url = "https://api.openweathermap.org/data/2.5/forecast?q=";    
    currenturl = "https://api.openweathermap.org/data/2.5/weather?q=";
    APIkey = "&appid=5ce8439fd4264478d1da0b24a7cd547d";
    queryurl = url + city + APIkey;
    weatherUrl = currenturl + city + APIkey; 
    
    $("#city").text(city);
    $.ajax({
        url: queryurl,
        method: "GET",
        
    }).then(function(response){
        var days = 0; 
        
        //iterate through the 40 weather data sets
        for(var i=0; i< response.list.length; i++){
            
            //split function to isolate the time from the time/data aspect of weather data, and only select weather reports for 3pm
            if(response.list[i].dt_txt.split(" ")[1] == "15:00:00")
            {
    
                var day = response.list[i].dt_txt.split("-")[2].split(" ")[0];
                var month = response.list[i].dt_txt.split("-")[1];
                var year = response.list[i].dt_txt.split("-")[0];
                $("#" + days + "date").text(month + "/" + day + "/" + year); 
                var temp = Math.round(((response.list[i].main.temp - 273.15) *9/5+32));
                $("#" + days + "temps").text("Temp: " + temp + String.fromCharCode(176)+"F");
                $("#" + days + "humidities").text("Humidity: " + response.list[i].main.humidity);
                $("#" + days + "icons").attr("src", "http://openweathermap.org/img/w/" + response.list[i].weather[0].icon + ".png");
                days++; 
                        }   
        }
    });

     $.ajax({
         url:weatherUrl,
         method: "GET", 
     }).then(function(current_data){
         var temp = Math.round(((current_data.main.temp - 273.15) * 9/5 + 32));
         $("#temp1").text("Temperature: " + temp + String.fromCharCode(176)+"F");
         $("#humidity1").text("Humidity: " + current_data.main.humidity);
         $("#windspeed1").text("Wind Speed: " + current_data.wind.speed);
         $("#icon1").attr({"src": "http://openweathermap.org/img/w/" + current_data.weather[0].icon + ".png",
          "height": "100px", "width":"100px"});
     })

     var lat = response.city.coord.lat;
     var lon = response.city.coord.lon;
 
     var apiKey1 = "ada1f715672a438e9b9acaa7ea0e930b";
     var queryURL2 = `https://api.openweathermap.org/data/2.5/uvi?appid=${apiKey1}&lat=${lat}&lon=${lon}`;
 
     $.ajax({
         url: queryURL2,
         method: "GET",
     }).then(function (res) {
         var uvI = res.value;
         $(".uvIndex").text("UV Index: " + uvI);
     });
}

