<?php
header('Content-Type: application/json');
include_once('underscore/underscore.php');

//-----------------------------------------------------
$getQuery = "榮總一";
//$getQuery = $_GET[name];
$getJson0 = file_get_contents("./data/bus-tp-stop.json");
$data0=json_decode($getJson0,true);

$myBusStopArray = $data0['features'];

$ret3 = __($myBusStopArray)->filter(function($bus){
// return strcmp($bus['properties']['bsm_chines'],$getiQuery)==0;
    return $bus['properties']['bsm_chines']==="榮總一";
});
echo json_encode($ret3);
?>
