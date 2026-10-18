/* A black ball resting on the About page floor. Drag it, toss it. */
(function () {
  var floor = document.querySelector('[data-ball]');
  if (!floor) return;

  var ball = document.createElement('div');
  ball.className = 'ball';
  floor.appendChild(ball);

  var G = 2600, BOUNCE = 0.62, AIR = 0.999, ROLL = 0.985, MAX = 4000;
  var size = 48, x = 0, y = 0, vx = 0, vy = 0;
  var held = null, running = false, last = 0;

  function bounds() { return { w: floor.clientWidth - size, h: floor.clientHeight - size }; }
  function draw() { ball.style.transform = 'translate(' + x + 'px,' + y + 'px)'; }

  function step(t) {
    var dt = Math.min(0.032, (t - last) / 1000 || 0.016); last = t;
    var b = bounds();
    if (!held) {
      vy += G * dt;
      vx *= AIR; vy *= AIR;
      x += vx * dt; y += vy * dt;
      if (y > b.h) { y = b.h; vy = Math.abs(vy) < 60 ? 0 : -vy * BOUNCE; vx *= ROLL; }
      if (x < 0) { x = 0; vx = -vx * BOUNCE; }
      if (x > b.w) { x = b.w; vx = -vx * BOUNCE; }
      if (y >= b.h && vy === 0) { vx *= ROLL; if (Math.abs(vx) < 4) vx = 0; }
    }
    draw();
    if (held || vx || vy || y < b.h) requestAnimationFrame(step);
    else running = false;
  }
  function wake() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(step); } }

  ball.addEventListener('pointerdown', function (e) {
    var r = floor.getBoundingClientRect();
    held = { dx: e.clientX - r.left - x, dy: e.clientY - r.top - y, trail: [] };
    vx = vy = 0;
    ball.classList.add('is-held');
    ball.setPointerCapture(e.pointerId);
    e.preventDefault();
    wake();
  });
  ball.addEventListener('pointermove', function (e) {
    if (!held) return;
    var r = floor.getBoundingClientRect(), b = bounds();
    x = Math.max(0, Math.min(b.w, e.clientX - r.left - held.dx));
    y = Math.min(b.h, e.clientY - r.top - held.dy);
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

  function rest() { var b = bounds(); x = Math.round(b.w * 0.5); y = b.h; draw(); }
  window.addEventListener('resize', function () { var b = bounds(); x = Math.min(x, b.w); y = Math.min(y, b.h); draw(); wake(); });
  rest();
})();
