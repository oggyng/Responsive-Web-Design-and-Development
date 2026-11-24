<?php
// =====================================================================
// includes/auth.php  -  start the session and check the role
// Every role page sets $requiredRole BEFORE including head.php
// (head.php includes this file first, so no HTML is sent before the redirect)
// =====================================================================
if (session_status() === PHP_SESSION_NONE) {
    session_start();
}

// pages sit one folder deep (passenger/, driver/, admin/, analytic/)
$base = '../';

$allowedRoles = ['Passenger', 'Driver', 'Admin', 'Analytic'];

if (!isset($requiredRole) || !in_array($requiredRole, $allowedRoles, true)) {
    http_response_code(500);
    exit('Page setup error: set $requiredRole (Passenger / Driver / Admin / Analytic) before including head.php');
}

// not logged in, or opening another role's page  ->  back to login
if (empty($_SESSION['role']) || $_SESSION['role'] !== $requiredRole) {
    header('Location: ' . $base . 'login.php');
    exit;
}