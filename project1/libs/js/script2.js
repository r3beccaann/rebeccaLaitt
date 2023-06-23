///////////////// PRELOADER //////////////

$(window).on("load", function () {
  if ($("#preloader").length) {
    $("#preloader")
      .delay(1000)
      .fadeOut("slow", function () {
        $(this).remove();
      });
  }
});

/////////////////// MAP LAYERS ///////////////////

// ADDS OPENSTREETMAP LAYER

var osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", { // used to create tile layer
  maxZoom: 19,
  attribution: "",
});

// ADDS DARK LAYER

var CartoDB_DarkMatter = L.tileLayer( // used to create tile layer
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png",
  {
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a><a href="https://carto.com/attributions">CARTO</a>',
    subdomains: "abcd",
    maxZoom: 19,
  }
);

// ADDS GOOGLE STREETS LAYER

googleStreets = L.tileLayer( // used to create tile layer
  "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
  {
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  }
);

// ADDS GOOGLE SATELITE LAYER

googleSat = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", { // used to create tile layer
  maxZoom: 20,
  subdomains: ["mt0", "mt1", "mt2", "mt3"],
});

// ADDS WATERCOLOUR LAYER

var Stamen_Watercolor = L.tileLayer( // used to create tile layer
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

// ADDS CYCLING LAYER

let WaymarkedTrails_cycling = L.tileLayer( // used to create tile layer
  "https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png",
  {
    maxZoom: 18,
    attribution:
      'Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
  }
);

/////////////////// INITIALISING MAP ///////////////////

let map = L.map("map", { // creates map
  zoomControl: false, // zoom control false as moving
  layers: [ // adds tile layers
    osm,
    CartoDB_DarkMatter,
    googleStreets,
    googleSat,
    Stamen_Watercolor,
  ],
}).setView([54.505, -0.09], 6); // sets initial view of map


// ADDING ZOOM CONTROL 

L.control
  .zoom({
    position: "topright",
  })
  .addTo(map);


////////////////// INITIALISINGLAYER CONTROL //////////////////

var baseLayers = { // grouping base layers
  Satellite: googleSat,
  "Google Maps": googleStreets,
  "Water Color": Stamen_Watercolor,
  OpenStreetMap: osm,
};

let overlayLayers = { // grouping overlay layers
  "Cycling Routes": WaymarkedTrails_cycling,
};

// ADDING BASE LAYERS AND OVERLAY LAYERS WITHIN THE LAYER CONTROL

let layerControl = L.control.layers(baseLayers, overlayLayers, {
  position: "topright",
});

// ADDING LAYER CONTROL TO THE MAP

layerControl.addTo(map);

// JOINING USER LOCATION WITH START POINT ON MAP

function locateUser() {
  map
    .locate({ setView: true, maxZoom: 7 }) // setting view to users location 
    .on("locationfound", function (e) { // if able to get users location, locationfound is emited. 
      e.latitude; // lat used to populate users location on map
      e.longitude; // lng used to populate users location on map
    })
    .on("locationerror", function (e) { // if unsuccessful, error will be thrown to select a country via the drop down
      // console.log(error);
      alert("Unable to get your location. Please select a Country via the drop down.");
    });
}

////////////////// DECLARING VARIBALES //////////////////

var lat;
var lng;
var countryCode;
var capitalCity;

//////////// JOINING USER LAT & LNG TO REVERSE COUNTRY CODE  //////////////////

$(document).ready(function () {
  function findUserLocation() {
    if (navigator.geolocation) { // checking to see if users browser supports geolocation
      navigator.geolocation.getCurrentPosition(function (data) { // used to get the users lat lng
        let { latitude } = data.coords; // stores user lat in variable
        let { longitude } = data.coords; // stores user lng in variable
        let coords = [latitude, longitude]; // stores both in coords variable
        //console.log(coords);

        $.ajax({ // gets country code from users location using lat and lng
          url: "libs/php/countryLatLng.php?",
          type: "GET",
          data: {
            lat: latitude,
            lng: longitude,
          },
          success: function (data) {
            //console.log(lat);
            json = JSON.parse(data);
            countryCode = json.countryCode;
            //console.log(countryCode);
            $("#countryList").val(countryCode).change();
            onloadCountry(countryCode); // populates drop down list with countries
          },
        });
      });
    } else {
      alert("Unable to get your location. Please select a Country via the drop down.");
    }
  }
  findUserLocation("map");
});


////////////////// DROPDOWN MENU POPULATING //////////////////

function userCountryCode() { // gets list of countries and their country codes
  $.ajax({
    url: "libs/php/countryCode.php?",
    type: "GET",

    success: function (data) {
      let countries = JSON.parse(data);
      // console.log(data);
      let option = ""; // where the countries will be appended to
     
      // LOOPING THROUGH COUNTRIES

      for (let country of countries) { // iterating through countries
        option +=
          '<option value = "' + country[1] + '">' + country[0] + "</option>";
        countryCode = country[1];
      }
      $("#countryList").append(option); // appending them to the drop down
    },
  });
}

userCountryCode("map");

////////////////// INITIALISING MARKERS //////////////////

let markers = L.markerClusterGroup(); // creates markers object for clustered markers
let marker = L.marker(); // creates marker object for single marker

// CITY MARKERS

let cityIcon = L.ExtraMarkers.icon({ // used to create icon
  icon: "fa-regular fa-city",
  markerColor: "violet",
  iconColor: "white",
  shape: "circle",
  prefix: "fa",
});

// EARTHQUAKE MARKERS

let earthquakeIcon = L.ExtraMarkers.icon({ // used to create icon
  icon: "fa-regular fa-house-crack",
  markerColor: "violet",
  iconColor: "green",
  shape: "circle",
  prefix: "fa",
});

////////////////// ADDING MAP BORDERS LAYER //////////////////

let countryBoundary = new L.geoJson(); // creates new object to add to the map

countryBoundary.addTo(map); // adds to map

// BORDER STYLING

function borderStyle() {
  return {
    fillColor: "purple",
    weight: 4,
    opacity: 2.0,
    color: "purple",
    fillOpacity: 0.3,
  };
}

/////////////////// GETTING BORDER INFO FROM PHP FILE ///////////////////


function countryBorder(countryCode) { // gets country border info using countryCode as parameter

  $.ajax({
    url: "libs/php/countryBorder.php?",
    type: "GET",
    data: {
      countryCode: countryCode,
    },
    success: function (json) {
      jsonInfo = JSON.parse(json);

      countryBoundary.clearLayers(); // clears other layers
      countryBoundary.addData(jsonInfo).setStyle(borderStyle()); // setting style and adding boundary

      const bounds = countryBoundary.getBounds(); // fitting to the bounds of the border
      map.fitBounds(bounds); // fits the map object to the bounds of the country border

      // variables used to store e w n s for border
      let eastBounds = bounds.getEast();
      let westBounds = bounds.getWest();
      let northBounds = bounds.getNorth();
      let southBounds = bounds.getSouth();

      // CITY MARKERS

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

          let marker = L.marker();
          let markers = L.markerClusterGroup();

          if (markers) {
            $("#countryList").change(function () { // changes the markers per country
              markers.eachLayer(function (layer) {
                markers.removeLayer(layer);
              });
            });
          }

          for (let i = 0; i < cityData.length; i++) { // iterates through city markers
            let cityMarkerLat = cityData[i].lat;
            let cityMarkerLng = cityData[i].lng;
            
            let cityMarkerName = cityData[i].name; // populating markers with info
            let cityMarkerPop = numeral(cityData[i].population).format(
              "0a",
              "0.0a"
            );
            let cityMarkerWiki = cityMarkerName.split(" ").join("_");

            cityMarker = L.marker([cityMarkerLat, cityMarkerLng], {
              icon: cityIcon,
            }).bindPopup(`
            <h5 class="cityMarkerName">${cityMarkerName}</h5>
            <table class="table borderless">
                                   
            <tr><td><b>Population:</b></td><td>${cityMarkerPop}</td></tr>
            <tr><td colspan="4" class="cityMarkerWiki"><b></b><a href=https://en.wikipedia.org/wiki/${cityMarkerWiki} target=_blank >Find Out More about ${cityMarkerName}</a> </td></tr>
              </table>
            `);

            markers.addLayer(cityMarker); // adding layers
            markers.addTo(map); // adding to map
          }
        },

        error: function (error) {
          error = "Unable to populate Country Cities";
          // console.log(error)
        },
      });

      // EARTHQUAKE MARKERS

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
            $("#countryList").change(function () { // changes the markers per country
              markers.eachLayer(function (layer) {
                markers.removeLayer(layer);
              });
            });
          }

          for (let i = 0; i < earthquakeData.length; i++) { // iterates through earthquake markers
            let earthquakeMarkerLat = earthquakeData[i].lat; // populating markers with info
            // console.log(earthquakeMarkerLat)
            let earthquakeMarkerLng = earthquakeData[i].lng;
            // console.log(earthquakeMarkerLng)
            let earthquakeMarkerName = earthquakeData[i].magnitude;

            let earthquakeMarkerTime = earthquakeData[i].datetime;

            earthquakeMarker = L.marker(
              [earthquakeMarkerLat, earthquakeMarkerLng],
              {
                icon: earthquakeIcon,
              }
            ).bindPopup(`
          <h5 class="earthquakeMarkerName">Earthquakes</h5>
          <h5 class="earthquakeMarkerName">${earthquakeMarkerName}</h5>
           <table class="table borderless">
          <tr><td><b>Time:</b></td><td>${earthquakeMarkerTime}</td></tr> 
          <tr><td><b>Coordinates:</b></td><td>${earthquakeMarkerLat}, ${earthquakeMarkerLng}</td></tr>                         
          </table>
          `);

            markers.addLayer(earthquakeMarker);  // adding layers
            markers.addTo(map); // adding to map
          }
        },
        error: function (error) {
          error = "Unable to populate Country Earthquakes";
          // console.log(error)
        },
      });

     /////////////////// WEATHER MODAL USING SAME PARAMS ///////////////////

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

          let weatherCondition = weatherData[0].weatherCondition;
          if (weatherCondition === "n/a") {
            weatherCondition = "Sun";
          } else if (weatherCondition === "heavy") {
            weatherCondition = "Rain";
          }

          // console.log(weatherCondition)

          let weatherTemp = weatherData[0].temperature;
          // console.log(weatherTemp)

          let weatherClouds = weatherData[0].clouds;
          // console.log(weatherClouds)

          let weatherTime = weatherData[0].datetime;
          // console.log(weatherTime)

          let weatherWind = weatherData[0].windSpeed;
          // console.log(weatherWind)

          if (weatherCondition === "Sun") {
            $("#weatherImage").attr(
              "src",
              "https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif"
            );
          } else if (weatherCondition === "heavy") {
            $("#weatherImage").attr(
              "src",
              "https://mdbgo.io/ascensus/mdb-advanced/img/rain.gif"
            );
          } else if (weatherCondition === "haze") {
            $("#weatherImage").attr(
              "src",
              "https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif"
            );
          } else if (weatherCondition === "fog") {
            $("#weatherImage").attr(
              "src",
              "https://mdbgo.io/ascensus/mdb-advanced/img/fog.gif"
            );
          } else if (weatherCondition === "snow") {
            $("#weatherImage").attr(
              "src",
              "https://mdbgo.io/ascensus/mdb-advanced/img/snow.gif"
            );
          } else if (weatherCondition === "light rain") {
            $("#weatherImage").attr(
              "src",
              "https://mdbgo.io/ascensus/mdb-advanced/img/rain.gif"
            );
          } else {
            $("#weatherImage").attr(
              "src",
              "https://mdbgo.io/ascensus/mdb-advanced/img/clear.gif"
            );
          }

          $("#weatherCondition").html(weatherCondition);
          $("#weatherTemp").html(weatherTemp);
          $("#weatherClouds").html(weatherClouds);
          $("#weatherWind").html(weatherWind);
        },

        error: function (error) {
          if (error.status !== 200) {
            $("#weatherInfo").empty();

            let newErrorRow = $("<tr>");
            let weatherError = "Could not load weather Information";
            newErrorRow.append($("<td>").text(weatherError));
            $("#weatherInfo").append(newErrorRow);
          }
        },
      });
    },
  });
}

countryBorder("map");

/////////////////// JOINING THE SELECT MENU AND COUNTRY CODES / BORDERS ///////////////////

window.onload = function () {
  document.getElementById("countryList").onchange = function () {
    onloadCountry(this.value);
  };
};

// DECLARING VARIABLES

let countries = "";
let countryName;

// INITIATING FUNCTIONS FOR REQUIRED MENUS 

function onloadCountry(countryCode) {
  
  if (countryCode == "" ) return;
  countryName = $("#countryList option:selected").text();
  countries = countryCode;
  countryBorder(countryCode);
  countryInfo(countryCode);
  calendarInfo(countryCode);
  newsInfo(countryCode);
  countryWiki(countryName);
}
onloadCountry("gb"); // setting GB as initial loading country

// DECLARING VARIABLES

let currencyCode;
let wikiInfo;

/////////////////// COUNTRY INFO MODAL POPULATING ///////////////////

function countryInfo(countryCode) {
  //console.log(countryCode)

  $.ajax({
    url: "libs/php/countryInfo.php?",
    type: "GET",
    data: {
      countryCode: countryCode,
    },

    success: function (response) {
      // console.log(response);
      let dataInfo = response.data;
      // console.log(dataInfo);

      let wiki = "https://en.wikipedia.org/wiki/";
      let wikiLink = wiki + countryName;

      $("#countryName").html(countryName);
      $("#countryCapitalCity").html(dataInfo.capital);
      $("#countryContinent").html(dataInfo.region);
      $("#countryBorders").html(dataInfo.borders);
      $("#countryPopulation").html(dataInfo.population)
     
      $("#countryArea").html(dataInfo.area)

      $("#countryFlag").attr("src", dataInfo.flag);
      $("#countryWiki").attr("href", wikiLink);

      currencyCode = dataInfo.currencies[0]["code"];
      capitalCity = dataInfo.capital;

      lat = dataInfo.latlng[0];
      lng = dataInfo.latlng[1];

    },
  });
}

/////////////////// COUNTRY NEWS MODAL POPULATING ///////////////////

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
      // console.log(dataInfo);

      // let newsData = dataInfo.news;

      // let newsCardData = dataInfo.news

      $("#newsData").empty();

      // if (dataInfo =! 'null') {
      for (let i = 0; i < 6; i++) {
        let newsData = dataInfo.news;
        let name = newsData[i].title;
        let date = newsData[i].publish_date;
        let image = newsData[i].image;
        let link = newsData[i].url;

        let card = `
              <div class="card" style="width: 18rem;" id="newsCards">
                <img src="${image}" class="card-img-top" alt="...">
                <div class="card-body">
                  <h5 class="card-title">${name}</h5>
                  <p class="card-text">${date}</p>
                  <a href="${link}" class="btn btn-primary">Read More</a>
                </div>
              </div>
            `;

        $("#newsData").append(card);
      }
      // } else {
      /////////////// HANDING NULL NEWS ERROR WHICH HAS HAPPENED TWICE BEFORE DUE TO THEIR SERVER ERROR ///////////////
      //   let newErrorDiv = $("<div>");
      //   let newsErrorHeading = 'Something went wrong..'
      //   let newsError = 'Sorry, we could not load country News Information. Please try another option.'
      //   newErrorDiv.append($("<h5>").text(newsErrorHeading));
      //   newErrorDiv.append($("<p>").text(newsError));
      //   $("#newsData").append(newErrorDiv);
      // }
    },
    error: function (error) {
      if (error.status !== 200) {
        $("#newsData").empty();

        let newErrorDiv = $("<div>");
        let newsErrorHeading = "Something went wrong..";
        let newsError =
          "Sorry, we could not load country News Information. Please try another option.";
        newErrorDiv.append($("<h5>").text(newsErrorHeading));
        newErrorDiv.append($("<p>").text(newsError));
        $("#newsData").append(newErrorDiv);
      }
    },
  });
}

/////////////////// COUNTRY CURRENCY MODAL POPULATING ///////////////////

function currencyInfo() {
  $.ajax({
    url: "libs/php/currencyPound.php?",
    type: "GET",

    success: function (response) {
      let currencyData = response;

      $("#poundExchange").empty();

      countryExchange = numeral(currencyData.data[currencyCode]).format("0.00");
      //console.log(countryExchange);
      $("#poundExchange").append(" ", countryExchange);
    },

    error: function (error) {
      error = "Unable to load Country Exchange rate.";
      
    },
  }),
    $.ajax({
      url: "libs/php/currencyEuro.php?",
      type: "GET",

      success: function (response) {
        let currencyData = response;

        $("#euroExchange").empty();

        countryExchange = numeral(currencyData.data[currencyCode]).format(
          "0.00"
        );
        //console.log(countryExchange);
        $("#euroExchange").append(" ", countryExchange);
      },

      error: function (error) {
        error = "Unable to load Country Exchange rate.";
        //alert(error);
      },
    }),
    $.ajax({
      url: "libs/php/currencyDollar.php?",
      type: "GET",

      success: function (response) {
        let currencyData = response;

        $("#dollarExchange").empty();

        countryExchange = numeral(currencyData.data[currencyCode]).format(
          "0.00"
        );
       
        $("#dollarExchange").append(" ", countryExchange);

       
      },

      error: function (error) {
        error = "Unable to load Country Exchange rate..";
        //alert(error);
      },
    });
}

/////////////////// COUNTRY CALENDAR MODAL POPULATING ///////////////////

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
        let calendarError = "Could not load calendar Information";
        newErrorRow.append($("<td>").text(calendarError));
        $("#calendarData").append(newErrorRow);
      }
    },
  });
}

/////////////////// COUNTRY IMAGES MODAL POPULATING ///////////////////

function imagesInfo() {
  let countryName = $("#countryList").val();

  $.ajax({
    url: "libs/php/countryImages.php",
    type: "GET",
    data: {
      country: countryName,
    },
    success: function (response) {
      // console.log(data)

      $("#countryImages").empty();

      for (let i = 0; i < 10; i++) {
        let image = response.data[i];
        let img = document.createElement("img");
        img.src = image.urls.small;
        $("#countryImages").append(img);

        var images = document.querySelectorAll("img");

        // Set all images' ID to "my-image"
        for (var j = 0; j < images.length; j++) {
          images[j].id = "countryImage";
        }

       
      }
    },
    error: function (error) {
      if (error.status !== 200) {
        $("#countryImages").empty();

        let newErrorDiv = $("<div>");
        let imagesErrorHeading = "Something went wrong..";
        let imagesError =
          "Sorry, we could not load country Images Information. Please try another option.";
        newErrorDiv.append($("<h5>").text(imagesErrorHeading));
        newErrorDiv.append($("<p>").text(imagesError));
        $("#countryImages").append(newErrorDiv);
      }
    },
  });
}

/////////////////// COUNTRY WIKI MODAL POPULATING ///////////////////


    function countryWiki(countryName) {
      $.ajax({
        url: "libs/php/countryWiki.php?",
        type: "GET",
        dataType: "JSON",
        data: {
          countryName: countryName.split(" ").join("_"),
       
         
        },
    
        success: function (response) {
          let dataInfo = response.data;
          // console.log(dataInfo);

          $("#wikiData").empty();

          // if (dataInfo =! 'null') {
          for (let i = 0; i < 6; i++) {
            let wikiData = dataInfo
            let title = wikiData[i].title;
            
            let summary = wikiData[i].summary;
          
            let url = wikiData[i].wikipediaUrl;
            // console.log(url)
    
            let card = `
                  <div class="card" style="width: 18rem;" id="wikiCards">
                   
                    <div class="card-body">
                      <h5 class="card-title">${title}</h5>
                      <p class="card-text">${summary}</p>
                      <a href="https://${wikiData[i].wikipediaUrl}" class="btn btn-primary" target="_blank">Read More</a>

                    </div>
                  </div>
                `;
    
            $("#wikiData").append(card);
          }


        }})}

/////////////////// MODAL BUTTONS VIA EASY BUTTON ///////////////////

// IMAGES MODAL BUTTON

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

// CURRENCY MODAL BUTTON

let displayCurrencyInfo = L.easyButton(
  '<i class="fa-solid fa-coins" style="color: #820c82;"></i>',
  function (btn, map) {
    if (countryName === "Select Country") {
      $("#alert").modal("show");
    } else {
      $("#currencyInfo").modal("show");
    }

    currencyInfo();
  },
  "Currency Info"
);

displayCurrencyInfo.setPosition("bottomleft").addTo(map);

// CALENDAR MODAL BUTTON

let displayCalendarInfo = L.easyButton(
  '<i class="fa-solid fa-calendar-days" style="color: #820c83;"></i>',
  function (btn, map) {
    if (countryName === "Select Country") {
      $("#alert").modal("show");
    } else {
      $("#calendarInfo").modal("show");
      //calendarInfo();
    }
    calendarInfo();
  },
  "Calendar Info"
);

displayCalendarInfo.setPosition("bottomleft").addTo(map);

// WEATHER MODAL BUTTON

let displayWeatherInfo = L.easyButton(
  '<i class="fa-solid fa-sun" style="color: #820c82;"></i>',
  function (btn, map) {
    if (countryName === "Select Country") {
      $("#alert").modal("show");
    } else {
      $("#weatherInfo").modal("show");
      // weatherInfo();
    }
    //weatherInfo();
  },
  "Weather Info"
);

displayWeatherInfo.setPosition("bottomleft").addTo(map);

// NEWS MODAL BUTTON

let displayNewsInfo = L.easyButton(
  '<i class="fa-regular fa-newspaper" style="color: #820c83;">',
  function (btn, map) {
    if (countryName === "Select Country") {
      $("#alert").modal("show");
    } else {
      $("#newsInfo").modal("show");
    }
  },
  "News Info"
);

displayNewsInfo.setPosition("bottomleft").addTo(map);

// WIKI MODAL BUTTON 

let displayWikiInfo = L.easyButton(
  '<i class="fa-solid fa-w" style="color: #820c82;"></i>',
  function (btn, map) {
    if (countryName === "Select Country") {
      $("#alert").modal("show");
    } else {
      $("#wikiInfo").modal("show");
      //   displayIimagesInfo();
      // imagesInfo(); // function to get data
    }
    // wikiInfo();
  },
  "Wiki Info"
);

displayWikiInfo.setPosition("bottomleft").addTo(map);

// INFO MODAL BUTTON

let displayCountryInfo = L.easyButton(
  '<i class="fa-solid fa-info" style="color: #820c82;"></i>',
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

// HELP MODAL BUTTON

let displayHelpInfo = L.easyButton(
  '<i class="fa-solid fa-question" style="color: #820c83;"></i>',
  function (btn, map) {
    $("#helpInfo").modal("show");

    helpInfo();
  },
  "Help Info"
);

displayHelpInfo.setPosition("bottomright").addTo(map);







