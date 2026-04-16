<?php
include 'db.php';

$text = $_POST['text'];
$amount = $_POST['amount'];
$date = $_POST['date'];

$conn->query("INSERT INTO transactions (text, amount, date)
VALUES ('$text','$amount','$date')");
?>