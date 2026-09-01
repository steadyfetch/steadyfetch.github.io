from PIL import Image, ImageDraw, ImageFont
import os
D = "/tmp/claude-1000/-home-cdoom-Github-new-project/435a9485-6d39-42c8-a083-40ea53994b8e/scratchpad/brand"
OUT = "/home/cdoom/Github/steadyfetch.github.io/brand"
PLATE = (5, 9, 17, 255)
GREEN = (38, 220, 98, 255)
ARCHIVO = os.path.join(D, "Archivo%5Bwdth%2Cwght%5D.ttf.ttf")

import re as _re
_src = open("/home/cdoom/Github/steadyfetch.github.io/build.mjs").read()
def _count(name):
    blk = _re.search(r"const %s = \{.*?\n\};" % name, _src, _re.S).group(0)
    return len(_re.findall(r'^\s{2}"[^"]+":', blk, _re.M))
N_OURS, N_COMP = _count("OURS"), _count("C")
CHECKED = _re.search(r'const CHECKED = "([^"]+)"', _src).group(1)
STAMP = "%d ACTORS  \u00b7  %d COMPETING ACTORS  \u00b7  PRICES READ %s" % (
    N_OURS, N_COMP, CHECKED.upper())
print("stamp from build.mjs:", STAMP)
AZERET = os.path.join(D, "AzeretMono%5Bwght%5D.ttf.ttf")

def arch(size, wght=600, wdth=100):
    f = ImageFont.truetype(ARCHIVO, size)
    f.set_variation_by_axes([wght, wdth])
    return f

def azer(size, wght=400):
    f = ImageFont.truetype(AZERET, size)
    f.set_variation_by_axes([wght])
    return f

def pulse(draw, ox, oy, scale, color, sw=21.0):
    """Draw the steadyfetch square-wave from the 512-unit master geometry."""
    h = sw * scale / 2.0
    def X(v): return ox + v * scale
    def Y(v): return oy + v * scale
    segs = [
        (X(64), Y(306) - h, X(200) + h, Y(306) + h),      # left baseline
        (X(200) - h, Y(177) - h, X(200) + h, Y(306) + h),  # riser
        (X(200) - h, Y(177) - h, X(311) + h, Y(177) + h),  # plateau
        (X(311) - h, Y(177) - h, X(311) + h, Y(306) + h),  # fall
        (X(311) - h, Y(306) - h, X(447), Y(306) + h),      # right baseline
    ]
    for s in segs:
        draw.rectangle(s, fill=color)

def icon(size, path, ss=4):
    n = size * ss
    im = Image.new("RGBA", (n, n), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    s = n / 512.0
    d.rounded_rectangle([2 * s, 2 * s, 510 * s, 510 * s], radius=80 * s, fill=PLATE)
    pulse(d, 0, 0, s, GREEN)
    im.resize((size, size), Image.LANCZOS).save(path)
    print("wrote", path)

icon(32, f"{OUT}/favicon-32.png")
icon(180, f"{OUT}/apple-touch-icon.png")
icon(512, f"{OUT}/icon-512.png")

# ---- favicon.ico (16 + 32 + 48) ----
base = Image.new("RGBA", (256, 256), (0, 0, 0, 0))
d = ImageDraw.Draw(base)
s = 256 / 512.0
d.rounded_rectangle([2 * s, 2 * s, 510 * s, 510 * s], radius=80 * s, fill=PLATE)
pulse(d, 0, 0, s, GREEN)
base.save(f"{OUT}/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
print("wrote favicon.ico")

# ---- OG image 1200x630 ----
SS = 2
W, H = 1200 * SS, 630 * SS
og = Image.new("RGB", (W, H), PLATE[:3])
d = ImageDraw.Draw(og)
M = 78 * SS                      # page margin
INK = (227, 234, 228)
INK2 = (147, 162, 155)
RULE = (30, 42, 51)

# plate frame — a hairline inset rule, the plate's own border
d.rectangle([M - 30 * SS, M - 30 * SS, W - M + 30 * SS, H - M + 30 * SS], outline=RULE, width=1 * SS)

# lockup: mark plate + wordmark
ms = 62 * SS
d.rounded_rectangle([M, M, M + ms, M + ms], radius=int(ms * 0.156), fill=PLATE)
d.rounded_rectangle([M, M, M + ms, M + ms], radius=int(ms * 0.156), outline=(30, 42, 51), width=1 * SS)
pulse(d, M, M, ms / 512.0, GREEN, sw=26.0)
fw = arch(34 * SS, wght=600, wdth=92)
d.text((M + ms + 20 * SS, M + ms / 2), "steadyfetch", font=fw, fill=INK, anchor="lm")

# headline — condensed Archivo, the plate title
f1 = arch(92 * SS, wght=700, wdth=68)
y = 196 * SS
for line in ["Data actors on Apify,", "compared honestly."]:
    d.text((M, y), line, font=f1, fill=INK, anchor="la")
    y += 96 * SS

# the pulse rule, stepped, running the width — the mark as structure
ry = 448 * SS
x0, x1 = M, W - M
step_x = x0 + int((x1 - x0) * 0.17)
step_w = int((x1 - x0) * 0.085)
rise = 15 * SS
t = 2 * SS
d.rectangle([x0, ry - t // 2, step_x, ry + t // 2], fill=GREEN)
d.rectangle([step_x - t // 2, ry - rise, step_x + t // 2, ry + t // 2], fill=GREEN)
d.rectangle([step_x, ry - rise - t // 2, step_x + step_w, ry - rise + t // 2], fill=GREEN)
d.rectangle([step_x + step_w - t // 2, ry - rise, step_x + step_w + t // 2, ry + t // 2], fill=GREEN)
d.rectangle([step_x + step_w, ry - t // 2, x1, ry + t // 2], fill=GREEN)

# the collection stamp, engraved caps in the mono
f2 = azer(19 * SS, wght=400)
d.text((M, 474 * SS), STAMP, font=f2, fill=INK2, anchor="la")

f3 = arch(26 * SS, wght=400, wdth=100)
d.text((M, 552 * SS), "steadyfetch.com", font=f3, fill=INK2, anchor="ls")
d.text((W - M, 552 * SS), "Charged only when a row lands in your dataset.",
       font=f3, fill=INK2, anchor="rs")

from PIL import PngImagePlugin
PROV = ("Authored for steadyfetch.com by the Impeccable design lane, 2026-09-01. "
        "Drawn with PIL from the measured geometry of the existing steadyfetch mark "
        "(the green square-wave pulse on #050911 live as the Apify profile picture); "
        "type is Archivo and Azeret Mono (SIL OFL). Counts and the checked date are read "
        "at render time from build.mjs. No generative model produced any pixel.")
def stamp_provenance(path, what):
    im = Image.open(path)
    meta = PngImagePlugin.PngInfo()
    meta.add_text("Title", "steadyfetch " + what)
    meta.add_text("Author", "steadyfetch")
    meta.add_text("Software", "PIL via brand/render.py (no image generation)")
    meta.add_text("Source", PROV)
    im.save(path, pnginfo=meta, optimize=True)

og.resize((1200, 630), Image.LANCZOS).save(f"{OUT}/og.png", optimize=True)
for f, what in [("og.png", "Open Graph card"), ("favicon-32.png", "favicon 32"),
                ("apple-touch-icon.png", "apple touch icon"), ("icon-512.png", "app icon 512")]:
    stamp_provenance(f"{OUT}/{f}", what)
open(f"{OUT}/PROVENANCE", "w").write(PROV + "\n\nfavicon.ico is the same artwork at 16/32/48 (ICO carries no text chunk).\n"
    "mark.svg and icon.svg are hand-written paths from the same measured geometry.\n"
    "Regenerate everything with: python3 render.py (reads counts from build.mjs).\n")
print("wrote og.png + provenance on 4 rasters and brand/PROVENANCE")
