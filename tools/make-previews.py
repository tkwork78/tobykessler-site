"""Make small preview copies of every image for the grids (images/_small/<same path>).

Run from the repo root after adding images:  python3 tools/make-previews.py
Grids load the small copy and fall back to the original if it is missing;
the lightbox and booklet always use the original.
"""
import os
from PIL import Image

SRC, OUT, MAX = 'images', os.path.join('images', '_small'), 1200
SKIP = {'_small', 'text'}

for root, dirs, files in os.walk(SRC):
    dirs[:] = [d for d in dirs if d not in SKIP]
    for name in files:
        ext = name.lower().rsplit('.', 1)[-1]
        if ext not in ('jpg', 'jpeg', 'png'):
            continue
        src = os.path.join(root, name)
        dst = os.path.join(OUT, os.path.relpath(src, SRC))
        if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
            continue
        os.makedirs(os.path.dirname(dst), exist_ok=True)
        im = Image.open(src)
        icc = im.info.get('icc_profile')
        im.thumbnail((MAX, MAX), Image.LANCZOS)
        kw = {'icc_profile': icc} if icc else {}
        if ext == 'png':
            im.save(dst, optimize=True, **kw)
        else:
            im.convert('RGB').save(dst, quality=82, optimize=True, progressive=True, **kw)
        print(dst)
