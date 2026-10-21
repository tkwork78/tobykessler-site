/* Snake on the 404 page. Arrow keys or WASD, swipe on phones, space to pause. Walls and your own tail end the game. */
(function () {
  var canvas = document.querySelector('[data-snake]');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var COLS = 20, ROWS = 14, C = canvas.width / COLS;
  var overlay = document.querySelector('[data-snake-overlay]'), msg = document.querySelector('[data-snake-msg]');
  var startBtn = document.querySelector('[data-snake-start]');
  var scoreEl = document.querySelector('[data-snake-score]'), bestEl = document.querySelector('[data-snake-best]');
  var best = 0;
  try { best = parseInt(localStorage.getItem('tk-snake-best'), 10) || 0; } catch (e) {}
  bestEl.textContent = best;

  var snake, dir, queue, food, score, timer, playing = false, paused = false;

  function reset() {
    snake = [{ x: 6, y: 7 }, { x: 5, y: 7 }, { x: 4, y: 7 }];
    dir = { x: 1, y: 0 }; queue = []; score = 0; scoreEl.textContent = 0;
    placeFood();
  }
  function placeFood() {
    do { food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) }; }
    while (snake.some(function (s) { return s.x === food.x && s.y === food.y; }));
  }
  function speed() { return Math.max(60, 120 - score * 3); }   // a little faster with every bite

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc((food.x + .5) * C, (food.y + .5) * C, C * .32, 0, Math.PI * 2); ctx.fill();
    snake.forEach(function (s, i) {
      ctx.fillStyle = i === 0 ? '#000' : '#2b2b2b';
      var p = 2, r = C * .3, x = s.x * C + p, y = s.y * C + p, w = C - p * 2;
      ctx.beginPath();
      if (ctx.roundRect) ctx.roundRect(x, y, w, w, r); else ctx.rect(x, y, w, w);
      ctx.fill();
    });
  }

  function step() {
    if (queue.length) dir = queue.shift();
    var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    var ate = head.x === food.x && head.y === food.y;
    var body = ate ? snake : snake.slice(0, -1);
    if (head.x < 0 || head.y < 0 || head.x >= COLS || head.y >= ROWS || body.some(function (s) { return s.x === head.x && s.y === head.y; })) return over();
    snake.unshift(head);
    if (ate) { score++; scoreEl.textContent = score; placeFood(); } else snake.pop();
    draw();
    timer = setTimeout(step, speed());
  }

  function start() {
    reset(); draw();
    playing = true; paused = false; overlay.hidden = true;
    clearTimeout(timer); timer = setTimeout(step, speed());
  }
  function over() {
    playing = false;
    if (score > best) { best = score; bestEl.textContent = best; try { localStorage.setItem('tk-snake-best', best); } catch (e) {} }
    msg.textContent = 'Game Over'; startBtn.textContent = 'Play Again'; overlay.hidden = false;
  }
  function pause() {
    if (!playing) return;
    paused = !paused;
    if (paused) { clearTimeout(timer); msg.textContent = 'Paused'; startBtn.textContent = 'Keep Playing'; overlay.hidden = false; }
    else { overlay.hidden = true; timer = setTimeout(step, speed()); }
  }

  function turn(x, y) {
    var last = queue.length ? queue[queue.length - 1] : dir;
    if ((x && x === -last.x) || (y && y === -last.y) || (x === last.x && y === last.y)) return;   // no turning back on itself
    if (queue.length < 3) queue.push({ x: x, y: y });
  }
  var KEYS = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0], W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0] };
  document.addEventListener('keydown', function (e) {
    if (e.key === ' ' && playing) { e.preventDefault(); return pause(); }
    var k = KEYS[e.key];
    if (!k || !playing || paused) return;
    e.preventDefault();                                  // keep the arrow keys from scrolling the page
    turn(k[0], k[1]);
  });
  startBtn.addEventListener('click', function () { if (paused) pause(); else start(); });

  // swipe on the board to turn
  var t0 = null, board = canvas.parentNode;
  board.addEventListener('touchstart', function (e) { t0 = { x: e.touches[0].clientX, y: e.touches[0].clientY }; }, { passive: true });
  board.addEventListener('touchmove', function (e) {
    if (!t0 || !playing) return;
    var dx = e.touches[0].clientX - t0.x, dy = e.touches[0].clientY - t0.y;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
    if (Math.abs(dx) > Math.abs(dy)) turn(dx > 0 ? 1 : -1, 0); else turn(0, dy > 0 ? 1 : -1);
    t0 = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    e.preventDefault();
  }, { passive: false });

  reset(); draw();
})();
