<?php

// gets current time
$executionStartTime = microtime(true);

// loads file into countryBorder variable
$countryBorder = json_decode(file_get_contents("../json/getCountryBorders.geo.json"));

// assigns features within countryBorder to features variable
$features = $countryBorder->features;

// getting country code
$countryCode = $_GET['countryCode'];

// $countryCode = 'GB';

// iterating through the features array, checking the country code of the border is equal to the country code in the GET request
$output = "";
for ($i = 0; $i < sizeof($features); $i++) {
    $feature = $features[$i];
    if ($feature->properties->iso_a2 == $countryCode) {
        $output = $feature->geometry;
    }
}
echo (json_encode($output));

?>
