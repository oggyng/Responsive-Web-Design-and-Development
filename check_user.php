<?php
include 'dbconn.php';
header('Content-Type: application/json');

$userID = strtoupper(trim($_POST['userID'] ?? ''));

$stmt = mysqli_prepare($conn, "SELECT status FROM user WHERE userID = ?");
mysqli_stmt_bind_param($stmt, "s", $userID);     // "s" = string
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

if (mysqli_num_rows($result) == 0) {
    echo json_encode(['ok' => false, 'error' => 'notfound']);
} else {
    $row = mysqli_fetch_assoc($result);
    if ($row['status'] === 'Suspended') {
        echo json_encode(['ok' => false, 'error' => 'suspended']);
    } else {
        echo json_encode(['ok' => true]);
    }
}