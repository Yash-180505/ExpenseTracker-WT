<?php
include 'db.php';

$res = $conn->query("SELECT * FROM transactions");
$data = [];

while($row = $res->fetch_assoc()){
    $data[] = $row;
}

echo json_encode($data);
?>