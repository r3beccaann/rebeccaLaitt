
<?php

// error reporting
ini_set('display_errors', 'On');
error_reporting(E_ALL);

// gets current time
$executionStartTime = microtime(true);

// for testing
// $countryCode = $_GET['countryCode'];

// full url
// $url = "https://holidayapi.com/v1/holidays?pretty&country=GB&year=2022&key=89d2ad5e-0a46-4e57-87a5-d686b8251912";

// getting country code from request variable
$url = "https://holidayapi.com/v1/holidays?pretty&country=" . $_REQUEST['countryCode'] . "&year=2022&key=89d2ad5e-0a46-4e57-87a5-d686b8251912";

$ch = curl_init(); // creating curl handle
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
$output['data'] = $decode;

header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);

?>
