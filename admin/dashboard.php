<?php
// test page
$requiredRole = 'Admin';
$pageTitle    = 'Dashboard';
$activePage   = 'dashboard';
$unreadCount  = 3;                 // test only. Later: count from the database

include '../includes/head.php';
include '../includes/header.php';
?>

    <main class="role-main">
        <h1 class="section-title">Admin Dashboard</h1>
        <p class="section-subtitle">Header and footer test page.</p>
    </main>

<?php include '../includes/footer.php'; ?>