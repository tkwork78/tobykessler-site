/* A red tulip on the Contact page. A bud pops out of the dark Contact pill in the menu, drops onto the footer line,
   sprouts a stem with two leaves, opens, then sways gently. */
(function () {
  if (!document.body.hasAttribute('data-tulip')) return;

  var NS = 'http://www.w3.org/2000/svg';
  var BW = 44, BH = 50;                       // the flower head, base at its bottom centre
  var layer = document.createElement('div');
  layer.className = 'tulip-layer';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML =
    '<div class="tulip">' +
      '<div class="tulip-stem"></div>' +
      '<svg class="tulip-leaf tulip-leaf-l" viewBox="0 0 30 60" width="30" height="60" preserveAspectRatio="none"><path d="M30 60 Q2 44 0 4 Q24 26 30 52Z"/></svg>' +
      '<svg class="tulip-leaf tulip-leaf-r" viewBox="0 0 30 60" width="30" height="60" preserveAspectRatio="none"><path d="M0 60 Q28 44 30 10 Q6 30 0 52Z"/></svg>' +
      '<svg class="tulip-head" viewBox="0 0 44 50" width="44" height="50">' +
        '<path class="tulip-back" d="M22 50 Q10 46 11 22 Q14 6 22 0 Q30 6 33 22 Q34 46 22 50Z"/>' +
        '<path class="tulip-petal tulip-petal-l" d="M22 50 Q4 48 3 22 Q4 8 10 4 Q20 16 24 48Z"/>' +
        '<path class="tulip-petal tulip-petal-r" d="M22 50 Q40 48 41 22 Q40 8 34 4 Q24 16 20 48Z"/>' +
      '</svg>' +
    '</div>';
  document.body.appendChild(layer);
  var tulip = layer.querySelector('.tulip'), stem = layer.querySelector('.tulip-stem'), head = layer.querySelector('.tulip-head');

  function rect(n) { return n.getBoundingClientRect(); }
  // where it grows: straight under the Contact pill, standing on the footer line
  function spot() {
    var pill = document.querySelector('.nav-pill') || document.querySelector('.site-nav [aria-current]');
    var foot = document.querySelector('.site-footer .wrap');
    var p = pill ? rect(pill) : { left: innerWidth - 80, width: 60, top: 20, height: 30 };
    var x = p.left + p.width / 2, ground = (foot ? rect(foot).top : innerHeight) + scrollY;
    // stay clear of the page text above that spot: the lowest text or rule line it would overlap
    var top = 0;
    document.querySelectorAll('main *').forEach(function (n) {
      var r = rect(n), cs;
      if (!r.width || r.left > x + 30 || r.right < x - 30) return;
      cs = getComputedStyle(n);
      if (n.childElementCount === 0 || parseFloat(cs.borderBottomWidth) > 0) top = Math.max(top, r.bottom + scrollY);
    });
    var stemH = Math.max(50, Math.min(170, ground - top - BH - 14));
    return { x: x, ground: ground, start: p.top + p.height / 2 + scrollY, stemH: stemH };
  }

  var s = spot();
  tulip.style.left = s.x + 'px';
  tulip.style.top = s.ground + 'px';
  stem.style.height = s.stemH + 'px';
  // leaves stay below the flower on a short stem
  layer.querySelectorAll('.tulip-leaf').forEach(function (l) { var h = Math.min(60, Math.round(s.stemH * 0.6)); l.style.height = h + 'px'; l.style.width = Math.round(h / 2) + 'px'; });

  function finish() {
    head.style.transform = 'translate(-50%, ' + (-BH - s.stemH) + 'px)';
    tulip.classList.add('is-grown', 'is-open', 'is-swaying');
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }

  // 1. the bud pops out of the pill and drops onto the footer line with a small bounce
  var y = s.start - s.ground, vy = -260, G = 2600, t0 = performance.now(), last = t0, bounces = 0;
  function drop(t) {
    var dt = Math.min(0.032, (t - last) / 1000); last = t;
    vy += G * dt; y += vy * dt;
    if (y >= -BH) { y = -BH; vy = -vy * 0.32; if (++bounces > 2 || Math.abs(vy) < 60) { vy = 0; place(1); return setTimeout(grow, 120); } }
    place(Math.min(1, 0.45 + (t - t0) / 600));
    requestAnimationFrame(drop);
  }
  function place(scale) { head.style.transform = 'translate(-50%, ' + y + 'px) scale(' + scale + ')'; }

  // 2. the stem pushes the bud up, the leaves unfold, then 3. the petals open and it sways
  function grow() {
    var g0 = performance.now(), D = 1100;
    tulip.classList.add('is-sprouting');
    (function rise(t) {
      var k = Math.min(1, (t - g0) / D), e = 1 - Math.pow(1 - k, 3);
      stem.style.transform = 'translateX(-50%) scaleY(' + e + ')';
      head.style.transform = 'translate(-50%, ' + (-BH - s.stemH * e) + 'px)';
      if (k > 0.35) tulip.classList.add('is-grown');
      if (k < 1) return requestAnimationFrame(rise);
      stem.style.transform = '';
      setTimeout(function () { tulip.classList.add('is-open'); }, 150);
      setTimeout(function () { tulip.classList.add('is-swaying'); }, 900);
    })(g0);
  }
  requestAnimationFrame(function (t) { last = t0 = t; requestAnimationFrame(drop); });
})();
