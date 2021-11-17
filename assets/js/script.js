var cityFormEl = document.querySelector(".city-form");
var cityEl = document.querySelector("#city");
var currentEl = document.querySelector(".current")
var futureEl = document.querySelector(".cards");
var pastEl = document.querySelector(".past");
var uvColor = document.querySelector(".uvValue")
var cities = [];
var newCity = false;


var currentWeather = function(data, cityName) {

  currentEl.innerHTML = "";
  var temp = data.temp;
  var wind = data.wind_speed;
  var hum = data.humidity;
  var uv = data.uvi;
  var iconSrc = "http://openweathermap.org/img/wn/"+data.weather[0].icon+"@2x.png"
  var date = new Date(data.dt*1000);
  date = date.toLocaleString().substring(0,10);

  var cityNameEl = document.createElement("div");
  cityNameEl.classList="title";
  cityNameEl.innerHTML = "<h2>"+cityName+"("+date+")</h2><img src='"+iconSrc+"'>"

    
  var tempEl = document.createElement("p");
  tempEl.textContent = "Temp: "+temp+"°F";

  var windEl = document.createElement("p");
  windEl.textContent = "Wind: "+wind+" MPH";

  var humEl = document.createElement("p");
  humEl.textContent = "Humidity: "+hum+" %";

  var uvEl = document.createElement("p");
  
  if (uv < 3) { 
    uvEl.innerHTML = "UV Index: <span class='uvValue low'>"+uv+"</span>";
  }else if (uv < 6){ 
    uvEl.innerHTML = "UV Index: <span class='uvValue moderate'>"+uv+"</span>";
  }else if ( uv < 8){
    uvEl.innerHTML = "UV Index: <span class='uvValue high'>"+uv+"</span>";
  }else if (uv < 11) {
    uvEl.innerHTML = "UV Index: <span class='uvValue very-high'>"+uv+"</span>";
  }else {
    uvEl.innerHTML = "UV Index: <span class='uvValue extreme'>"+uv+"</span>";
  }

  currentEl.appendChild(cityNameEl);
  currentEl.appendChild(tempEl);
  currentEl.appendChild(windEl);
  currentEl.appendChild(humEl);
  currentEl.appendChild(uvEl);
  
}

var futureWeather = function(data) {
  
  futureEl.innerHTML = "";
  for (var i = 1; i < 6; i++){

    var cardEl = document.createElement("div");
    cardEl.classList = "card"

    var tempMax = Math.round(data[i].temp.max);
    var tempMin = Math.round(data[i].temp.min);
    var wind = data[i].wind_speed;
    var hum = data[i].humidity;
    var iconSrc = "http://openweathermap.org/img/wn/"+data[i].weather[0].icon+"@2x.png"
    var date = new Date(data[i].dt*1000);
    date = date.toLocaleString().substring(0,10);

    var dateEl = document.createElement("h3");
    dateEl.textContent = date;

    var iconEl = document.createElement("img")
    iconEl.setAttribute("src", iconSrc)
    
    var tempEl = document.createElement("p");
    tempEl.textContent ="Temp: "+tempMax+"°/"+tempMin+"°";
  
    var windEl = document.createElement("p");
    windEl.textContent ="Wind: "+wind+" MPH";
  
    var humEl = document.createElement("p");
    humEl.textContent ="Humidity: "+hum+" %";
    
    cardEl.innerHTML = "";
    cardEl.appendChild(dateEl);
    cardEl.appendChild(iconEl);
    cardEl.appendChild(tempEl);
    cardEl.appendChild(windEl);
    cardEl.appendChild(humEl);

    futureEl.appendChild(cardEl);

  }
}

var saveCity = function(cityName) {
  if (cities.includes(cityName)){
    return 
  } else {
    cities.push(cityName);
    localStorage.setItem("cities", JSON.stringify(cities));
    getCities();
  }
};

var getCities = function() {
  pastEl.innerHTML = "";
  cities =JSON.parse(localStorage.getItem('cities'));

  if (cities === null) {
    cities = []
    return
  }

  if(!newCity){
    var cityUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+cities[0]+"&limit=5&appid=aea3763261460cc25632d3f72b2d8a29"
    fetch(cityUrl)
      .then(function(response) {
        return response.json();
      })
      .then(function(data) {
        var lat = data[0].lat;
        var lon = data[0].lon;
        var url = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&exclude=hourly&appid=aea3763261460cc25632d3f72b2d8a29"
        
        fetch(url)
          .then(function(response){
            return response.json();
          })
          .then(function(data){
            
            currentWeather(data.current, cities[0]);
            futureWeather(data.daily);
          })
      })
  }

  for(let i=0; i < cities.length; i++){
    
    let pastCity = document.createElement("p");
    pastCity.classList = "pastCity";
    pastCity.textContent = cities[i];
    pastEl.appendChild(pastCity);
  
  }
  
};

var cityHandler = function(event){
  event.preventDefault();
  newCity = true;
  let cityName = ""
  for (let i=0; i < cityEl.value.length; i++) {
    if(i==0 || cityEl.value[i-1] == " " ) {
      cityName += cityEl.value[i].toUpperCase();
    } else {
      cityName += cityEl.value[i].toLowerCase()
    }
  }

  var cityUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=5&appid=aea3763261460cc25632d3f72b2d8a29"
  fetch(cityUrl)
    .then(function(response) {
      if(!response.ok){
        window.alert("Please enter a valid city")
        return
      }
      return response.json();
    })
    .then(function(data) {

      if (data.length == 0){
        window.alert("Please enter a valid city")
        return
      }
      var lat = data[0].lat;
      var lon = data[0].lon;
      var url = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&exclude=hourly&appid=aea3763261460cc25632d3f72b2d8a29"
      
      fetch(url)
        .then(function(response){
          return response.json();
        })
        .then(function(data){
          
          currentWeather(data.current, cityName);
          futureWeather(data.daily);
          saveCity(cityName);
        })
    })
}

var savedCities = function(event) {
  
  var cityName = event.target.innerText;
  cityEl.value = event.target.innerText;

  var cityUrl = "http://api.openweathermap.org/geo/1.0/direct?q="+cityName+"&limit=5&appid=aea3763261460cc25632d3f72b2d8a29"
  fetch(cityUrl)
    .then(function(response) {
      return response.json();
    })
    .then(function(data) {
      var lat = data[0].lat;
      var lon = data[0].lon;
      var url = "https://api.openweathermap.org/data/2.5/onecall?lat="+lat+"&lon="+lon+"&units=imperial&exclude=hourly&appid=aea3763261460cc25632d3f72b2d8a29"
      
      fetch(url)
        .then(function(response){
          return response.json();
        })
        .then(function(data){
          
          currentWeather(data.current, cityName);
          futureWeather(data.daily);
        })
    })

}


getCities();
pastEl.addEventListener("click", savedCities)
cityFormEl.addEventListener("submit", cityHandler);