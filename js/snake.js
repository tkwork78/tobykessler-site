/* Snake for the under-construction landing page. Arrow keys / WASD on desktop, swipe on phones. */
(function () {
  var canvas = document.querySelector('.snake-board');
  if (!canvas) return;
  var ctx = canvas.getContext('2d');
  var scoreEl = document.querySelector('.snake-score');
  var hintEl = document.querySelector('[data-snake-hint]');
  var N = 20, CELL = canvas.width / N, TICK = 110;
  var touch = matchMedia('(pointer: coarse)').matches;
  var startHint = touch ? 'Swipe to play' : 'Press any arrow key to play';
  var snake, dir, queue, food, score, best = 0, state = 'ready', timer = null;

  try { best = parseInt(localStorage.getItem('snakeBest'), 10) || 0; } catch (e) {}

  function reset() {
    snake = [{ x: 9, y: 10 }, { x: 8, y: 10 }, { x: 7, y: 10 }];
    dir = { x: 1, y: 0 }; queue = []; score = 0;
    placeFood(); updateScore(); draw();
  }
  function placeFood() {
    do { food = { x: Math.floor(Math.random() * N), y: Math.floor(Math.random() * N) }; }
    while (snake.some(function (s) { return s.x === food.x && s.y === food.y; }));
  }
  function updateScore() { scoreEl.textContent = 'Score ' + score + (best ? '  ·  Best ' + best : ''); }

  function draw() {
    ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = '#e4e4e4';
    for (var i = 1; i < N; i++) for (var j = 1; j < N; j++) ctx.fillRect(i * CELL - 1, j * CELL - 1, 2, 2);
    ctx.fillStyle = '#000';
    ctx.beginPath(); ctx.arc(food.x * CELL + CELL / 2, food.y * CELL + CELL / 2, CELL * 0.3, 0, Math.PI * 2); ctx.fill();
    snake.forEach(function (s, k) {
      ctx.fillStyle = k === 0 ? '#000' : '#2b2b2b';
      ctx.fillRect(s.x * CELL + 1, s.y * CELL + 1, CELL - 2, CELL - 2);
    });
    if (state !== 'playing') {
      ctx.fillStyle = 'rgba(255,255,255,.85)'; ctx.fillRect(0, canvas.height / 2 - 64, canvas.width, 128);
      ctx.fillStyle = '#000'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
      ctx.font = '300 48px Inter, Helvetica Neue, Arial, sans-serif';
      ctx.fillText(state === 'over' ? 'Game over' : 'Snake', canvas.width / 2, canvas.height / 2 - 16);
      ctx.font = '400 24px Inter, Helvetica Neue, Arial, sans-serif'; ctx.fillStyle = '#666';
      ctx.fillText(state === 'over' ? (touch ? 'Tap or swipe to play again' : 'Press any arrow key to play again') : startHint, canvas.width / 2, canvas.height / 2 + 30);
    }
  }

  function step() {
    if (queue.length) dir = queue.shift();
    var head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    var ate = head.x === food.x && head.y === food.y;
    var body = ate ? snake : snake.slice(0, -1);
    if (head.x < 0 || head.y < 0 || head.x >= N || head.y >= N || body.some(function (s) { return s.x === head.x && s.y === head.y; })) return gameOver();
    snake.unshift(head);
    if (ate) { score++; if (score > best) { best = score; try { localStorage.setItem('snakeBest', best); } catch (e) {} } updateScore(); placeFood(); }
    else snake.pop();
    draw();
  }
  function start() {
    if (state === 'playing') return;
    if (state === 'over') reset();
    state = 'playing'; hintEl.textContent = touch ? 'Swipe to turn' : 'Arrow keys or WASD';
    clearInterval(timer); timer = setInterval(step, TICK);
  }
  function gameOver() {
    state = 'over'; clearInterval(timer); hintEl.textContent = startHint; draw();
  }
  function turn(d) {
    var last = queue.length ? queue[queue.length - 1] : dir;
    if (d.x === -last.x && d.y === -last.y) return;
    if (d.x === last.x && d.y === last.y) return;
    if (queue.length < 3) queue.push(d);
  }
  function go(d) { if (state !== 'playing') { start(); if (!(d.x === -dir.x && d.y === -dir.y)) turn(d); } else turn(d); }

  var KEYS = { ArrowUp: [0, -1], ArrowDown: [0, 1], ArrowLeft: [-1, 0], ArrowRight: [1, 0], w: [0, -1], s: [0, 1], a: [-1, 0], d: [1, 0], W: [0, -1], S: [0, 1], A: [-1, 0], D: [1, 0] };
  document.addEventListener('keydown', function (e) {
    var k = KEYS[e.key];
    if (k) { e.preventDefault(); go({ x: k[0], y: k[1] }); }
    else if ((e.key === ' ' || e.key === 'Enter') && state !== 'playing') { e.preventDefault(); start(); }
  });

  var t0 = null;
  canvas.addEventListener('touchstart', function (e) { var t = e.touches[0]; t0 = { x: t.clientX, y: t.clientY }; e.preventDefault(); }, { passive: false });
  canvas.addEventListener('touchmove', function (e) { e.preventDefault(); }, { passive: false });
  canvas.addEventListener('touchend', function (e) {
    if (!t0) return; var t = e.changedTouches[0], dx = t.clientX - t0.x, dy = t.clientY - t0.y; t0 = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 20) { if (state !== 'playing') start(); return; }
    go(Math.abs(dx) > Math.abs(dy) ? { x: dx > 0 ? 1 : -1, y: 0 } : { x: 0, y: dy > 0 ? 1 : -1 });
  });
  canvas.addEventListener('click', function () { canvas.focus(); if (state !== 'playing' && !touch) start(); });

  hintEl.textContent = startHint;
  reset();
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
})();
