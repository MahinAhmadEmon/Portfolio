/* =========================================================
   main.js — Rijoan-style portfolio interactivity
   ========================================================= */

/* ── Particle Canvas Constellation ── */
(function () {
  var canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var W, H, particles = [];
  var mouse = { x: null, y: null };
  var COUNT = 75, DIST = 130, MOUSE_DIST = 160;
  var TEAL = '56,191,174';

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function Particle() {
    this.reset();
  }
  Particle.prototype.reset = function () {
    this.x  = Math.random() * W;
    this.y  = Math.random() * H;
    this.vx = (Math.random() - 0.5) * 0.45;
    this.vy = (Math.random() - 0.5) * 0.45;
    this.r  = Math.random() * 1.5 + 0.8;
  };
  Particle.prototype.update = function () {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x < 0 || this.x > W) this.vx *= -1;
    if (this.y < 0 || this.y > H) this.vy *= -1;
  };

  function init() {
    particles = [];
    for (var i = 0; i < COUNT; i++) particles.push(new Particle());
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    var len = particles.length;
    for (var i = 0; i < len; i++) {
      var p = particles[i];
      p.update();
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(' + TEAL + ',0.65)';
      ctx.fill();

      for (var j = i + 1; j < len; j++) {
        var q  = particles[j];
        var dx = p.x - q.x, dy = p.y - q.y;
        var d  = Math.sqrt(dx * dx + dy * dy);
        if (d < DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(q.x, q.y);
          ctx.strokeStyle = 'rgba(' + TEAL + ',' + ((1 - d / DIST) * 0.22) + ')';
          ctx.lineWidth = 0.7;
          ctx.stroke();
        }
      }

      if (mouse.x !== null) {
        var mx = p.x - mouse.x, my = p.y - mouse.y;
        var md = Math.sqrt(mx * mx + my * my);
        if (md < MOUSE_DIST) {
          ctx.beginPath();
          ctx.moveTo(p.x, p.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.strokeStyle = 'rgba(' + TEAL + ',' + ((1 - md / MOUSE_DIST) * 0.45) + ')';
          ctx.lineWidth = 0.9;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', function () { resize(); init(); });
  window.addEventListener('mousemove', function (e) { mouse.x = e.clientX; mouse.y = e.clientY; });
  window.addEventListener('mouseleave', function () { mouse.x = null; mouse.y = null; });

  resize();
  init();
  draw();
})();

/* ── Theme Toggle ── */
(function () {
  var button = document.querySelector('.theme-toggle');
  if (!button) return;
  var root = document.documentElement;
  var savedTheme = localStorage.getItem('portfolio-theme');

  function update(theme) {
    var dark = theme === 'dark';
    root.dataset.theme = dark ? 'dark' : 'light';
    button.setAttribute('aria-pressed', String(dark));
    button.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
    button.querySelector('.theme-label').textContent = dark ? 'Light mode' : 'Dark mode';
  }

  update(savedTheme === 'dark' ? 'dark' : 'light');
  button.addEventListener('click', function () {
    var nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    localStorage.setItem('portfolio-theme', nextTheme);
    update(nextTheme);
  });
})();

/* ── Contact Form Local Fallback ── */
(function () {
  var form = document.querySelector('.contact-form');
  if (!form) return;
  var note = form.querySelector('.form-note');
  var isLocal = window.location.protocol === 'file:' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1' ||
    window.location.hostname.endsWith('.test') ||
    window.location.hostname.endsWith('.local');
  if (!isLocal) {
    if (note) note.textContent = 'Your message will be submitted securely.';
    return;
  }
  if (note) note.textContent = 'On this local preview, submission opens your email app.';

  form.addEventListener('submit', function (event) {
    event.preventDefault();
    var data = new FormData(form);
    var subject = data.get('subject') || 'Portfolio contact';
    var body = [
      'Name: ' + (data.get('name') || ''),
      'Email: ' + (data.get('email') || ''),
      '',
      data.get('message') || ''
    ].join('\n');
    window.location.href = 'mailto:mahinahmad911@gmail.com?subject=' +
      encodeURIComponent(subject) + '&body=' + encodeURIComponent(body);
    if (note) note.textContent = 'Your email app should open with this message ready to send.';
  });
})();

/* ── Scroll Reveal ── */
(function () {
  var els = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('visible'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.1 });
  els.forEach(function (e) { io.observe(e); });
})();

/* ── Sticky Header Scroll Style ── */
(function () {
  var header = document.querySelector('.site-header');
  if (!header) return;
  function update() { header.classList.toggle('scrolled', window.scrollY > 30); }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();

/* ── Active Nav Link On Scroll ── */
(function () {
  var sections = document.querySelectorAll('section[id]');
  var links    = document.querySelectorAll('.site-nav a');
  if (!sections.length || !links.length) return;
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        links.forEach(function (l) { l.classList.remove('active'); });
        var a = document.querySelector('.site-nav a[href="#' + e.target.id + '"]');
        if (a) a.classList.add('active');
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });
  sections.forEach(function (s) { io.observe(s); });
})();

/* ── Mobile Nav Toggle ── */
(function () {
  var btn = document.querySelector('.nav-toggle');
  var nav = document.getElementById('site-nav');
  if (!btn || !nav) return;
  btn.addEventListener('click', function () {
    var open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    nav.classList.toggle('open', !open);
  });
  nav.querySelectorAll('a').forEach(function (a) {
    a.addEventListener('click', function () {
      btn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('open');
    });
  });
})();

/* ── Footer Year ── */
(function () {
  var el = document.getElementById('year');
  if (el) el.textContent = new Date().getFullYear();
})();

/* ── Back To Top Visibility ── */
(function () {
  var btn = document.querySelector('.back-to-top');
  if (!btn) return;
  function update() { btn.classList.toggle('visible', window.scrollY > 400); }
  window.addEventListener('scroll', update, { passive: true });
  update();
})();
