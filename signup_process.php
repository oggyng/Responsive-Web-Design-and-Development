<?php
// =====================================================================
// signup_process.php  -  saves a new Passenger / Driver (called by signup.php)
// success -> login.php        problem -> signup.php?error=exists | invalid | upload | server
// =====================================================================
include 'dbconn.php';

// go back to the sign up page with a message (signup.php shows it)
function back($key) {
    header('Location: signup.php?error=' . $key);
    exit;
}

// does this value already exist? (prepared statement, used for the student ID and the plate)
function alreadyExists($conn, $sql, $value) {
    $stmt = mysqli_prepare($conn, $sql);
    mysqli_stmt_bind_param($stmt, "s", $value);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    return mysqli_num_rows($result) > 0;
}

// check one uploaded photo and save it. returns the saved path, or false if something is wrong
function saveImage($field, $folder, $userID) {
    if (!isset($_FILES[$field]) || $_FILES[$field]['error'] !== UPLOAD_ERR_OK) return false;
    $file = $_FILES[$field];

    if ($file['size'] > 5 * 1024 * 1024) return false;                 // max 5 MB

    $types = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
    $mime  = mime_content_type($file['tmp_name']);                      // the real file type, not just the name
    if (!isset($types[$mime])) return false;

    if (!is_dir($folder)) mkdir($folder, 0755, true);
    $path = $folder . '/' . $userID . '_' . time() . '.' . $types[$mime];
    return move_uploaded_file($file['tmp_name'], $path) ? $path : false;
}

// only accept a form that was really submitted
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('Location: signup.php');
    exit;
}

// 1. read what the form sent
$role      = $_POST['role'] ?? '';
$userID    = strtoupper(trim($_POST['userID'] ?? ''));
$password  = $_POST['password'] ?? '';
$confirm   = $_POST['confirm'] ?? '';
$name      = trim($_POST['name'] ?? '');
$gender    = $_POST['gender'] ?? '';
$phone     = preg_replace('/\D/', '', $_POST['phone'] ?? '');     // keep digits only
$dob       = $_POST['dob'] ?? '';
$stationID = $_POST['stationID'] ?? '';
$isDriver  = ($role === 'Driver');

// 2. check it again (JavaScript already did, but never trust the browser)
if (!in_array($role, ['Passenger', 'Driver'], true))                        back('invalid');
if (!preg_match('/^TP\d{6}$/', $userID))                                    back('invalid');
if (strlen($password) < 8 || strlen($password) > 72)                        back('invalid');
if (!preg_match('/[A-Za-z]/', $password) || !preg_match('/\d/', $password)) back('invalid');
if ($password !== $confirm)                                                 back('invalid');
if ($name === '' || mb_strlen($name) > 30)                                  back('invalid');
if (!in_array($gender, ['Male', 'Female'], true))                           back('invalid');
if (!preg_match('/^01\d{8,9}$/', $phone))                                   back('invalid');

$dobDate = DateTime::createFromFormat('Y-m-d', $dob);
if (!$dobDate || $dobDate->format('Y-m-d') !== $dob || $dobDate > new DateTime('-16 years')) back('invalid');

// the station must be in our list
if (!alreadyExists($conn, "SELECT stationID FROM station WHERE stationID = ?", $stationID)) back('invalid');

// driver only: plate and seats
if ($isDriver) {
    $plate   = strtoupper(preg_replace('/\s+/', ' ', trim($_POST['plate'] ?? '')));
    $maxSeat = (int) ($_POST['maxSeat'] ?? 0);

    if (!preg_match('/^[A-Z0-9 ]{2,13}$/', $plate) || !preg_match('/[A-Z]/', $plate) || !preg_match('/\d/', $plate)) back('invalid');
    if ($maxSeat < 1 || $maxSeat > 6) back('invalid');
}

// 3. already registered?
if (alreadyExists($conn, "SELECT userID FROM user WHERE userID = ?", $userID)) back('exists');
if ($isDriver && alreadyExists($conn, "SELECT userID FROM driver WHERE carPlateNumber = ?", $plate)) back('invalid');

// 4. driver only: save the two photos
if ($isDriver) {
    $carPath     = saveImage('carImage', 'uploads/cars', $userID);
    $licensePath = saveImage('licenseImage', 'uploads/licences', $userID);
    if (!$carPath || !$licensePath) {
        if ($carPath)     unlink($carPath);          // one worked, one failed: remove the one that worked
        if ($licensePath) unlink($licensePath);
        back('upload');
    }
}

// 5. save to the database
$hash = password_hash($password, PASSWORD_DEFAULT); // never store the real password

try {
    mysqli_begin_transaction($conn); // user + driver are saved together, or not at all

    $stmt = mysqli_prepare($conn,
        "INSERT INTO user (userID, name, gender, phoneNumber, dob, password, role, stationID)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)");
    mysqli_stmt_bind_param($stmt, "ssssssss", $userID, $name, $gender, $phone, $dob, $hash, $role, $stationID);
    mysqli_stmt_execute($stmt);

    if ($isDriver) {
        // verifyStatus is not sent: the table sets it to 'Pending' by itself
        $stmt = mysqli_prepare($conn,
            "INSERT INTO driver (userID, carPlateNumber, carImagePath, driverLicenseImagePath, maxSeat)
             VALUES (?, ?, ?, ?, ?)");
        mysqli_stmt_bind_param($stmt, "ssssi", $userID, $plate, $carPath, $licensePath, $maxSeat);
        mysqli_stmt_execute($stmt);
    }

    mysqli_commit($conn);
} catch (mysqli_sql_exception $e) {
    mysqli_rollback($conn); // something failed: undo everything
    if ($isDriver) { unlink($carPath); unlink($licensePath); }
    back('server');
}

// 6. done: go and log in
header('Location: login.php');
exit;