<?php
  header('Content-Type: application/json');
  include_once('underscore/underscore.php');

//-----------------------------------------------------
$stopList = json_decode(stripslashes($_POST['name']));
  /*
  if(isset($_GET['name']) && !empty($_GET['name'])) {
    $getQuery = $_GET['name'];
  } else {
    $getQuery = "榮總一";
  }
  */
  $getJson0 = file_get_contents("./data/bus-tp-stop.json");
  $jsonStop = json_decode($getJson0, true);

  $myBusStopArray = $jsonStop['features'];

  $ret3 = __($myBusStopArray)->filter(function($stop){
    global $stopList;
    return in_array($stop['properties']['bsm_chines'],$stopList);
  });

  echo json_encode($ret3);
?>
