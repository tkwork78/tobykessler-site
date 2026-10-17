/* Site script: justified image grid + lightbox (Portfolio design system), and page rendering from content.js.
   You shouldn't need to edit this file — change js/content.js instead. */
(function () {
  var S = window.SITE || {};

  function el(tag, attrs, kids) {
    var n = document.createElement(tag);
    for (var k in attrs || {}) {
      if (k === 'text') n.textContent = attrs[k];
      else if (k === 'html') n.innerHTML = attrs[k];
      else n.setAttribute(k, attrs[k]);
    }
    (kids || []).forEach(function (c) { if (c) n.appendChild(c); });
    return n;
  }
  function ratioOf(it) { return it.width > 0 && it.height > 0 ? it.width / it.height : 1.5; }
  function arrow(dir) {
    var d = dir === 'left' ? 'M15 5 L8 12 L15 19 M8 12 H21' : 'M9 5 L16 12 L9 19 M16 12 H3';
    var w = document.createElement('span');
    w.innerHTML = '<svg class="pf-icon" width="24" height="24" viewBox="0 0 24 24" aria-hidden="true"><path d="' + d + '" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="square"/></svg>';
    return w.firstChild;
  }
  function caption(it, cls) {
    if (!it.title && !it.meta) return null;
    return el('figcaption', { class: 'pf-cap' + (cls ? ' ' + cls : '') }, [
      it.title ? el('p', { class: 'pf-cap-title', text: it.title }) : null,
      it.meta ? el('p', { class: 'pf-cap-meta', text: it.meta }) : null
    ]);
  }

  /* ---------- Lightbox (one shared viewer) ---------- */
  var LB = (function () {
    var root, img, figure, prevBtn, nextBtn, closeBtn, items = [], index = 0, opener = null, tx = null;
    function build() {
      closeBtn = el('button', { type: 'button', class: 'pf-lb-btn', text: 'Close' });
      prevBtn = el('button', { type: 'button', class: 'pf-lb-btn pf-lb-nav pf-lb-prev', 'aria-label': 'Previous image' }, [arrow('left')]);
      nextBtn = el('button', { type: 'button', class: 'pf-lb-btn pf-lb-nav pf-lb-next', 'aria-label': 'Next image' }, [arrow('right')]);
      figure = el('figure', { class: 'pf-lb-figure' });
      root = el('div', { class: 'pf-lb', role: 'dialog', 'aria-modal': 'true', hidden: '' }, [
        el('div', { class: 'pf-lb-bar' }, [closeBtn]),
        el('div', { class: 'pf-lb-stage' }, [prevBtn, figure, nextBtn])
      ]);
      document.body.appendChild(root);
      closeBtn.onclick = close;
      prevBtn.onclick = function () { go(-1); };
      nextBtn.onclick = function () { go(1); };
      root.addEventListener('touchstart', function (e) { var t = e.touches[0]; tx = { x: t.clientX, y: t.clientY }; }, { passive: true });
      root.addEventListener('touchend', function (e) {
        if (!tx) return; var t = e.changedTouches[0], dx = t.clientX - tx.x, dy = t.clientY - tx.y; tx = null;
        if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy)) go(dx < 0 ? 1 : -1);
      });
      document.addEventListener('keydown', function (e) {
        if (root.hidden) return;
        if (e.key === 'Escape') { e.preventDefault(); close(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); go(-1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); go(1); }
        else if (e.key === 'Tab') {
          var f = [closeBtn, prevBtn, nextBtn].filter(function (b) { return !b.hidden; });
          var i = f.indexOf(document.activeElement);
          e.preventDefault(); f[(i + (e.shiftKey ? -1 : 1) + f.length) % f.length].focus();
        }
      });
    }
    function render() {
      var it = items[index];
      figure.innerHTML = '';
      img = el('img', { class: 'pf-lb-img', src: it.full || it.src, alt: it.alt || it.title || '' });
      figure.appendChild(img);
      var c = caption(it, 'pf-lb-cap'); if (c) { c.setAttribute('aria-live', 'polite'); figure.appendChild(c); }
      root.setAttribute('aria-label', it.title || 'Image viewer');
      prevBtn.hidden = nextBtn.hidden = items.length < 2;
      [index - 1, index + 1].forEach(function (k) { var n = items[(k + items.length) % items.length]; if (n) { var p = new Image(); p.src = n.full || n.src; } });
    }
    function go(d) { if (items.length < 2) return; index = (index + d + items.length) % items.length; render(); }
    function open(list, i, from) {
      if (!root) build();
      items = list; index = i; opener = from || null;
      render(); root.hidden = false;
      document.documentElement.style.overflow = 'hidden';
      closeBtn.focus();
    }
    function close() {
      root.hidden = true; document.documentElement.style.overflow = '';
      if (opener) opener.focus();
    }
    return { open: open };
  })();

  /* ---------- Justified image grid ---------- */
  function grid(items, opts) {
    opts = opts || {};
    var columns = opts.columns || 3, gap = 16, rowGap = 24, maxRows = opts.maxRows || 0;
    var host = el('div', { class: 'pf-grid' });
    host.style.rowGap = rowGap + 'px';
    var lastW = -1;
    function layout() {
      var W = host.clientWidth; if (!W || W === lastW) return; lastW = W;
      var cols = W < 560 ? 1 : W < 900 ? Math.min(2, columns) : columns;
      var list = maxRows ? items.slice(0, cols * maxRows) : items;
      host.innerHTML = '';
      var total = 0, count = 0;
      for (var i = 0; i < list.length; i += cols) {
        var chunk = list.slice(i, i + cols), sum = 0;
        chunk.forEach(function (it) { sum += ratioOf(it); });
        var h = (W - gap * (chunk.length - 1)) / sum;
        if (chunk.length < cols) h = Math.min(h, count ? total / count : (W - gap * (cols - 1)) / (cols * 1.5));
        total += h; count++;
        var row = el('div', { class: 'pf-row' }); row.style.columnGap = gap + 'px';
        chunk.forEach(function (it, j) {
          var idx = i + j;
          var b = el('button', { type: 'button', class: 'pf-tile-btn', 'aria-label': 'Open ' + (it.title || 'image ' + (idx + 1)) }, [
            el('img', { class: 'pf-tile-img', src: it.src, alt: it.alt || it.title || '', loading: 'lazy', width: Math.round(ratioOf(it) * h), height: Math.round(h) })
          ]);
          b.querySelector('img').style.height = h + 'px';
          b.onclick = function () { LB.open(items, idx, b); };
          var fig = el('figure', { class: 'pf-tile' }, [b, caption(it)]);
          fig.style.width = ratioOf(it) * h + 'px';
          row.appendChild(fig);
        });
        host.appendChild(row);
      }
    }
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(layout).observe(host);
    else window.addEventListener('resize', layout);
    requestAnimationFrame(layout);
    return host;
  }

  /* ---------- Page rendering ---------- */
  function sectionHead(label, title, summary, link) {
    return el('div', { class: 'section-head' }, [
      el('div', { class: 'text' }, [
        label ? el('p', { class: 'label', text: label }) : null,
        el('h2', { class: 'headline', text: title }),
        summary ? el('p', { class: 'summary', text: summary }) : null
      ]),
      link ? el('a', { class: 'more', href: link.href, text: link.text }) : null
    ]);
  }

  var renderers = {
    home: function (mount) {
      (S.design || []).forEach(function (c) {
        mount.appendChild(el('section', { class: 'section', id: c.id }, [
          sectionHead('Design · ' + c.years, c.company, c.role, { href: 'design.html#' + c.id, text: 'View all →' }),
          grid(c.items, { maxRows: 1 })
        ]));
      });
      if (S.photography) mount.appendChild(el('section', { class: 'section', id: 'photography' }, [
        sectionHead('Personal', 'Photography', S.photography.summary, { href: 'photography.html', text: 'View all →' }),
        grid(S.photography.items, { maxRows: 1 })
      ]));
    },
    design: function (mount) {
      var sub = document.querySelector('[data-subnav]');
      (S.design || []).forEach(function (c) {
        if (sub) sub.appendChild(el('a', { href: '#' + c.id, text: c.company }));
        mount.appendChild(el('section', { class: 'section', id: c.id }, [
          sectionHead(c.role + ' · ' + c.years, c.company, c.summary),
          grid(c.items)
        ]));
      });
    },
    photography: function (mount) {
      if (S.photography) mount.appendChild(el('section', { class: 'section' }, [grid(S.photography.items)]));
    },
    contact: function (mount) {
      var rows = [];
      if (S.email) rows.push(['Email', 'mailto:' + S.email, S.email]);
      (S.links || []).forEach(function (l) { rows.push([l.label, l.href, l.text || l.label]); });
      mount.appendChild(el('ul', { class: 'contact-list' }, rows.map(function (r) {
        var a = el('a', { href: r[1], text: r[2] });
        if (!/^mailto:/.test(r[1])) { a.target = '_blank'; a.rel = 'noopener'; }
        return el('li', {}, [el('span', { class: 'label', text: r[0] }), a]);
      })));
    }
  };

  document.querySelectorAll('[data-render]').forEach(function (m) {
    var r = renderers[m.getAttribute('data-render')]; if (r) r(m);
  });
  document.querySelectorAll('[data-site-intro]').forEach(function (n) { if (S.intro) n.textContent = S.intro; });
  document.querySelectorAll('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });
  if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(function () { t.scrollIntoView(); }, 50); }
})();
