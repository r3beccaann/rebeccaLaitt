<?php 

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $countryData = json_decode(file_get_contents("../json/getCountryBorders.json"));
    // $countryInfo;

    // foreach($countryData['features'] as $feature) {
    //     $name = $feature["properties"]["name"];
	// 	$code = $feature["properties"]["iso_a2"];
    //     $countryInfo[$name] = $code;
    // }

    // // $decode = json_decode($countryData,true);	

	// $output['status']['code'] = "200";
	// $output['status']['name'] = "ok";
	// $output['status']['description'] = "success";
	// $output['status']['returnedIn'] = intval((microtime(true) - $executionStartTime) * 1000) . " ms";
	// $output['data'] = $countryInfo;
	
	// header('Content-Type: application/json; charset=UTF-8');

	// echo json_encode($countryInfo);

    $features = $countryData->features;

$countries = array();
for ($i = 0; $i < sizeof($features); $i++) {
    $feature = $features[$i];
    $countryName = $feature->properties->name;
    $countryIsoA2 = $feature->properties->iso_a2;
    $array = [$countryName, $countryIsoA2];
    array_push($countries, $array);
}
usort($countries, function ($a, $b) {
    return strcasecmp($a[0], $b[0]);
});
echo(json_encode($countries));
?>