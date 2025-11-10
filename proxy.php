<?php
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");

$url = "http://marcconrad.com/uob/banana/api.php?out=json";
$response = file_get_contents($url);
echo $response;
?>
