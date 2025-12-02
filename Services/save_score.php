<?php
include 'db_connect.php';
session_start();

if(!isset($_SESSION['username'])) exit;

$score = intval($_POST['score']);
$username = $_SESSION['username'];

$stmt = $conn->prepare("UPDATE users SET score=? WHERE username=?");
$stmt->bind_param("is",$score,$username);
$stmt->execute();
$stmt->close();
$conn->close();

// Update session score
$_SESSION['score'] = $score;
?>
