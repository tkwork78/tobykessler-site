/* A paper plane on the Contact page. It flies out from behind the dark Contact pill in the menu, left and down
   across the page with a loop-the-loop, trailing a dotted line, and lands on the footer line. */
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

  // the dotted trail is revealed behind the plane through a mask that draws along the same path
  var mask = make('mask', { id: 'plane-reveal', maskUnits: 'userSpaceOnUse', x: 0, y: 0, width: W, height: H }, make('defs', {}, svg));
  var reveal = make('path', { d: d, fill: 'none', stroke: '#fff', 'stroke-width': 8 }, mask);
  var trail = make('path', { d: d, class: 'plane-trail', mask: 'url(#plane-reveal)' }, svg);
  var L = trail.getTotalLength();
  reveal.setAttribute('stroke-dasharray', L + ' ' + L);
  reveal.setAttribute('stroke-dashoffset', L);

  // a paper dart seen from above, pointing right; it is turned to follow the path
  var plane = make('g', {}, svg);
  make('path', { class: 'plane-body', d: 'M15 0 L-11 -10 L-6 0 L-11 10 Z' }, plane);
  make('path', { class: 'plane-fold', d: 'M15 0 L-6 0' }, plane);

  function at(len, scale) {
    var a = trail.getPointAtLength(Math.max(0, len - 0.5)), b = trail.getPointAtLength(Math.min(L, len + 0.5));
    var c = trail.getPointAtLength(len), ang = Math.atan2(b.y - a.y, b.x - a.x) * 180 / Math.PI;
    plane.setAttribute('transform', 'translate(' + c.x + ' ' + c.y + ') rotate(' + ang + ') scale(' + scale + ')');
  }

  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { trail.style.display = 'none'; at(L, 1); return; }

  var D = 3600, t0;
  function fly(t) {
    if (!t0) t0 = t;
    var k = Math.min(1, (t - t0) / D);
    var e = 0.5 * k + 0.25 * (1 - Math.cos(Math.PI * k));   // eases in and out, but keeps moving
    var len = L * e;
    reveal.setAttribute('stroke-dashoffset', L - len);
    at(len, Math.min(1, 0.4 + k * 3));
    if (k < 1) return requestAnimationFrame(fly);
    setTimeout(function () { trail.classList.add('is-gone'); }, 1500);
  }
  at(0, 0.4);
  setTimeout(function () { requestAnimationFrame(fly); }, 300);
})();
