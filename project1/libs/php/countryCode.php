<?php

// gets current time
$executionStartTime = microtime(true);

// loads file into countryData variable
$countryData = json_decode(file_get_contents('../json/getCountryBorders.geo.json'));

// assigns features within countryData to features variable
$features = $countryData->features;

// iterates through features array. for each country, we get the country name and ISO-A2 code which are stored in an array and pushed into the countries array
$countries = array();
for ($i = 0; $i < sizeof($features); $i++) {
    $feature = $features[$i];
    $countryName = $feature->properties->name;
    $countryIsoA2 = $feature->properties->iso_a2;
    $array = [$countryName, $countryIsoA2];
    array_push($countries, $array);
}
usort($countries, function ($a, $b) { // sorts the countries by country name
    return strcasecmp($a[0], $b[0]); // compares the country names in a case insensitive way
});
echo(json_encode($countries));



?>
