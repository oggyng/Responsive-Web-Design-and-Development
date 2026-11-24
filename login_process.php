<?php
session_start();
include 'dbconn.php';
header('Content-Type: application/json');

$userID   = strtoupper(trim($_POST['userID'] ?? ''));
$password = $_POST['password'] ?? '';

// 1. use Studend ID to find user
$stmt = mysqli_prepare($conn,
    "SELECT userID, name, password, role, profilePicturePath, status
     FROM user WHERE userID = ?");
mysqli_stmt_bind_param($stmt, "s", $userID);
mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);
$user = mysqli_fetch_assoc($result);

// 2. cannot find (remind without showing either student ID or password wrong)
if (!$user || !password_verify($password, $user['password'])) {
    echo json_encode(['ok' => false, 'error' => 'wrong']);
    exit;
}

// 3. suspended acc cannot access
if ($user['status'] === 'Suspended') {
    echo json_encode(['ok' => false, 'error' => 'suspended']);
    exit;
}

// 4. Success：change new session ID (safer) then only store the data to session
session_regenerate_id(true);
$_SESSION['userID']      = $user['userID'];
$_SESSION['name']        = $user['name'];
$_SESSION['role']        = $user['role'];
$_SESSION['profile_pic'] = $user['profilePicturePath'] ?? '';

// 5. access to dashboard according to the role
$pages = [
    'Passenger' => 'passenger/dashboard.php',
    'Driver'    => 'driver/dashboard.php',
    'Admin'     => 'admin/dashboard.php',
    'Analytic'  => 'analytic/dashboard.php',
];
echo json_encode(['ok' => true, 'redirect' => $pages[$user['role']]]);