TOBY KESSLER — PORTFOLIO SITE
=============================

Pages
  index.html        Temporary "Site under construction" page (what tobykessler.com shows)
  home.html         Home: intro + a row of work from each section
  projects.html     Projects: TF Cornerstone, Car Community, Logos, Triton (text only)
  projects-tf-cornerstone.html  TF Cornerstone: floor plans, emails, print, blog posts
  projects-car-community.html   Car Community: posters, illustration, photography
  photography.html  Photography: 6-photo previews of each project
  photography-personal-work.html, photography-art-documentary.html, photography-car-community.html  Full projects
  about.html        Short bio, experience and focus areas
  contact.html      Email and links

To change text or images, edit ONE file: js/content.js
(open it in any text editor; the notes at the top explain each field).

Adding your images
  1. Export JPGs about 2400px on the long side (keeps quality, loads fast).
  2. Put them in a folder under images (e.g. images/photography).
  3. In js/content.js change the src, width and height for that item.
  4. Delete the old .svg placeholders when you're done.

Publishing: the site is plain HTML/CSS/JS with no build step, so it runs
on GitHub Pages as-is (push this folder to a repo, then Settings > Pages >
Deploy from branch > main / root). The empty .nojekyll file keeps GitHub
from processing it.

Preview on your computer: double-click home.html, or run
  python3 -m http.server 8000
in this folder and open http://localhost:8000

While the site is under construction
  tobykessler.com shows index.html (the landing page). The full site is
  live but unlisted at tobykessler.com/home.html, and every page has a
  noindex tag so search engines skip it. To launch: replace index.html
  with home.html and remove the noindex tags.
