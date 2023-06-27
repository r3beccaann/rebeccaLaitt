<?php

// url for testing
//$url = "http://api.geonames.org/countryCodeJSON?lat=51.5072&lng=0.1276&username=rebeccalaitt";

// lat and lng are received and stores into variables
$lat = $_GET['lat'];
$lng = $_GET['lng'];

// getting lat and lng from request variable
$data = file_get_contents("http://api.geonames.org/countryCodeJSON?lat=$lat&lng=$lng&username=rebeccalaitt");

$json = json_decode($data, true);  // decodes the response from the API as a a JSON object
echo json_encode($json);



?>
