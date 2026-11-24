// =====================================================================
// auth.js  -  the sign up wizard (signup.php)
// load common.js first:  <script src="js/common.js"></script> then <script src="js/auth.js"></script>
// =====================================================================

// Rules: plain functions, value in -> message out ('' means OK)
const AUTH_AGE_MIN = 16;       // youngest age allowed to sign up
const AUTH_MAX_FILE_MB = 5;    // biggest photo allowed
const AUTH_FILE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

const authRules = {
    userID(v) {
        return /^TP\d{6}$/.test(v.trim().toUpperCase()) ? '' : 'Use your student ID, like TP012345.';
    },
    password(v) {
        if (v.length < 8) return 'Use at least 8 characters.';
        if (v.length > 72) return 'Please keep it under 72 characters.';
        if (!/[A-Za-z]/.test(v) || !/\d/.test(v)) return 'Add at least one letter and one number.';
        return '';
    },
    confirm(v, password) {
        return v !== '' && v === password ? '' : 'The two passwords do not match.';
    },
    name(v) {
        const t = v.trim();
        return t.length >= 1 && t.length <= 30 ? '' : 'Please enter your name (up to 30 characters).';
    },

    phone(v) {
        return /^01\d{8,9}$/.test(v.replace(/\D/g, '')) ? '' : 'Enter your phone number, like 0123456789.';
    },

    dob(v, today = new Date()) {
        if (!v) return 'Please pick your date of birth.';
        const d = new Date(v + 'T00:00:00');
        if (Number.isNaN(d.getTime()) || d.getFullYear() < 1900) return 'That date does not look right.';
        if (d > today) return 'Your birthday cannot be in the future.';
        const limit = new Date(today.getFullYear() - AUTH_AGE_MIN, today.getMonth(), today.getDate());
        if (d > limit) return 'You need to be at least ' + AUTH_AGE_MIN + ' years old.';
        return '';
    },
    plate(v) {
        const t = v.trim().toUpperCase().replace(/\s+/g, ' ');
        const ok = /^[A-Z0-9 ]{2,13}$/.test(t) && /[A-Z]/.test(t) && /\d/.test(t);
        return ok ? '' : 'Enter your plate number, like ABC 1234.';
    },
    file(f) {
        if (!f) return 'Please choose a photo.';
        if (!AUTH_FILE_TYPES.includes(f.type)) return 'Use a JPG, PNG or WEBP photo.';
        if (f.size > AUTH_MAX_FILE_MB * 1024 * 1024) return 'That photo is over ' + AUTH_MAX_FILE_MB + ' MB.';
        return '';
    },
};

(() => {
    const form = document.getElementById('signupForm');
    if (!form) return;

    const panels = {};
    form.querySelectorAll('.auth-step').forEach((p) => { panels[p.dataset.step] = p; });

    const progress = document.getElementById('authProgress');
    const stepLabel = document.getElementById('stepLabel');
    const backBtn = document.getElementById('backBtn');
    const nextBtn = document.getElementById('nextBtn');
    const nextText = nextBtn.querySelector('.btn-text');
    const bubble = document.getElementById('mascotBubble');
    const mover = document.getElementById('mascotMove');
    const faces = document.querySelectorAll('.mascot-faces .face');

    // what the star says on each step
    const SAY = {
        role: "Hi! Who's joining CPU today?",
        account: 'Your student ID is how you log in.',
        profile: 'Almost there. Tell me about you.',
        vehicle: 'Admin checks your licence before you can offer rides.',
    };

    let order = ['role', 'account', 'profile'];   // 'vehicle' is added for drivers
    let index = 0;

    const roleValue = () => {
        const r = form.querySelector('input[name="role"]:checked');
        return r ? r.value : '';
    };
    const field = (name) => form.elements[name];
    const val = (name) => field(name).value;

    // Star
    function setMood(mood, text) {
        faces.forEach((f) => f.classList.toggle('is-on', f.dataset.mood === mood));
        if (text) bubble.textContent = text;
        mover.classList.remove('bounce', 'shake');
        void mover.offsetWidth;                       // restart the animation
        if (mood === 'happy') mover.classList.add('bounce');
        if (mood === 'thinking') mover.classList.add('shake');
    }

    // Error Msg
    function showError(name, message) {
        const holder = form.querySelector('[data-error-for="' + name + '"]');
        if (!holder) return;
        holder.textContent = message || '';
        const group = holder.closest('.form-group, .upload-box');
        if (group) group.classList.toggle('has-error', !!message);
    }

    // returns { fieldName: message } for one step (nothing is shown on screen)
    function getErrors(step) {
        const e = {};
        const add = (name, msg) => { if (msg) e[name] = msg; };

        if (step === 'role') {
            if (!roleValue()) e.role = 'Please choose Passenger or Driver.';
        }
        if (step === 'account') {
            add('userID', authRules.userID(val('userID')));
            add('password', authRules.password(val('password')));
            add('confirm', authRules.confirm(val('confirm'), val('password')));
        }
        if (step === 'profile') {
            add('name', authRules.name(val('name')));
            if (!val('gender')) e.gender = 'Please choose one.';
            add('phone', authRules.phone(val('phone')));
            add('dob', authRules.dob(val('dob')));
            if (!val('stationID')) e.stationID = 'Please choose your pickup station.';
        }
        if (step === 'vehicle') {
            add('plate', authRules.plate(val('plate')));
            if (!val('maxSeat')) e.maxSeat = 'How many seats can you share?';
            add('carImage', authRules.file(field('carImage').files[0]));
            add('licenseImage', authRules.file(field('licenseImage').files[0]));
        }
        return e;
    }

    // shows the errors of one step, makes the star think, focuses the first problem
    function showErrors(step, errors) {
        const names = [];
        form.querySelectorAll('[data-step="' + step + '"] [data-error-for]').forEach((h) => names.push(h.dataset.errorFor));
        names.forEach((n) => showError(n, errors[n] || ''));
        const first = names.find((n) => errors[n]);
        if (!first) return;
        setMood('thinking', errors[first]);
        const el = field(first);
        const target = (typeof RadioNodeList !== 'undefined' && el instanceof RadioNodeList) ? el[0] : el;
        if (target && target.focus) target.focus({ preventScroll: false });
    }

    // Steps
    function buildOrder() {
        order = ['role', 'account', 'profile'];
        if (roleValue() === 'Driver') order.push('vehicle');
        if (index > order.length - 1) index = order.length - 1;
    }

    function render(direction, keepMood) {
        buildOrder();
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

        const last = index === order.length - 1;
        backBtn.hidden = index === 0;
        nextText.textContent = last ? 'Create account' : 'Next';

        if (!keepMood) setMood('normal', SAY[step]);

        if (direction) {
            const first = panels[step].querySelector('input:not([type="radio"]):not([type="file"]), select');
            if (first) first.focus({ preventScroll: true });
        }
    }

    // Button
    backBtn.addEventListener('click', () => {
        if (index > 0) { index -= 1; render(-1); }
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const step = order[index];

        const errors = getErrors(step);
        if (Object.keys(errors).length) { showErrors(step, errors); return; }
        if (index < order.length - 1) { index += 1; render(1); return; }

        // last step: check every step once more (someone may have gone back and changed things)
        for (let i = 0; i < order.length; i++) {
            const errs = getErrors(order[i]);
            if (Object.keys(errs).length) {
                index = i;
                render(-1, true);
                showErrors(order[i], errs);
                return;
            }
        }

        // tidy the text before it is sent
        field('userID').value = val('userID').trim().toUpperCase();
        field('name').value = val('name').trim();
        if (roleValue() === 'Driver') field('plate').value = val('plate').trim().toUpperCase().replace(/\s+/g, ' ');

        nextBtn.disabled = true;
        nextText.textContent = 'Creating...';
        setMood('happy', 'Creating your account...');
        setTimeout(() => form.submit(), 450);     // form.submit() does not run this handler again
    });

    // Role Cards-
    form.querySelectorAll('input[name="role"]').forEach((radio) => {
        radio.addEventListener('change', () => {
            form.querySelectorAll('.role-card').forEach((c) => {
                c.classList.toggle('is-selected', c.contains(radio) && radio.checked);
            });
            showError('role', '');
            render(0, true);
            setMood('happy', radio.value === 'Driver'
                ? "Nice, a driver! I'll ask for your car and licence later."
                : "Great! Let's find you a seat.");
        });
    });

    // Small Helper
    form.addEventListener('input', (e) => { // typing clears that field's error
        if (e.target.name) showError(e.target.name, '');
    });

    ['userID', 'plate'].forEach((name) => { // show capitals as soon as user leave the box
        field(name).addEventListener('blur', (e) => { e.target.value = e.target.value.trim().toUpperCase(); });
    });

    form.querySelectorAll('[data-toggle]').forEach((btn) => { // eye button: show / hide password
        btn.addEventListener('click', () => {
            const input = document.getElementById(btn.dataset.toggle);
            const show = input.type === 'password';
            input.type = show ? 'text' : 'password';
            btn.classList.toggle('is-shown', show); // CSS swaps the eye picture
            btn.setAttribute('aria-label', show ? 'Hide password' : 'Show password');
        });
    });

    // Password - Strong / Weak
    const strengthBox = document.getElementById('pwStrength');
    const strengthText = document.getElementById('pwStrengthText');
    const STRENGTH_WORDS = ['', 'Weak', 'Medium', 'Strong'];

    // 0 = empty, 1 = weak, 2 = medium, 3 = strong
    function passwordLevel(v) {
        if (!v) return 0;
        if (authRules.password(v) !== '') return 1;               // does not meet the sign up rules yet
        let extras = 0;
        if (v.length >= 12) extras++;                             // long
        if (/[a-z]/.test(v) && /[A-Z]/.test(v)) extras++;         // small + capital letters
        if (/[^A-Za-z0-9]/.test(v)) extras++;                     // symbol: ! @ #
        return extras >= 2 ? 3 : 2;
    }

    field('password').addEventListener('input', (e) => {
        const level = passwordLevel(e.target.value);
        strengthBox.dataset.level = level;
        strengthText.textContent = STRENGTH_WORDS[level];
    });

    const today = new Date();
    field('dob').max = today.getFullYear() + '-' + String(today.getMonth() + 1).padStart(2, '0') + '-' + String(today.getDate()).padStart(2, '0');

    // Photo uploads: show a preview of the chosen photo
    form.querySelectorAll('.upload-input').forEach((input) => {
        const box = input.closest('.upload-box');
        const preview = box.querySelector('.upload-preview');
        const cta = box.querySelector('.upload-cta');
        const exampleSrc = preview.getAttribute('src');
        const ctaText = cta.textContent;
        let objectUrl = null;

        input.addEventListener('change', () => {
            if (objectUrl) { URL.revokeObjectURL(objectUrl); objectUrl = null; }
            const file = input.files[0];
            const err = file ? authRules.file(file) : '';

            if (!file || err) {
                input.value = '';
                preview.src = exampleSrc;
                box.classList.remove('has-file');
                cta.textContent = ctaText;
                showError(input.name, err);
                if (err) setMood('thinking', err);
                return;
            }
            objectUrl = URL.createObjectURL(file);
            preview.src = objectUrl;
            box.classList.add('has-file');
            cta.textContent = file.name;
            showError(input.name, '');
            setMood('happy', 'Looks good!');
        });
    });

    // Start
    render(0);
    if (document.querySelector('.auth-error')) setMood('thinking', 'Oops. Please check the message above.');
})();