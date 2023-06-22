<?php

$executionStartTime = microtime(true);

$countryData = json_decode(file_get_contents('../json/getCountryBorders.geo.json'));

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
