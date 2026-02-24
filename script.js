
// ===== NAVBAR LOGIC =====
const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const links = document.querySelectorAll('.nav-link');

// Toggle mobile menu
navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('active');
});

// Close menu on link click
links.forEach(link => {
    link.addEventListener('click', () => {
        navToggle.classList.remove('active');
        navLinks.classList.remove('active');
    });
});

// Navbar scroll effect
window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ===== CUSTOM CURSOR =====
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursorDot');
let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;

document.addEventListener('mousemove', e => {
    mouseX = e.clientX; mouseY = e.clientY;
    cursorDot.style.left = mouseX + 'px';
    cursorDot.style.top = mouseY + 'px';
});
function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.12;
    cursorY += (mouseY - cursorY) * 0.12;
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    requestAnimationFrame(animateCursor);
}
animateCursor();
document.querySelectorAll('button, .flower-card, .memory-card, .quality-item, .birthday-btn, .hero-cake').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
});

// ===== CONFETTI =====
const canvas = document.getElementById('confetti-canvas');
const ctx = canvas.getContext('2d');
let confetti = [];
let confettiActive = false;

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

function createConfettiPiece(x, y) {
    const colors = ['#ff4d8d', '#ffd700', '#ce93d8', '#80cbc4', '#ff6b9d', '#fff'];
    const shapes = ['circle', 'square', 'heart'];
    return {
        x: x || Math.random() * canvas.width,
        y: y || -10,
        size: Math.random() * 10 + 5,
        color: colors[Math.floor(Math.random() * colors.length)],
        shape: shapes[Math.floor(Math.random() * shapes.length)],
        vx: (Math.random() - 0.5) * 6,
        vy: Math.random() * 4 + 2,
        rotation: Math.random() * 360,
        rotV: (Math.random() - 0.5) * 10,
        opacity: 1,
        gravity: 0.1
    };
}

function drawConfettiPiece(p) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rotation * Math.PI / 180);
    ctx.globalAlpha = p.opacity;
    ctx.fillStyle = p.color;
    if (p.shape === 'circle') {
        ctx.beginPath();
        ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        ctx.fill();
    } else if (p.shape === 'square') {
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size);
    } else {
        ctx.font = p.size + 'px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('❤', 0, 0);
    }
    ctx.restore();
}

function launchConfetti(x, y, count = 50) {
    for (let i = 0; i < count; i++) {
        const p = createConfettiPiece(x, y);
        p.vy = (Math.random() - 0.5) * 12 - 5;
        p.vx = (Math.random() - 0.5) * 15;
        confetti.push(p);
    }
    confettiActive = true;
}

function raining() {
    for (let i = 0; i < 5; i++) {
        confetti.push(createConfettiPiece());
    }
}

function animateConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confetti = confetti.filter(p => p.y < canvas.height + 50 && p.opacity > 0.01);
    confetti.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += p.gravity;
        p.vx *= 0.99;
        p.rotation += p.rotV;
        if (p.y > canvas.height * 0.7) p.opacity -= 0.02;
        drawConfettiPiece(p);
    });
    requestAnimationFrame(animateConfetti);
}
animateConfetti();

// Launch on load
setTimeout(() => {
    for (let i = 0; i < 80; i++) {
        setTimeout(() => confetti.push(createConfettiPiece()), i * 30);
    }
}, 1500);

// Raining confetti interval
setInterval(raining, 600);

// ===== FLOATING HEARTS =====
const heartEmojis = ['💕', '💖', '💗', '💓', '💞', '🌸', '✨', '💫', '🌟'];
const container = document.getElementById('heartsContainer');

function createHeart() {
    const heart = document.createElement('div');
    heart.className = 'heart';
    heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
    heart.style.left = Math.random() * 100 + 'vw';
    heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
    const dur = Math.random() * 8 + 6;
    heart.style.animation = `floatHeart ${dur}s ease-in-out forwards`;
    heart.style.animationDelay = Math.random() * 3 + 's';
    container.appendChild(heart);
    setTimeout(() => heart.remove(), (dur + 3) * 1000);
}
setInterval(createHeart, 800);

// ===== INTERSECTION OBSERVER =====
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, { threshold: 0.15 });

document.querySelectorAll(
    '.section-label, .section-title, .message-text, .flower-card, .memory-card, .quality-item, .wish-text, .mummy-img-container'
).forEach(el => observer.observe(el));

// ===== CAKE CLICK =====
const heroCake = document.getElementById('heroCake');

function triggerCelebration(x, y) {
    launchConfetti(
        x || window.innerWidth / 2,
        y || window.innerHeight / 2,
        60
    );
    createBurst();
}

heroCake.addEventListener('click', function (e) {
    const rect = this.getBoundingClientRect();
    triggerCelebration(rect.left + rect.width / 2, rect.top + rect.height / 2);
    createRipple(e, this);
    this.style.transform = 'scale(1.3) rotate(-15deg)';
    setTimeout(() => this.style.transform = '', 300);
});
heroCake.addEventListener('touchstart', function (e) {
    e.preventDefault();
    const touch = e.touches[0];
    triggerCelebration(touch.clientX, touch.clientY);
}, { passive: false });

function createBurst() {
    for (let i = 0; i < 8; i++) {
        const el = document.createElement('div');
        el.textContent = ['🌟', '💥', '✨', '🎊', '💕', '🌸', '🎉', '💫'][i];
        el.style.cssText = `
    position: fixed;
    font-size: ${Math.random() * 2 + 1}rem;
    top: ${Math.random() * 100}vh;
    left: ${Math.random() * 100}vw;
    z-index: 9000;
    pointer-events: none;
    animation: burstFade 1.5s ease forwards;
    `;
        document.body.appendChild(el);
        setTimeout(() => el.remove(), 1500);
    }
}

// Add burst animation dynamically
const style = document.createElement('style');
style.textContent = `
    @keyframes burstFade {
        0 % { transform: scale(0) rotate(0deg); opacity: 1; }
    100% {transform: scale(2) rotate(360deg) translateY(-50px); opacity: 0; }
  }
    `;
document.head.appendChild(style);

// ===== RIPPLE EFFECT =====
function createRipple(e, el) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple';
    const rect = el.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    const x = (e.clientX || e.touches?.[0]?.clientX || rect.left) - rect.left - size / 2;
    const y = (e.clientY || e.touches?.[0]?.clientY || rect.top) - rect.top - size / 2;
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    el.appendChild(ripple);
    setTimeout(() => ripple.remove(), 700);
}

// Add ripple to all interactive cards
document.querySelectorAll('.memory-card, .quality-item, .flower-card').forEach(el => {
    el.style.position = 'relative';
    el.style.overflow = 'hidden';
    el.addEventListener('click', e => createRipple(e, el));
    el.addEventListener('touchstart', e => createRipple(e.touches[0], el), { passive: true });
});

// Celebrate button
document.getElementById('celebrateBtn').addEventListener('click', function (e) {
    triggerCelebration();
    createRipple(e, this);
});

// ===== CANDLE LOGIC =====
const candleIds = ['candle1', 'candle2', 'candle3', 'candle4', 'candle5'];
const candleStates = [false, false, false, false, false]; // false=off, true=lit
const statusEl = document.getElementById('candleStatus');
const glow = document.getElementById('cakeGlowOverlay');

const statusMessages = {
    allLit: '🎂 All candles lit! Close your eyes and make a wish! 💕',
    allOut: '💨 Candles blown out! Click on candle to Light it ✨',
    partial: (n) => `🕯️ ${n} of 5 candles lit — keep going!`,
    none: '🕯️ Tap a candle to light it...',
};

function setStatus(msg) {
    statusEl.classList.remove('show');
    setTimeout(() => {
        statusEl.textContent = msg;
        statusEl.classList.add('show');
    }, 200);
}

function lightCandle(idx, instant = false) {
    if (candleStates[idx]) return;
    candleStates[idx] = true;
    const group = document.getElementById(candleIds[idx]);
    group.classList.remove('off', 'blowing');
    void group.offsetWidth; // reflow
    group.classList.add('lighting');
    if (!instant) {
        // small sparkle burst at candle position
        const svg = document.getElementById('cake-svg');
        const rect = svg.getBoundingClientRect();
        const candleX = rect.left + rect.width * ([142, 175, 212, 254, 287][idx] + 7) / 480;
        const candleY = rect.top + rect.height * ([112, 104, 95, 104, 112][idx]) / 380;
        launchConfetti(candleX, candleY, 15);
    }
    updateGlow();
    updateStatus();
}

function blowCandle(idx, instant = false) {
    if (!candleStates[idx]) return;
    candleStates[idx] = false;
    const group = document.getElementById(candleIds[idx]);
    group.classList.remove('lighting');
    group.classList.add('blowing');
    setTimeout(() => {
        group.classList.remove('blowing');
        group.classList.add('off');
    }, 600);
    updateGlow();
    updateStatus();
}

function updateGlow() {
    const litCount = candleStates.filter(Boolean).length;
    glow.setAttribute('opacity', (litCount / 5 * 0.6).toString());
}

function updateStatus() {
    const litCount = candleStates.filter(Boolean).length;
    if (litCount === 5) {
        setStatus(statusMessages.allLit);
        setTimeout(() => {
            launchConfetti(window.innerWidth / 2, window.innerHeight / 3, 80);
            createBurst();
        }, 400);
    } else if (litCount === 0) {
        setStatus(statusMessages.allOut);
    } else {
        setStatus(statusMessages.partial(litCount));
    }
}

// Click each candle to toggle
candleIds.forEach((id, idx) => {
    const group = document.getElementById(id);
    group.addEventListener('click', (e) => {
        e.stopPropagation();
        if (candleStates[idx]) {
            blowCandle(idx);
        } else {
            lightCandle(idx);
        }
    });
    group.addEventListener('touchstart', (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (candleStates[idx]) {
            blowCandle(idx);
        } else {
            lightCandle(idx);
        }
    }, { passive: false });
    group.style.cursor = 'pointer';
});

// Light all button
document.getElementById('btnLightAll').addEventListener('click', function (e) {
    createRipple(e, this);
    candleIds.forEach((_, idx) => {
        setTimeout(() => lightCandle(idx, false), idx * 200);
    });
});
document.getElementById('btnLightAll').addEventListener('touchstart', function (e) {
    e.preventDefault();
    candleIds.forEach((_, idx) => {
        setTimeout(() => lightCandle(idx, false), idx * 200);
    });
}, { passive: false });

// Blow all button
document.getElementById('btnBlowAll').addEventListener('click', function (e) {
    createRipple(e, this);
    // animate one by one with stagger
    candleIds.forEach((_, idx) => {
        setTimeout(() => blowCandle(idx, false), idx * 150);
    });
});
document.getElementById('btnBlowAll').addEventListener('touchstart', function (e) {
    e.preventDefault();
    candleIds.forEach((_, idx) => {
        setTimeout(() => blowCandle(idx, false), idx * 150);
    });
}, { passive: false });

// Observer for cake section
const cakeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            document.querySelector('.cake-subtitle').classList.add('visible');
            document.getElementById('cakeWrapper').classList.add('visible');
            document.getElementById('cakeBtns').classList.add('visible');
            document.getElementById('candleStatus').classList.add('show');
        }
    });
}, { threshold: 0.2 });
cakeObserver.observe(document.getElementById('cake-section'));

// Add cursor hover to buttons
document.querySelectorAll('.cake-btn').forEach(el => {
    el.addEventListener('mouseenter', () => cursor && cursor.classList.add('hover'));
    el.addEventListener('mouseleave', () => cursor && cursor.classList.remove('hover'));
});

// ===== PARALLAX =====
window.addEventListener('scroll', () => {
    const scrollY = window.scrollY;
    const hero = document.getElementById('hero');
    if (hero) {
        hero.style.backgroundPositionY = scrollY * 0.5 + 'px';
    }
    document.querySelectorAll('.orb').forEach((orb, i) => {
        orb.style.transform = `translateY(${scrollY * (0.1 * (i + 1))}px)`;
    });
});
