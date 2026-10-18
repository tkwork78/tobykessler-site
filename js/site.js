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
      figure.className = 'pf-lb-figure';
      figure.scrollTop = 0;
      img = el('img', { class: 'pf-lb-img' + (it.zoom ? ' is-zoomable' : ''), src: it.full || it.src, alt: it.alt || it.title || '' });
      if (it.zoom) img.addEventListener('click', function (e) { toggleZoom(e); });
      figure.appendChild(img);
      var c = caption(it, 'pf-lb-cap'); if (c) { c.setAttribute('aria-live', 'polite'); figure.appendChild(c); }
      root.setAttribute('aria-label', it.title || 'Image viewer');
      prevBtn.hidden = nextBtn.hidden = items.length < 2;
      [index - 1, index + 1].forEach(function (k) { var n = items[(k + items.length) % items.length]; if (n) { var p = new Image(); p.src = n.full || n.src; } });
    }
    // Zoomable images (emails): click to see full width and scroll; click again to fit.
    function toggleZoom(e) {
      var r = img.getBoundingClientRect(), fy = (e.clientY - r.top) / r.height;
      var zoomed = figure.classList.toggle('is-zoomed');
      if (zoomed) figure.scrollTop = Math.max(0, fy * img.offsetHeight - (e.clientY - figure.getBoundingClientRect().top));
      else figure.scrollTop = 0;
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
        // Home rows: one shared height for every row; tiles share the width by shape and are trimmed to fit
        var fitW = 0;
        var wholeW = 0, restSum = sum;   // items marked whole keep their full shape; the others share what is left
        if (opts.sameHeight) {
          h = cols === 1 ? W * 0.75 : Math.round(W * 0.28);
          if (!opts.ratio && cols > 1) chunk.forEach(function (it) { if (it.whole) { wholeW += tileRatio(it) * h; restSum -= tileRatio(it); } });
          fitW = (W - gap * (chunk.length - 1) - wholeW) / (opts.ratio ? opts.ratio * chunk.length : restSum);
        }
        else if (opts.ratio) h = (W - gap * (cols - 1)) / cols / opts.ratio;
        else if (chunk.length < cols) h = Math.min(h, count ? total / count : (W - gap * (cols - 1)) / cols / (sum / chunk.length));
        total += h; count++;
        var row = el('div', { class: 'pf-row' }); row.style.columnGap = gap + 'px';
        chunk.forEach(function (it, j) {
          var idx = i + j;
          // Previews link into their project; full grids open the lightbox.
          var b = el(opts.href ? 'a' : 'button', opts.href
            ? { class: 'pf-tile-btn is-link', href: opts.href }
            : { type: 'button', class: 'pf-tile-btn', 'aria-label': 'Open ' + (it.title || 'image ' + (idx + 1)) }, [
            el('img', { class: 'pf-tile-img', src: it.src, alt: it.alt || it.title || '', loading: 'lazy', width: Math.round((opts.ratio || tileRatio(it)) * h), height: Math.round(h) })
          ]);
          b.querySelector('img').style.height = h + 'px';
          if (!opts.href) b.onclick = function () { LB.open(items, idx, b); };
          var fig = el('figure', { class: 'pf-tile' }, [b, caption(it)]);
          fig.style.width = (fitW && !(wholeW && it.whole) ? (opts.ratio || tileRatio(it)) * fitW : (opts.ratio || tileRatio(it)) * h) + 'px';
          if ((opts.ratio || fitW) && it.anchor) b.querySelector('img').style.objectPosition = it.anchor;
          if (opts.contain) b.querySelector('img').style.objectFit = 'contain';   // shrink to fit the box, never trim
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
  function sectionHead(label, title, summary, link, titleHref) {
    return el('div', { class: 'section-head' }, [
      el('div', { class: 'text' }, [
        label ? el('p', { class: 'label', text: label }) : null,
        titleHref ? el('h2', { class: 'headline' }, [el('a', { href: titleHref }, [document.createTextNode(title + ' '), el('span', { class: 'go-arrow', 'aria-hidden': 'true', text: '↗' })])]) : el('h2', { class: 'headline', text: title }),
        summary ? el('p', { class: 'summary', text: summary }) : null
      ]),
      link ? el('a', { class: 'more', href: link.href }, [document.createTextNode(link.text + ' '), el('span', { class: 'go-arrow', 'aria-hidden': 'true', text: '↗' })]) : null
    ]);
  }

  // Text-only entries: links with the ↗ arrow instead of images.
  function noteOf(c) {
    return el('div', { class: 'work-note' }, [
      el('ul', { class: 'work-links' }, (c.links || []).map(function (l) {
        var ext = /^https?:/.test(l.href);
        return el('li', {}, [el('a', ext ? { href: l.href, target: '_blank', rel: 'noopener' } : { href: l.href },
          [document.createTextNode(l.text + ' '), el('span', { class: 'go-arrow', 'aria-hidden': 'true', text: '↗' })])]);
      }))
    ]);
  }
  function itemsOf(c) {
    return c.items || (c.sections || []).reduce(function (all, s) { return all.concat(s.items || []); }, []);
  }
  // Preview rows skip email sections (too tall for a row) and any section marked preview: false.
  function previewOf(c) {
    return c.items || itemsOf({ sections: (c.sections || []).filter(function (s) { return !s.full && s.preview !== false; }) });
  }
  // Home preview: the usual preview plus any photos picked in homePhotos.
  function homePreviewOf(c) {
    if (c.booklet) return c.booklet.pages.slice(0, 4).map(function (src, i) {
      return { src: src, width: c.booklet.width, height: c.booklet.height, alt: (c.booklet.title || c.company) + ', page ' + (i + 1) };
    });
    if (c.homePreview) {
      var all = itemsOf(c), vids = (c.sections || []).reduce(function (v, s) { return v.concat(s.videos || []); }, []);
      return c.homePreview.reduce(function (out, p) {
        if (p.video) vids.filter(function (v) { return v.title === p.video; }).forEach(function (v) {
          out.push({ src: p.image || v.poster, width: p.width || v.width, height: p.height || v.height, title: p.title || v.title, meta: 'Video', anchor: p.anchor });
        });
        if (p.src) out = out.concat(pickPhotos(all, [p.src]).map(function (it) { return Object.assign({}, it, { anchor: p.anchor, whole: p.whole }, p.title ? { title: p.title, meta: p.meta } : {}); }));
        if (p.blog) (c.blog || []).filter(function (b) { return b.image; }).slice(0, p.blog).forEach(function (b) {
          out.push({ src: b.image, width: 3, height: 2, title: b.title, meta: 'Blog Post' });   // blog covers are 3:2
        });
        return out;
      }, []);
    }
    return previewOf(c).concat(pickPhotos(itemsOf(c), c.homePhotos) || []);
  }
  function pickPhotos(all, srcs) {
    return srcs && srcs.map(function (src) { return all.filter(function (it) { return it.src === src; })[0]; }).filter(Boolean);
  }
  // Booklet: the cover on the right on its own, then two-page spreads whose pages turn like a book.
  // Narrow screens show one page at a time. Round ← → buttons sit outside the pages.
  function booklet(b) {
    var pages = b.pages, ratio = b.width / b.height, at = 0, busy = false;
    var book = el('div', { class: 'book' });
    var count = el('p', { class: 'booklet-count' });
    var prev = el('button', { type: 'button', class: 'booklet-arrow is-prev', 'aria-label': 'Previous page', text: '←' });
    var next = el('button', { type: 'button', class: 'booklet-arrow is-next', 'aria-label': 'Next page', text: '→' });
    var host = el('div', { class: 'booklet', tabindex: '0', 'aria-label': (b.title || 'Booklet') + ', use the arrow keys to turn pages' }, [
      el('div', { class: 'booklet-stage' }, [prev, book, next]), count
    ]);
    function single() { return host.clientWidth < 700; }
    // Views: [cover], [1,2], [3,4], ... as spreads; [0], [1], [2], ... one page at a time
    function views() {
      if (single()) return pages.map(function (p, i) { return [i]; });
      var v = [[null, 0]]; for (var i = 1; i < pages.length; i += 2) v.push([i, i + 1 < pages.length ? i + 1 : null]); return v;
    }
    function viewOf(page) { var v = views(); for (var i = 0; i < v.length; i++) if (v[i].indexOf(page) >= 0) return i; return 0; }
    function page(i) {
      return i === null || i === undefined ? el('div', { class: 'book-page is-blank' })
        : el('img', { class: 'book-page', src: pages[i], alt: (b.title || 'Page') + ', page ' + (i + 1), draggable: 'false' });
    }
    function slots(view) {
      book.innerHTML = '';
      book.classList.toggle('is-single', view.length === 1);
      view.forEach(function (i) { book.appendChild(el('div', { class: 'book-slot' }, [page(i)])); });
    }
    function label() {
      var v = views(), k = viewOf(at), cur = v[k].filter(function (i) { return i !== null; });
      count.textContent = (cur.length === 2 ? 'Pages ' + (cur[0] + 1) + '–' + (cur[1] + 1) : 'Page ' + (cur[0] + 1)) + ' of ' + pages.length;
      prev.disabled = k === 0; next.disabled = k === v.length - 1;
      var n = v[k + 1]; if (n) n.forEach(function (i) { if (i !== null) new Image().src = pages[i]; });   // preload the next spread
    }
    function show() { book.style.aspectRatio = String(single() ? ratio : ratio * 2); slots(views()[viewOf(at)]); label(); }
    var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    function go(d) {
      var v = views(), k = viewOf(at), to = v[k + d];
      if (!to || busy) return;
      var from = v[k];
      at = to.filter(function (i) { return i !== null; })[0];
      if (reduce) { show(); return; }
      busy = true;
      // Underneath: the half that stays plus the half being revealed. On top: a leaf that turns over the spine.
      var spread = from.length === 2, fwd = d > 0;
      var under = spread ? (fwd ? [from[0], to[1]] : [to[0], from[1]]) : to;
      slots(under);
      var leaf = el('div', { class: 'book-leaf' + (spread ? (fwd ? ' from-right' : ' from-left') : ' is-whole') + (fwd ? ' is-fwd' : ' is-back') }, [
        el('div', { class: 'leaf-face leaf-front' }, [page(spread ? (fwd ? from[1] : from[0]) : from[0])]),
        el('div', { class: 'leaf-face leaf-back' }, [page(spread ? (fwd ? to[0] : to[1]) : to[0])])
      ]);
      book.appendChild(leaf);
      label();
      requestAnimationFrame(function () { requestAnimationFrame(function () { leaf.classList.add('is-turned'); }); });
      setTimeout(function () { busy = false; show(); }, 700);
    }
    prev.onclick = function () { go(-1); }; next.onclick = function () { go(1); };
    book.onclick = function (e) { var r = book.getBoundingClientRect(); go(e.clientX - r.left < r.width / 2 ? -1 : 1); };
    host.addEventListener('keydown', function (e) { if (e.key === 'ArrowRight') { go(1); e.preventDefault(); } if (e.key === 'ArrowLeft') { go(-1); e.preventDefault(); } });
    var sx = null;
    book.addEventListener('touchstart', function (e) { sx = e.touches[0].clientX; }, { passive: true });
    book.addEventListener('touchend', function (e) { if (sx === null) return; var dx = e.changedTouches[0].clientX - sx; if (Math.abs(dx) > 40) go(dx < 0 ? 1 : -1); sx = null; });
    var lastSingle = null;
    function relayout() { var sg = single(); if (sg !== lastSingle) { lastSingle = sg; if (!busy) show(); } }
    if (typeof ResizeObserver !== 'undefined') new ResizeObserver(relayout).observe(host); else window.addEventListener('resize', relayout);
    requestAnimationFrame(relayout);
    return host;
  }
  function companyHref(c) { return c.page || 'design.html#' + c.id; }

  function blogSection(posts) {
    var head = sectionHead(null, 'Blog Posts');
    if (!posts.length) return el('section', { class: 'section', id: 'blog' }, [head, el('p', { class: 'caption', text: 'Links coming soon.' })]);
    var list = el('ul', { class: 'blog-grid' }, posts.map(function (b) {
      var host = ''; try { host = new URL(b.url).hostname.replace(/^www\./, ''); } catch (e) {}
      var thumb = b.image
        ? el('img', { class: 'card-img', src: b.image, alt: '', loading: 'lazy' })
        : el('span', { class: 'card-img card-blank', 'aria-hidden': 'true' });
      return el('li', {}, [el('a', { class: 'card', href: b.url, target: '_blank', rel: 'noopener' }, [
        thumb,
        el('span', { class: 'card-title', text: b.title || b.url }),
        el('span', { class: 'caption', text: b.meta || host })
      ])]);
    }));
    return el('section', { class: 'section', id: 'blog' }, [head, list]);
  }

  function igEmbeds(urls) {
    var box = el('div', { class: 'ig-posts' }, urls.map(function (p) {
      return el('blockquote', { class: 'instagram-media', 'data-instgrm-permalink': p, 'data-instgrm-version': '14' }, [el('a', { href: p, target: '_blank', rel: 'noopener', text: 'View on Instagram' })]);
    }));
    if (!document.querySelector('script[src*="instagram.com/embed.js"]')) {
      var sc = document.createElement('script'); sc.async = true; sc.src = 'https://www.instagram.com/embed.js'; document.body.appendChild(sc);
    }
    return box;
  }

  // Video cards: name, video (plays inline with controls) and caption. @handles link to Instagram.
  function videoGrid(list) {
    return el('div', { class: 'video-grid' }, list.map(function (v) {
      // Click the video to play; the player controls appear once it starts.
      var video = el('video', { class: 'video-media', src: v.src, poster: v.poster || '', playsinline: '', preload: 'none', width: v.width, height: v.height, 'aria-label': 'Play video: ' + v.title });
      video.addEventListener('click', function () {
        if (video.controls) return;
        video.controls = true;
        var go = video.play(); if (go && go.catch) go.catch(function () {});
      });
      video.addEventListener('play', function () {   // one video at a time
        document.querySelectorAll('.video-media').forEach(function (o) { if (o !== video) o.pause(); });
      });
      var play = el('span', { class: 'video-play', 'aria-hidden': 'true' });
      video.addEventListener('play', function () { play.hidden = true; });
      var text = el('p', { class: 'video-text' }, (v.caption || '').split(/(@[A-Za-z0-9_.]+)/).map(function (part) {
        return /^@/.test(part)
          ? el('a', { href: 'https://www.instagram.com/' + part.slice(1) + '/', target: '_blank', rel: 'noopener', text: part })
          : document.createTextNode(part);
      }));
      return el('figure', { class: 'video-card' }, [el('div', { class: 'video-frame' }, [video, play]), el('figcaption', {}, [el('p', { class: 'pf-cap-title', text: v.title }), text])]);
    }));
  }

  function instagramSection(ig) {
    var url = 'https://www.instagram.com/' + ig.handle + '/';
    var kids = [sectionHead(null, 'Instagram', '@' + ig.handle, { href: url, text: 'View on Instagram' })];
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
          sectionHead(c.homeLabel || c.tags || 'Design', c.company, c.summaryOnPageOnly ? null : c.summary, c.links ? null : { href: companyHref(c), text: 'View all' }, c.links ? null : companyHref(c)),
          c.links ? noteOf(c) : (function (row) { return grid(row, { maxRows: 1, columns: Math.min(4, Math.max(3, row.length)), ratio: c.homeRatio, sameHeight: true, contain: c.homeContain, href: companyHref(c) }); })(homePreviewOf(c))
        ]));
        // Photography sits right after TF Cornerstone
        if (c.id === 'tf-cornerstone' && S.photography) mount.appendChild(el('section', { class: 'section', id: 'photography' }, [
          sectionHead(null, 'Photography', S.photography.summary, { href: 'photography.html', text: 'View all' }, 'photography.html'),
          grid(pickPhotos(itemsOf(S.photography), S.photography.homePhotos) || itemsOf(S.photography), { maxRows: 1, sameHeight: true, href: 'photography.html' })
        ]));
      });
    },
    design: function (mount) {
      var sub = document.querySelector('[data-subnav]');
      (S.design || []).forEach(function (c) {
        if (sub) sub.appendChild(el('a', { href: c.page || '#' + c.id, text: c.company }));
        mount.appendChild(el('section', { class: 'section', id: c.id }, c.page ? [
          sectionHead(c.tags || null, c.company, c.summaryOnPageOnly ? null : c.summary, { href: c.page, text: 'View project' }, c.page),
          grid(pickPhotos(itemsOf(c), c.designPreview) || previewOf(c), { maxRows: 1, href: c.page })
        ] : [
          sectionHead(c.tags || null, c.company, c.summary),
          c.links ? noteOf(c) : c.booklet ? booklet(c.booklet) : grid(c.items)
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
        mount.appendChild(el('section', { class: 'section', id: s.id }, [(s.zoom && s.items ? s.items.forEach(function (it) { it.zoom = true; }) : null, sectionHead(s.label || 'Design Samples', s.title)), s.videos ? videoGrid(s.videos) : s.embeds ? igEmbeds(s.embeds) : grid(s.items), s.credits ? el('p', { class: 'credits', text: s.credits }) : null]));
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
          sectionHead(null, sec.title, sec.summary, sec.page ? { href: sec.page, text: 'View project' } : null, sec.page),
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
          el('a', { class: 'more', href: 'contact.html' }, [document.createTextNode('Get in touch '), el('span', { class: 'go-arrow', 'aria-hidden': 'true', text: '↗' })])
        ])
      ]));
    },
    contact: function (mount) {
      var rows = [];
      if (S.email) rows.push(['Email', 'mailto:' + S.email, S.email]);
      (S.links || []).forEach(function (l) { rows.push([l.label, l.href, l.text || l.label]); });
      mount.appendChild(el('ul', { class: 'contact-list' }, rows.map(function (r) {
        var a = el('a', { href: r[1] }, [document.createTextNode(r[2] + ' '), el('span', { class: 'go-arrow', 'aria-hidden': 'true', text: '↗' })]);
        if (!/^mailto:/.test(r[1])) { a.target = '_blank'; a.rel = 'noopener'; }
        return el('li', {}, [el('span', { class: 'label', text: r[0] }), a]);
      })));
    }
  };

  document.querySelectorAll('[data-render]').forEach(function (m) {
    var r = renderers[m.getAttribute('data-render')]; if (r) r(m);
  });
  document.querySelectorAll('[data-site-intro]').forEach(function (n) {
    if (!S.intro) return;
    var place = S.introPlace, at = place ? S.intro.lastIndexOf(place) : -1;
    if (at < 0) { n.textContent = S.intro; return; }
    // The place spins like a slot reel of copies of itself and lands on the real name.
    var words = [];   // the reel is copies of the place itself, so nothing else can ever be read
    for (var i = 0; i < 15; i++) words.push(place);
    var strip = el('span', { class: 'spin-strip' }, words.map(function (w) { return el('span', { text: w }); }));
    var reel = el('span', { class: 'spin-reel', 'aria-hidden': 'true' }, [strip]);
    n.textContent = '';
    n.appendChild(document.createTextNode(S.intro.slice(0, at)));
    n.appendChild(el('span', { class: 'spin-sr', text: place }));
    n.appendChild(reel);
    n.appendChild(document.createTextNode(S.intro.slice(at + place.length)));
    // The reel is as wide as the real place name; measure again once the web font has loaded,
    // since the fallback font is narrower and would clip the last letter.
    function fit() { var probe = el('span', { text: place }); n.appendChild(probe); reel.style.width = Math.ceil(probe.getBoundingClientRect().width) + 2 + 'px'; n.removeChild(probe); }
    fit(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(fit);
    // Once it lands, swap the reel for plain text so nothing can be clipped.
    function settle() { if (!reel.parentNode) return; n.replaceChild(document.createTextNode(place), reel); n.removeChild(n.querySelector('.spin-sr')); n.normalize(); }
    strip.addEventListener('transitionend', settle); setTimeout(settle, 3500);
    var lh = parseFloat(getComputedStyle(n).lineHeight) || 24;
    reel.style.setProperty('--lh', lh + 'px');
    var end = 'translateY(-' + (words.length - 1) * lh + 'px)';
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { settle(); return; }
    requestAnimationFrame(function () { requestAnimationFrame(function () {
      reel.classList.add('is-spinning');
      strip.style.transform = end;
    }); });
    window.addEventListener('resize', function () {   // keep it lined up if the text size changes
      lh = parseFloat(getComputedStyle(n).lineHeight) || lh;
      reel.style.setProperty('--lh', lh + 'px');
      strip.style.transition = 'none';
      strip.style.transform = 'translateY(-' + (words.length - 1) * lh + 'px)';
    });
  });
  document.querySelectorAll('[data-year]').forEach(function (n) { n.textContent = new Date().getFullYear(); });
  // Last updated: the date GitHub Pages last published this page
  var mod = new Date(document.lastModified);
  if (!isNaN(mod)) document.querySelectorAll('[data-updated]').forEach(function (n) {
    function pad(v) { return (v < 10 ? '0' : '') + v; }
    n.textContent = ' Last updated ' + pad(mod.getMonth() + 1) + '.' + pad(mod.getDate()) + '.' + mod.getFullYear() + '.';
  });
  if (location.hash) { var t = document.getElementById(location.hash.slice(1)); if (t) setTimeout(function () { t.scrollIntoView(); }, 50); }
})();
