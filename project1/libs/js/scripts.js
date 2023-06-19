///////////////// PRELOADER //////////////

 $(window).on('load', function () {
    if (
        $('#preloader').length) {
            $('#preloader').delay(1000).fadeOut('slow', function () {
                $(this).remove();
            });
    }
}); 

////////////////// DECLARING VARIBALES //////////////////
var lat;
var lng;
var countryCode;
var capitalCity;



////////////////// MAP LOGIC //////////////////

// INITIALISES MAP

var map = L.map("map").setView([54.505, -0.09], 6);



// REMOVING ZOOM CONTROL TO RE-POSITION

map.removeControl(map.zoomControl);

// RE-ADDING ZOOM CONTROLS TO TOP RIGHT

L.control
  .zoom({
    position: "topright",
  })
  .addTo(map);

// JOINING USER LOCATION WITH START POINT ON MAP

function getUserLocation() {
  return new Promise(function (resolve, reject) {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (position) {
          let { latitude, longitude } = position.coords;
          resolve({ lat: latitude, lng: longitude });
        },
        function (error) {
          resolve({ lat: 51.5074, lng: -0.1278 }); //Default value for UK
        }
      );
    } else {
      resolve({ lat: 51.5074, lng: -0.1278 });
    }
  });
}



(async function () {
  try {
    const location = await getUserLocation();
//     console.log("User location:", location.lat, location.lng);

    $.ajax({
      url: "libs/php/countryLatLng.php?",
      type: "GET",
      data: {
        lat: location.lat,
        lng: location.lng,
      },
      success: function (data) {
        json = JSON.parse(data);
        countryCode = json.countryCode;

        $("#countryList").val(countryCode).change();
        onloadCountry(countryCode);
      },
    });

  
  } catch (error) {
    console.error("Error getting user location:", error);
  }
})();

////////////////// ADDING LAYERS //////////////////

// ADDS OPENSTREETMAP LAYER

var osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
  maxZoom: 19,
  attribution: "",
});
osm.addTo(map);

// ADDS DARK LAYER

var CartoDB_DarkMatter = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a><a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }
);
CartoDB_DarkMatter.addTo(map);

// ADDS GOOGLE STREETS LAYER

googleStreets = L.tileLayer(
  "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);
googleStreets.addTo(map);

// ADDS GOOGLE SATELITE LAYER

googleSat = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
  maxZoom: 20,
  subdomains: ["mt0", "mt1", "mt2", "mt3"],
});
googleSat.addTo(map);

// ADDS WATERCOLOUR LAYER

var Stamen_Watercolor = L.tileLayer(
  "https://stamen-tiles-{s}.a.ssl.fastly.net/watercolor/{z}/{x}/{y}.{ext}",
  {
    attribution:
      '<a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC 3.0</a>',
    subdomains: "abcd",
    minZoom: 1,
    maxZoom: 16,
    ext: "jpg",
  }
);
Stamen_Watercolor.addTo(map);

// ADDS CYCLING LAYER

let WaymarkedTrails_cycling = L.tileLayer('https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png', {
	maxZoom: 18,
	attribution: 'Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
});



////////////////// INITIALISING MARKERS //////////////////

let markers = L.markerClusterGroup();
let marker = L.marker();

let cityIcon = L.ExtraMarkers.icon({
  icon: "fa-regular fa-city",
  markerColor: "violet",
  iconColor: "white",
  shape: "circle",
  prefix: "fa",
});

let earthquakeIcon = L.ExtraMarkers.icon({
  icon: "fa-regular fa-house-crack",
  markerColor: "violet",
  iconColor: "green",
  shape: "circle",
  prefix: "fa",
});







////////////////// ADDING LAYER CONTROL //////////////////

var baseLayers = {
  Satellite: googleSat,
  "Google Map": googleStreets,
  "Water Color": Stamen_Watercolor,
  OpenStreetMap: osm,
};

let overlayLayers = {
  "Cycling Routes": WaymarkedTrails_cycling,
};


L.control.layers(baseLayers, overlayLayers).addTo(map);







////////////////// DROPDOWN MENU POPULATING //////////////////

function userCountryCode() {
  $.ajax({
    url: "libs/php/countryCode.php?",
    type: "GET",

    success: function (data) {
      let countries = JSON.parse(data);
      // console.log(data);
      let option = "";
      // countries.forEach( function(country) {
      //     option += '<option value = "'+country[1]+'">'+country[0]+'</option>'
      // } )
      for (let country of countries) {
        option +=
          '<option value = "' + country[1] + '">' + country[0] + "</option>";
        countryCode = country[1];
        // console.log(countryCode)
      }
      $("#countryList").append(option);
    },
  });
}

userCountryCode("map");

////////////////// ADDING MAP BORDERS LAYER //////////////////

let countryBoundary = new L.geoJson();

countryBoundary.addTo(map);

function borderStyle() {
  return {
    fillColor: "purple",
    weight: 4,
    opacity: 2.0,
    color: "purple",
    fillOpacity: 0.3,
  };
}

////////// GETTING BORDER INFO FROM PHP FILE

function countryBorder(countryCode) {
  //console.log(countryCode);

  $.ajax({
    url: "libs/php/countryBorder.php?",
    type: "GET",
    data: {
      countryCode: countryCode,
    },
    success: function (json) {
      jsonInfo = JSON.parse(json);
      
      

      countryBoundary.clearLayers();
      countryBoundary.addData(jsonInfo).setStyle(borderStyle());

      
      const bounds = countryBoundary.getBounds();
      map.fitBounds(bounds);

      

      let eastBounds = bounds.getEast();
      let westBounds = bounds.getWest();
      let northBounds = bounds.getNorth();
      let southBounds = bounds.getSouth();

      /////// CITY MARKERS

      $.ajax({
        url: "libs/php/countryCities.php?",
        type: "GET",
        dataType: "JSON",
        data: {
          northBounds: northBounds,
          southBounds: southBounds,
          eastBounds: eastBounds,
          westBounds: westBounds,
        },

        success: function (response) {
          //console.log(response);
          let cityData = response.geonames;
          //console.log(cityData[0].fcodeName);

          let marker = L.marker();
          let markers = L.markerClusterGroup();

          
      

          if (markers) {
            $("#countryList").change(function () {
              markers.eachLayer(function (layer) {
                markers.removeLayer(layer);
              });
            });
          }

          for (let i = 0; i < cityData.length; i++) {
            let cityMarkerLat = cityData[i].lat;
            let cityMarkerLng = cityData[i].lng;
            let cityMarkerLatFormat = numeral(cityData[i].lat).format("0,0.00");
            let cityMarkerLngFormat = numeral(cityData[i].lng).format("0,0.00");
            let cityMarkerName = cityData[i].name;
            let cityMarkerPop = numeral(cityData[i].population).format(
              "0a",
              "0.0a"
            );
            let cityMarkerWiki = cityMarkerName.split(" ").join("_");

            //console.log(cityMarkerWiki);

            cityMarker = L.marker([cityMarkerLat, cityMarkerLng], {
              icon: cityIcon,
            }).bindPopup(`
            <h5 class="cityMarkerName">${cityMarkerName}</h5>
            <table class="table borderless">
                                   
            <tr><td><b>Population:</b></td><td>${cityMarkerPop}</td></tr>
            <tr><td colspan="4" class="cityMarkerWiki"><b></b><a href=https://en.wikipedia.org/wiki/${cityMarkerWiki} target=_blank >Find Out More about ${cityMarkerName}</a> </td></tr>
              </table>
            `);

            markers.addLayer(cityMarker);
            markers.addTo(map);

    
          
          }
        },

        error: function (error) {
          error = "Not able to get close by cities.";
        
        },
      });

      ////// EARTHQUAKE MARKERS
      $.ajax({
        url: "libs/php/countryEarthquakes.php?",
        type: "GET",
        dataType: "JSON",
        data: {
          northBounds: northBounds,
          southBounds: southBounds,
          eastBounds: eastBounds,
          westBounds: westBounds,
        },

        success: function (response) {
          let earthquakeData = response.data;
          //console.log(cityData[0].fcodeName);

          marker = L.marker();
          let markers = L.markerClusterGroup();

          if (markers) {
            $("#countryList").change(function () {
              markers.eachLayer(function (layer) {
                markers.removeLayer(layer);
              });
            });
          }

          for (let i = 0; i < earthquakeData.length; i++) {
            let earthquakeMarkerLat = earthquakeData[i].lat;
            // console.log(earthquakeMarkerLat)
            let earthquakeMarkerLng = earthquakeData[i].lng;
            // console.log(earthquakeMarkerLng)
            let earthquakeMarkerName = earthquakeData[i].magnitude;

            let earthquakeMarkerTime = earthquakeData[i].datetime;

            earthquakeMarker = L.marker([earthquakeMarkerLat, earthquakeMarkerLng], {
              icon: earthquakeIcon,
            }).bindPopup(`
          <h5 class="earthquakeMarkerName">Earthquakes</h5>
          <h5 class="earthquakeMarkerName">${earthquakeMarkerName}</h5>
           <table class="table borderless">
          <tr><td><b>Time:</b></td><td>${earthquakeMarkerTime}</td></tr> 
          <tr><td><b>Coordinates:</b></td><td>${earthquakeMarkerLat}, ${earthquakeMarkerLng}</td></tr>                         
          </table>
          `);

            markers.addLayer(earthquakeMarker);
            markers.addTo(map);
          }
        },
        error: function (error) {
          error = "Not able to get close by cities.";}
      });

      /////// WEATHER MODAL ///////////

      $.ajax({
        url: "libs/php/countryWeather.php?",
        type: "GET",
        dataType: "JSON",
        data: {
          northBounds: northBounds,
          southBounds: southBounds,
          eastBounds: eastBounds,
          westBounds: westBounds,
        },

        success: function (response) {
          
          let weatherData = response.data;
          // console.log(weatherData)

          let weatherCondition = weatherData[0].weatherCondition
          if (weatherCondition === 'n/a') {
            weatherCondition = 'Sun'
          } else if (weatherCondition === 'heavy') {
            weatherCondition = 'Rain'
          } 

          // console.log(weatherCondition)

          let weatherTemp = weatherData[0].temperature
          // console.log(weatherTemp)

          let weatherClouds = weatherData[0].clouds
          // console.log(weatherClouds)

          let weatherTime = weatherData[0].datetime
          // console.log(weatherTime)

          let weatherWind = weatherData[0].windSpeed
          // console.log(weatherWind)

          if (weatherCondition === 'Sun') {
            $("#weatherImage").attr("src", "https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif")
          } else if (weatherCondition === 'heavy') {
            $('#weatherImage').attr("src", "https://mdbgo.io/ascensus/mdb-advanced/img/rain.gif")
          } else if (weatherCondition === 'haze') {
            $("#weatherImage").attr("src", "https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif")
          } else if (weatherCondition === 'fog') {
            $("#weatherImage").attr("src", "https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif")
          } else if (weatherCondition === 'snow') {
            $("#weatherImage").attr("src", "https://mdbgo.io/ascensus/mdb-advanced/img/snow.gif")
          } else if (weatherCondition === 'light rain') {
            $("#weatherImage").attr("src", "https://mdbgo.io/ascensus/mdb-advanced/img/rain.gif")
          } else {
            $("#weatherImage").attr("src", "https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif")
          }


          $("#weatherCondition").html(weatherCondition);
          $("#weatherTemp").html(weatherTemp);
          $('#weatherClouds').html(weatherClouds);
          $('#weatherWind').html(weatherWind);
          // $('#weatherTime').html(weatherTime);
      
          
        },
      
        error: function (error) {
      
          if (error.status !== 200) {
           $("#weatherInfo").empty();

           let newErrorRow = $("<tr>");
           let weatherError = 'Could not load weather Information'
           newErrorRow.append($("<td>").text(weatherError));
           $("#weatherInfo").append(newErrorRow);
           
          }
        
       

         }})}})}

countryBorder("map");

// JOINING THE SELECT MENU AND COUNTRY CODES/ BORDERS

window.onload = function () {
  document.getElementById("countryList").onchange = function () {
    onloadCountry(this.value);
  };
};

let countries = "";
let countryName = "";

function onloadCountry(countryCode) {
  if (countryCode == "") return;
  countryName = $("#countryList option:selected").text();
  countries = countryCode;
  countryBorder(countryCode);
  countryInfo(countryCode);
  calendarInfo(countryCode);
  newsInfo(countryCode)
}
onloadCountry();

////////////////// EASY BUTTONS (reverse order) //////////////////

////////////////// IMAGES INFO MODAL SHOW BUTTOM //////////////////

let displayImagesInfo = L.easyButton(
  '<i class="fa-solid fa-camera-retro" style="color: #820c82;"></i>',
  function (btn, map) {
    if (countryName === "Select Country") {
      $("#alert").modal("show");
    } else {
      $("#imagesInfo").modal("show");
      //   displayIimagesInfo();
      // imagesInfo(); // function to get data
    }
    imagesInfo();
  },
  "Images Info"
);

displayImagesInfo.setPosition("bottomleft").addTo(map);

////////////////// CURRENCY INFO MODAL SHOW BUTTON //////////////////

let displayCurrencyInfo = L.easyButton(
  '<i class="fa-solid fa-coins" style="color: #820c82;"></i>',
  function (btn, map) {
    if (countryName === "Select Country") {
      $("#alert").modal("show");
    } else {
      $("#currencyInfo").modal("show");
    }
    // currencyInfo()
  },

  "Currency Info"
);

displayCurrencyInfo.setPosition("bottomleft").addTo(map);

//
////////////////// NATIONAL CALENDAR MODAL SHOW BUTTON //////////////////

let displayCalendarInfo = L.easyButton(
  '<i class="fa-solid fa-calendar-days" style="color: #820c82;"></i>',
  function (btn, map) {
    if (countryName === "Select Country") {
      $("#alert").modal("show");
    } else {
      $("#calendarInfo").modal("show");
      //calendarInfo();
    }
    calendarInfo()
  },
  "Calendar Info"
);

displayCalendarInfo.setPosition("bottomleft").addTo(map);

////////////////// WEATHER INFO MODAL SHOW BUTTON  //////////////////

let displayWeatherInfo = L.easyButton(
  '<i class="fa-solid fa-sun" style="color: #820c82;"></i>',
  function (btn, map) {
    if (countryName === "Select Country") {
      $("#alert").modal("show");
    } else {
      
      $("#weatherInfo").modal("show");
      // weatherInfo();
    }
    // weatherInfo();
  },
  "Weather Forecast"
);

displayWeatherInfo.setPosition("bottomleft").addTo(map);

////////////////// COUNTRY NEWS MODAL SHOW BUTTON //////////////////

let displayNewsInfo = L.easyButton(
  '<i class="fa-regular fa-newspaper" style="color: #820c82;"></i>',
  function (btn, map) {
    if (countryName === "Select Country") {
      $("#alert").modal("show");
    } else {
      $("#newsInfo").modal("show");
    }
    newsInfo();
  },
  "News Info"
);

displayNewsInfo.setPosition("bottomleft").addTo(map);



////////////////// COUNTRY INFO MODAL SHOW BUTTON //////////////////

let displayCountryInfo = L.easyButton(
  '<i class="fa-sharp fa-solid fa-info" style="color: #820c82;"></i>',
  function (btn, map) {
    if (countryName === "Select Country") {
      $("#alert").modal("show");
    } else {
      $("#countryInfo").modal("show");
    }

    countryInfo();
  },
  "Country Info"
);

displayCountryInfo.setPosition("bottomleft").addTo(map);

////////////////// HELP MODAL SHOW BUTTON //////////////////

let displayHelpInfo = L.easyButton(
  '<i class="fa-solid fa-question" style="color: #820c83;"></i>',
  function (btn, map) {
    $("#helpInfo").modal("show");

    helpInfo();
  },
  "Help Info"
);

displayHelpInfo.setPosition("bottomright").addTo(map);

//////////////////////////// POPULATING REST OF MODALS /////////////////////////////////


/////////////// CALENDAR MODAL ////////////////




function calendarInfo(countryCode) {
  //console.log(countryCode);

  $.ajax({
    url: "libs/php/countryCalendar.php?",
    type: "GET",
    data: {
      countryCode: countryCode,
    },

    success: function (response) {
      // console.log(response)
      let dataInfo = response.data;
      //console.log(dataInfo);

      let holidayInfo = dataInfo.holidays;

      $("#calendarData").empty();


      for (let i = 0; i < 12; i++) {
        let name = holidayInfo[i].name;
        let date = holidayInfo[i].date;

        // console.log(name);

        let newRow = $("<tr>");
        /* newRow.append($("<td>").text(""));
        newRow.append($("<td>").text("")); */
        newRow.append($("<td>").text(name));
        newRow.append($("<td>").text(date));
        $("#calendarData").append(newRow);

  
      }
    },
    error: function (error) {

      if (error.status !== 200) {
      $("#calendarData").empty();

      let newErrorRow = $("<tr>");
      let calendarError = 'Could not load calendar Information'
      newErrorRow.append($("<td>").text(calendarError));
      $("#calendarData").append(newErrorRow);

      
      
    
    }}})};

////////////////// NEWS MODAL //////////////////

function newsInfo(countryCode) {
  //console.log(countryCode);

  $.ajax({
    url: "libs/php/countryNews.php?",
    type: "GET",
    data: {
      countryCode: countryCode,
    },

    success: function (response) {
    // console.log(response)

      // let dataInfo = response.data.news;
      let dataInfo = response.data;
//       console.log(dataInfo)
      
      // let newsData = dataInfo.news;
     
      // let newsCardData = dataInfo.news
     

      $("#newsData").empty();

      if (dataInfo =! 'null') {
        for (let i = 0; i < 6; i++) {
          let newsData = dataInfo.news;
          let name = newsData[i].title;
          let date = newsData[i].publish_date;
          let image = newsData[i].image;
          let link = newsData[i].url;
  
          let card = (`
            <div class="card" style="width: 18rem;" id="newsCards">
              <img src="${image}" class="card-img-top" alt="...">
              <div class="card-body">
                <h5 class="card-title">${name}</h5>
                <p class="card-text">${date}</p>
                <a href="${link}" class="btn btn-primary">Read More</a>
              </div>
            </div>
          `);
  
          $("#newsData").append(card);
        }} else {
          /////////////// HANDING NULL NEWS ERROR WHICH HAS HAPPENED TWICE BEFORE DUE TO THEIR SERVER ERROR ///////////////
          let newErrorDiv = $("<div>");
          let newsErrorHeading = 'Something went wrong..'
          let newsError = 'Sorry, we could not load country News Information. Please try another option.'
          newErrorDiv.append($("<h5>").text(newsErrorHeading));
          newErrorDiv.append($("<p>").text(newsError));
          $("#newsData").append(newErrorDiv);
        }

   
      
    },
    error: function (error) {
      

      if (error.status !== 200) {
      $("#newsData").empty();

      let newErrorDiv = $("<div>");
      let newsErrorHeading = 'Something went wrong..'
      let newsError = 'Sorry, we could not load country News Information. Please try another option.'
      newErrorDiv.append($("<h5>").text(newsErrorHeading));
      newErrorDiv.append($("<p>").text(newsError));
      $("#newsData").append(newErrorDiv);

    
      }}})};
///////////////// POPULATING COUNTRY INFO MODAL ////////////////////

function countryInfo(countryCode) {
  //console.log(countryCode)

  $.ajax({
    url: "libs/php/countryInfo.php?",
    type: "GET",
    data: {
      countryCode: countryCode,
    },

    success: function (response) {
//       console.log(response);
      let dataInfo = response.data;

     

      let wiki = "https://en.wikipedia.org/wiki/";
      let wikiLink = wiki + dataInfo.name;

     

      $("#countryName").html(countryName);
      $("#countryCapitalCity").html(dataInfo.capital);
      $("#countryContinent").html(dataInfo.region);
      $("#countryBorders").html(dataInfo.borders);

     
      // $("#countryCurrency").html(dataInfo.currencies[0].code);
      

     

      // var img = document.getElementById("countryFlag");

      // img.onload = function () {
      //   this.height = "100px";
      //   this.width = "100px";
      // };

      

      $("#countryFlag").attr("src", dataInfo.flag);
      $("#countryWiki").attr("href", wikiLink);

      capitalCity = dataInfo.capital;

      // lat = dataInfo.latlng[0];
      // lng = dataInfo.latlng[1];
    },
    error: function (error) {
      if (error.status !== 200) {
        $("#countryInfo").empty();
  
        let newErrorRow = $("<tr>");
        let infoError = 'Could not load Country Information'
        newErrorRow.append($("<td>").text(infoError));
        $("#countryInfo").append(newErrorRow);
      }}})}



//////////// POPULATING IMAGES MODAL ////////////

function imagesInfo() {
 
  let countryName = $("#countryList").val();

 
  $.ajax({
    url: "libs/php/countryImages.php",
    type: "GET",
    data: {
      country: countryName,
    },
    success: function(response) {
      // console.log(data)

    
      $("#countryImages").empty();

      for (let i = 0; i < 10; i++) {
        let image = response.data[i];
        let img = document.createElement('img');
        img.src = image.urls.small;
        $("#countryImages").append(img);

        var images = document.querySelectorAll("img");

// Set all images' ID to "my-image"
for (var j = 0; j < images.length; j++) {
  images[j].id = "countryImage";
}

// var resizedImg = document.getElementById("countryImage");

//       resizedImg.onload = function () {
//         this.height = "100px";
//         this.width = "100px";
      // };

      
      }
     
      },
      error: function (error) {
        if (error.status !== 200) {
          $("#countryImages").empty();
    
          let newErrorDiv = $("<div>");
          let imagesErrorHeading = 'Something went wrong..'
          let imagesError = 'Sorry, we could not load country Images Information. Please try another option.'
          newErrorDiv.append($("<h5>").text(imagesErrorHeading));
          newErrorDiv.append($("<p>").text(imagesError));
          $("#countryImages").append(newErrorDiv);
        }
    }
  });
}


//////////////// POPULATING CURRENCY INFO MODAL //////////////////

function currencyInfo() {

  // $.ajax({
  //   url: "libs/php/currencyEuro.php?",
  //   type: "GET",
  
  //   success: function (response) {
  //     // console.log(response)
  //     let currencyData = response.data;
  //     let euroData = currencyData.EUR
  //     console.log(euroData)
  
  
  //     $("#euroExchange").html(euroData);
  //   },
  // });
  
}


$.ajax({
  url: "libs/php/currencyPound.php?",
  type: "GET",

  success: function (response) {
    let currencyData = response.data;
    let poundData = currencyData.GBP
    let euroData = currencyData.EUR
    let dollarData = currencyData.USD
//     console.log(poundData)
//     console.log(euroData)
//     console.log(dollarData)

    $("#poundExchange").html(poundData);
    $("#euroExchange").html(euroData);
    $("#dollarExchange").html(dollarData);
  },

  error: function (error) {

    if (error.status !== 200) {
    $("#currencyTable").empty();

    let newErrorRow = $("<tr>");
    let currencyError = 'Could not load currency Information'
    newErrorRow.append($("<td>").text(currencyError));
    $("#currencyTable").append(newErrorRow);
    }}
});

