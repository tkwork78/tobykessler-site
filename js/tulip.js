/* A red tulip on the Contact page. It slowly grows up out of the first line under the Contact heading,
   unfolds two leaves, opens, then sways gently. */
(function () {
  if (!document.body.hasAttribute('data-tulip')) return;

  var NS = 'http://www.w3.org/2000/svg';
  var BW = 44, BH = 50;                       // the flower head, base at its bottom centre
  var layer = document.createElement('div');
  layer.className = 'tulip-layer';
  layer.setAttribute('aria-hidden', 'true');
  layer.innerHTML =
    '<div class="tulip">' +
      '<div class="tulip-stem"></div>' +
      '<svg class="tulip-leaf tulip-leaf-l" viewBox="0 0 30 60" width="30" height="60" preserveAspectRatio="none"><path d="M30 60 Q2 44 0 4 Q24 26 30 52Z"/></svg>' +
      '<svg class="tulip-leaf tulip-leaf-r" viewBox="0 0 30 60" width="30" height="60" preserveAspectRatio="none"><path d="M0 60 Q28 44 30 10 Q6 30 0 52Z"/></svg>' +
      '<svg class="tulip-head" viewBox="0 0 44 50" width="44" height="50">' +
        '<path class="tulip-back" d="M22 50 Q10 46 11 22 Q14 6 22 0 Q30 6 33 22 Q34 46 22 50Z"/>' +
        '<path class="tulip-petal tulip-petal-l" d="M22 50 Q4 48 3 22 Q4 8 10 4 Q20 16 24 48Z"/>' +
        '<path class="tulip-petal tulip-petal-r" d="M22 50 Q40 48 41 22 Q40 8 34 4 Q24 16 20 48Z"/>' +
      '</svg>' +
    '</div>';
  document.body.appendChild(layer);
  var tulip = layer.querySelector('.tulip'), stem = layer.querySelector('.tulip-stem'), head = layer.querySelector('.tulip-head');

  function rect(n) { return n.getBoundingClientRect(); }
  // where it grows: from the first line under the Contact heading, near its right end, below the menu
  function spot() {
    var line = null;
    document.querySelectorAll('main *').forEach(function (n) {
      if (parseFloat(getComputedStyle(n).borderTopWidth) > 0 && (!line || rect(n).top < rect(line).top)) line = n;
    });
    var l = line ? rect(line) : { left: 0, right: innerWidth - 40, top: innerHeight / 2 };
    var head = document.querySelector('.site-header');
    var room = l.top - (head ? rect(head).bottom : 0);
    var stemH = Math.max(40, Math.min(150, room - BH - 16));
    return { x: l.right - 40, ground: l.top + scrollY, stemH: stemH };
  }

  var s = spot();
  tulip.style.left = s.x + 'px';
  tulip.style.top = s.ground + 'px';
  stem.style.height = s.stemH + 'px';
  // leaves stay below the flower on a short stem
  layer.querySelectorAll('.tulip-leaf').forEach(function (l) { var h = Math.min(60, Math.round(s.stemH * 0.6)); l.style.height = h + 'px'; l.style.width = Math.round(h / 2) + 'px'; });

  function finish() {
    head.style.transform = 'translate(-50%, ' + (-BH - s.stemH) + 'px)';
    tulip.classList.add('is-grown', 'is-open', 'is-swaying');
  }
  if (matchMedia('(prefers-reduced-motion: reduce)').matches) { finish(); return; }

  // the bud peeks out of the line, the stem slowly pushes it up, the leaves unfold, then the petals open and it sways
  function grow() {
    var g0 = performance.now(), D = 3200;
    tulip.classList.add('is-sprouting');
    (function rise(t) {
      var k = Math.min(1, (t - g0) / D), e = k < .5 ? 2 * k * k : 1 - Math.pow(-2 * k + 2, 2) / 2;
      stem.style.transform = 'translateX(-50%) scaleY(' + e + ')';
      head.style.transform = 'translate(-50%, ' + (-BH - s.stemH * e) + 'px) scale(' + Math.min(1, 0.05 + k * 2) + ')';
      if (k > 0.45) tulip.classList.add('is-grown');
      if (k < 1) return requestAnimationFrame(rise);
      stem.style.transform = '';
      setTimeout(function () { tulip.classList.add('is-open'); }, 250);
      setTimeout(function () { tulip.classList.add('is-swaying'); }, 1600);
    })(g0);
  }
  head.style.transform = 'translate(-50%, ' + -BH + 'px) scale(0.05)';
  setTimeout(grow, 400);
})();
