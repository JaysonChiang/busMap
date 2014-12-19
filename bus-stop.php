<?php
  header('Content-Type: application/json');
  include_once('underscore/underscore.php');

//-----------------------------------------------------

  if(isset($_GET['name']) && !empty($_GET['name'])) {
    $getQuery = $_GET['name'];
  } else {
    $getQuery = "榮總一";
  }
  
  $getJson0 = file_get_contents("./data/bus-tp-stop.json");
  $data0 = json_decode($getJson0, true);

  $myBusStopArray = $data0['features'];

  $ret3 = __($myBusStopArray)->filter(function($bus){
    global $getQuery;
    return strcmp($bus['properties']['bsm_chines'],$getQuery)==0;
  });

  echo json_encode($ret3);
?>
