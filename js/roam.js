/* "Take me somewhere new": shows a loading spinner while it loads Google Street View of a random beautiful place.
   To add a place: copy a line below and change the name and coordinates (latitude, longitude, heading). */
(function () {
  var PLACES = [
    ['Moraine Lake, Canada', 51.3217, -116.1860, 120],
    ['Hallstatt, Austria', 47.5622, 13.6493, 200],
    ['Positano, Italy', 40.6281, 14.4850, 180],
    ['Oia, Santorini, Greece', 36.4618, 25.3753, 260],
    ['Manarola, Cinque Terre, Italy', 44.1067, 9.7286, 60],
    ['Geirangerfjord, Norway', 62.1008, 7.2059, 300],
    ['Reine, Lofoten, Norway', 67.9326, 13.0886, 220],
    ['Arashiyama Bamboo Grove, Japan', 35.0170, 135.6713, 0],
    ['Bixby Bridge, Big Sur, California', 36.3715, -121.9017, 330],
    ['Tunnel View, Yosemite, California', 37.7158, -119.6771, 90],
    ['Kirkjufell, Iceland', 64.9420, -23.3070, 250],
    ['Lauterbrunnen, Switzerland', 46.5935, 7.9091, 170],
    ['Lake Bled, Slovenia', 46.3636, 14.0938, 280],
    ['Lago di Braies, Italy', 46.6946, 12.0857, 180],
    ['Glencoe, Scotland', 56.6826, -5.1024, 100],
    ['Twelve Apostles, Australia', -38.6650, 143.1049, 110],
    ['Milford Sound, New Zealand', -44.6719, 167.9256, 300],
    ['Lake Tekapo, New Zealand', -44.0048, 170.4775, 330],
    ['Grand Canyon, Arizona', 36.0617, -112.1077, 0],
    ['Chefchaouen, Morocco', 35.1688, -5.2636, 90],
    ['Gásadalur, Faroe Islands', 62.1104, -7.4352, 270],
    ['Trollstigen, Norway', 62.4565, 7.6680, 0],
    ['Göreme, Cappadocia, Turkey', 38.6431, 34.8289, 60]
  ];
  var frame = document.querySelector('.roam-view');
  if (!frame) return;
  var placeEl = document.querySelector('.roam-place');
  var openEl = document.querySelector('.roam-open');
  var btn = document.querySelector('.roam-roll');
  var last = -1;

  var MIN_SPIN = 1000, started = 0, done = null;
  function loading(on) {
    clearTimeout(done);
    if (on) {
      started = Date.now();
      btn.classList.add('is-loading'); btn.setAttribute('aria-busy', 'true');
      done = setTimeout(function () { loading(false); }, 10000);
    } else {
      /* keep the spinner up for at least MIN_SPIN ms so it never just flickers */
      done = setTimeout(function () { btn.classList.remove('is-loading'); btn.setAttribute('aria-busy', 'false'); }, Math.max(0, MIN_SPIN - (Date.now() - started)));
    }
  }
  frame.addEventListener('load', function () { if (frame.src) loading(false); });
  function show(i) {
    var p = PLACES[i];
    frame.src = 'https://www.google.com/maps?layer=c&cbll=' + p[1] + ',' + p[2] + '&cbp=11,' + p[3] + ',0,0,0&output=svembed';
    frame.title = 'Street View of ' + p[0];
    placeEl.textContent = p[0];
    openEl.href = 'https://www.google.com/maps/@?api=1&map_action=pano&viewpoint=' + p[1] + ',' + p[2] + '&heading=' + p[3];
  }
  function roll() {
    var i;
    do { i = Math.floor(Math.random() * PLACES.length); } while (i === last && PLACES.length > 1);
    last = i;
    loading(true);
    show(i);
  }
  btn.addEventListener('click', roll);
  roll();

  // Password box: the right word opens the full site. A wrong word turns the box red for 2 seconds; after 5 wrong
  // tries it locks for an hour. All of this lives in this browser only, so it is not real security.
  var pass = document.querySelector('[data-pass]');
  if (pass) (function () {
    var input = pass.querySelector('input'), btn = pass.querySelector('button');
    var TRIES = 5, LOCK = 60 * 60 * 1000, redTimer, lockTimer;
    function get(k) { try { return parseInt(localStorage.getItem(k), 10) || 0; } catch (e) { return 0; } }
    function set(k, v) { try { if (v) localStorage.setItem(k, v); else localStorage.removeItem(k); } catch (e) {} }
    function locked() {
      var left = get('tk-pass-lock') - Date.now();
      clearTimeout(lockTimer);
      if (left <= 0) {
        if (get('tk-pass-lock')) { set('tk-pass-lock', 0); set('tk-pass-fails', 0); }
        input.disabled = btn.disabled = false; pass.classList.remove('is-locked');
        if (input.placeholder.indexOf('Locked') === 0) input.placeholder = 'Password';
        return false;
      }
      var mins = Math.ceil(left / 60000);
      input.value = ''; input.disabled = btn.disabled = true; pass.classList.add('is-locked');
      input.placeholder = 'Locked, Try Again In ' + mins + (mins === 1 ? ' Minute' : ' Minutes');
      lockTimer = setTimeout(locked, Math.min(left, (left % 60000) || 60000));
      return true;
    }
    locked();
    pass.addEventListener('submit', function (e) {
      e.preventDefault();
      if (locked()) return;
      var word = input.value.trim().toLowerCase();
      if (word && btoa(unescape(encodeURIComponent(word))) === 'd2VsY29tZQ==') { set('tk-pass-fails', 0); location.href = 'home.html'; return; }
      var fails = get('tk-pass-fails') + 1;
      set('tk-pass-fails', fails);
      input.value = ''; input.placeholder = 'Try Again';
      pass.classList.remove('is-wrong'); void pass.offsetWidth; pass.classList.add('is-wrong', 'is-red');
      clearTimeout(redTimer); redTimer = setTimeout(function () { pass.classList.remove('is-red'); }, 2000);
      if (fails >= TRIES) { set('tk-pass-lock', Date.now() + LOCK); setTimeout(locked, 400); }
    });
  })();
})();
