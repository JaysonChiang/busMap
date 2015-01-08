<?php
  header('Content-Type: application/json');
  include_once('underscore/underscore.php');

//-----------------------------------------------------
  
  if(isset($_POST['name']) && !empty($_POST['name'])) {
    $stopList = json_decode(stripslashes($_POST['name']));
  } else {
    $stopList = ["榮總一"];
  }

  $getJson0 = file_get_contents("./data/bus-tp-stop.json");
  $jsonStop = json_decode($getJson0, true);

  $busStopArray = $jsonStop['features'];

  $ret3 = __($busStopArray)->filter(function($stop){
    global $stopList;
    return in_array($stop['properties']['bsm_chines'], $stopList);
  });

  echo json_encode($ret3);
?>
