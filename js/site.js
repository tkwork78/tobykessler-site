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
  // Very tall images (emails) scroll in the viewer.
  function isTall(it) { return ratioOf(it) < 0.45; }
  function tileRatio(it) { return ratioOf(it); }   // images are never cropped
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
      figure.className = 'pf-lb-figure' + (isTall(it) ? ' is-tall' : '');
      figure.scrollTop = 0;
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
        chunk.forEach(function (it) { sum += tileRatio(it); });
        var h = (W - gap * (chunk.length - 1)) / sum;
        if (opts.ratio) h = (W - gap * (cols - 1)) / cols / opts.ratio;
        else if (chunk.length < cols) h = Math.min(h, count ? total / count : (W - gap * (cols - 1)) / cols / (sum / chunk.length));
        total += h; count++;
        var row = el('div', { class: 'pf-row' }); row.style.columnGap = gap + 'px';
        chunk.forEach(function (it, j) {
          var idx = i + j;
          // Previews link into their project; full grids open the lightbox.
          var b = el(opts.href ? 'a' : 'button', opts.href
            ? { class: 'pf-tile-btn is-link', href: opts.href }
            : { type: 'button', class: 'pf-tile-btn', 'aria-label': 'Open ' + (it.title || 'image ' + (idx + 1)) }, [
            el('img', { class: 'pf-tile-img', src: it.src, alt: it.alt || it.title || '', loading: 'lazy', width: Math.round(tileRatio(it) * h), height: Math.round(h) })
          ]);
          b.querySelector('img').style.height = h + 'px';
          if (!opts.href) b.onclick = function () { LB.open(items, idx, b); };
          var fig = el('figure', { class: 'pf-tile' }, [b, caption(it)]);
          fig.style.width = tileRatio(it) * h + 'px';
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

  function noteOf(c) {
    return el('p', { class: 'lead work-note' }, [document.createTextNode(c.note + ' '), el('a', { href: 'contact.html', text: 'Get in touch →' })]);
  }
  function itemsOf(c) {
    return c.items || (c.sections || []).reduce(function (all, s) { return all.concat(s.items || []); }, []);
  }
  // Preview rows skip email sections (too tall for a row) and any section marked preview: false.
  function previewOf(c) {
    return c.items || itemsOf({ sections: (c.sections || []).filter(function (s) { return !s.full && s.preview !== false; }) });
  }
  function companyHref(c) { return c.page || 'design.html#' + c.id; }

  function blogSection(posts) {
    var head = sectionHead(null, 'Blog Posts');
    if (!posts.length) return el('section', { class: 'section', id: 'blog' }, [head, el('p', { class: 'caption', text: 'Links coming soon.' })]);
    var track = el('ul', { class: 'carousel-track' }, posts.map(function (b) {
      var host = ''; try { host = new URL(b.url).hostname.replace(/^www\./, ''); } catch (e) {}
      var thumb = b.image
        ? el('img', { class: 'card-img', src: b.image, alt: '', loading: 'lazy' })
        : el('span', { class: 'card-img card-blank', 'aria-hidden': 'true' });
      return el('li', { class: 'carousel-item' }, [el('a', { class: 'card', href: b.url, target: '_blank', rel: 'noopener' }, [
        thumb,
        el('span', { class: 'card-title', text: b.title || b.url }),
        el('span', { class: 'caption', text: b.meta || host })
      ])]);
    }));
    var prev = el('button', { type: 'button', class: 'carousel-btn', 'aria-label': 'Previous posts' }, [arrow('left')]);
    var next = el('button', { type: 'button', class: 'carousel-btn', 'aria-label': 'Next posts' }, [arrow('right')]);
    function page(d) { track.scrollBy({ left: d * track.clientWidth * 0.9, behavior: 'smooth' }); }
    function sync() {
      prev.disabled = track.scrollLeft < 4;
      next.disabled = track.scrollLeft + track.clientWidth > track.scrollWidth - 4;
    }
    prev.onclick = function () { page(-1); }; next.onclick = function () { page(1); };
    track.addEventListener('scroll', sync, { passive: true });
    window.addEventListener('resize', sync);
    requestAnimationFrame(sync);
    var head2 = el('div', { class: 'section-head' }, [
      el('div', { class: 'text' }, [el('h2', { class: 'headline', text: 'Blog Posts' })]),
      el('div', { class: 'carousel-nav' }, [prev, next])
    ]);
    return el('section', { class: 'section', id: 'blog' }, [head2, el('div', { class: 'carousel' }, [track])]);
  }

  function instagramSection(ig) {
    var url = 'https://www.instagram.com/' + ig.handle + '/';
    var kids = [sectionHead(null, 'Instagram', '@' + ig.handle, { href: url, text: 'View on Instagram →' })];
    if (ig.posts && ig.posts.length) {
      kids.push(el('div', { class: 'ig-posts' }, ig.posts.map(function (p) {
        return el('blockquote', { class: 'instagram-media', 'data-instgrm-permalink': p, 'data-instgrm-version': '14' }, [el('a', { href: p, text: 'View this post on Instagram' })]);
      })));
      var sc = document.createElement('script'); sc.async = true; sc.src = 'https://www.instagram.com/embed.js'; document.body.appendChild(sc);
    } else {
      var link = el('a', { class: 'ig-card', href: url, target: '_blank', rel: 'noopener' }, [
        el('span', { class: 'ig-handle', text: '@' + ig.handle }),
        el('span', { class: 'caption', text: 'See the account on Instagram' })
      ]);
      kids.push(link);
    }
    return el('section', { class: 'section', id: 'instagram' }, kids);
  }

  var renderers = {
    home: function (mount) {
      (S.design || []).forEach(function (c) {
        mount.appendChild(el('section', { class: 'section', id: c.id }, [
          sectionHead('Design', c.company, c.summary, c.note ? null : { href: companyHref(c), text: 'View all →' }),
          c.note ? noteOf(c) : grid(previewOf(c), { maxRows: 1, href: companyHref(c) })
        ]));
      });
      if (S.photography) mount.appendChild(el('section', { class: 'section', id: 'photography' }, [
        sectionHead(null, 'Photography', S.photography.summary, { href: 'photography.html', text: 'View all →' }),
        grid(itemsOf(S.photography), { maxRows: 1, href: 'photography.html' })
      ]));
    },
    design: function (mount) {
      var sub = document.querySelector('[data-subnav]');
      (S.design || []).forEach(function (c) {
        if (sub) sub.appendChild(el('a', { href: c.page || '#' + c.id, text: c.company }));
        mount.appendChild(el('section', { class: 'section', id: c.id }, c.page ? [
          sectionHead(null, c.company, c.summary, { href: c.page, text: 'View project →' }),
          grid(previewOf(c), { maxRows: 1, href: c.page })
        ] : [
          sectionHead(null, c.company, c.summary),
          c.note ? noteOf(c) : grid(c.items)
        ]));
      });
    },
    company: function (mount) {
      var c = (S.design || []).filter(function (d) { return d.id === mount.getAttribute('data-company'); })[0];
      if (!c) return;
      document.querySelectorAll('[data-company-name]').forEach(function (n) { n.textContent = c.company; });
      document.querySelectorAll('[data-company-summary]').forEach(function (n) { n.textContent = c.summary; });
      var sub = document.querySelector('[data-subnav]');
      (c.sections || []).forEach(function (s) {
        if (sub) sub.appendChild(el('a', { href: '#' + s.id, text: s.title }));
        mount.appendChild(el('section', { class: 'section', id: s.id }, [sectionHead(s.label || 'Design Samples', s.title), grid(s.items)]));
      });
      if (c.blog) {
        if (sub) sub.appendChild(el('a', { href: '#blog', text: 'Blog Posts' }));
        mount.appendChild(blogSection(c.blog));
      }
      if (c.instagram) {
        if (sub) sub.appendChild(el('a', { href: '#instagram', text: 'Instagram' }));
        mount.appendChild(instagramSection(c.instagram));
      }
    },
    photography: function (mount) {
      var sub = document.querySelector('[data-subnav]');
      ((S.photography || {}).sections || []).forEach(function (sec) {
        if (sub) sub.appendChild(el('a', { href: sec.page || '#' + sec.id, text: sec.title }));
        mount.appendChild(el('section', { class: 'section', id: sec.id }, [
          sectionHead(null, sec.title, sec.summary, sec.page ? { href: sec.page, text: 'View project →' } : null),
          sec.page ? grid(sec.items.slice(0, 6), { href: sec.page }) : grid(sec.items)
        ]));
      });
    },
    'photo-project': function (mount) {
      var sec = ((S.photography || {}).sections || []).filter(function (s) { return s.id === mount.getAttribute('data-project'); })[0];
      if (!sec) return;
      document.querySelectorAll('[data-company-summary]').forEach(function (n) { n.textContent = sec.summary || ''; });
      mount.appendChild(el('section', { class: 'section' }, [grid(sec.items)]));
    },
    about: function (mount) {
      var A = S.about || {};
      mount.appendChild(el('section', { class: 'section about' }, [
        el('div', { class: 'about-bio' }, (A.bio || []).map(function (t) { return el('p', { class: 'lead', text: t }); })),
        el('div', { class: 'about-side' }, [
          el('p', { class: 'label', text: 'Selected work' }),
          el('ul', { class: 'about-list' }, (S.design || []).filter(function (c) { return !c.collection; }).map(function (c) {
            return el('li', {}, [el('a', { class: 'about-co', href: companyHref(c), text: c.company })]);
          })),
          A.skills && A.skills.length ? el('p', { class: 'label', text: 'Focus' }) : null,
          A.skills && A.skills.length ? el('ul', { class: 'about-list' }, A.skills.map(function (k) { return el('li', { text: k }); })) : null,
          el('a', { class: 'more', href: 'contact.html', text: 'Get in touch →' })
        ])
      ]));
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
  // Last updated: the date GitHub Pages last published this page
  var mod = new Date(document.lastModified);
  if (!isNaN(mod)) document.querySelectorAll('[data-updated]').forEach(function (n) {
    n.textContent = ' Last updated ' + mod.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) + '.';
  });
  if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(function () { t.scrollIntoView(); }, 50); }
})();
