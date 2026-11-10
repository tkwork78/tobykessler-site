/* Work Sample page (work-sample.html): unlisted, password locked.
   The files in data/ws/ are encrypted (AES-GCM, key from the password via PBKDF2), so they can't be
   opened from GitHub or by URL without the password. data/ws/index.bin holds the titles and file list.
   To change the samples, re-run the encrypt script kept in the project files (work-sample/encrypt.py) with a new salt, then update SALT here. */
(function () {
  var DIR = 'data/ws/';
  var INDEX = document.body.getAttribute('data-index') || 'index.bin';   // the Web Design subpage reads web.bin
  var SALT = 'RZp4e1q30tlj2IL/rohGWQ==';
  var ITER = 600000;
  var KEY = 'tk-ws-key';
  var body = document.body;
  var form = document.querySelector('.pass');
  var input = form.querySelector('input');
  var btn = form.querySelector('button');
  var subtle = window.crypto && window.crypto.subtle;

  function b64(s) { var b = atob(s), u = new Uint8Array(b.length); for (var i = 0; i < b.length; i++) u[i] = b.charCodeAt(i); return u; }
  function unb64(buf) { var u = new Uint8Array(buf), s = ''; for (var i = 0; i < u.length; i++) s += String.fromCharCode(u[i]); return btoa(s); }

  function derive(word) {
    return subtle.importKey('raw', new TextEncoder().encode(word), 'PBKDF2', false, ['deriveKey']).then(function (base) {
      return subtle.deriveKey({ name: 'PBKDF2', salt: b64(SALT), iterations: ITER, hash: 'SHA-256' }, base, { name: 'AES-GCM', length: 256 }, true, ['decrypt']);
    });
  }
  // Each set of files is tied to its salt, so a browser or CDN copy from an older version is never mixed in.
  var VER = encodeURIComponent(SALT.slice(0, 8));
  function fetchDecrypt(key, name) {
    function get(opts) {
      return fetch(DIR + name + '?v=' + VER, opts).then(function (r) { if (!r.ok) throw new Error(name); return r.arrayBuffer(); }).then(function (buf) {
        return subtle.decrypt({ name: 'AES-GCM', iv: new Uint8Array(buf, 0, 12) }, key, new Uint8Array(buf, 12));
      });
    }
    return get().catch(function () { return get({ cache: 'reload' }); });   // one fresh retry
  }


  // Decrypted pages are cached as blob URLs so turning back is instant.
  var cache = {};
  function imageUrl(key, name) {
    if (!cache[name]) cache[name] = fetchDecrypt(key, name).then(function (plain) {
      return URL.createObjectURL(new Blob([plain], { type: 'image/jpeg' }));
    });
    return cache[name];
  }
  function picture(url, alt) {
    var img = new Image(); img.src = url; img.alt = alt; img.draggable = false; return img;
  }

  // Viewer: one doc at a time, page by page.
  var viewer = document.querySelector('.viewer');
  var stage = viewer.querySelector('.viewer-stage');
  var vTitle = viewer.querySelector('.viewer-title');
  var vCount = viewer.querySelector('.viewer-count span');
  var vNote = viewer.querySelector('.viewer-note');
  var vPrev = viewer.querySelector('.vprev'), vNext = viewer.querySelector('.vnext');
  var cur = null, page = 0, theKey = null, lastFocus = null;
  function show(i) {
    page = i;
    var f = cur.files[i];
    vCount.textContent = (i + 1) + ' / ' + cur.files.length;
    vNote.textContent = f[3] || '';   // per-page note, e.g. on pages a redaction disturbed
    vPrev.disabled = i === 0; vNext.disabled = i === cur.files.length - 1;
    stage.innerHTML = '<div class="spin" aria-label="Loading"></div>';
    imageUrl(theKey, f[0]).then(function (url) {
      if (cur && page === i) {
        stage.innerHTML = '';
        var box = document.createElement('div'); box.style.position = 'relative'; box.style.maxWidth = '100%'; box.style.maxHeight = '100%'; box.style.display = 'flex';
        var img = picture(url, cur.title + ', page ' + (i + 1));
        if (cur.shape === 'page') { box.style.maxHeight = 'none'; box.style.width = '100%'; }   // a whole web page: full width, scrolls
        else img.style.maxHeight = (stage.clientHeight) + 'px';
        box.appendChild(img);
        var sh = document.createElement('span'); sh.className = 'shield'; box.appendChild(sh);
        stage.appendChild(box);
      }
    });
    [i + 1, i + 2, i - 1].forEach(function (j) { if (cur.files[j]) imageUrl(theKey, cur.files[j][0]); });
  }
  function openDoc(doc, at) {
    lastFocus = document.activeElement;
    cur = doc; vTitle.textContent = doc.title;
    viewer.classList.toggle('is-single', doc.files.length === 1);
    viewer.classList.toggle('is-page', doc.shape === 'page');
    stage.scrollTop = 0;
    viewer.classList.add('is-open'); body.classList.add('has-viewer');
    show(at || 0); viewer.querySelector('.vclose').focus();
  }
  function closeDoc() {
    viewer.classList.remove('is-open'); body.classList.remove('has-viewer'); cur = null; stage.innerHTML = '';
    if (lastFocus) lastFocus.focus();
  }
  function step(d) { if (cur && cur.files[page + d]) show(page + d); }
  vPrev.addEventListener('click', function () { step(-1); });
  vNext.addEventListener('click', function () { step(1); });
  viewer.querySelector('.vclose').addEventListener('click', closeDoc);
  stage.addEventListener('click', function (e) {   // click right half for next, left half for previous
    if (!cur) return;
    var r = stage.getBoundingClientRect();
    step(e.clientX > r.left + r.width / 2 ? 1 : -1);
  });
  document.addEventListener('keydown', function (e) {
    if (!cur) return;
    if (e.key === 'Escape') closeDoc();
    else if (e.key === 'ArrowRight') step(1);
    else if (e.key === 'ArrowLeft') step(-1);
  });
  var tx = null;
  viewer.addEventListener('touchstart', function (e) { tx = e.touches[0].clientX; }, { passive: true });
  viewer.addEventListener('touchend', function (e) {
    if (tx === null) return;
    var dx = e.changedTouches[0].clientX - tx; tx = null;
    if (Math.abs(dx) > 40) step(dx < 0 ? 1 : -1);
  });

  // Photo grid (work-sample-photos.html): every photo of the one doc as its own tile, whole and uncropped,
  // loaded as it scrolls into view; a click opens the viewer at that photo.
  function renderGrid(key, doc, mount) {
    var grid = document.createElement('div'); grid.className = 'photos';
    var io = 'IntersectionObserver' in window ? new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { io.unobserve(e.target); e.target._load(); } });
    }, { rootMargin: '600px' }) : null;
    doc.files.forEach(function (f, i) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'photo';
      b.style.aspectRatio = f[1] + ' / ' + f[2];
      b.addEventListener('click', function () { openDoc(doc, i); });
      b._load = function () {
        imageUrl(key, f[0]).then(function (url) {
          b.appendChild(picture(url, doc.title + ', photo ' + (i + 1)));
          var sh = document.createElement('span'); sh.className = 'shield'; b.appendChild(sh);
        });
      };
      grid.appendChild(b);
      if (io) io.observe(b); else b._load();
    });
    mount.appendChild(grid);
  }

  function render(key, manifest) {
    theKey = key;
    var mount = document.querySelector('[data-samples]');
    mount.innerHTML = '';
    if (document.body.hasAttribute('data-grid')) { renderGrid(key, manifest[0], mount); body.classList.add('is-open'); window.scrollTo(0, 0); return; }
    var grid = document.createElement('div'); grid.className = 'docs';
    manifest.forEach(function (doc) {
      var b = document.createElement('button'); b.type = 'button'; b.className = 'doc';
      var cover = document.createElement('span'); cover.className = 'doc-cover';
      cover.innerHTML = '<span class="spin"></span>';
      var t = document.createElement('span'); t.className = 'doc-title'; t.textContent = doc.title;
      var m = document.createElement('span'); m.className = 'doc-meta'; m.textContent = doc.meta || 'Image';
      b.appendChild(cover); b.appendChild(t);
      if (doc.desc) { var d = document.createElement('span'); d.className = 'doc-desc'; d.textContent = doc.desc; b.appendChild(d); }
      b.appendChild(m);
      if (doc.badge) { var bg = document.createElement('span'); bg.className = 'doc-badge'; bg.textContent = doc.badge; b.appendChild(bg); }
      b.addEventListener('click', function () { if (doc.link) location.href = doc.link; else openDoc(doc); });
      grid.appendChild(b);
      var coverFile = (doc.cover || doc.files[0])[0];
      imageUrl(key, coverFile).then(function (url) {
        cover.innerHTML = '';
        cover.appendChild(picture(url, doc.title));
        var sh = document.createElement('span'); sh.className = 'shield'; cover.appendChild(sh);
      }).catch(function () { cover.innerHTML = '<span class="doc-meta">Couldn\'t Load, Please Refresh</span>'; delete cache[coverFile]; });
    });
    mount.appendChild(grid);
    body.classList.add('is-open'); window.scrollTo(0, 0);
  }

  // Try a key: decrypting the index only works with the right password.
  function unlock(key) {
    return fetchDecrypt(key, INDEX).then(function (plain) {
      render(key, JSON.parse(new TextDecoder().decode(plain)));
      return subtle.exportKey('raw', key).then(function (raw) { try { sessionStorage.setItem(KEY, unb64(raw)); } catch (e) {} });
    });
  }

  if (!subtle) { input.disabled = btn.disabled = true; input.placeholder = 'Please Use A Newer Browser'; return; }

  try {
    var saved = sessionStorage.getItem(KEY);
    if (saved) subtle.importKey('raw', b64(saved), { name: 'AES-GCM' }, true, ['decrypt']).then(unlock).catch(function () { try { sessionStorage.removeItem(KEY); } catch (e) {} });
  } catch (e) {}

  var redTimer;
  form.addEventListener('submit', function (e) {
    e.preventDefault();
    var word = input.value.trim().toLowerCase();
    if (!word || form.classList.contains('is-busy')) return;
    form.classList.add('is-busy'); input.disabled = true; btn.textContent = '…';
    derive(word).then(unlock).catch(function () {
      input.value = ''; input.placeholder = 'Try Again';
      form.classList.remove('is-wrong'); void form.offsetWidth; form.classList.add('is-wrong', 'is-red');
      clearTimeout(redTimer); redTimer = setTimeout(function () { form.classList.remove('is-red'); }, 2000);
    }).then(function () { form.classList.remove('is-busy'); input.disabled = false; btn.textContent = '→'; input.focus(); });
  });

  // Discourage saving: no right click, no dragging, no save/print shortcuts.
  document.addEventListener('contextmenu', function (e) { e.preventDefault(); });
  document.addEventListener('dragstart', function (e) { e.preventDefault(); });
  document.addEventListener('keydown', function (e) {
    var k = (e.key || '').toLowerCase();
    if ((e.ctrlKey || e.metaKey) && (k === 's' || k === 'p' || k === 'u')) e.preventDefault();
  });

  // Screenshot deterrent. A web page can't truly block screenshots (Netflix does it with paid video DRM),
  // so the samples are hidden whenever a capture is likely: the window loses focus (Snipping Tool, screen
  // recorders, switching apps), the tab is hidden, or screenshot keys are pressed (Print Screen, Windows key,
  // Cmd+Shift on a Mac). Phone screenshots and cameras can't be detected.
  var keyShade = false;
  function shade() {
    var on = keyShade || document.hidden || !document.hasFocus();
    body.classList.toggle('is-shaded', on);
  }
  window.addEventListener('blur', shade);
  window.addEventListener('focus', shade);
  document.addEventListener('visibilitychange', shade);
  document.addEventListener('keydown', function (e) {
    var k = e.key || '';
    if (k === 'PrintScreen' || k === 'Meta' || k === 'OS' || (e.metaKey && e.shiftKey) || (e.ctrlKey && e.shiftKey && (k === 'S' || k === 's'))) { keyShade = true; shade(); }
  });
  document.addEventListener('keyup', function (e) {
    if (e.key === 'PrintScreen') { try { navigator.clipboard.writeText('').catch(function () {}); } catch (err) {} }   // overwrite the capture
    if (!e.metaKey && !e.shiftKey) { keyShade = false; setTimeout(shade, 300); }
  });
  ['pointermove', 'pointerdown', 'touchstart'].forEach(function (t) {
    document.addEventListener(t, function () { if (keyShade && !document.hidden && document.hasFocus()) { keyShade = false; shade(); } }, { passive: true });
  });
  setInterval(shade, 500);   // catches focus changes some browsers don't report
})();
