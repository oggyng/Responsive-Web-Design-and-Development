<?php
include 'dbconn.php';

$stations = [];
$result = mysqli_query($conn, "SELECT stationID, stationName FROM station ORDER BY stationName");
while ($row = mysqli_fetch_assoc($result)) {
    $stations[$row['stationID']] = $row['stationName'];
}

$errorMessages = [
    'exists'  => 'That student ID is already registered. Try logging in instead.',
    'invalid' => 'Some details were not valid. Please check and try again.',
    'upload'  => 'We could not upload your photos. Please try again.',
    'server'  => 'Something went wrong on our side. Please try again.',
];
$errorKey  = $_GET['error'] ?? '';
$errorText = $errorMessages[$errorKey] ?? '';
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">

    <script>
        (function () {
            var theme = null;
            try { theme = localStorage.getItem('theme'); } catch (e) {}
            if (!theme) { theme = 'light'; }
            document.documentElement.setAttribute('data-theme', theme);
        })();
    </script>

    <link rel="stylesheet" href="style/base.css">
    <link rel="stylesheet" href="style/auth.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Titan+One&family=Nunito:wght@700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=DynaPuff:wght@400..700&display=swap" rel="stylesheet">

    <title>Join CPU - Carpooling University</title>
    <noscript><style>.auth-step[hidden] { display: grid !important; }</style></noscript>
</head>
<body class="auth-page">

    <header class="main-header">
        <a class="logo-container" href="index.html">
            <img src="assets/logo.png" alt="CPU logo" class="nav-logo"><h4>CPU.</h4>
        </a>

        <div class="header-right">
            <a href="index.html" class="nav-btn">Back to home</a>
        </div>

        <button class="pull-switch" id="themeToggle" type="button"
                aria-label="Switch light or dark mode" aria-pressed="false"
                title="Pull to switch theme">
            <span class="cord"></span>
            <span class="mascot">
                <img class="mascot-light" src="assets/mascot-light.png" alt="">
                <img class="mascot-dark" src="assets/mascot-dark.png" alt="">
            </span>
        </button>
    </header>

    <main class="auth-main">
        <div class="auth-wrap">

            <!-- left: star reaction -->
            <aside class="auth-side">
                <div class="mascot-stage">
                    <p class="mascot-bubble" id="mascotBubble" role="status" aria-live="polite">Hi! Who's joining CPU today?</p>
                    <div class="mascot-move" id="mascotMove">
                        <div class="mascot-faces">
                            <img class="face is-on" data-mood="normal"   src="assets/feeling-normal.png"   alt="">
                            <img class="face"       data-mood="thinking" src="assets/feeling-thinking.png" alt="">
                            <img class="face"       data-mood="happy"    src="assets/feeling-happy.png"    alt="">
                        </div>
                    </div>
                </div>
            </aside>

            <!-- right: the form, one small step at a time -->
            <section class="auth-card" aria-labelledby="authTitle">
                <div class="auth-progress" id="authProgress" aria-hidden="true"></div>
                <p class="auth-step-label" id="stepLabel">Step 1 of 3</p>
                <h1 class="auth-title" id="authTitle">Join CPU</h1>

                <?php if ($errorText !== ''): ?>
                    <p class="auth-error" role="alert"><?= htmlspecialchars($errorText, ENT_QUOTES, 'UTF-8') ?></p>
                <?php endif; ?>

                <form id="signupForm" method="post" action="signup_process.php" enctype="multipart/form-data" novalidate>

                    <!-- Select Role - Driver / Passenger -->
                    <div class="auth-step" data-step="role">
                        <h2 class="step-heading">Who are you?</h2>
                        <div class="role-group form-group">
                            <div class="role-grid">
                                <label class="role-card">
                                    <input type="radio" name="role" value="Passenger">
                                    <img src="assets/passenger.png" alt="Passenger">
                                    <span class="role-type">Passenger</span>
                                    <span class="role-check" aria-hidden="true">&#10003;</span>
                                </label>
                                <label class="role-card">
                                    <input type="radio" name="role" value="Driver">
                                    <img src="assets/driver.png" alt="Driver">
                                    <span class="role-type">Driver</span>
                                    <span class="role-check" aria-hidden="true">&#10003;</span>
                                </label>
                            </div>
                            <p class="field-error" data-error-for="role"></p>
                        </div>
                    </div>

                    <!-- Account Details -->
                    <div class="auth-step" data-step="account" hidden>
                        <h2 class="step-heading">Create your account</h2>

                        <div class="form-group">
                            <label for="userID">Student ID</label>
                            <input id="userID" name="userID" type="text" placeholder="TP012345" maxlength="8"
                                   autocomplete="username" autocapitalize="characters" spellcheck="false" required>
                            <small class="hint">TP followed by 6 numbers</small>
                            <p class="field-error" data-error-for="userID"></p>
                        </div>

                        <div class="form-group">
                            <label for="password">Password</label>
                            <div class="password-field">
                                <input id="password" name="password" type="password" maxlength="72"
                                       autocomplete="new-password" required>
                                <button type="button" class="eye" data-toggle="password" aria-label="Show password">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><line class="eye-slash" x1="4" y1="4" x2="20" y2="20"/></svg>
                                </button>
                            </div>
                            <div class="strength" id="pwStrength" data-level="0">
                                <span class="strength-bars" aria-hidden="true"><i></i><i></i><i></i></span>
                                <span class="strength-text" id="pwStrengthText" aria-live="polite"></span>
                            </div>
                            <small class="hint">At least 8 characters, with a letter and a number</small>
                            <p class="field-error" data-error-for="password"></p>
                        </div>

                        <div class="form-group">
                            <label for="confirm">Confirm password</label>
                            <div class="password-field">
                                <input id="confirm" name="confirm" type="password" maxlength="72"
                                       autocomplete="new-password" required>
                                <button type="button" class="eye" data-toggle="confirm" aria-label="Show password">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><line class="eye-slash" x1="4" y1="4" x2="20" y2="20"/></svg>
                                </button>
                            </div>
                            <p class="field-error" data-error-for="confirm"></p>
                        </div>
                    </div>

                    <!-- Profile -->
                    <div class="auth-step" data-step="profile" hidden>
                        <h2 class="step-heading">About you</h2>

                        <div class="form-group">
                            <label for="name">Name</label>
                            <input id="name" name="name" type="text" maxlength="30" autocomplete="name" required>
                            <p class="field-error" data-error-for="name"></p>
                        </div>

                        <div class="form-group">
                            <span class="label-like">Gender</span>
                            <div class="pill-group" role="radiogroup" aria-label="Gender">
                                <label class="pill"><input type="radio" name="gender" value="Male"><span>Male</span></label>
                                <label class="pill"><input type="radio" name="gender" value="Female"><span>Female</span></label>
                            </div>
                            <p class="field-error" data-error-for="gender"></p>
                        </div>

                        <div class="form-group">
                            <label for="phone">Phone number</label>
                            <input id="phone" name="phone" type="tel" maxlength="13" placeholder="0123456789"
                                autocomplete="tel" inputmode="numeric" required>
                            <p class="field-error" data-error-for="phone"></p>
                        </div>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="dob">Date of birth</label>
                                <input id="dob" name="dob" type="date" autocomplete="bday" required>
                                <p class="field-error" data-error-for="dob"></p>
                            </div>

                            <div class="form-group">
                                <label for="stationID">Pickup station</label>
                                <select id="stationID" name="stationID" required>
                                    <option value="" selected disabled>Choose a station</option>
                                    <?php foreach ($stations as $id => $stationName): ?>
                                        <option value="<?= htmlspecialchars($id, ENT_QUOTES, 'UTF-8') ?>"><?= htmlspecialchars($stationName, ENT_QUOTES, 'UTF-8') ?></option>
                                    <?php endforeach; ?>
                                </select>
                                <p class="field-error" data-error-for="stationID"></p>
                            </div>
                        </div>
                    </div>

                    <!-- Vehicle - Driver ONLY -->
                    <div class="auth-step" data-step="vehicle" hidden>
                        <h2 class="step-heading">Your car</h2>

                        <div class="form-row">
                            <div class="form-group">
                                <label for="plate">Car plate number</label>
                                <input id="plate" name="plate" type="text" maxlength="13" placeholder="ABC 1234"
                                       autocapitalize="characters" spellcheck="false" required>
                                <p class="field-error" data-error-for="plate"></p>
                            </div>

                            <div class="form-group">
                                <label for="maxSeat">Seats for passengers</label>
                                <select id="maxSeat" name="maxSeat" required>
                                    <option value="" selected disabled>Choose</option>
                                    <?php for ($i = 1; $i <= 6; $i++): ?>
                                        <option value="<?= $i ?>"><?= $i ?></option>
                                    <?php endfor; ?>
                                </select>
                                <p class="field-error" data-error-for="maxSeat"></p>
                            </div>
                        </div>

                        <div class="upload-grid">
                            <div class="upload-box">
                                <span class="label-like">Car photo (front)</span>
                                <label class="upload-drop" for="carImage">
                                    <img class="upload-preview" src="assets/example-car.png" alt="Example of a front photo of a car">
                                    <span class="upload-cta">Choose photo</span>
                                </label>
                                <input class="upload-input" id="carImage" name="carImage" type="file"
                                       accept="image/png,image/jpeg,image/webp" required>
                                <small class="hint">Show the whole front, plate visible</small>
                                <p class="field-error" data-error-for="carImage"></p>
                            </div>

                            <div class="upload-box">
                                <span class="label-like">Driver licence</span>
                                <label class="upload-drop" for="licenseImage">
                                    <img class="upload-preview" src="assets/example-license.png" alt="Example of a driver licence photo">
                                    <span class="upload-cta">Choose photo</span>
                                </label>
                                <input class="upload-input" id="licenseImage" name="licenseImage" type="file"
                                       accept="image/png,image/jpeg,image/webp" required>
                                <small class="hint">Clear and readable, nothing covered</small>
                                <p class="field-error" data-error-for="licenseImage"></p>
                            </div>
                        </div>

                        <p class="auth-note">Our admin checks your licence before you can offer rides.</p>
                    </div>

                    <!-- Button -->
                    <div class="auth-actions">
                        <button type="button" class="hero-btn is-primary" id="backBtn" hidden>
                            <span class="btn-arrow" aria-hidden="true">&larr;</span> <span class="btn-text">Back</span>
                        </button>
                        <button type="submit" class="hero-btn is-primary" id="nextBtn">
                            <span class="btn-text">Next</span> <span class="btn-arrow">&rarr;</span>
                        </button>
                    </div>
                </form>
            </section>
        </div>

        <p class="auth-switch">Already have an account? <a href="login.php">Log in</a></p>
    </main>

    <footer class="auth-footer">&copy; CPU - Carpooling University</footer>

    <script src="js/common.js"></script>
    <script src="js/auth.js"></script>
</body>
</html>