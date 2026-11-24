// =====================================================================
// app.js  -  home page only (index.html)
// load common.js first:  <script src="js/common.js"></script> then <script src="js/app.js"></script>
// =====================================================================

let intro = document.querySelector('.intro');
let logo = document.querySelector('.logo-header');
let logoSpan = document.querySelectorAll('.logo');
let cars = document.querySelectorAll('.car');
let bubbles = document.querySelectorAll('.bubble');
let skipBtn = document.getElementById('skipBtn');

skipBtn.addEventListener('click', () => {
    intro.style.top = '-100vh';
});

// Skip Intro
intro.addEventListener('transitionend', (e) => {
    if (e.propertyName === 'top') {
        intro.style.visibility = 'hidden';
    }
});

window.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {

        // Logo letters (C, P, U) appear one by one
        logoSpan.forEach((span, idx) => {
            setTimeout(() => {
                span.classList.add('active');
            }, (idx + 1) * 400)
        });

        // Cars pop up one by one
        cars.forEach((car, idx) => {
            setTimeout(() => {
                car.classList.add('show');
            }, 300 + idx * 350)
        });

        // Bubbles pop up one by one
        bubbles.forEach((b, idx) => {
            setTimeout(() => {
                b.classList.add('show');
            }, 500 + idx * 400);       
        });

        // Logo letters fade out one by one
        setTimeout(() => {
            logoSpan.forEach((span, idx) => {
                setTimeout(() => {
                    span.classList.remove('active');
                    span.classList.add('fade');
                }, (idx + 1) * 50)
            })
        }, 3000);

        // The whole intro slides up and reveals the page
        setTimeout(() => {
            intro.style.top = '-100vh';
        }, 3300);

    })
})

const heroTitle = document.getElementById('heroTitle');
if (heroTitle) {
    const words = heroTitle.textContent.trim().split(' ');
    heroTitle.textContent = '';

    words.forEach((word, i) => {
        const wordEl = document.createElement('span');
        wordEl.className = 'title-word';
        wordEl.setAttribute('aria-hidden', 'true');   // screen reader 读 aria-label 就好
        [...word].forEach(ch => {
            const letter = document.createElement('span');
            letter.className = 'title-letter';
            letter.textContent = ch;
            wordEl.appendChild(letter);
        });
        heroTitle.appendChild(wordEl);
        if (i < words.length - 1) heroTitle.appendChild(document.createTextNode(' '));
    });

    // 手机没有 hover，所以点一下也弹
    heroTitle.addEventListener('click', (e) => {
        const letter = e.target.closest('.title-letter');
        if (!letter) return;
        letter.classList.remove('pop');
        void letter.offsetWidth;          // 重新播放动画
        letter.classList.add('pop');
    });
}

const heroStrip = document.querySelector('.hero-strip');

const SCROLL_DISTANCE = 0.8;   // 滚多少个屏幕高度，车才到最右边（数字越小，车跑得越快）
const ROLL_TURNS = 3;          // 星星从左到右一共滚几圈

function updateRoad() {
    const progress = Math.min(Math.max(window.scrollY / (window.innerHeight * SCROLL_DISTANCE), 0), 1);
    heroStrip.style.setProperty('--drive', progress);
    heroStrip.style.setProperty('--roll', (progress * ROLL_TURNS * 360) + 'deg');
}

if (heroStrip) {
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(() => {
            updateRoad();
            ticking = false;
        });
    }, { passive: true });

    updateRoad();
}

if ('scrollRestoration' in history) history.scrollRestoration = 'manual';
 
(() => {
    const section = document.getElementById('how');
    const list = document.getElementById('howSteps');
    const wrap = document.getElementById('howBookWrap');
    const book = document.getElementById('howBook');
    const prevBtn = document.getElementById('bookPrev');
    const nextBtn = document.getElementById('bookNext');
    const dotsBox = document.getElementById('bookDots');
    const statusEl = document.getElementById('bookStatus');
    if (!section || !list || !wrap || !book) return;
 
    const steps = Array.from(list.querySelectorAll('.how-step'));
    const N = steps.length;
    if (N < 2) return;
 
    const ASSETS = 'assets/';
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const FLIP_MS = reduceMotion ? 0 : 900;     // keep in sync with .leaf { transition } in the css
    const pad = (n) => String(n).padStart(2, '0');
 
    // small builders 
    function makeArtBox(step, i) {
        const box = document.createElement('div');
        box.className = 'page-art';
        box.dataset.label = 'Illustration ' + pad(i + 1);
        const src = step.dataset.art;
        if (!src) {
            box.classList.add('no-art');
            return box;
        }
        const img = new Image();
        img.alt = '';
        img.draggable = false;
        img.decoding = 'async';
        img.addEventListener('error', () => box.classList.add('no-art'));   // missing file -> dashed placeholder
        img.src = src;
        box.appendChild(img);
        return box;
    }
 
    function makeArtPage(step, i) {
        const page = document.createElement('div');
        page.className = 'art-page';
        page.appendChild(makeArtBox(step, i));
        const mini = step.querySelector('.mini');
        if (mini) page.appendChild(mini.cloneNode(true));
        return page;
    }
 
    function makeTextPage(step) {
        const page = document.createElement('div');
        page.className = 'text-page';
        ['.stop-label', 'h3', 'p'].forEach((sel) => {
            const el = step.querySelector(sel);
            if (el) page.appendChild(el.cloneNode(true));
        });
        return page;
    }
 
    // side 'front' = right-hand paper, 'back' = left-hand paper
    function makeFace(side, content, className) {
        const face = document.createElement('div');
        face.className = 'face ' + className;
        const bg = new Image();
        bg.className = 'face-bg';
        bg.alt = '';
        bg.draggable = false;
        bg.src = ASSETS + (side === 'back' ? 'page-back.webp' : 'page-front.webp');
        const zone = document.createElement('div');
        zone.className = 'zone zone-' + side;
        zone.appendChild(content);
        face.append(bg, zone);
        return face;
    }
 
    // build the book 
    const base = new Image();
    base.className = 'book-base';
    base.alt = '';
    base.draggable = false;
    base.src = ASSETS + 'book.webp';
 
    const pages = document.createElement('div');
    pages.className = 'book-pages';
    pages.setAttribute('aria-hidden', 'true');   // screen readers read the plain list instead
 
    // the two pages that never move
    pages.appendChild(makeFace('back', makeArtPage(steps[0], 0), 'sheet sheet-left'));
    pages.appendChild(makeFace('front', makeTextPage(steps[N - 1]), 'sheet sheet-right'));
 
    const LEAVES = N - 1;
    const leaves = [];
    for (let k = 0; k < LEAVES; k++) {
        const leaf = document.createElement('div');
        leaf.className = 'leaf';
        leaf.append(
            makeFace('front', makeTextPage(steps[k]), 'face-front'),
            makeFace('back', makeArtPage(steps[k + 1], k + 1), 'face-back')
        );
        pages.appendChild(leaf);
        leaves.push(leaf);
    }
    book.append(base, pages);
 
    // the same pictures also go on top of the plain cards (phones)
    steps.forEach((step, i) => step.insertBefore(makeArtBox(step, i), step.firstChild));
 
    // dots
    const dots = steps.map((step, i) => {
        const dot = document.createElement('button');
        dot.type = 'button';
        dot.className = 'book-dot';
        dot.setAttribute('aria-label', 'Go to step ' + (i + 1));
        dot.addEventListener('click', () => goTo(i));
        dotsBox.appendChild(dot);
        return dot;
    });
 
    // ---------- state ----------
    let current = 0;        // which spread we are on (0 .. N-1)
    let busy = false;
    let zCounter = 0;
 
    // resting stack order: unflipped leaves pile up on the right (leaf 0 on top),
    // flipped leaves pile up on the left (the latest one on top)
    const restZ = (k, flipped) => 10 + (flipped ? k : LEAVES - 1 - k);
 
    function setLeaf(k, flipped, animate) {
        const leaf = leaves[k];
        leaf.classList.toggle('flipped', flipped);
        if (!animate) {
            leaf.style.zIndex = restZ(k, flipped);
            return;
        }
        leaf.style.zIndex = 50 + (++zCounter);              // the moving leaf is always on top
        const token = (leaf._token = (leaf._token || 0) + 1);
        setTimeout(() => {
            if (leaf._token === token) leaf.style.zIndex = restZ(k, leaf.classList.contains('flipped'));
        }, FLIP_MS + 80);
    }
 
    function updateUI() {
        prevBtn.disabled = current === 0;
        nextBtn.disabled = current === N - 1;
        dots.forEach((d, i) => {
            if (i === current) d.setAttribute('aria-current', 'true');
            else d.removeAttribute('aria-current');
        });
        const title = steps[current].querySelector('h3');
        statusEl.textContent = 'Step ' + (current + 1) + ' of ' + N + (title ? ': ' + title.textContent : '');
    }
 
    function go(dir) {
        if (busy) return false;
        const target = current + dir;
        if (target < 0 || target >= N) return false;
        busy = true;
        if (dir > 0) setLeaf(current, true, true);          // turn the right page over
        else setLeaf(current - 1, false, true);             // turn the left page back
        current = target;
        updateUI();
        setTimeout(() => { busy = false; }, reduceMotion ? 0 : 420);
        return true;
    }
 
    function goTo(target) {
        if (target === current) return;
        const dir = target > current ? 1 : -1;
        (function step() {
            if (current === target) return;
            if (!go(dir)) { setTimeout(step, 80); return; }
            setTimeout(step, reduceMotion ? 0 : 440);
        })();
    }
 
    // initial resting state
    leaves.forEach((_, k) => setLeaf(k, false, false));
    updateUI();
 
    // ---------- controls ----------
    prevBtn.addEventListener('click', () => go(-1));
    nextBtn.addEventListener('click', () => go(1));
 
    let swipeStartX = null;
    let swiped = false;
    book.addEventListener('pointerdown', (e) => { swipeStartX = e.clientX; swiped = false; });
    book.addEventListener('pointerup', (e) => {
        if (swipeStartX === null) return;
        const dx = e.clientX - swipeStartX;
        swipeStartX = null;
        if (Math.abs(dx) > 40) {
            swiped = true;
            go(dx < 0 ? 1 : -1);
        }
    });
    book.addEventListener('click', (e) => {
        if (swiped) { swiped = false; return; }
        const r = book.getBoundingClientRect();
        go(e.clientX - r.left > r.width / 2 ? 1 : -1);      // right half = next, left half = back
    });
    book.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
        if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
    });
 
    // ---------- show it ----------
    section.classList.add('book-ready');
 
    if ('IntersectionObserver' in window && !reduceMotion) {
        wrap.classList.add('reveal-ready');
        const io = new IntersectionObserver((entries) => {
            if (!entries.some((en) => en.isIntersecting)) return;
            io.disconnect();
            wrap.classList.add('in');
            // a tiny peek of the first page lifting, so people know it can be turned
            setTimeout(() => {
                if (current !== 0) return;
                leaves[0].classList.add('peek');
                setTimeout(() => leaves[0].classList.remove('peek'), 650);
            }, 900);
        }, { threshold: 0.35 });
        io.observe(wrap);
    }
})();

const rolePack = document.getElementById('rolePack');
const rolesCardsGrid = document.getElementById('rolesCardsGrid');
const roleCards = Array.from(document.querySelectorAll('.role-card'));

// 4 positions in a ring: 0 = front (big and lower), 1 = right, 2 = right-back, 3 = left
const ROLE_SLOTS = 4;
const roleStart = { driver: 0, admin: 1, analytic: 2, passenger: 3 };   // who stands where at the start
roleCards.forEach((card) => { card.dataset.slot = roleStart[card.dataset.role]; });

// 拉开包装袋：按住箭头往右拖，包装袋顶部就一路被撕开；拉过一半放手，整个撕开，卡片散开
if (rolePack) {
    const pullHandle = rolePack.querySelector('.pack-pull');
    const PACK_PAD = 28;       // 箭头离袋边的距离（要和 CSS 里的 28px 一样）
    const OPEN_AT = 0.6;       // 拉过 60% 放手，就会整个撕开

    let tear = 0;              // 撕开了多少，0 到 1
    let dragging = false;
    let startX = 0;
    let startTear = 0;
    let travel = 1;            // 拖一整条要走多少像素
    let moved = 0;             // 拖了多远，用来分辨是「拖」还是「点一下」
    let tearFrame = 0;

    function setTear(v) {
        tear = Math.min(Math.max(v, 0), 1);
        rolePack.style.setProperty('--tear', tear);
    }

    // 平滑地把 tear 走到某个值
    function animateTear(to, ms, done) {
        cancelAnimationFrame(tearFrame);
        const from = tear;
        const t0 = performance.now();
        function step(now) {
            const k = Math.min((now - t0) / ms, 1);
            setTear(from + (to - from) * (1 - Math.pow(1 - k, 3)));
            if (k < 1) tearFrame = requestAnimationFrame(step);
            else if (done) done();
        }
        tearFrame = requestAnimationFrame(step);
    }

    function openPack() {
        if (rolePack.classList.contains('ripped')) return;
        rolePack.classList.add('ripped');
        setTimeout(() => {
            rolesCardsGrid.classList.add('active');
        }, 300);
        // after the cards have spread out, clicks should move them without any waiting
        setTimeout(() => {
            rolesCardsGrid.classList.add('dealt');
        }, 1800);
    }

    pullHandle.addEventListener('pointerdown', (e) => {
        if (rolePack.classList.contains('ripped')) return;
        cancelAnimationFrame(tearFrame);
        dragging = true;
        moved = 0;
        startX = e.clientX;
        startTear = tear;
        travel = rolePack.getBoundingClientRect().width - PACK_PAD * 2;
        rolePack.classList.add('pulling');
        pullHandle.setPointerCapture(e.pointerId);
    });

    pullHandle.addEventListener('pointermove', (e) => {
        if (!dragging) return;
        moved = Math.max(moved, Math.abs(e.clientX - startX));
        setTear(startTear + (e.clientX - startX) / travel);
    });

    function stopPull() {
        if (!dragging) return;
        dragging = false;

        if (moved < 4) {
            // only a click: show a little tear to say "drag me", then close it again
            animateTear(0.15, 160, () => animateTear(0, 260, () => rolePack.classList.remove('pulling')));
        } else if (tear >= OPEN_AT) {
            animateTear(1, 160, openPack);                  // pulled far enough: tear the rest
        } else {
            animateTear(0, 260, () => rolePack.classList.remove('pulling'));   // not far enough: it closes again
        }
    }
    pullHandle.addEventListener('pointerup', stopPull);
    pullHandle.addEventListener('pointercancel', stopPull);

    // keyboard: Enter / Space / right arrow opens the pack
    pullHandle.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowRight') {
            e.preventDefault();
            rolePack.classList.add('pulling');
            animateTear(1, 500, openPack);
        }
    });
}

roleCards.forEach((card) => {
    card.addEventListener('click', (e) => {
        if (!rolesCardsGrid.classList.contains('active')) return;

        const slot = Number(card.dataset.slot);

        // already in front: click again = flip it
        if (slot === 0) {
            card.classList.toggle('flipped');
            return;
        }

        // not in front: everybody turns face-up and the ring turns until this card is in front
        roleCards.forEach((c) => {
            c.classList.remove('flipped');
            c.dataset.slot = (Number(c.dataset.slot) - slot + ROLE_SLOTS) % ROLE_SLOTS;
        });
    });
});

const albumCards = document.querySelectorAll('.album-card');
const notesContainer = document.getElementById('notesContainer');
const turntableVideo = document.getElementById('turntableVideo');
let currentAudio = null;
let noteInterval = null;

// 你的三张音符图片路径数组
const noteImages = [
    'assets/note1.png',
    'assets/note2.png',
    'assets/note3.png'
];

// 随机生成音符图片的函数
function spawnNoteImage() {
    if (!notesContainer) return;

    const img = document.createElement('img');
    img.classList.add('floating-note-img');
    
    // 随机选择其中一张音符图片
    const randomImgSrc = noteImages[Math.floor(Math.random() * noteImages.length)];
    img.src = randomImgSrc;
    
    // 随机飘动轨迹和旋转角度，让每个音符都不一样
    const randomX = (Math.random() - 0.5) * 70; // 左右随机漂移范围 (-35px 到 +35px)
    const randomRot = (Math.random() - 0.5) * 50; // 随机旋转角度
    img.style.setProperty('--end-x', randomX + 'px');
    img.style.setProperty('--end-rot', randomRot + 'deg');

    notesContainer.appendChild(img);

    // 动画结束后（1.8秒）自动移除图片 DOM，防止内存占用
    setTimeout(() => {
        img.remove();
    }, 1800);
}

albumCards.forEach(card => {
    const audioId = card.getAttribute('data-audio');
    const audio = document.getElementById(audioId);
    const targetUrl = card.getAttribute('data-member');

    // 1. 鼠标悬停：播歌 + 显示并播放 WebM 唱片视频 + 飘音符
    card.addEventListener('mouseenter', () => {
        if (currentAudio && currentAudio !== audio) {
            currentAudio.pause();
            currentAudio.currentTime = 0;
        }

        if (audio) {
            audio.currentTime = 0;
            audio.play().catch(err => console.log('Audio autoplay prevented:', err));
            currentAudio = audio;
        }

        // 显示并播放唱片视频
        if (turntableVideo) {
            turntableVideo.currentTime = 0;
            turntableVideo.play().catch(() => {});
            turntableVideo.classList.add('playing');
        }

        // 飘音符
        if (!noteInterval) {
            noteInterval = setInterval(spawnNoteImage, 400);
        }
    });

    // 2. 鼠标移出：停歌 + 隐藏并暂停视频 + 停止飘音符
    card.addEventListener('mouseleave', () => {
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        if (currentAudio === audio) {
            currentAudio = null;
        }

        // 暂停并隐藏唱片视频
        if (turntableVideo) {
            turntableVideo.pause();
            turntableVideo.classList.remove('playing');
        }

        // 停止飘音符
        if (noteInterval) {
            clearInterval(noteInterval);
            noteInterval = null;
        }
    });

    // 3. 点击跳转
    card.addEventListener('click', () => {
        if (targetUrl) {
            window.location.href = targetUrl;
        }
    });
});


// Why CPU: the cards drift to the left by themselves, in an endless loop (after 06 comes 01 again)
const whySection = document.querySelector('.why-section');

if (whySection) {
    const whyTrack = whySection.querySelector('.why-track');
    const whyCount = document.getElementById('whyCount');
    const whyCards = Array.from(whyTrack.children);     // the 6 real cards
    const whyTotal = whyCards.length;

    const WHY_SPEED = 70;                               // pixels per second (bigger = faster)
    const WHY_SCROLL = 1;                               // how much scrolling the page pushes the cards (0 = not at all, 2 = double)
    const whyReduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    const whyLabel = (n) => String(n).padStart(2, '0') + ' / ' + String(whyTotal).padStart(2, '0');

    let whyClones = [];
    let whyStep = 0;           // distance from one card to the next (card + gap)
    let whySetWidth = 0;       // width of all 6 cards together
    let whyOffset = 0;         // how far the row has moved to the left
    let whySpeed = WHY_SPEED;  // current speed (eases to 0 when paused)
    let whyTarget = WHY_SPEED; // speed we want
    let whyShown = 1;
    let whyRunning = false;
    let whyOnScreen = false;
    let whyLast = 0;
    let whyWidth = 0;
    let whyPending = 0;        // distance the page scrolling still has to push the cards
    let whyScrollY = window.scrollY;

    function whyDraw() {
        whyTrack.style.transform = 'translate3d(' + (-whyOffset) + 'px, 0, 0)';

        // 01 / 06 follows the card that is at the left side
        const n = (Math.round(whyOffset / whyStep) % whyTotal) + 1;
        if (n !== whyShown) {
            whyShown = n;
            whyCount.textContent = whyLabel(n);
        }
    }

    function whyTick(now) {
        if (!whyRunning) return;

        const dt = Math.min(Math.max((now - whyLast) / 1000, 0), 0.05);   // seconds since last frame
        whyLast = now;

        whySpeed += (whyTarget - whySpeed) * Math.min(dt * 6, 1);          // smooth start / stop
        // scrolling the page pushes the cards too, a little at a time so it never jumps
        const push = whyPending * Math.min(dt * 8, 1);
        whyPending -= push;

        whyOffset += whySpeed * dt + push;
        whyOffset = ((whyOffset % whySetWidth) + whySetWidth) % whySetWidth;   // loop in both directions, the copy looks exactly the same

        whyDraw();
        requestAnimationFrame(whyTick);
    }

    function whyPlay() {
        if (whyRunning || !whyOnScreen || whyReduce.matches || document.hidden) return;
        whyRunning = true;
        whyLast = performance.now();
        requestAnimationFrame(whyTick);
    }

    function whyPause() {
        whyRunning = false;
    }

    function whyBuild() {
        whyClones.forEach((c) => c.remove());
        whyClones = [];
        whyTrack.style.transform = '';
        whySection.classList.remove('why-marquee');
        whyWidth = window.innerWidth;

        whyStep = whyCards[1].offsetLeft - whyCards[0].offsetLeft;
        whySetWidth = whyStep * whyTotal;

        if (whyReduce.matches) {
            // visitor asked for less motion: normal swipe row, no drifting
            whyShown = 0;
            whyCount.textContent = whyLabel(1);
            return;
        }

        whySection.classList.add('why-marquee');

        // copy the cards behind the last one, so there is never an empty space
        const copies = Math.ceil(window.innerWidth / whySetWidth);
        for (let i = 0; i < copies; i++) {
            whyCards.forEach((card) => {
                const clone = card.cloneNode(true);
                clone.setAttribute('aria-hidden', 'true');
                whyTrack.appendChild(clone);
                whyClones.push(clone);
            });
        }

        whyOffset = whyOffset % whySetWidth;
        whyDraw();
        whyPlay();
    }

    // swipe row (reduced motion): counter follows the scrolling
    whyTrack.addEventListener('scroll', () => {
        if (!whyReduce.matches) return;
        const n = Math.min(Math.round(whyTrack.scrollLeft / whyStep) + 1, whyTotal);
        whyCount.textContent = whyLabel(n);
    }, { passive: true });

    // page scroll: down = cards rush to the left, up = cards go back to the right
    window.addEventListener('scroll', () => {
        const dy = window.scrollY - whyScrollY;
        whyScrollY = window.scrollY;
        if (!whyOnScreen || whyReduce.matches) return;
        whyPending = Math.max(-1500, Math.min(1500, whyPending + dy * WHY_SCROLL));
    }, { passive: true });

    // slow down and stop while the mouse is on the cards, so they can be read
    whyTrack.addEventListener('mouseenter', () => { whyTarget = 0; });
    whyTrack.addEventListener('mouseleave', () => { whyTarget = WHY_SPEED; });
    whyTrack.addEventListener('touchstart', () => { whyTarget = 0; }, { passive: true });
    whyTrack.addEventListener('touchend', () => { setTimeout(() => { whyTarget = WHY_SPEED; }, 1200); }, { passive: true });

    // only move while the section is on screen
    if ('IntersectionObserver' in window) {
        new IntersectionObserver((entries) => {
            whyOnScreen = entries[0].isIntersecting;
            if (whyOnScreen) whyPlay(); else whyPause();
        }).observe(whySection);
    } else {
        whyOnScreen = true;
    }

    document.addEventListener('visibilitychange', () => {
        if (document.hidden) whyPause(); else whyPlay();
    });

    window.addEventListener('resize', () => {
        if (window.innerWidth !== whyWidth) whyBuild();    // phones fire resize while scrolling, ignore that
    });
    window.addEventListener('load', whyBuild);
    if (whyReduce.addEventListener) whyReduce.addEventListener('change', whyBuild);
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(whyBuild);

    whyBuild();
}

const accordionCards = document.querySelectorAll('.eco-right-accordion .eco-panel');
const plantImage = document.getElementById('plantImage');
const plantBadge = document.getElementById('plantBadge');
const ecoContainer = document.getElementById('ecoAccordion');

let currentIndex = 0;
let autoPlayTimer = null;
const INTERVAL_TIME = 4000; // 4秒没动就自动切下一阶段

function activateStage(index) {
    accordionCards.forEach((card, idx) => {
        if (idx === index) {
            card.classList.add('active');
            // 换左边的图片和文字
            const newImg = card.getAttribute('data-img');
            const newTitle = card.getAttribute('data-title');
            
            // 加上一点小小的渐显动画效果
            plantImage.style.opacity = '0';
            plantImage.style.transform = 'scale(0.9)';
            
            setTimeout(() => {
                plantImage.src = newImg;
                plantBadge.textContent = newTitle;
                plantImage.style.opacity = '1';
                plantImage.style.transform = 'scale(1)';
            }, 200);

        } else {
            card.classList.remove('active');
        }
    });
    currentIndex = index;
}

// 绑定鼠标悬停事件（用户手动看）
accordionCards.forEach((card, index) => {
    card.addEventListener('mouseenter', () => {
        stopAutoPlay(); // 暂停自动轮播
        activateStage(index);
    });
});

// 开启系统自动轮播
function startAutoPlay() {
    stopAutoPlay();
    autoPlayTimer = setInterval(() => {
        currentIndex = (currentIndex + 1) % accordionCards.length;
        activateStage(currentIndex);
    }, INTERVAL_TIME);
}

function stopAutoPlay() {
    if (autoPlayTimer) {
        clearInterval(autoPlayTimer);
        autoPlayTimer = null;
    }
}

// 鼠标离开整个互动区时，重新开始自动轮播
if (ecoContainer) {
    ecoContainer.addEventListener('mouseleave', () => {
        startAutoPlay();
    });
    // 初始化启动自动轮播
    startAutoPlay();
}

// ---------- About: "What is CPU?" - chat with the star ----------
(function () {
    const root = document.getElementById('aboutTalk');
    if (!root) return;

    const star = document.getElementById('talkStar');
    const bubble = document.getElementById('talkBubble');
    const textEl = document.getElementById('talkText');
    const nextBtn = document.getElementById('talkNext');
    const menu = document.getElementById('talkMenu');
    const live = document.getElementById('talkLive');
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    // everything the star says. Each answer is a few short lines; one click moves to the next line.
    const SCRIPT = {
        greeting: ["Hi! I'm the CPU star. Ask me anything!"],
        what: [
            'CPU is a carpooling web app made only for APU students.',
            'Drivers share their empty seats.',
            'Passengers hop on and ride along!'
        ],
        how: [
            'You book a ride for next week, not the same day.',
            'Booking is open on Saturday and Sunday.',
            'So everyone can plan ahead!'
        ],
        get: [
            'A fair fee, suggested from the station distance.',
            'You can see how much CO\u2082 each ride saves.',
            'Plus badges and a leaderboard!'
        ],
        more: 'Anything else?'
    };

    let typing = false;     // a line is being typed right now
    let skipTyping = false; // the visitor clicked: show the whole line at once
    let waiting = null;     // set while we wait for a click on "next"
    let busy = false;       // an answer is playing, ignore menu clicks
    let refocus = false;    // keyboard user pressed "next": put focus back on the menu

    function setText(shown, rest) {
        textEl.innerHTML = '';
        const a = document.createElement('span');
        a.textContent = shown;
        const b = document.createElement('span');
        b.className = 't-rest';
        b.textContent = rest;
        textEl.append(a, b);
    }

    function mouth(open) { star.classList.toggle('mouth-open', open); }

    function typeLine(line) {
        return new Promise((resolve) => {
            live.textContent = line;
            if (reduceMotion) { setText(line, ''); resolve(); return; }

            let i = 0;
            typing = true;
            skipTyping = false;
            star.classList.add('talking');
            setText('', line);

            (function tick() {
                i = skipTyping ? line.length : i + 1;
                setText(line.slice(0, i), line.slice(i));

                const ch = line[i - 1];
                mouth(i < line.length && /[a-z0-9]/i.test(ch) && i % 4 === 0);

                if (i >= line.length) {
                    typing = false;
                    star.classList.remove('talking');
                    mouth(false);
                    resolve();
                    return;
                }
                let delay = 32;
                if (/[.!?]/.test(ch)) delay = 220;
                else if (ch === ',') delay = 110;
                setTimeout(tick, delay);
            })();
        });
    }

    function waitNext() {
        nextBtn.hidden = false;
        return new Promise((resolve) => {
            waiting = () => {
                refocus = document.activeElement === nextBtn;
                nextBtn.hidden = true;
                waiting = null;
                resolve();
            };
        });
    }

    // click anywhere on the bubble: skip the typing, or go to the next line
    bubble.addEventListener('click', () => {
        if (typing) skipTyping = true;
        else if (waiting) waiting();
    });

    async function say(lines) {
        bubble.hidden = false;
        for (let k = 0; k < lines.length; k++) {
            await typeLine(lines[k]);
            if (k < lines.length - 1) await waitNext();
        }
    }

    function showMenu() {
        menu.hidden = false;
        if (refocus) {
            refocus = false;
            menu.querySelector('.talk-option').focus({ preventScroll: true });
        }
    }

    async function answer(key) {
        menu.hidden = true;
        star.classList.add('lit');
        await say(SCRIPT[key]);
        await waitNext();
        star.classList.remove('lit');
        await say([SCRIPT.more]);
        showMenu();
    }

    menu.addEventListener('click', (e) => {
        const btn = e.target.closest('.talk-option');
        if (!btn || busy) return;
        busy = true;
        answer(btn.dataset.q).finally(() => { busy = false; });
    });

    async function start() {
        await say(SCRIPT.greeting);
        showMenu();
    }

    // wait until the block is on screen, then the star pops in and says hello (once)
    if (!('IntersectionObserver' in window)) { start(); return; }

    const io = new IntersectionObserver((entries) => {
        if (!entries.some((en) => en.isIntersecting)) return;
        io.disconnect();
        root.classList.add('in');
        setTimeout(start, 0);
    }, { threshold: 0.4 });
    io.observe(root);
})();