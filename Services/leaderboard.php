<?php
include 'db_connect.php';
header("Content-Type: application/json");

// Get top 5 players
$sql = "SELECT username, score FROM users ORDER BY score DESC LIMIT 5";
$result = $conn->query($sql);

$topPlayers = [];
while($row = $result->fetch_assoc()){
    $topPlayers[] = $row;
}

echo json_encode($topPlayers);
$conn->close();
?>
