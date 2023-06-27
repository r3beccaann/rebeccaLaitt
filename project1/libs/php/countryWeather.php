<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

//    $url = "https://api.openweathermap.org/data/2.5/weather?q=London,GB&appid=6a48e02a6f3898d055c1ea2e09537dd2";
    $url='http://api.openweathermap.org/data/2.5/forecast?q=' . $_REQUEST['capital'] . ',' . $_REQUEST['countryCode'] . '&appid=6a48e02a6f3898d055c1ea2e09537dd2&units=metric';
	
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

?>
