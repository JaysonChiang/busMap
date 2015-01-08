<?php
  if (isset($_GET['url']) && !empty($_GET['url'])) {

	//$url =  mb_convert_encoding($_GET['url'],'UTF-8','HTML-ENTITIES');
$url = $_GET['url'];
	echo file_get_contents($url);
	//echo $url;
  }
?>
