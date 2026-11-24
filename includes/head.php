<?php
// =====================================================================
// includes/head.php  -  <head> + opens <body>
// set before including:  $requiredRole, $pageTitle, $activePage
// optional:  $extraCss = ['style/passenger.css'];  $extraJs = ['js/passenger.js'];
// =====================================================================
require __DIR__ . '/auth.php';

$pageTitle = $pageTitle ?? 'Dashboard';
$extraCss  = $extraCss ?? [];
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <script>
        // same theme check as the landing page, plus a path for common.js (sound file)
        window.CPU_BASE = '<?= $base ?>';
        (function () {
            var theme = null;
            try { theme = localStorage.getItem('theme'); } catch (e) {}
            if (!theme) { theme = 'light'; }
            document.documentElement.setAttribute('data-theme', theme);
        })();
    </script>

    <link rel="stylesheet" href="<?= $base ?>style/base.css">
    <link rel="stylesheet" href="<?= $base ?>style/role.css">
<?php foreach ($extraCss as $css): ?>
    <link rel="stylesheet" href="<?= $base . htmlspecialchars($css) ?>">
<?php endforeach; ?>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Titan+One&family=Nunito:wght@700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=DynaPuff:wght@400..700&display=swap" rel="stylesheet">

    <title><?= htmlspecialchars($pageTitle) ?> - CPU - Carpooling University</title>
</head>
<body class="role-page role-<?= strtolower($requiredRole) ?>">