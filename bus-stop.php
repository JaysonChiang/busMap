<?php
header('Content-Type: application/json');
include_once('underscore/underscore.php');

//-----------------------------------------------------
$getJson0 = file_get_contents("./data/bus-tp-stop.json");
$data0=json_decode($getJson0,true);

$myBusStopArray = $data0['features'];

$ret3 = __($myBusStopArray)->filter(function($bus){
    return $bus['properties']['bsm_chines']==='榮總一';
});
echo json_encode($ret3);
?>
