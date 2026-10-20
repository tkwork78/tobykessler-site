/* A black ball on the About page. It drops out of the dark About pill in the menu onto the line under the title,
   can roll or be tossed off it, and drops to the footer line. */
(function () {
  if (!document.body.hasAttribute('data-ball')) return;

  var layer = document.createElement('div');
  layer.className = 'ball-layer';
  layer.setAttribute('aria-hidden', 'true');
  var ball = document.createElement('div');
  ball.className = 'ball';
  layer.appendChild(ball);
  document.body.appendChild(layer);

  var G = 2600, BOUNCE = 0.62, AIR = 0.999, ROLL = 0.985, MAX = 4000;
  var R = 24, x = 0, y = 0, vx = 0, vy = 0;      // x, y = ball centre, page coordinates
  var held = null, running = false, last = 0;
  var grow = 1, born = 0;                          // the ball swells to full size as it leaves the pill

  // Surfaces the ball can land on from above: the line under the title, the list lines, and the footer line.
  function surfaces() {
    var sy = window.scrollY, list = [];
    var ledge = document.querySelector('main .section');
    if (ledge) { var a = ledge.getBoundingClientRect(); list.push({ y: a.top + sy, x1: a.left, x2: a.right }); }
    // every line in the Selected Work and Focus lists: the top of each list and the line under each row
    document.querySelectorAll('.about-list').forEach(function (ul) {
      var u = ul.getBoundingClientRect(); list.push({ y: u.top + sy, x1: u.left, x2: u.right });
      Array.prototype.forEach.call(ul.children, function (li) { var b = li.getBoundingClientRect(); list.push({ y: b.bottom + sy, x1: b.left, x2: b.right }); });
    });
    var foot = document.querySelector('.site-footer .wrap');
    var f = foot ? foot.getBoundingClientRect().top + sy : document.body.scrollHeight;
    list.push({ y: f, x1: -1e4, x2: 1e4 });
    return list;
  }
  function draw() {
    if (grow < 1) grow = Math.min(1, 0.5 + (performance.now() - born) / 600);
    ball.style.transform = 'translate(' + (x - R) + 'px,' + (y - R) + 'px) scale(' + grow + ')';
  }
  function onSurface(list) {
    return list.some(function (s) { return Math.abs(y + R - s.y) < 0.5 && x >= s.x1 && x <= s.x2; });
  }

  function step(t) {
    var dt = Math.min(0.032, (t - last) / 1000 || 0.016); last = t;
    var list = surfaces(), W = layer.clientWidth;
    if (!held) {
      var prevBottom = y + R;
      vy += G * dt; vx *= AIR; vy *= AIR;
      x += vx * dt; y += vy * dt;
      list.forEach(function (s) {          // land on a line when crossing it on the way down
        if (vy >= 0 && prevBottom <= s.y + 0.5 && y + R >= s.y && x >= s.x1 && x <= s.x2) {
          y = s.y - R;
          vy = Math.abs(vy) < 60 ? 0 : -vy * BOUNCE;
          vx *= ROLL;
          if (vy === 0 && Math.abs(vx) < 4) vx = 0;
        }
      });
      if (x < R) { x = R; vx = -vx * BOUNCE; }
      if (x > W - R) { x = W - R; vx = -vx * BOUNCE; }
      if (y < R) { y = R; vy = -vy * BOUNCE; }
    }
    draw();
    if (held || vx || vy || grow < 1 || !onSurface(list)) requestAnimationFrame(step);
    else running = false;
  }
  function wake() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(step); } }

  function pagePoint(e) { return { x: e.clientX + window.scrollX, y: e.clientY + window.scrollY }; }
  ball.addEventListener('pointerdown', function (e) {
    var p = pagePoint(e);
    held = { dx: p.x - x, dy: p.y - y, trail: [] };
    vx = vy = 0;
    ball.classList.add('is-held');
    ball.setPointerCapture(e.pointerId);
    e.preventDefault();
    wake();
  });
  ball.addEventListener('pointermove', function (e) {
    if (!held) return;
    var p = pagePoint(e), floor = surfaces().pop().y, W = layer.clientWidth;
    x = Math.max(R, Math.min(W - R, p.x - held.dx));
    y = Math.max(R, Math.min(floor - R, p.y - held.dy));
    held.trail.push({ x: x, y: y, t: performance.now() });
    if (held.trail.length > 6) held.trail.shift();
  });
  function release() {
    if (!held) return;
    var tr = held.trail, a = tr[0], z = tr[tr.length - 1];
    if (a && z && z.t - a.t > 0 && performance.now() - z.t < 80) {
      var dt = (z.t - a.t) / 1000;
      vx = Math.max(-MAX, Math.min(MAX, (z.x - a.x) / dt));
      vy = Math.max(-MAX, Math.min(MAX, (z.y - a.y) / dt));
    }
    held = null;
    ball.classList.remove('is-held');
    wake();
  }
  ball.addEventListener('pointerup', release);
  ball.addEventListener('pointercancel', release);

  // Starts hidden behind the dark About pill in the menu (half size, so the pill covers it) and drops out of it.
  function drop() {
    var pill = document.querySelector('.nav-pill') || document.querySelector('.site-nav [aria-current]');
    var r = pill.getBoundingClientRect();
    x = r.left + r.width / 2 + window.scrollX; y = r.top + r.height / 2 + window.scrollY; vx = 0; vy = 0;
    grow = 0.5; born = performance.now();
    draw(); wake();
  }
  window.addEventListener('resize', function () { if (!held) { x = Math.min(x, layer.clientWidth - R); wake(); } });
  if (document.readyState === 'complete') drop();
  else { y = -2 * R; draw(); window.addEventListener('load', drop); }   // wait for fonts so the heading width is right
})();
