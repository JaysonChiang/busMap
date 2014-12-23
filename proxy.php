<?php
  if (isset($_GET['url']) && !empty($_GET['url'])) {

	$url =  mb_convert_encoding($_GET['url'],'UTF-8','HTML-ENTITIES');

	echo file_get_contents($url);
  }
?>
