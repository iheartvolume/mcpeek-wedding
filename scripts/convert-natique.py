"""Rebuild src/assets/fonts/natiques-regular.woff2 from the original TTF.

The free Natique font draws placeholder bars for digits and many accented
letters. This script drops those so the browser falls back to Libre
Baskerville for them.

Usage (needs Python 3):
    pip install fonttools brotli
    python scripts/convert-natique.py fonts-source/natiques-regular.ttf
"""
import sys
from fontTools.ttLib import TTFont
from fontTools.pens.boundsPen import BoundsPen
from fontTools import subset

src = sys.argv[1] if len(sys.argv) > 1 else "fonts-source/natiques-regular.ttf"
font = TTFont(src)
cmap = font.getBestCmap()
glyphs = font.getGlyphSet()

# The placeholder glyph is the same shape as the digit zero.
zero = BoundsPen(glyphs); glyphs[cmap[ord("0")]].draw(zero)
keep = set(range(0x20, 0x7F)) | set(range(0xA0, 0x180)) | {0x2013, 0x2014, 0x2018, 0x2019, 0x201C, 0x201D, 0x2026}

good = []
for cp, name in cmap.items():
    pen = BoundsPen(glyphs); glyphs[name].draw(pen)
    if cp in keep and pen.bounds != zero.bounds and not 0x30 <= cp <= 0x39:
        good.append(cp)

opts = subset.Options(); opts.flavor = "woff2"; opts.layout_features = ["*"]
sub = subset.Subsetter(opts); sub.populate(unicodes=good); sub.subset(font)
font.flavor = "woff2"
font.save("src/assets/fonts/natiques-regular.woff2")
print(f"Saved with {len(good)} characters.")
