TOBY KESSLER — PORTFOLIO SITE
=============================

Pages
  index.html        Home: intro + a row of work from each section
  design.html       Design, split into Triton Construction and TF Cornerstone
  photography.html  Personal photography
  about.html        Short bio, experience and focus areas
  contact.html      Email and links

To change text or images, edit ONE file: js/content.js
(open it in any text editor; the notes at the top explain each field).

Adding your images
  1. Export JPGs about 2400px on the long side (keeps quality, loads fast).
  2. Put them in images/triton, images/tf-cornerstone or images/photography.
  3. In js/content.js change the src, width and height for that item.
  4. Delete the old .svg placeholders when you're done.

Publishing: the site is plain HTML/CSS/JS with no build step, so it runs
on GitHub Pages as-is (push this folder to a repo, then Settings > Pages >
Deploy from branch > main / root). The empty .nojekyll file keeps GitHub
from processing it.

Preview on your computer: double-click index.html, or run
  python3 -m http.server 8000
in this folder and open http://localhost:8000
