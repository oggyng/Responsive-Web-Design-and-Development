<?php
// =====================================================================
// includes/header.php  -  the header for the 4 roles (from our wireframe)
// each role has its own menu; logo, icons and fonts are the same for all
// needs $requiredRole and $activePage (set them before including head.php)
// =====================================================================

// [ key (for $activePage), label, file ]
$navByRole = [
    'Passenger' => [
        ['dashboard',  'Dashboard',           'dashboard.php'],
        ['find',       'Find a Ride',         'find-ride.php'],
        ['bookings',   'My Bookings',         'my-bookings.php'],
        ['challenges', 'Challenges & Badges', 'challenges.php'],
    ],
    'Driver' => [
        ['dashboard',  'Dashboard',           'dashboard.php'],
        ['rides',      'My Rides',            'my-rides.php'],
        ['requests',   'Requests',            'requests.php'],
        ['challenges', 'Challenges & Badges', 'challenges.php'],
    ],
    'Admin' => [
        ['dashboard',  'Dashboard',            'dashboard.php'],
        ['verify',     'Driver Verification',  'driver-verification.php'],
        ['users',      'Users',                'users.php'],
        ['reports',    'Reports & Complaints', 'reports.php'],
        ['stations',   'Stations & Fees',      'stations.php'],
    ],
    'Analytic' => [
        ['dashboard',  'Dashboard',  'dashboard.php'],
        ['challenges', 'Challenges', 'challenges.php'],
        ['reports',    'Reports',    'reports.php'],
    ],
];

$navItems    = $navByRole[$requiredRole];
$activePage  = $activePage ?? 'dashboard';
$userName    = $_SESSION['name'] ?? 'User';
$userInitial = strtoupper(mb_substr($userName, 0, 1));
$profilePic  = $_SESSION['profile_pic'] ?? '';   // later: filled from the database
$unreadCount = $unreadCount ?? 0;                // later: count unread notifications from the database
?>
    <header class="main-header role-header">

        <div class="logo-container">
            <img src="<?= $base ?>assets/logo.png" alt="CPU logo" class="nav-logo"><h4>CPU.</h4>
        </div>

        <nav class="header-center" id="navMenu" aria-label="<?= htmlspecialchars($requiredRole) ?> menu">
<?php foreach ($navItems as [$key, $label, $file]): ?>
            <a href="<?= $file ?>" class="nav-item<?= $key === $activePage ? ' active' : '' ?>"<?= $key === $activePage ? ' aria-current="page"' : '' ?>><?= htmlspecialchars($label) ?></a>
<?php endforeach; ?>

            <!-- only shown inside the mobile menu (on desktop these live under the profile picture) -->
            <div class="mobile-only">
                <div class="theme-row">
                    <span class="theme-text" aria-live="polite">Light mode</span>
                    <button type="button" class="theme-switch" role="switch" aria-checked="false" aria-label="Dark mode">
                        <span class="theme-knob"></span>
                    </button>
                </div>
            </div>
            <a href="<?= $base ?>profile.php" class="nav-item mobile-only">My Profile</a>
            <a href="<?= $base ?>logout.php" class="nav-item mobile-only">Log out</a>
        </nav>

        <div class="header-right">

            <a href="<?= $base ?>leaderboard.php" class="icon-btn" aria-label="Leaderboard" title="Leaderboard">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 14.66V17a1 1 0 0 1-1 1 2 2 0 0 0-2 2v2"/><path d="M14 14.66V17a1 1 0 0 0 1 1 2 2 0 0 1 2 2v2"/><path d="M17.916 10H19.5A2.5 2.5 0 0 0 22 7.5V5a1 1 0 0 0-1-1h-3"/><path d="M4 22h16"/><path d="M6 9a6 6 0 0 0 12 0V3a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1z"/><path d="M6.084 10H4.5A2.5 2.5 0 0 1 2 7.5V5a1 1 0 0 1 1-1h3"/></svg>
            </a>

            <a href="<?= $base ?>notifications.php" class="icon-btn" aria-label="Notifications<?= $unreadCount > 0 ? ', ' . (int)$unreadCount . ' unread' : '' ?>" title="Notifications">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10.268 21a2 2 0 0 0 3.464 0"/><path d="M3.262 15.326A1 1 0 0 0 4 17h16a1 1 0 0 0 .74-1.673C19.41 13.956 18 12.499 18 8A6 6 0 0 0 6 8c0 4.499-1.411 5.956-2.738 7.326"/></svg>
<?php if ($unreadCount > 0): ?>
                <span class="notif-badge"><?= $unreadCount > 9 ? '9+' : (int)$unreadCount ?></span>
<?php endif; ?>
            </a>

            <div class="user-menu-wrap">
                <button type="button" class="pfp-btn" id="userMenuBtn" aria-haspopup="true" aria-expanded="false" aria-controls="userMenu" title="<?= htmlspecialchars($userName) ?>">
<?php if ($profilePic): ?>
                    <img src="<?= $base . htmlspecialchars($profilePic) ?>" alt="Your profile picture">
<?php else: ?>
                    <span class="pfp-initial" aria-hidden="true"><?= htmlspecialchars($userInitial) ?></span>
<?php endif; ?>
                </button>
                <div class="user-menu" id="userMenu" hidden>
                    <p class="user-menu-name"><?= htmlspecialchars($userName) ?></p>
                    <p class="user-menu-role"><?= htmlspecialchars($requiredRole) ?></p>
                    <div class="theme-row">
                        <span class="theme-text" aria-live="polite">Light mode</span>
                        <button type="button" class="theme-switch" role="switch" aria-checked="false" aria-label="Dark mode">
                            <span class="theme-knob"></span>
                        </button>
                    </div>
                    <a href="<?= $base ?>profile.php">My Profile</a>
                    <a href="<?= $base ?>logout.php">Log out</a>
                </div>
            </div>

            <button type="button" class="menu-toggle" id="menuToggle" aria-label="Open menu" aria-expanded="false" aria-controls="navMenu">
                <span></span><span></span><span></span>
            </button>
        </div>

    </header>