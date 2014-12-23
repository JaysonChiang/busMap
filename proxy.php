<?php
  if (isset($_GET['url']) && !empty($_GET['url'])) {
//$myurl =  json_decode(stripslashes($_GET['url']));
//$url='http://pda.5284.com.tw/MQS/businfo2.jsp?routename=內科通勤專車10';
//echo $_GET['url'];    


$url =  mb_convert_encoding($_GET['url'],'UTF-8','HTML-ENTITIES');


//  echo $_GET['url'];


//  echo file_get_contents($_GET['url']);


//echo file_get_contents($myurl[0]);
echo file_get_contents($url);
  }
?>
