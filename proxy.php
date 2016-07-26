<?php

$url = $_REQUEST["q"];
$resp = file_get_contents($url);
echo $resp;

?>
