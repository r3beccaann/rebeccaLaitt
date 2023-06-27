<?php

// gets current time
$executionStartTime = microtime(true) / 1000;

// creating curl handle
$ch = curl_init();

// getting country code
$countryCode = $_GET['countryCode'];

// below used to test path
// $countryCode = 'GB'; 

// getting country code from request variable
$url = "https://restcountries.com/v2/alpha/" . $countryCode;


curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);  // ensures the response from the API is a string
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // disables SSL certificate verification

// makes the request to the API
$resp = curl_exec($ch); // response is stored in this variable

// error message if error
if ($e = curl_error($ch)) {
    echo $e;
} else {
    $decoded = json_decode($resp, true); // decodes the response from the API as a a JSON object
}

curl_close($ch); // closes the curl handle


$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decoded;

header('Content-Type: application/json; charset=UTF-8'); 

echo json_encode($output);  

?>
