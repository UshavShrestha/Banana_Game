<?php
include 'db_connect.php';

$username = $_POST['username'];
$password = password_hash($_POST['password'], PASSWORD_DEFAULT);

$stmt = $conn->prepare("INSERT INTO users (username, password) VALUES (?, ?)");
$stmt->bind_param("ss", $username, $password);

if($stmt->execute()){
    // Redirect to login page with a success message
    header("Location: ../login.html?registered=1");
    exit;
} else {
    echo "Error: " . $conn->error;
}

$stmt->close();
$conn->close();
?>
