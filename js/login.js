// =====================================================================
// login.js  -  the two step login (login.php)
//   step 1: student ID  -> check_user.php    (does this ID exist?)
//   step 2: password    -> login_process.php (is the password right?)
// Both PHP files answer in JSON:
//   check_user.php     {"ok":true}  or  {"ok":false,"error":"notfound" | "suspended"}
//   login_process.php  {"ok":true,"redirect":"page.php"}  or  {"ok":false,"error":"wrong" | "suspended"}
// load common.js first:  <script src="js/common.js"></script> then <script src="js/login.js"></script>
// =====================================================================

(() => {

    const form = document.getElementById('loginForm');
    if (!form) return;

    const panels = {};
    form.querySelectorAll('.auth-step').forEach((p) => { panels[p.dataset.step] = p; });

    const progress = document.getElementById('authProgress');
    const stepLabel = document.getElementById('stepLabel');
    const idChip = document.getElementById('idChip');
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');
    const nextText = nextBtn.querySelector('.btn-text');
    const bubble = document.getElementById('mascotBubble');
    const mover = document.getElementById('mascotMove');
    const facesBox = document.querySelector('.mascot-faces');
    const faces = facesBox.querySelectorAll('.face');
    const idInput = form.elements.userID;
    const pwInput = form.elements.password;

    const order = ['id', 'password'];
    let index = 0;
    let busy = false;

    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // where the mouth is inside the star picture (0 to 1 of its width / height)
    const MOUTH = { x: 0.51, y: 0.6 };
    const MAX_LETTERS = 10;          // letters that fly into the mouth (more would only take longer)

    // the long messages go under the box (red text) ...
    const ERRORS = {
        notfound: "I can't find that ID. Check it, or sign up first.",
        wrong: 'ID or password is incorrect.',
        suspended: 'This account is suspended. Please contact the admin.',
        server: 'Something went wrong. Please try again.',
    };
    // ... and the star only gives a short reaction
    const REACTIONS = {
        notfound: "Hmm, who's that?",
        wrong: 'Oops, not quite.',
        suspended: "I can't let you in.",
        server: 'Uh oh, try again?',
        check: 'Hmm, check that again.',
    };

    // Star
    // these pictures are drawn in a different pose, so they swap instantly (no fade, no ghost)
    const SNAP_MOODS = new Set(['openmouth', 'chewing', 'yummy', 'wrong']);
    let currentMood = 'normal';      // what the star is "feeling"
    let shownFace = 'normal';        // which picture is on screen

    function setMood(mood, text) {
        const face = mood === 'thinking' ? 'wrong' : mood;   // there is no "thinking" picture, so the normal face shakes
        facesBox.classList.toggle('snap', SNAP_MOODS.has(face) || SNAP_MOODS.has(shownFace));
        faces.forEach((f) => f.classList.toggle('is-on', f.dataset.mood === face));
        currentMood = mood;
        shownFace = face;
        if (text) bubble.textContent = text;
        mover.classList.remove('bounce', 'shake');
        void mover.offsetWidth;                         // restart the animation
        if (mood === 'yummy') mover.classList.add('bounce');
        if (mood === 'thinking' || mood === 'wrong') mover.classList.add('shake');
    }

    const stepSay = () => (index === 0
        ? "What's your student ID?"
        : 'Hi ' + idInput.value + '! Now your password.');

    // Error msg
    function showError(name, message) {
        const holder = form.querySelector('[data-error-for="' + name + '"]');
        if (!holder) return;
        holder.textContent = message || '';
        const group = holder.closest('.form-group');
        if (group) group.classList.toggle('has-error', !!message);
    }

    function fail(name, code) {
        showError(name, ERRORS[code] || ERRORS.server);
        setMood('wrong', REACTIONS[code] || REACTIONS.server);
    }

    // Timing helpers (a click anywhere skips the eating)
    let skipNow = false;
    const wakers = [];
    const running = [];

    function wait(ms) {
        return new Promise((resolve) => {
            if (reduceMotion || skipNow) { resolve(); return; }
            const timer = setTimeout(resolve, ms);
            wakers.push(() => { clearTimeout(timer); resolve(); });
        });
    }

    function skipAnimation() {
        skipNow = true;
        wakers.splice(0).forEach((wake) => wake());
        running.splice(0).forEach((a) => { try { a.finish(); } catch (e) { /* already done */ } });
    }

    // a little squash and stretch of the whole star (uses `scale`, so it never fights the float animation)
    function squish() {
        if (reduceMotion || skipNow) return;
        running.push(mover.animate([
            { scale: '1 1' },
            { scale: '1.07 0.9', offset: 0.4 },
            { scale: '1 1' },
        ], { duration: 260, easing: 'ease-in-out' }));
    }

    function gulp() {
        if (reduceMotion || skipNow) return;
        running.push(mover.animate([
            { scale: '1 1' },
            { scale: '1.09 1.09', offset: 0.4 },
            { scale: '1 1' },
        ], { duration: 200, easing: 'ease-out' }));
    }

    // Eating animation
    // every letter is a small copy that flies from the box into the star's mouth
    function flyLetters(input, text) {
        if (reduceMotion || skipNow) return Promise.resolve();

        const style = getComputedStyle(input);
        const box = input.getBoundingClientRect();
        const ctx = document.createElement('canvas').getContext('2d');
        ctx.font = style.fontSize + ' ' + style.fontFamily;

        const startX = box.left + parseFloat(style.paddingLeft) + parseFloat(style.borderLeftWidth);
        const startY = box.top + box.height / 2;

        const face = facesBox.getBoundingClientRect();     // it floats up and down, so measure it now
        const mouthX = face.left + face.width * MOUTH.x;
        const mouthY = face.top + face.height * MOUTH.y;

        const letters = Array.from(text).slice(0, MAX_LETTERS);
        return Promise.all(letters.map((ch, i) => {
            const el = document.createElement('span');
            el.className = 'fly-letter';
            el.textContent = ch;
            const left = startX + ctx.measureText(text.slice(0, i)).width;
            el.style.left = left + 'px';
            el.style.top = startY + 'px';
            document.body.appendChild(el);

            const dx = mouthX - left;
            const dy = mouthY - startY;
            const move = el.animate([
                { transform: 'translate(0, -50%) scale(1)', opacity: 1, offset: 0 },
                { transform: 'translate(' + dx * 0.8 + 'px, calc(' + dy * 0.8 + 'px - 50%)) scale(0.8)', opacity: 1, offset: 0.8 },
                { transform: 'translate(' + dx + 'px, calc(' + dy + 'px - 50%)) scale(0)', opacity: 0, offset: 1 },
            ], { duration: 420, delay: i * 40, easing: 'cubic-bezier(0.45, 0, 0.9, 0.55)', fill: 'both' });
            running.push(move);

            return move.finished.then(() => { el.remove(); if (i === 0) gulp(); }, () => el.remove());
        }));
    }

    // open mouth -> letters fly in -> chew, chew
    async function eat(input, text) {
        skipNow = false;
        wakers.length = 0;
        running.length = 0;
        const onKey = (e) => { if (e.key === 'Escape') skipAnimation(); };
        document.addEventListener('pointerdown', skipAnimation);
        document.addEventListener('keydown', onKey);

        input.dataset.typed = input.value;              // keep what was typed ...
        input.dataset.hint = input.placeholder;
        input.value = '';                               // ... and empty the box, so the text really is gone
        input.placeholder = '';
        input.classList.add('is-eating');
        setMood('openmouth');
        await wait(120);
        await flyLetters(input, text);
        for (let i = 0; i < 2; i++) {
            setMood('chewing');
            squish();
            await wait(140);
            setMood('openmouth');
            await wait(120);
        }

        document.removeEventListener('pointerdown', skipAnimation);
        document.removeEventListener('keydown', onKey);
        skipNow = false;                                // so the "yummy" pause still works after a skipped eating
    }

    // give the typed text back to the box (used when the ID was wrong, or before moving to the next step)
    function uneat(input) {
        if ('typed' in input.dataset) {
            input.value = input.dataset.typed;
            input.placeholder = input.dataset.hint;
            delete input.dataset.typed;
            delete input.dataset.hint;
        }
        input.classList.remove('is-eating');
    }

    // talking to the server
    function fakeServer(url, data) {
        return new Promise((resolve) => {
            setTimeout(() => {
                if (url.indexOf('check_user') !== -1) {
                    if (data.userID === 'TP000001') resolve({ ok: true });
                    else if (data.userID === 'TP000002') resolve({ ok: false, error: 'suspended' });
                    else resolve({ ok: false, error: 'notfound' });
                } else {
                    resolve(data.password === 'test1234'
                        ? { ok: true, redirect: 'index.html' }
                        : { ok: false, error: 'wrong' });
                }
            }, 400);
        });
    }

    async function post(url, data) {
        const body = new FormData();
        Object.keys(data).forEach((k) => body.append(k, data[k]));
        try {
            const res = await fetch(url, { method: 'POST', body: body });
            return await res.json();
        } catch (e) {
            return { ok: false, error: 'server' };
        }
    }

    // Steps
    function render(direction) {
        const step = order[index];

        Object.keys(panels).forEach((k) => {
            panels[k].hidden = k !== step;
            panels[k].classList.remove('from-right', 'from-left');
        });
        if (direction) panels[step].classList.add(direction > 0 ? 'from-right' : 'from-left');

        progress.innerHTML = '';
        order.forEach((_, i) => {
            const seg = document.createElement('span');
            seg.className = 'seg' + (i < index ? ' done' : i === index ? ' now' : '');
            progress.appendChild(seg);
        });
        stepLabel.textContent = 'Step ' + (index + 1) + ' of ' + order.length;

        backBtn.hidden = index === 0;
        nextText.textContent = index === order.length - 1 ? 'Log in' : 'Next';
        idChip.textContent = index === 1 ? 'Student ID: ' + idInput.value : '';

        setMood('normal', stepSay());

        if (direction) panels[step].querySelector('input').focus({ preventScroll: true });
    }

    async function submitId() {
        const id = idInput.value.trim().toUpperCase();
        idInput.value = id;

        if (!/^TP\d{6}$/.test(id)) {
            showError('userID', 'Use your student ID, like TP012345.');
            setMood('thinking', REACTIONS.check);
            idInput.focus();
            return;
        }

        // the star eats the ID while the server checks it (the star is NOT happy yet)
        const results = await Promise.all([eat(idInput, id), post('check_user.php', { userID: id })]);
        uneat(idInput);

        if (!results[1].ok) { fail('userID', results[1].error); return; }
        index = 1;
        render(1);
    }

    async function submitPassword() {
        const pw = pwInput.value;

        if (pw === '') {
            showError('password', 'Please enter your password.');
            setMood('thinking', REACTIONS.check);
            pwInput.focus();
            return true;                                     // not logged in, keep the button usable
        }

        const results = await Promise.all([
            eat(pwInput, '\u2022'.repeat(pw.length)),         // only dots fly, never the real password
            post('login_process.php', { userID: idInput.value, password: pw }),
        ]);
        const res = results[1];

        if (res.ok) {
            setMood('yummy', 'Welcome back.');               // the only happy "yummy" moment
            await wait(1000);
            window.location.href = res.redirect || 'index.html';
            return false;                                    // leaving the page, keep the button disabled
        }

        uneat(pwInput);
        pwInput.value = '';
        fail('password', res.error);
        pwInput.focus();
        return true;
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (busy) return;
        busy = true;
        nextBtn.disabled = true;
        backBtn.disabled = true;

        let enable = true;
        if (index === 0) await submitId();
        else enable = await submitPassword();

        busy = false;
        backBtn.disabled = false;
        if (enable) nextBtn.disabled = false;
    });

    backBtn.addEventListener('click', () => {
        if (busy || index === 0) return;
        index = 0;
        render(-1);
    });

    // Small helper
    form.addEventListener('input', (e) => {                   // typing clears that field's error
        if (e.target.name) showError(e.target.name, '');
        if (currentMood === 'wrong' || currentMood === 'thinking') setMood('normal', stepSay());
    });

    idInput.addEventListener('blur', () => { idInput.value = idInput.value.trim().toUpperCase(); });

    form.querySelectorAll('[data-toggle]').forEach((btn) => { // eye button: show / hide password
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.toggle);
            const show = input.type === 'password';
            input.type = show ? 'text' : 'password';
            btn.classList.toggle('is-shown', show);
            btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
            btn.title = show ? 'Hide password' : 'Show password';
        });
    });

    // Start
    render(0);
})();