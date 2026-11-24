// =====================================================================
// common.js  -  loaded on EVERY page (home, login, sign up, ...)
//   1. light / dark theme + the pull cord
//   2. the "Contact Us" pop-up in the footer
// Everything here checks that the element exists first, so it is safe on pages that don't have it.
// =====================================================================

// Light / Dark theme
const themeToggle = document.getElementById('themeToggle');
const root = document.documentElement;
 
function setTheme(theme) {
    root.setAttribute('data-theme', theme);
    if (themeToggle) themeToggle.setAttribute('aria-pressed', theme === 'dark');
}
 
if (themeToggle) {
    // Make sure the button state matches the theme when the page loads
    themeToggle.setAttribute('aria-pressed', root.getAttribute('data-theme') === 'dark');
 
    themeToggle.addEventListener('click', () => {
        // Replay the pull animation every time
        themeToggle.classList.remove('pulled');
        void themeToggle.offsetWidth;      // force the browser to restart the animation
        themeToggle.classList.add('pulled');
 
        const next = root.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        setTheme(next);
        playPull(next === 'dark');
 
        // Remember the choice for the next visit
        try { localStorage.setItem('theme', next); } catch (e) {}
    });
}

// Sound for the pull cord
const pullSound = new Audio('assets/sounds/lamp-pull.wav');
pullSound.volume = 0.5;
pullSound.preservesPitch = false;

function playPull(isDark) {
    pullSound.currentTime = 0;                       // 每次从头播，连续拉也能响
    pullSound.playbackRate = isDark ? 1.3 : 1.5;     // 关灯稍微低沉一点
    pullSound.play().catch(() => {});                // 浏览器不让播放时，安静跳过
}

// ====== Contact Us pop-up (footer) ======
const contactModal = document.getElementById('contactModal');
const closeContactModal = document.getElementById('closeContactModal');
const contactLink = document.querySelector('a[href="#contact"]');
const contactForm = document.getElementById('contactForm');
const modalHeaderContent = document.getElementById('modalHeaderContent');
const contactSuccessMsg = document.getElementById('contactSuccessMsg');

// Click "Contact Us" pop up small window
if (contactLink) {
    contactLink.addEventListener('click', (e) => {
        e.preventDefault();
        contactModal.classList.add('active');
        contactModal.setAttribute('aria-hidden', 'false');
    });
}

// X --> Close window
if (closeContactModal) {
    closeContactModal.addEventListener('click', () => {
        contactModal.classList.remove('active');
        contactModal.setAttribute('aria-hidden', 'true');
    });
}

// Click (any) background --> Close window
window.addEventListener('click', (e) => {
    if (e.target === contactModal) {
        contactModal.classList.remove('active');
        contactModal.setAttribute('aria-hidden', 'true');
    }
});

// 表单提交事件（预留 PHP AJAX 数据交互接口）
if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault(); // 阻止页面跳转刷新

        // 获取表单数据
        const formData = new FormData(this);

        // 未来在这里用 fetch 发送给 PHP：
        /*
        fetch('process-contact.php', {
            method: 'POST',
            body: formData
        })
        .then(response => response.json())
        .then(data => {
            // 后端处理成功后的逻辑
        });
        */

        // Submitted succesfully then hide pic n feedback (contact us) form, show 邮箱 = success
        if (modalHeaderContent) modalHeaderContent.style.display = 'none';
        contactForm.style.display = 'none';
        contactSuccessMsg.style.display = 'block';

        // 2.5 close n reset
        setTimeout(() => {
            contactModal.classList.remove('active');
            setTimeout(() => {
                contactForm.reset();
                if (modalHeaderContent) modalHeaderContent.style.display = 'block';
                contactForm.style.display = 'flex';
                contactSuccessMsg.style.display = 'none';
            }, 300);
        }, 2500);
    });
}