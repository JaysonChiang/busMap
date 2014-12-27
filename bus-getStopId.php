<?php
  header('Content-Type: application/json');
  include_once('underscore/underscore.php');
// $url = '//www.example.com/path?googleguy=googley';

$stopList = json_decode(stripslashes($_POST['list']));

$output = __::map($stopList, function($link){



  $url = "http://pda.5284.com.tw/MQS/".$link;
//$url = "http://pda.5284.com.tw/MQS/"."businfo3.jsp?Dir=1&Route=268&Stop=%E6%95%AC%E6%A5%AD%E4%B8%89%E8%B7%AF%E4%BA%8C";
$ch = curl_init();
  curl_setopt($ch, CURLOPT_URL, $url);
  curl_setopt($ch, CURLOPT_HEADER, TRUE);
  curl_setopt($ch, CURLOPT_FOLLOWLOCATION, FALSE);
  curl_setopt($ch, CURLOPT_RETURNTRANSFER, TRUE);

$a = curl_exec($ch);
if(preg_match('#Location: (.*)#', $a, $r)){
 $l = trim($r[1]);
}


//http://pda.5284.com.tw/MQS/businfo4.jsp?SLID=112
$busId = substr($l, 45, strlen($l));
return $busId;
});


echo json_encode($output);
?>
