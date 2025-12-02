<?php
include 'db_connect.php';
session_start();

$username = $_POST['username'];
$password = $_POST['password'];

$stmt = $conn->prepare("SELECT * FROM users WHERE username=?");
$stmt->bind_param("s", $username);
$stmt->execute();
$result = $stmt->get_result();

if($result->num_rows === 1){
    $user = $result->fetch_assoc();
    if(password_verify($password, $user['password'])){
        $_SESSION['username'] = $username;
        $_SESSION['score'] = $user['score'];
        header("Location: ../index.php");
        exit;
    } else {
        echo "Wrong password! <a href='login.html'>Try again</a>";
    }
} else {
    echo "User not found! <a href='login.html'>Try again</a>";
}

$stmt->close();
$conn->close();
?>
