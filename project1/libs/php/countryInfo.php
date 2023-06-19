<?php

$executionStartTime = microtime(true) / 1000;

$ch = curl_init();

$countryCode = $_GET['countryCode'];
// $countryCode = 'GB'; 
// ^^ USED TO TEST JSON PATH ETC.

$url = "https://restcountries.com/v2/alpha/" . $countryCode;



curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

$resp = curl_exec($ch);

if ($e = curl_error($ch)) {
    echo $e;
} else {
    $decoded = json_decode($resp, true);
}

curl_close($ch);


$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decoded;

header('Content-Type: application/json; charset=UTF-8'); 

echo json_encode($output);  

?>