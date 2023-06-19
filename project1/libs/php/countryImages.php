<?php

	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);

    // $url='https://api.unsplash.com/search/photos/?page=1&query=Italy&client_id=DJ-VQYgmz14UuQwht7OBfkaRPpbCMYmFgWV6NYiikrE';
	$url="https://api.unsplash.com/search/photos/?page=1&query=" . $_REQUEST['country'] . "&client_id=uEs0Cw8VIAFBtgCCjJ030MUJ8LouIQz5pv5HZS1TjEU";

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
	$output['data'] = $decode['results'];
	
	header('Content-Type: application/json; charset=UTF-8');

	echo json_encode($output); 

?>