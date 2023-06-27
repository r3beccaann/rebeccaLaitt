<?php

// gets current time
$executionStartTime = microtime(true);

// creating curl handle
$ch = curl_init();

// setting URL to below
// $url = "https://api.exchangerate.host/latest?base=" . $_REQUEST['currencyCode'];
$url = "https://api.exchangerate-api.com/v4/latest/" . $_REQUEST['currencyCode'];

// $url = "https://v6.exchangerate-api.com/v6/e35f3038e01c65e2f9c51153/pair/" . $_REQUEST['baseCurr'] . $_REQUEST['toCurr'] . $_REQUEST['value'];

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

curl_close($ch); // closes the curl handle

$output['status']['code'] = "200"; 
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decoded['rates'];
	
header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);  

?>