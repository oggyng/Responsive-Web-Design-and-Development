// =====================================================================
// role.js  -  header behaviour on every role page
//   1. hamburger menu (mobile)
//   2. profile picture menu (desktop)
//   3. light / dark switch (inside the profile menu and the hamburger menu)
// load common.js first (theme + contact pop-up), then this file
// =====================================================================

// hamburger menu
const menuToggle = document.getElementById('menuToggle');
const navMenu = document.getElementById('navMenu');

function setMenu(open) {
    if (!menuToggle || !navMenu) return;
    navMenu.classList.toggle('is-open', open);
    menuToggle.setAttribute('aria-expanded', open);
    menuToggle.setAttribute('aria-label', open ? 'Close menu' : 'Open menu');
}

if (menuToggle && navMenu) {
    menuToggle.addEventListener('click', () => {
        setMenu(!navMenu.classList.contains('is-open'));
    });

    // back to a wide screen: close the drop-down
    window.matchMedia('(min-width: 1201px)').addEventListener('change', (e) => {
        if (e.matches) setMenu(false);
    });
}

// pfp menu
const userMenuBtn = document.getElementById('userMenuBtn');
const userMenu = document.getElementById('userMenu');

function setUserMenu(open) {
    if (!userMenuBtn || !userMenu) return;
    userMenu.hidden = !open;
    userMenuBtn.setAttribute('aria-expanded', open);
}

if (userMenuBtn && userMenu) {
    userMenuBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        setUserMenu(userMenu.hidden);
    });

    // click anywhere else = close
    document.addEventListener('click', (e) => {
        if (!userMenu.hidden && !userMenu.contains(e.target)) setUserMenu(false);
    });
}

// Esc closes whichever menu is open
document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (userMenu && !userMenu.hidden) { setUserMenu(false); userMenuBtn.focus(); }
    if (navMenu && navMenu.classList.contains('is-open')) { setMenu(false); menuToggle.focus(); }
});

// Light / Dark Switch (sun n moon)
// there are two switches on the page (profile menu + hamburger menu); they always show the same state
const themeSwitches = document.querySelectorAll('.theme-switch');
const themeTexts = document.querySelectorAll('.theme-text');

function showTheme() {
    const dark = document.documentElement.getAttribute('data-theme') === 'dark';
    themeSwitches.forEach((sw) => sw.setAttribute('aria-checked', dark));
    themeTexts.forEach((t) => { t.textContent = dark ? 'Dark mode' : 'Light mode'; });
}

showTheme();   // match the theme that head.php already set

themeSwitches.forEach((sw) => {
    sw.addEventListener('click', () => {
        const next = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        try { localStorage.setItem('theme', next); } catch (e) {}   // remember it for the next page
        showTheme();
    });
});