<?php

$executionStartTime = microtime(true);

$ch = curl_init();

$url = "https://api.exchangerate.host/latest?base=GBP";

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
$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
$output['data'] = $decoded['rates'];
	
header('Content-Type: application/json; charset=UTF-8');

echo json_encode($output);  

?>
