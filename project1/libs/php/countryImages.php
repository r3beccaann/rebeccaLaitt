<?php

// error reporting
// ini_set('display_errors', 'On');
// error_reporting(E_ALL);

// gets current time
$executionStartTime = microtime(true);

// getting country code from request variable
$url = "https://api.unsplash.com/search/photos/?page=1&query=" . $_REQUEST['country'] . "&client_id=uEs0Cw8VIAFBtgCCjJ030MUJ8LouIQz5pv5HZS1TjEU";

$ch = curl_init();
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);  // disables SSL certificate verification
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true); // ensures the response from the API is a string
curl_setopt($ch, CURLOPT_URL, $url);

// makes the request to the API
$result = curl_exec($ch); // response is stored in this variable

curl_close($ch); // closes the curl handle

$decode = json_decode($result, true); // decodes the response from the API as a a JSON object

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decode['results'];

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);
