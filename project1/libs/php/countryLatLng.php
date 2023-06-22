<?php

//$url = "http://api.geonames.org/countryCodeJSON?lat=51.5072&lng=0.1276&username=loud_task";

$lat = $_GET['lat'];
$lng = $_GET['lng'];

$data = file_get_contents("http://api.geonames.org/countryCodeJSON?lat=$lat&lng=$lng&username=rebeccalaitt");

$json = json_decode($data, true);
echo json_encode($json);



?>
