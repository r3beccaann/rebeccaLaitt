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
  
  var osm = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    // used to create tile layer
    maxZoom: 19,
    attribution: "",
  });
  
  
  // ADDS GOOGLE STREETS LAYER
  
  googleStreets = L.tileLayer(
    // used to create tile layer
    "http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}",
    {
      maxZoom: 20,
      subdomains: ["mt0", "mt1", "mt2", "mt3"],
    }
  );
  
  // ADDS GOOGLE SATELITE LAYER
  
  googleSat = L.tileLayer("http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}", {
    // used to create tile layer
    maxZoom: 20,
    subdomains: ["mt0", "mt1", "mt2", "mt3"],
  });
  
  
  // ADDS CYCLING LAYER
  
  let WaymarkedTrails_cycling = L.tileLayer(
    // used to create tile layer
    "https://tile.waymarkedtrails.org/cycling/{z}/{x}/{y}.png",
    {
      maxZoom: 18,
      attribution:
        'Map style: &copy; <a href="https://waymarkedtrails.org">waymarkedtrails.org</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
    }
  );
  
  /////////////////// INITIALISING MAP ///////////////////
  
  let map = L.map("map", {
    // creates map
    zoomControl: true, // zoom control
    layers: [
      // adds tile layers
      osm,
      // CartoDB_DarkMatter,
      googleStreets,
      googleSat,
      // Stamen_Watercolor,
    ],
  }).setView([54.505, -0.09], 6); // sets initial view of map
  

  
  ////////////////// INITIALISINGLAYER CONTROL //////////////////
  
  var baseLayers = {
    // grouping base layers
    Satellite: googleSat,
    "Google Streets": googleStreets,
    // "Water Color": Stamen_Watercolor,
    "Open Street Map": osm,
  };
  
  var earthquakes = L.markerClusterGroup({
    polygonOptions: {
      fillColor: "#fff",
      color: "#000",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5,
    },
  }).addTo(map);
  
  var cities = L.markerClusterGroup({
    polygonOptions: {
      fillColor: "#fff",
      color: "#000",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5,
    },
  }).addTo(map);
  
  var wiki = L.markerClusterGroup({
    polygonOptions: {
      fillColor: "#fff",
      color: "#000",
      weight: 2,
      opacity: 1,
      fillOpacity: 0.5,
    },
  }).addTo(map);
  
  let overlayLayers = {
    // grouping overlay layers
    "Cycling Routes": WaymarkedTrails_cycling,
    Earthquakes: earthquakes,
    Cities: cities,
    "Wiki Markers": wiki,
  };
  
  // ADDING BASE LAYERS AND OVERLAY LAYERS WITHIN THE LAYER CONTROL
  
  let layerControl = L.control.layers(baseLayers, overlayLayers, {
    position: "topright",
  });
  
  // ADDING LAYER CONTROL TO THE MAP
  
  layerControl.addTo(map);
  
   ////////////////// INITIALISING MARKERS //////////////////

  var earthquakeIcon = L.ExtraMarkers.icon({
    prefix: "fa",
    icon: "fa-house-crack",
    iconColor: "black",
    markerColor: "green",
    shape: "square",
  });
  
  var cityIcon = L.ExtraMarkers.icon({
    prefix: "fa",
    icon: "fa-city",
    markerColor: "violet",
    shape: "square",
  });
  
  var wikiIcon = L.ExtraMarkers.icon({
    prefix: "fa",
    icon: "fa-w",
    markerColor: "green",
    shape: "square",
  });
  
  // JOINING USER LOCATION WITH START POINT ON MAP
  
  function locateUser() {
    map
      .locate({ setView: true, maxZoom: 7 }) // setting view to users location
      .on("locationfound", function (e) {
        // if able to get users location, locationfound is emited.
        e.latitude; // lat used to populate users location on map
        e.longitude; // lng used to populate users location on map
      })
      .on("locationerror", function (e) {
        // if unsuccessful, error will be thrown to select a country via the drop down
        // console.log(e)
        $("#countryList").val('GB').change();

        alert(
          "Unable to get your location. Please select a Country via the drop down."
        );
      });
  }

  locateUser('map')
  
  ////////////////// DECLARING VARIBALES //////////////////
  
  var lat;
  var lng;
  var countryCode;
  var capitalCity;
  
  //////////// JOINING USER LAT & LNG TO REVERSE COUNTRY CODE  //////////////////
  
  $(document).ready(function () {
    function findUserLocation() {
      
      if (navigator.geolocation) {
        // checking to see if users browser supports geolocation
        navigator.geolocation.getCurrentPosition(function (data) {
          // used to get the users lat lng
          let { latitude } = data.coords; // stores user lat in variable
          let { longitude } = data.coords; // stores user lng in variable
          let coords = [latitude, longitude]; // stores both in coords variable
          // console.log(coords);
  
          $.ajax({
            // gets country code from users location using lat and lng
            url: "libs/php/countryLatLng.php?",
            type: "GET",
            dataType: "JSON",
            data: {
              lat: latitude,
              lng: longitude,
            },
            success: function (data) {
              //console.log(lat);
              json = data;
              countryCode = json.countryCode;
              //console.log(countryCode);
              $("#countryList").val(countryCode).change();
              //   onloadCountry(countryCode); // populates drop down list with countries
            },
          });
        });
      } else { 
        $("#countryList").val('GB').change();
        
        alert(
          "Unable to get your location. Please select a Country via the drop down."
        );
      }
    }
    findUserLocation("map");
  });
  
  ////////////////// DROPDOWN MENU POPULATING //////////////////
  
  function userCountryCode() {
    // gets list of countries and their country codes
    $.ajax({
      url: "libs/php/countryCode.php?",
      type: "GET",
      dataType: "JSON",
  
      success: function (data) {
        let countries = data;
        // console.log(data);
        let option = ""; // where the countries will be appended to
  
        // LOOPING THROUGH COUNTRIES
  
        for (let country of countries) {
          // iterating through countries
          option +=
            '<option value = "' + country[1] + '">' + country[0] + "</option>";
          countryCode = country[1];
        }
        $("#countryList").append(option); // appending them to the drop down
      },
    });
  }
  
  userCountryCode("map");
  
 
  
  ////////////////// ADDING MAP BORDERS LAYER //////////////////
  
  let countryBoundary = new L.geoJson(); // creates new object to add to the map
  
  countryBoundary.addTo(map); // adds to map
  
  // BORDER STYLING
  
  function borderStyle() {
    return {
      fillColor: "green",
      weight: 4,
      opacity: 2.0,
      color: "green",
      fillOpacity: 0.3,
    };
  }
  
  /////////////////// GETTING BORDER INFO FROM PHP FILE ///////////////////
  
  function countryBorder(countryCode) {
    // gets country border info using countryCode as parameter
    if (countryCode.includes('map')) { // gets rid of the bounds error as tries to read map as country code
      return;
      }

    $.ajax({
      url: "libs/php/countryBorder.php?",
      type: "GET",
      dataType: "JSON",
      data: {
        countryCode: countryCode,
      },
      success: function (json) {
        jsonInfo = json;
        // console.log(jsonInfo);
  
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
  
            for (let i = 0; i < earthquakeData.length; i++) {
              // iterates through earthquake markers
              let earthquakeMarkerLat = earthquakeData[i].lat; // populating markers with info
              // console.log(earthquakeMarkerLat)
              let earthquakeMarkerLng = earthquakeData[i].lng;
              // console.log(earthquakeMarkerLng)
              let earthquakeMarkerName = earthquakeData[i].magnitude;
  
              let earthquakeMarkerTime = earthquakeData[i].datetime;
  
              let formattedTime =
                Date.parse(earthquakeMarkerTime).toString("MMMM dS, yyyy");
  
              L.marker([earthquakeMarkerLat, earthquakeMarkerLng], {
                icon: earthquakeIcon,
              })
                .bindTooltip(
                  "<div class='col text-center'><strong>" +
                    "Recorded Earthquake" +
                    "</strong><br><i>" +
                    "on " +
                    formattedTime +
                    "</i><br><i>" +
                    "Measuring " +
                    "</i>" +
                    earthquakeMarkerName +
                    "</i><i>" +
                    " on the Richter Scale" +
                    "</i></div>",
                  { direction: "top", sticky: true }
                )
                .addTo(earthquakes);
            }
          },
        });
  
        $.ajax({
          url: "libs/php/countryCities.php?",
          type: "GET",
          dataType: "JSON",
          data: {
            countryCode: countryCode,
          },
          success: function (response) {
            //   console.log(response)
  
  
            let cityData = response.geonames;
  
            for (let i = 0; i < cityData.length; i++) {
              // iterates through city markers
              let cityMarkerLat = cityData[i].lat;
              let cityMarkerLng = cityData[i].lng;
  
              let cityMarkerName = cityData[i].name; // populating markers with info
              let cityMarkerPopulation = numeral(cityData[i].population).format(
                "0a",
                "0.0a"
              );
  
              L.marker([cityMarkerLat, cityMarkerLng], { icon: cityIcon })
                .bindTooltip(
                  "<div class='col text-center'><strong>" +
                    cityMarkerName +
                    "</strong><br><i>" +
                    "Population of " +
                    cityMarkerPopulation +
                    "</i></div>",
                  { direction: "top", sticky: true }
                )
                .addTo(cities);
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
      // onloadCountry(this.value);
      onloadCountry(this.value);
     
    };
  };
  
  // DECLARING VARIABLES
  
  let countries = "";
  let countryName;
  
  // INITIATING FUNCTIONS FOR REQUIRED MENUS

  function checkLocation() {
    if (navigator.geolocation === null) {
      // Check if the user's browser supports geolocation
      // If it doesn't, set the value of the #countryList element to 'gb'
      $("#countryList").val("gb").change();
    }
  }
 
  
  function onloadCountry(countryCode) {
    if (countryCode.includes('map')) { // gets rid of the bounds error as tries to read map as country code
      return;
      }
    if (countryName = 'undefined') { // gets rid of undefined error when trying to read map as country name for wiki
      countryName = 'GB'
    }
    
    if (countryCode == "") return;
    countryName = $("#countryList option:selected").text();
    // console.log(countryName)
    countries = countryCode;

    

    earthquakes.clearLayers(); // stops the markers from adding to eachother with each country selected
    cities.clearLayers(); // stops the markers from adding to eachother with each country selected
    wiki.clearLayers(); // stops the markers from adding to eachother with each country selected
  
    countryBorder(countryCode);
    countryInfo(countryCode);
  
    calendarInfo(countryCode);
    newsInfo(countryCode);
    countryWiki(countryName);

    
  }
  onloadCountry("map"); // setting GB as initial loading country
  
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
  
        let countryPopulation = numeral(dataInfo.population).format("0a", "0.0a");
  
        let countryArea = numeral(dataInfo.area).format("0a", "0.0a");
  
        $("#countryName").html(countryName);
        $("#countryCapitalCity").html(dataInfo.capital);
        $("#countryContinent").html(dataInfo.region);
        $("#countryBorders").html(dataInfo.borders);
  
        $("#countryPopulation").html(countryPopulation);
  
        $("#countryArea").html(countryArea);
  
        $("#countryFlag").attr("src", dataInfo.flag);
        $("#countryWiki").attr("href", wikiLink);
  
        
        currencyCode = dataInfo.currencies[0].code;
        
        // console.log(dataInfo)
        capitalCity = dataInfo.capital;
        // console.log(capitalCity)
  
        //console.log(currencyCode); 
  
        

        lat = dataInfo.latlng[0];
        lng = dataInfo.latlng[1];
  
        
  
        $.ajax({
          // url: "libs/php/currencyExchange.php?",
          url: "libs/php/currencyConvert.php?",
          type: "GET",
          dataType: "JSON",
          data: {
            currencyCode: currencyCode, // works - returns the currency code of selected country
          },
  
          success: function (response) {
            let currencyData = response.data
           
            // console.log(currencyData)
          // let currencyData = JSON.parse(response);
         
            $.each(currencyData, function(code, value) {
              $("#currencyList").append($('<option></option>').val(value).text(code));
              




              
            })

            // $('#currencyList').on('change', function() {
            //     var selectedCode = $(this).val();
            //     var selectedValue = currencyData[selectedCode];
            //     $('toAmount').text(selectedValue);
            // });

            // $('#fromAmount').on('keyup', function () {
            //     calcResult();
            // })

            // $('#fromAmount').on('change', function() {
            //     calcResult();
            // })

            // $('#currenctList').on('change', function() {
            //     calcResult();
            // })

            // $(document).ready(function() {
            //     calcResult();
            // })

            // function calcResult() {
            //     $('#toAmount').val(numeral($('#fromAmount').val() * $('#currencyList').val()).format("0,0.00"));
  
            // }
            // }})

            // let fromAmountNumber = 1;

            $(document).ready(function() {

              if (currencyData = '') {
                // console.log('currency info not available')
              } else {

                let fromAmount = document.getElementById("fromAmount").value;
                // console.log(fromAmount)
                let selectedCode = $(this).val(); // currency code of the drop down
                let selectedValue = currencyData[selectedCode]; // value of the drop down
                // console.log(selectedValue)

                fromAmountNumber = parseFloat(fromAmount);
                // console.log(fromAmountNumber)

                $("#fromAmount").on("input", function() {
                  

                  
                    let newFromAmount = $(this).val();
                    // console.log(newFromAmount)
                    fromAmountNumber = parseFloat(newFromAmount)
                   
                    let convertedAmount = parseFloat(fromAmountNumber) * parseFloat(selectedValue);
                    // console.log(convertedAmount)
                    document.getElementById("toAmount").value = convertedAmount;
    
                });
            
            $("#currencyList").on("change", function() {
            // let fromAmount = document.getElementById("fromAmount").value;
            let selectedCode = $(this).val(); // currency code of the drop down
            let selectedValue = currencyData[selectedCode]; // value of the drop down
           
            let convertedAmount = parseFloat(fromAmountNumber) * parseFloat(selectedValue);
            // console.log(convertedAmount)
            document.getElementById("toAmount").value = convertedAmount;


            });
            
            }});
            let currencyFrom = currencyCode; // base rate to access
            $("#fromAmountLabel").html("From " + currencyCode); // changes the base 'from' label
 
     
    
          }})

        //// NEW WEATHER MODAL HERE

// console.log(countryCode)
// console.log(capitalCity)

       
          $.ajax({
            url: "libs/php/countryWeather.php",
            type: "POST",
            dataType: "json",
            data: {
              capital: capitalCity,
              countryCode: countryCode,
            },
            success: function (response) {
        
              let data = response.data.list;
              // console.log(data)

            
              
              // today

              let tempToday = data[0].main.temp;
              // console.log(tempToday)

              let tempTodayRounded = Math.round(tempToday)
              // console.log(tempTodayRounded)

              let tempLowToday = data[0].main.temp_min;
              // console.log(tempLowToday)

              let tempLowTodayRounded = Math.round(tempLowToday)

              let conditionToday = data[0].weather[0].main;
              // console.log(conditionToday)

              let todayIcon = data[0].weather[0].icon;
              // console.log(todayIcon)

              let todayIconUrl = 'http://openweathermap.org/img/w/' + todayIcon + '.png'

              // tomorrow

              let dateNext = data[8].dt_txt;
              // console.log(dateNext)
              
              let dateNextFormatted = Date.parse(dateNext).toString("MMMM dS");
              // console.log(dateNextFormatted)

              let tempNext = data[8].main.temp;
              // console.log(tempNext)

              let tempNextRounded = Math.round(tempNext);
              // console.log(tempNextRounded)

              let tempLowNext = data[8].main.temp_min;
              // console.log(tempLowNext)

              let tempLowNextRounded = Math.round(tempLowNext);
              // console.log(tempLowNextRounded)

              let conditionNext = data[8].weather[0].main;
              // console.log(conditionNext)

              let nextIcon = data[8].weather[0].icon;
              // console.log(nextIcon)

              let nextIconUrl = 'http://openweathermap.org/img/w/' + nextIcon + '.png'

              // day after tomorrow

              let dateNextNext = data[16].dt_txt;
              // console.log(dateNextNext)

              let dateNextNextFormatted = Date.parse(dateNextNext).toString("MMMM dS");
              // console.log(dateNextNextFormatted)

              let tempNextNext = data[16].main.temp;
              // console.log(tempNextNext)

              let tempNextNextRounded = Math.round(tempNextNext);
              // console.log(tempNextNextRounded)

              let tempLowNextNext = data[16].main.temp_min;
              // console.log(tempLowNextNext)

              let tempLowNextNextRounded = Math.round(tempLowNextNext);
              // console.log(tempLowNextNextRounded)

              let conditionNextNext = data[16].weather[0].main;
              // console.log(conditionNextNext)

              let nextNextIcon = data[16].weather[0].icon;
              // console.log(nextNextIcon)

              let nextNextIconUrl = 'http://openweathermap.org/img/w/' + nextNextIcon + '.png'

              // appending 

              $("#todayConditions").html(conditionToday)
              $("#todayTemp").html(tempTodayRounded)
              $("#todayMinTemp").html(tempLowTodayRounded)
              $("#todayIcon").attr("src", todayIconUrl);
              

              $("#day1Date").html(dateNextFormatted)
              $("#day1Temp").html(tempNextRounded)
              $("#day1MinTemp").html(tempLowNextRounded)
              $("#day1Icon").attr("src", nextIconUrl);

              $("#day2Date").html(dateNextNextFormatted)
              $("#day2Temp").html(tempNextNextRounded)
              $("#day2MinTemp").html(tempLowNextNextRounded)
              $("#day2Icon").attr("src", nextNextIconUrl);

              $("#weatherInfoTitle").html(capitalCity + ', ' + countryCode);

        }})} 
      
      })}
         
    
  
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
  // console.log(response.data.news = [])
        let dataInfo = response.data;
        // if (dataInfo.news.title != 'undefined') {
        //   console.log('not undefined news')
  
        // let newsData = dataInfo.news;
  
        // let newsCardData = dataInfo.news
  
        $("#newsData").empty();
  
        if (dataInfo.news != '') {
          for (let i = 0; i < 6; i++) {
            let newsData = dataInfo.news[i];
            let name = newsData.title;
            let date = newsData.publish_date;
            let author = newsData.author;
            let image = newsData.image;
            let link = newsData.url;
  
            // let card = `
            //         <div class="card" style="width: 18rem;" id="newsCards">
            //           <img src="${image}" class="card-img-top" alt="...">
            //           <div class="card-body">
            //             <h5 class="card-title">${name}</h5>
            //             <p class="card-text">${date}</p>
            //             <a href="${link}" class="btn btn-primary">Read More</a>
            //           </div>
            //         </div>
            //       `;
  
            // $("#newsData").append(card);
  
            let newsTable = `
              <table class="table table-borderless">
          <tr>
            <td rowspan="2" width="50%">
              <img class="img-fluid rounded" src="${image}" />
            </td>
            <td>
            <a href="${link}" target="_blank" style="font-weight: bold; color: black;">${name}</a>
            </td>
          </tr>
          <tr>
            <td class="align-bottom pb-0">
              <p class="fw-light fs-6 mb-1">Author: ${author}</p>
            </td>
          </tr>
        </table>
        <hr>
      `;
            $("#newsData").append(newsTable);
            // console.log('news ok!')
          }
        } else if (response.data.news = [])  {
          let newErrorDiv = $("<div>");
          let newsErrorHeading = 'Something went wrong..'
          let newsError = 'Sorry, we could not load country News Information. Please try another option.'
          newErrorDiv.append($("<h5>").text(newsErrorHeading));
          newErrorDiv.append($("<p>").text(newsError));
          $("#newsData").append(newErrorDiv);
// console.log('undefined error')
        


        } else {
          /////////////// HANDING NULL NEWS ERROR WHICH HAS HAPPENED TWICE BEFORE DUE TO THEIR SERVER ERROR ///////////////
          let newErrorDiv = $("<div>");
          let newsErrorHeading = 'Something went wrong..'
          let newsError = 'Sorry, we could not load country News Information. Please try another option.'
          newErrorDiv.append($("<h5>").text(newsErrorHeading));
          newErrorDiv.append($("<p>").text(newsError));
          $("#newsData").append(newErrorDiv);
          // console.log(" credit error");
        }


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
  
      
        for (let i = 0; i < holidayInfo.length; i++) {
          let name = holidayInfo[i].name;
          let date = holidayInfo[i].date;
  
          let dateFormatted = Date.parse(date).toString("MMMM dS");
  
          // console.log(name);
  
          let newRow = $("<tr>");
          /* newRow.append($("<td>").text(""));
              newRow.append($("<td>").text("")); */
          newRow.append($("<td>").text(name));
          newRow.append($("<td>").text(dateFormatted));
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
          let desc = image.alt_description;
  
          let img = document.createElement("img");
          img.src = image.urls.small;
          //   $("#countryImages").append(img);
  
          var images = document.querySelectorAll("img");
  
          // Set all images' ID to "my-image"
          for (var j = 0; j < images.length; j++) {
            images[j].id = "countryImage";
          }
  
          // }
  
          let fig = `
            <figure class="figure text-center">
            <img src="${img.src}" class="figure-img img-fluid rounded" alt="">
            <figcaption class="figure-caption">${desc}</figcaption>
          </figure>
                    `;
  
          $("#countryImages").append(fig);
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
        // console.log(dataInfo.title);
  
        $("#wikiData").empty();
        
  
        // if (dataInfo =! 'undefined') {
          if (dataInfo != '') {
        for (let i = 0; i < dataInfo.length; i++) {
          let wikiData = dataInfo;


          
          let title = wikiData[i].title;
       
  
          let summary = wikiData[i].summary;
  
          let url = wikiData[i].wikipediaUrl;
          // console.log(url)
  
          let card = `
                      <div class="card" style="width: 18rem;" id="wikiCards">
                       
                        <div class="card-body text-center">
                          <h5 class="card-title">${title}</h5>
                          <p class="card-text ">${summary}</p>
                          <a href="https://${wikiData[i].wikipediaUrl}" class="btn btn-success" target="_blank">Read More</a>
                          <button class="btn btn-success" data-bs-dismiss="modal">View on Map</button>
                        </div>
                      </div>
                    `;
  
          $("#wikiData").append(card);
        }} else {
          // console.log('oops wiki error!!')
          let errorCard = `
                      <div class="card" style="width: 18rem;" id="wikiCards">
                       
                        <div class="card-body text-center">
                          <h5 class="card-title">Something went wrong..</h5>
                          <p class="card-text ">Sorry, we could not load country Wiki Information. Please try another option.</p>
                          
                        </div>
                      </div>
                    `;
  
          $("#wikiData").append(errorCard);
        }
        // WIKI MARKERS
  
        
        
        let wikiDataInfo = response.data;
        
        if (wikiDataInfo != '') {

        let wikiDataMarkers = wikiDataInfo;
        // console.log(wikiDataMarkers);
        
        for (let i = 0; i < wikiDataMarkers.length; i++) {
          // iterates through wiki markers
          let wikiMarkerLat = wikiDataMarkers[i].lat;
  
          let wikiMarkerLng = wikiDataMarkers[i].lng;
  
          let wikiMarkerTitle = wikiDataMarkers[i].title; // populating markers with info
          let wikiMarkerUrl = wikiDataMarkers[i].wikipediaUrl;
          // console.log(wikiMarkerUrl)
  
          L.marker([wikiMarkerLat, wikiMarkerLng], { icon: wikiIcon })
            .bindPopup(
              "<div class='col text-center'><strong>" +
                wikiMarkerTitle +
                "</strong><br><i><a target='_blank' href='https://" +
                wikiMarkerUrl +
                "'>" +
                "Find Out More" +
                "</a></i></div>",
              { direction: "top", sticky: true }
            )
            .addTo(wiki);
        } } else {
          
            // console.log('wiki marker error')
          
        }
      }
      }
    );
  }
  
  /////////////////// MODAL BUTTONS VIA EASY BUTTON ///////////////////
  
  // INFO MODAL BUTTON
  
  let displayCountryInfo = L.easyButton(
    '<i class="fa-solid fa-lg fa-info" style="color: #208c07;"></i>',
    function (btn, map) {
      if (countryName === "Select Country") {
        $("#alert").modal("show");
      } else {
        $("#countryInfo").modal("show");
      }
      //   countryInfo();
    },
    "Country Info"
  );
  
  displayCountryInfo.addTo(map);
  
  // WIKI MODAL BUTTON
  
  let displayWikiInfo = L.easyButton(
    '<i class="fa-solid fa-lg fa-w" style="color: #208c07;"></i>',
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
  
  displayWikiInfo.addTo(map);
  
  // NEWS MODAL BUTTON
  
  let displayNewsInfo = L.easyButton(
    '<i class="fa-regular fa-lg fa-newspaper" style="color: #208c07;">',
    function (btn, map) {
      if (countryName === "Select Country") {
        $("#alert").modal("show");
      } else {
        $("#newsInfo").modal("show");
      }
    },
    "News Info"
  );
  
  displayNewsInfo.addTo(map);
  
  // WEATHER MODAL BUTTON
  
  let displayWeatherInfo = L.easyButton(
    '<i class="fa-solid fa-lg fa-sun" style="color: #208c07;"></i>',
    function (btn, map) {
      if (countryName === "Select Country") {
        $("#alert").modal("show");
      } else {
        $("#weatherInfo").modal("show");
        // weatherInfo();
      }
      // weatherInfo();
    },
    "Weather Info"
  );
  
  displayWeatherInfo.addTo(map);
  
  // CALENDAR MODAL BUTTON
  
  let displayCalendarInfo = L.easyButton(
    '<i class="fa-solid fa-lg fa-calendar-days" style="color: #208c07;"></i>',
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
  
  displayCalendarInfo.addTo(map);
  
  // CURRENCY MODAL BUTTON
  
  let displayCurrencyInfo = L.easyButton(
    '<i class="fa-solid fa-lg fa-coins" style="color: #208c07;"></i>',
    function (btn, map) {
      if (countryName === "Select Country") {
        $("#alert").modal("show");
      } else {
        $("#currencyInfo").modal("show");
      }
  
      //   currencyInfo();
    },
    "Currency Info"
  );
  
  displayCurrencyInfo.addTo(map);
  
  // IMAGES MODAL BUTTON
  
  let displayImagesInfo = L.easyButton(
    '<i class="fa-solid fa-lg fa-camera-retro" style="color: #208c07;"></i>',
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
  
  displayImagesInfo.addTo(map);
  
  // HELP MODAL BUTTON
  
  let displayHelpInfo = L.easyButton(
    '<i class="fa-solid fa-lg fa-question" style="color: #208c07;"></i>',
    function (btn, map) {
      $("#helpInfo").modal("show");
  
      helpInfo();
    },
    "Help Info"
  );
  
  displayHelpInfo.setPosition("bottomright").addTo(map);
  
