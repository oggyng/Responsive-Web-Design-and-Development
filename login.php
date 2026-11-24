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
    <link rel="stylesheet" href="style/login.css">
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Titan+One&family=Nunito:wght@700&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Patrick+Hand&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=DynaPuff:wght@400..700&display=swap" rel="stylesheet">

    <title>Log in - CPU - Carpooling University</title>
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

            <!-- left: the star chewing the input text -->
            <aside class="auth-side">
                <div class="mascot-stage">
                    <p class="mascot-bubble" id="mascotBubble" role="status" aria-live="polite">What's your student ID?</p>
                    <div class="mascot-move" id="mascotMove">
                        <div class="mascot-faces">
                            <img class="face is-on" data-mood="normal"    src="assets/sign-normal.png"     alt="">
                            <img class="face"       data-mood="openmouth" src="assets/sign-open-mouth.png" alt="">
                            <img class="face"       data-mood="chewing"   src="assets/sign-chewing.png"    alt="">
                            <img class="face"       data-mood="yummy"     src="assets/sign-yummy.png"      alt="">
                            <img class="face"       data-mood="wrong"     src="assets/sign-wrong.png"      alt="">
                        </div>
                    </div>
                </div>
            </aside>

            <!-- right: the form, one small step at a time -->
            <section class="auth-card login-card" aria-labelledby="authTitle">
                <div class="auth-progress" id="authProgress" aria-hidden="true"></div>
                <p class="auth-step-label" id="stepLabel">Step 1 of 2</p>
                <h1 class="auth-title" id="authTitle">Welcome back</h1>

                <form id="loginForm" method="post" action="login_process.php" novalidate>

                    <!-- Student ID -->
                    <div class="auth-step" data-step="id">
                        <h2 class="step-heading">Your student ID</h2>

                        <div class="form-group">
                            <label for="userID">Student ID</label>
                            <input id="userID" name="userID" type="text" placeholder="TP012345" maxlength="8"
                                   autocomplete="username" autocapitalize="characters" spellcheck="false" required>
                            <p class="field-error" data-error-for="userID"></p>
                        </div>
                    </div>

                    <!-- Password -->
                    <div class="auth-step" data-step="password" hidden>

                        <p class="id-chip" id="idChip"></p>
                        <h2 class="step-heading">Your password</h2>

                        <div class="form-group">
                            <label for="password">Password</label>
                            <div class="password-field">
                                <input id="password" name="password" type="password" maxlength="72"
                                       autocomplete="current-password" required>
                                <button type="button" class="eye" data-toggle="password" aria-label="Show password" title="Show password">
                                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12z"/><circle cx="12" cy="12" r="3"/><line class="eye-slash" x1="4" y1="4" x2="20" y2="20"/></svg>
                                </button>
                            </div>
                            <p class="field-error" data-error-for="password"></p>
                        </div>
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

        <p class="auth-switch">New here? <a href="signup.php">Sign up</a></p>
    </main>

    <footer class="auth-footer">&copy; CPU - Carpooling University</footer>

    <script src="js/common.js"></script>
    <script src="js/login.js"></script>
</body>
</html>