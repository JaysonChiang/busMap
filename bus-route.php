<?php
header('Content-Type: application/json');
ini_set('memory_limit', '256M');
include_once('underscore/underscore.php');

$busr = json_decode(stripslashes($_POST['routes']));

//$json = '["223","224","288","290","535","645","645副","665","南軟通勤專車天母線","紅12"]';
//$busr = json_decode(stripslashes($json));
//-----------------------------------------------------
/*
$busr = array("223","267","277","285","288","290","508",
"508區","535","601","602","606","645","645副","646","665",
"902","內科通勤專車13","內科通勤專車15",
"南軟通勤專車天母線","小8","紅12","紅19");
*/
$getJson1 = file_get_contents("./data/bus-tp-route.json");
$data1=json_decode($getJson1,true);

$myarray = $data1['features'];
 
$ret5 = __::filter($myarray, function ($route){
	global $busr;
    return in_array($route["properties"]["bad_chines"],$busr);
});

echo json_encode($ret5);
/*
function meme($n){
    return $n;
}
$ing = array_map("meme",$data1['features']);
print_r($ing);
*/
//echo count($busRoutes);
//echo ' ';
//echo count($data1['features']);
//echo ' ';
//echo count($ret5);
//echo ' ';
//echo $data1['features'][3]['properties']['bad_chines'];
?>
