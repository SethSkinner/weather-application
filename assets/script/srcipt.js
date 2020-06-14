let searchData = $(".search-data")
let listOfCities = []
let city
let APIKey = "6d0afcb4738425f710c0a2c8a95d6432";

function appenedButtons() {
    for (var i = 0; i < listOfCities.length; i++) {
        var button = $("<button>");
        button.addClass("btn btn-primary city-btn");
        button.attr("data-name", listOfCities[i]);
        button.text(listOfCities[i]);
        $(".cities").prepend(<li>button</li>);
    }
}

function displayWeather() {
    //URL for AJAX Call - note: units=imperial
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + city + "&units=imperial&appid=" + APIKey + "&units=imperial";
    //AJAX Call
    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
            $(".search-data").html("")
            //Created div to store current weather data
            var newDiv = $("<div class='cityWeather'>")
            newDiv.html("<h2>Current Weather</h2><br>")
            searchData.prepend(newDiv)
            //Call for city name
            var cityName = response.name
            var pOne = $("<p>").html("<h4>" + cityName + "</h4>");
            newDiv.append(pOne)
            //Call for current date
            var currentDate = moment().format("LLLL")
            var pDate = $("<p>").html("<i>" + currentDate + "</i>");
            newDiv.append(pDate)
            //Call for windspeed (fixed to whole number)
            var windSpeed = response.wind.speed
            var pTwo = $("<p>").text("Wind Speed: " + windSpeed.toFixed(0) + " mph");
            newDiv.append(pTwo)
            //Call for humidity (fixed to whole number)
            var humidity = response.main.humidity
            var pThree = $("<p>").text("Humidity: " + humidity.toFixed(0) + " %");
            newDiv.append(pThree)
            //Call for temperature (fixed to whole number)
            var temperature = response.main.temp
            var pFour = $("<p>").text("Temperature: " + temperature.toFixed(0) + " F");
            newDiv.append(pFour)
            //Creation of image tag and call for icon image from API
            var iconImg = $("<img id = 'icon'>")
            $(".weather-icon").append(iconImg)
            var icon = response.weather[0].icon;
            var iconurl = "http://openweathermap.org/img/w/" + icon + ".png";
            $('#icon').attr('src', iconurl);
            //Call for longitude and latitude (for UV Index AJAX Call)
            var lon = response.coord.lon
            var lat = response.coord.lat
            //URL for UV Index API
            var uvIndexUrl = "http://api.openweathermap.org/data/2.5/uvi?appid=" + APIKey + "&lat=" + lat + "&lon=" + lon
            //AJAX call for UV Index
            $.ajax({
                url: uvIndexUrl,
                method: "GET"
            }).then(function (response) {
                var uvIndex = response.value
                var pFive = $("<p id=uvIndex>").text("UV Index: " + uvIndex);
                newDiv.append(pFive)
            })
            //Push search term into array ONLY if the name doesn't already exist
            if (listOfCities.includes(response.name) === false) {
                listOfCities.push(response.name)
            }
            //Run the functions to render buttons, save cities, and display the 5 day forcast
            renderButtons()
            saveCities()
            display5day()
        })
};