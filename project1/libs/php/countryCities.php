<?php

// gets current time
$executionStartTime = microtime(true) / 1000;

// creating curl handle
$ch = curl_init();

// getting bounds from request variable
// $url = 'http://api.geonames.org/citiesJSON?north=' . $_REQUEST['northBounds'] . '&south=' . $_REQUEST['southBounds'] . '&east=' . $_REQUEST['eastBounds'] . '&west=' . $_REQUEST['westBounds'] . '&lang=en&username=rebeccalaitt';
$url = 'http://api.geonames.org/searchJSON?country=' . $_REQUEST['countryCode'] . '&cities=cities15000&username=rebeccalaitt&maxRows=50';

// $url = 'http://api.geonames.org/searchJSON?country= ' . $_REQUEST['countryCode'] . '&cities=cities15000&username=rebeccalaitt&maxRows=50';

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // ensures the response from the API is a string
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // disables SSL certificate verification

// makes the request to the API
$resp = curl_exec($ch); // response is stored in this variable

// error message if error
if ($e = curl_error($ch)) {
    echo $e;
} else {
    $decoded = json_decode($resp, true); // decodes the response from the API as a a JSON object
}

curl_close($ch);  // closes the curl handle

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";

header('Content-Type: application/json; charset=UTF-8'); 

echo json_encode($decoded);

?>
