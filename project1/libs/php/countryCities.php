<?php

$executionStartTime = microtime(true) / 1000;

// Initiate curl session
$ch = curl_init();

//Info variables 

/* $north = $_GET['northBounds'];
$south = $_GET['southBounds'];
$east = $_GET['eastBounds'];
$west = $_GET['westBounds'];  */

//$url='http://api.geonames.org/citiesJSON?north=58.63500010846633&south=49.95999990498108&east=1.681530795914739&west=-7.572167934591079&lang=en&username=loud_task';

$url = 'http://api.geonames.org/citiesJSON?north=' . $_REQUEST['northBounds'] . '&south=' . $_REQUEST['southBounds'] . '&east=' . $_REQUEST['eastBounds'] . '&west=' . $_REQUEST['westBounds'] . '&lang=en&username=rebeccalaitt';

//$countryCities = file_get_contents("http://api.geonames.org/citiesJSON?north=58.63500010846633&south=49.95999990498108&east=1.681530795914739&west=-7.572167934591079&lang=en&username=loud_task");
//echo($info);

curl_setopt($ch, CURLOPT_URL, $url);
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);

// curl execute and variable store
$resp = curl_exec($ch);

if ($e = curl_error($ch)) {
    echo $e;
} else {
    $decoded = json_decode($resp, true);
    //print_r($decoded);
}

curl_close($ch);

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['executedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
//$output['data'] = $decoded;

header('Content-Type: application/json; charset=UTF-8'); 

echo json_encode($decoded);

?>