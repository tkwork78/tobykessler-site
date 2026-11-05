/* Work Sample page (work-sample.html): unlisted, password locked.
   The password check runs in the browser, so it keeps casual visitors out but is not real security.
   PDFs are shown as page images (images/work-sample/), never as downloadable files. */
(function () {
  var DIR = 'images/work-sample/';
  function pages(name, count, pad) {
    var out = [];
    for (var i = 1; i <= count; i++) {
      var n = String(i);
      while (n.length < pad) n = '0' + n;
      out.push(DIR + name + '-' + n + '.jpg');
    }
    return out;
  }
  // Edit titles and order here. shape: 'portrait' pages sit narrower than slides; paper adds a thin page edge.
  var SAMPLES = [
    { title: 'Proposal', meta: '62 Pages', shape: 'portrait paper', files: pages('doc', 62, 2) },
    { title: 'Interview Presentation', meta: '13 Slides', shape: 'wide', files: pages('presentation', 13, 2) },
    { title: 'Interview Team Slide', meta: '1 Slide', shape: 'wide', files: [DIR + 'interview-1.jpg'] },
    { title: 'Project Sheet', meta: '1 Page', shape: 'portrait paper', files: [DIR + 'pds-1.jpg'] },
    { title: 'Newsletter', meta: '37 Pages', shape: 'portrait paper', files: pages('newsletter', 37, 2) },
    { title: 'Invite', meta: '', shape: 'portrait', files: [DIR + 'invite.jpg'] },
    { title: 'Event', meta: '', shape: 'portrait', files: [DIR + 'event.jpg'] }
  ];

  var body = document.body;
  var KEY = 'tk-ws-open';
  function remembered() { try { return sessionStorage.getItem(KEY) === '1'; } catch (e) { return false; } }
  function remember() { try { sessionStorage.setItem(KEY, '1'); } catch (e) {} }

  function render() {
    var mount = document.querySelector('[data-samples]');
    if (mount.childNodes.length) return;
    SAMPLES.forEach(function (s) {
      var sec = document.createElement('section');
      sec.className = 'sample';
      var h = document.createElement('h2'); h.textContent = s.title; sec.appendChild(h);
      if (s.meta) { var m = document.createElement('p'); m.className = 'meta'; m.textContent = s.meta; sec.appendChild(m); }
      else h.style.marginBottom = '20px';
      var list = document.createElement('div'); list.className = 'pages';
      s.files.forEach(function (src, i) {
        var wrap = document.createElement('div'); wrap.className = 'sheet ' + s.shape;
        var img = new Image();
        img.src = src; img.alt = s.title + (s.files.length > 1 ? ', page ' + (i + 1) : '');
        img.loading = 'lazy'; img.decoding = 'async'; img.draggable = false;
        wrap.appendChild(img); list.appendChild(wrap);
      });
      sec.appendChild(list);
      mount.appendChild(sec);
    });
    var y = document.querySelector('[data-year]'); if (y) y.textContent = new Date().getFullYear();
  }
  function open() { render(); body.classList.add('is-open'); window.scrollTo(0, 0); }

  if (remembered()) open();

  var form = document.querySelector('.pass');
  var input = form.querySelector('input');
  var redTimer;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var word = input.value.trim().toLowerCase();
    if (word && btoa(unescape(encodeURIComponent(word))) === 'aGVsbG8=') { remember(); open(); return; }
    input.value = ''; input.placeholder = 'Try Again';
    form.classList.remove('is-wrong'); void form.offsetWidth; form.classList.add('is-wrong', 'is-red');
    clearTimeout(redTimer); redTimer = setTimeout(function () { form.classList.remove('is-red'); }, 2000);
  });

  // Discourage saving: no right click, no dragging, no save/print shortcuts.
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  document.addEventListener('dragstart', function (e) { e.preventDefault(); });
  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase();
    if ((e.ctrlKey || e.metaKey) && (k === 's' || k === 'p' || k === 'u')) e.preventDefault();
  });
})();
