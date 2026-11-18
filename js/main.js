// Efeitos interativos da landing page: parallax, barra de progresso,
// contadores animados, spotlight do hero e tilt 3D da foto.
(function () {
  'use strict';

  var rootStyle = document.documentElement.style;
  var set = function (name, value) { rootStyle.setProperty('--' + name, value); };

  var els = {};
  document.querySelectorAll('[data-ref]').forEach(function (el) { els[el.dataset.ref] = el; });
  var counters = document.querySelectorAll('[data-count]');

  var offsets = {};
  var progress = { kh: 0, ks: 0, ka: 0 };
  var started = {};

  // ---- Contadores -------------------------------------------------------
  function renderCounts() {
    var kh = progress.kh, ks = progress.ks, ka = progress.ka;
    var heroOrStats = Math.max(kh, ks);
    var values = {
      n30: Math.round(30 * heroOrStats),
      n95: Math.round(95 * heroOrStats),
      n30b: Math.round(30 * ka),
      n20b: Math.round(20 * ka),
      n95b: Math.round(95 * ka)
    };
    counters.forEach(function (el) { el.textContent = values[el.dataset.count]; });
    set('ring', (351.86 * (1 - 0.95 * ks)).toFixed(2));
    var pct = function (v) { return (v * ks).toFixed(1) + '%'; };
    set('f-a', pct(100)); set('f-b', pct(78)); set('f-c', pct(56)); set('f-d', pct(38));
  }

  function startCount(which) {
    if (started[which]) return;
    started[which] = true;
    var key = which === 'hero' ? 'kh' : (which === 'about' ? 'ka' : 'ks');
    var t0 = performance.now();
    function step(now) {
      var t = Math.min(1, (now - t0) / 1900);
      progress[key] = 1 - Math.pow(1 - t, 3);
      renderCounts();
      if (t < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  // ---- Scroll: parallax e progresso -------------------------------------
  function ty(k, f) { return 'translate3d(0,' + ((offsets[k] || 0) * f).toFixed(1) + 'px,0)'; }

  function measure() {
    var vh = window.innerHeight || 900;
    var prog = 0;
    Object.keys(els).forEach(function (k) {
      var r = els[k].getBoundingClientRect();
      if (k === 'root') {
        var span = r.height - vh;
        prog = span > 0 ? Math.min(1, Math.max(0, -r.top / span)) : 0;
        return;
      }
      offsets[k] = Math.round(r.top + r.height / 2 - vh / 2);
      if (k === 'stats' && r.top < vh * 0.8) startCount('stats');
      if (k === 'about' && r.top < vh * 0.7) startCount('about');
    });

    var heroY = offsets.hero || 0;
    var bigY = offsets.big || 0;
    set('prog', prog.toFixed(4));
    set('px-hero', ty('hero', -0.14));
    set('px-chip1', ty('hero', 0.2));
    set('px-chip2', ty('hero', -0.32));
    set('px-mark', 'translate3d(0,' + (heroY * 0.3).toFixed(1) + 'px,0) rotate(' + (heroY * -0.03).toFixed(2) + 'deg)');
    set('px-mark2', 'rotate(' + ((offsets.about || 0) * -0.02).toFixed(2) + 'deg)');
    set('px-big1', 'translate3d(' + (-200 + bigY * 0.6).toFixed(1) + 'px,0,0)');
    set('px-big2', 'translate3d(' + (-500 - bigY * 0.6).toFixed(1) + 'px,0,0)');
    set('px-ev', ty('ev', -0.12));
    set('px-about', ty('about', -0.1));
  }

  var raf = null;
  function tick() {
    if (raf) return;
    raf = requestAnimationFrame(function () { raf = null; measure(); });
  }

  // ---- Mouse: spotlight e tilt ------------------------------------------
  function onFrame(fn) {
    var pending = null, id = null;
    return function (value) {
      pending = value;
      if (id) return;
      id = requestAnimationFrame(function () { id = null; fn(pending); });
    };
  }

  var setSpot = onFrame(function (v) { set('spot', v); });
  document.querySelectorAll('[data-spot]').forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      setSpot(((e.clientX - r.left) / r.width * 100).toFixed(1) + '% ' +
              ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
    });
  });

  var setTilt = onFrame(function (t) {
    set('tilt-x', t.x); set('tilt-y', t.y); set('tilt-glare', t.glare);
  });
  document.querySelectorAll('[data-tilt]').forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var r = el.getBoundingClientRect();
      var nx = (e.clientX - r.left) / r.width - 0.5;
      var ny = (e.clientY - r.top) / r.height - 0.5;
      setTilt({
        x: (-ny * 10).toFixed(2),
        y: (nx * 12).toFixed(2),
        glare: ((nx + 0.5) * 100).toFixed(1) + '% ' + ((ny + 0.5) * 100).toFixed(1) + '%'
      });
    });
    el.addEventListener('mouseleave', function () { setTilt({ x: 0, y: 0, glare: '50% 0%' }); });
  });

  // ---- Início -----------------------------------------------------------
  renderCounts();
  measure();
  window.addEventListener('scroll', tick, { passive: true });
  window.addEventListener('resize', tick);
  startCount('hero');
  setTimeout(function () { startCount('stats'); startCount('about'); }, 7000);
})();
