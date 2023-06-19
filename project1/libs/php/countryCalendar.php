
<?php
ini_set('display_errors', 'On');
error_reporting(E_ALL);

$executionStartTime = microtime(true);

// $countryCode = $_GET['countryCode'];


// $url = "https://holidayapi.com/v1/holidays?pretty&country=GB&year=2022&key=89d2ad5e-0a46-4e57-87a5-d686b8251912";

$url = "https://holidayapi.com/v1/holidays?pretty&country=" . $_REQUEST['countryCode'] . "&year=2022&key=89d2ad5e-0a46-4e57-87a5-d686b8251912";

$ch = curl_init();
	curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
	curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
	curl_setopt($ch, CURLOPT_URL,$url);

	$result=curl_exec($ch);

	curl_close($ch);

	$decode = json_decode($result,true);	

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	$output['data'] = $decode;
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 
