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
    ['Monument Valley, Utah', 37.1010, -110.0110, 180],
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
})();
