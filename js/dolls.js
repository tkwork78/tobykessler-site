/* Nesting dolls game on the About page: drag the top half of each Lego figure to open it. */
(function () {
  var mount = document.querySelector('[data-dolls]');
  if (!mount) return;

  var NS = 'http://www.w3.org/2000/svg';
  var W = 800, H = 380, BASE = 360;             // stage size and floor line, in SVG units
  var SIZES = [2, 1.6, 1.28, 1.02, 0.82, 0.62];   // biggest to smallest
  var SHELF = 0.34, OPEN_AT = 45;                 // shelf scale; drag distance (doll units) that opens it

  function node(tag, attrs, parent) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  // One Lego figure, 100 x 152 units, origin at bottom centre. Split at the waist.
  function figure(last) {
    var g = node('g', { class: 'doll' });
    var inner = node('g', { transform: 'translate(-50 -152)' }, g);
    var bottom = node('g', { class: 'bottom' }, inner);
    node('rect', { class: 'blank', x: 22, y: 97, width: 56, height: 55 }, bottom);
    node('rect', { class: 'fill', x: 21, y: 107, width: 28, height: 45, rx: 1 }, bottom);
    node('rect', { class: 'fill', x: 51, y: 107, width: 28, height: 45, rx: 1 }, bottom);
    node('rect', { class: 'fill', x: 21, y: 97, width: 58, height: 10, rx: 1 }, bottom);
    node('path', { class: 'line', d: 'M21 144 H49 M51 144 H79' }, bottom);
    var top = node('g', { class: 'top' }, inner);
    node('path', { class: 'fill', d: 'M31 47 L15 84 L25 88 L37 60 Z' }, top);
    node('path', { class: 'fill', d: 'M69 47 L85 84 L75 88 L63 60 Z' }, top);
    node('path', { class: 'fill', d: 'M14 92 a6 6 0 1 1 10 4 M86 92 a6 6 0 1 0 -10 4' }, top);
    node('rect', { class: 'fill', x: 38, y: 40, width: 24, height: 6 }, top);
    node('path', { class: 'fill', d: 'M30 45 L70 45 L78 97 L22 97 Z' }, top);
    node('rect', { class: 'fill', x: 40, y: 1, width: 20, height: 8, rx: 2 }, top);
    node('rect', { class: 'fill', x: 30, y: 8, width: 40, height: 33, rx: 9 }, top);
    node('circle', { class: 'solid', cx: 42, cy: 22, r: 2.2 }, top);
    node('circle', { class: 'solid', cx: 58, cy: 22, r: 2.2 }, top);
    node('path', { class: 'line', d: last ? 'M42 30 Q50 38 58 30' : 'M42 30 Q50 35 58 30' }, top);
    if (!last) node('path', { class: 'line', d: 'M23 97 H77', 'stroke-dasharray': '3 3' }, top);
    return { g: g, top: top };
  }

  var svg = node('svg', { class: 'dolls-stage', viewBox: '0 0 ' + W + ' ' + H, role: 'img', 'aria-label': 'Lego figure nesting dolls' });
  node('path', { class: 'line', d: 'M0 ' + BASE + ' H' + W }, svg);
  var hint = document.createElement('p'); hint.className = 'caption';
  var reset = document.createElement('button'); reset.type = 'button'; reset.className = 'dolls-reset'; reset.textContent = 'Put Them Back';
  var bar = document.createElement('div'); bar.className = 'dolls-bar'; bar.appendChild(hint); bar.appendChild(reset);
  mount.appendChild(svg); mount.appendChild(bar);

  var dolls = [], current = 0;

  function place(d, x, s, opacity) {
    d.g.style.transform = 'translate(' + x + 'px,' + BASE + 'px) scale(' + s + ')';
    d.g.style.opacity = opacity;
  }
  function shelfX(i) {          // opened dolls line up along the left, biggest first
    var x = 24;
    for (var k = 0; k < i; k++) x += 100 * SIZES[k] * SHELF + 14;
    return x + 50 * SIZES[i] * SHELF;
  }
  function setTop(d, x, y) { d.top.style.transform = 'translate(' + x + 'px,' + y + 'px)'; }

  function build() {
    while (dolls.length) svg.removeChild(dolls.pop().g);
    current = 0;
    for (var i = SIZES.length - 1; i >= 0; i--) {       // smallest first so the biggest sits on top
      var d = figure(i === SIZES.length - 1);
      svg.appendChild(d.g);
      dolls[i] = d;
    }
    dolls.forEach(function (d, i) { place(d, W / 2, SIZES[i] * 0.9, i === 0 ? 1 : 0); setTop(d, 0, 0); });
    requestAnimationFrame(function () { place(dolls[0], W / 2, SIZES[0], 1); });
    update();
  }

  function update() {
    dolls.forEach(function (d, i) { d.g.classList.toggle('is-current', i === current); });
    var last = current === SIZES.length - 1;
    hint.textContent = last ? 'That’s the smallest one.' : current === 0 ? 'Drag the top half up to open it.' : 'Keep going.';
    reset.hidden = current === 0;
  }

  function open() {
    var d = dolls[current], next = dolls[current + 1];
    d.g.classList.remove('is-current');
    setTop(d, 10, -22);                                   // lid sits ajar on the shelf
    place(d, shelfX(current), SIZES[current] * SHELF, 1);
    place(next, W / 2, SIZES[current + 1], 1);
    current++;
    update();
  }

  // Dragging the top half of the current doll
  var drag = null;
  function point(e) {
    var r = svg.getBoundingClientRect(), k = W / r.width;
    return { x: (e.clientX - r.left) * k, y: (e.clientY - r.top) * k };
  }
  svg.addEventListener('pointerdown', function (e) {
    var d = dolls[current];
    if (!d || current === SIZES.length - 1 || !d.top.contains(e.target)) return;
    drag = { d: d, start: point(e), s: SIZES[current] };
    d.g.classList.add('is-dragging');
    svg.setPointerCapture(e.pointerId);
    e.preventDefault();
  });
  svg.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var p = point(e), dx = (p.x - drag.start.x) / drag.s, dy = Math.min(0, (p.y - drag.start.y) / drag.s);
    setTop(drag.d, dx * 0.6, dy);
    drag.dy = dy;
  });
  function end() {
    if (!drag) return;
    var d = drag.d, opened = -(drag.dy || 0) > OPEN_AT;
    d.g.classList.remove('is-dragging');
    drag = null;
    if (opened) open(); else setTop(d, 0, 0);
  }
  svg.addEventListener('pointerup', end);
  svg.addEventListener('pointercancel', end);

  // Keyboard: Enter or Space opens the next doll
  svg.setAttribute('tabindex', '0');
  svg.addEventListener('keydown', function (e) {
    if ((e.key === 'Enter' || e.key === ' ') && current < SIZES.length - 1) { e.preventDefault(); open(); }
  });

  reset.addEventListener('click', build);
  build();
})();
