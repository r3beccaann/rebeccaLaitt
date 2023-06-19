<?php 

    ini_set('display_errors', 'On');
    error_reporting(E_ALL);

    $executionStartTime = microtime(true);

    $countryBorder = json_decode(file_get_contents("../json/getCountryBorders.json"));


    $features = $countryBorder->features;

    $countryCode = $_GET['countryCode'];

    // $countryCode = 'GB';
   
    $output = "";
for ($i = 0; $i < sizeof($features); $i++) {
    $feature = $features[$i];
    if ($feature->properties->iso_a2 == $countryCode) {
        $output = $feature->geometry;
    }
}
echo(json_encode($output));

?>

