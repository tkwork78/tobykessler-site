/* A paper plane on the Contact page. It flies out from behind the dark Contact pill in the menu, left and down
   across the page with a loop-the-loop, with a short dotted trail behind it, and lands on the footer line.
   It can then be picked up and thrown, and glides back down. */
(function () {
  if (!document.body.hasAttribute('data-plane')) return;

  var NS = 'http://www.w3.org/2000/svg';
  function rect(n) { return n.getBoundingClientRect(); }
  function make(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  var layer = document.createElement('div');
  layer.className = 'plane-layer';
  layer.setAttribute('aria-hidden', 'true');
  document.body.appendChild(layer);

  var W = document.documentElement.clientWidth, H = document.documentElement.scrollHeight;
  var svg = make('svg', { width: W, height: H, viewBox: '0 0 ' + W + ' ' + H }, null);
  layer.appendChild(svg);

  // the flight: from the Contact pill, a curve down and left into a loop, then a long glide down to the footer line
  var pill = document.querySelector('.nav-pill') || document.querySelector('.site-nav [aria-current]');
  var foot = document.querySelector('.site-footer .wrap');
  var p = pill ? rect(pill) : { left: W - 80, width: 60, top: 20, height: 30 };
  var sx = p.left + p.width / 2, sy = p.top + p.height / 2 + scrollY;
  var g = (foot ? rect(foot).top : innerHeight) + scrollY;
  var small = W < 720, r = small ? 26 : 40, PH = 7;              // loop radius; plane half height, so it rests on the line
  var lx = small ? W * 0.6 : W * 0.68, ly = sy + (g - sy) * 0.42;
  var ex = small ? W * 0.3 : W * 0.4, ey = g - PH;
  var d = 'M' + sx + ' ' + sy +
    ' C' + (sx - 50) + ' ' + (sy + 40) + ' ' + (lx + r * 3) + ' ' + (ly + r) + ' ' + lx + ' ' + (ly + r) +
    ' A' + r + ' ' + r + ' 0 0 1 ' + lx + ' ' + (ly - r) +
    ' A' + r + ' ' + r + ' 0 0 1 ' + lx + ' ' + (ly + r) +
    ' C' + (lx - r * 3) + ' ' + (ly + r) + ' ' + (ex + (lx - ex) * 0.6) + ' ' + ey + ' ' + ex + ' ' + ey;

  // a short stretch of dotted trail just behind the plane, shown through a mask that slides along the same path
  var mask = make('mask', { id: 'plane-reveal', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H }, make('defs', {}, svg));
  var reveal = make('path', { d: d, fill: 'none', stroke: '#fff', 'stroke-width': 8 }, mask);
  var trail = make('path', { d: d, class: 'plane-trail', mask: 'url(#plane-reveal)' }, svg);
  var L = trail.getTotalLength();
  var T = small ? 90 : 140;                      // trail length behind the plane
  function tail(from, to) {
    reveal.setAttribute('stroke-dasharray', Math.max(0.01, to - from) + ' ' + (L * 2));
    reveal.setAttribute('stroke-dashoffset', -from);
  }
  tail(0, 0);

  // a paper dart seen from above, pointing right; it is turned to follow the path
  var plane = make('g', {}, svg);
  make('path', { class: 'plane-body', d: 'M15 0 L-11 -10 L-6 0 L-11 10 Z' }, plane);
  make('path', { class: 'plane-fold', d: 'M15 0 L-6 0' }, plane);
  var hit = make('circle', { class: 'plane-hit', r: 24, cx: 2, cy: 0 }, plane);   // a bigger, invisible grab area

  var x = sx, y = sy, ang = 0, size = 0.4;        // page coordinates and heading in degrees
  function draw() { plane.setAttribute('transform', 'translate(' + x + ' ' + y + ') rotate(' + ang + ') scale(' + size + ')'); }
  function at(len, scale) {
    var a = trail.getPointAtLength(Math.max(0, len - 0.5)), b = trail.getPointAtLength(Math.min(L, len + 0.5));
    var c = trail.getPointAtLength(len);
    x = c.x; y = c.y; ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI; size = scale;
    draw();
  }

  // ---- picking it up and throwing it: once thrown it glides, losing height slowly while it is moving fast
  var G = 1000, LIFT = 1.4, AIR = 0.4, SLIDE = 6;
  var vx = 0, vy = 0, held = null, scripted = true, running = false, last = 0;
  function physics(t) {
    var dt = Math.min(0.032, (t - last) / 1000 || 0.016); last = t;
    if (!held) {
      var lift = Math.min(G * 0.92, LIFT * Math.abs(vx));
      vy += (G - lift) * dt;
      var damp = Math.exp(-AIR * dt); vx *= damp; vy *= damp;
      x += vx * dt; y += vy * dt;
      if (x < 16) { x = 16; vx = Math.abs(vx) * 0.4; }
      if (x > W - 16) { x = W - 16; vx = -Math.abs(vx) * 0.4; }
      if (y < 12) { y = 12; vy = Math.abs(vy) * 0.3; }
      if (y >= ey) {                                   // on the footer line: level out and slide to a stop
        y = ey; vy = 0; vx *= Math.exp(-SLIDE * dt);
        if (Math.abs(vx) < 6) vx = 0;
        ang = vx > 0 || (vx === 0 && Math.abs(ang) < 90) ? 0 : 180;
      } else {
        ang = Math.atan2(vy, vx) * 180 / Math.PI;
      }
    }
    draw();
    if (held || vx || vy || y < ey) requestAnimationFrame(physics);
    else running = false;
  }
  function wake() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(physics); } }

  function pagePoint(e) { return { x: e.clientX + window.scrollX, y: e.clientY + window.scrollY }; }
  hit.addEventListener('pointerdown', function (e) {
    scripted = false; trail.style.display = 'none'; size = 1;
    var p = pagePoint(e);
    held = { dx: p.x - x, dy: p.y - y, trail: [{ x: p.x, y: p.y, t: performance.now() }] };
    vx = vy = 0;
    hit.classList.add('is-held');
    hit.setPointerCapture(e.pointerId);
    e.preventDefault();
    wake();
  });
  hit.addEventListener('pointermove', function (e) {
    if (!held) return;
    var p = pagePoint(e), now = performance.now(), prev = held.trail[held.trail.length - 1];
    x = Math.max(16, Math.min(W - 16, p.x - held.dx));
    y = Math.max(12, Math.min(ey, p.y - held.dy));
    if (Math.hypot(p.x - prev.x, p.y - prev.y) > 3) {  // point the nose the way the hand is moving
      var want = Math.atan2(p.y - prev.y, p.x - prev.x) * 180 / Math.PI, diff = ((want - ang + 540) % 360) - 180;
      ang += diff * 0.35;
    }
    held.trail.push({ x: p.x, y: p.y, t: now });
    while (held.trail.length > 2 && now - held.trail[0].t > 90) held.trail.shift();
  });
  function release() {
    if (!held) return;
    var tr = held.trail, a = tr[0], b = tr[tr.length - 1], dt = (b.t - a.t) / 1000;
    if (dt > 0.008 && performance.now() - b.t < 80) {
      vx = (b.x - a.x) / dt; vy = (b.y - a.y) / dt;
      var sp = Math.hypot(vx, vy), max = 2600;
      if (sp > max) { vx *= max / sp; vy *= max / sp; }
    }
    held = null;
    hit.classList.remove('is-held');
    wake();
  }
  hit.addEventListener('pointerup', release);
  hit.addEventListener('pointercancel', release);

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { trail.style.display = 'none'; at(L, 1); scripted = false; return; }

  var D = 3600, t0;
  function fly(t) {
    if (!scripted) return;                              // picked up mid-flight
    if (!t0) t0 = t;
    var k = Math.min(1, (t - t0) / D);
    var e = 0.5 * k + 0.25 * (1 - Math.cos(Math.PI * k));   // eases in and out, but keeps moving
    var len = L * e;
    tail(Math.max(0, len - T), len);
    at(len, Math.min(1, 0.4 + k * 3));
    if (k < 1) return requestAnimationFrame(fly);
    scripted = false; ang = 180; draw();
    // once it lands the trail catches up and tucks in behind it
    var c0;
    (function tuck(t2) {
      if (!c0) c0 = t2;
      var q = Math.min(1, (t2 - c0) / 700);
      tail(L - T * (1 - q) * (1 - q), L);
      if (q < 1) requestAnimationFrame(tuck); else trail.style.display = 'none';
    })(performance.now());
  }
  at(0, 0.4);
  setTimeout(function () { requestAnimationFrame(fly); }, 300);
})();
