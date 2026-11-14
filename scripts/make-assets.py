# Regenerates public/og-cover.png (1200x630) and the icons. Needs: pip install pillow arabic-reshaper python-bidi
import glob, math, random
from PIL import Image, ImageDraw, ImageFont, ImageFilter
import arabic_reshaper
from bidi.algorithm import get_display
def font(names, size):
    for n in names:
        for p in glob.glob(f"/usr/share/fonts/**/{n}", recursive=True): return ImageFont.truetype(p, size)
    return ImageFont.load_default()
W, H = 1200, 630
img = Image.new("RGB", (W, H)); px = img.load()
for y in range(H):
    for x in range(W):
        t = min(math.hypot(x - W / 2, y - H * .45) / 760, 1)
        px[x, y] = (int(74 - 50 * t), int(22 - 14 * t), int(38 - 25 * t))
glow = Image.new("RGBA", (W, H), (0, 0, 0, 0)); g = ImageDraw.Draw(glow); random.seed(7)
for _ in range(70):
    x, y, r = random.randint(0, W), random.randint(0, H), random.choice([2, 3, 4, 6])
    g.ellipse([x - r, y - r, x + r, y + r], fill=random.choice([(233, 214, 189, 150), (214, 154, 166, 130), (197, 161, 106, 150)]))
img = Image.alpha_composite(img.convert("RGBA"), glow.filter(ImageFilter.GaussianBlur(2))).convert("RGB")
d = ImageDraw.Draw(img)
gold, champ = (197, 161, 106), (233, 214, 189)
ft = font(["DejaVuSerif-Bold.ttf", "DejaVuSerif.ttf"], 104); fa = font(["DejaVuSans.ttf"], 56)
def center(t, f, y, c):
    b = d.textbbox((0, 0), t, font=f); d.text(((W - (b[2] - b[0])) / 2, y), t, font=f, fill=c)
center("A World of Love", ft, 190, gold)
d.line([(W / 2 - 140, 340), (W / 2 - 14, 340)], fill=gold, width=2); d.line([(W / 2 + 14, 340), (W / 2 + 140, 340)], fill=gold, width=2)
d.ellipse([W / 2 - 5, 335, W / 2 + 5, 345], fill=gold)
center(get_display(arabic_reshaper.reshape("عالم صغير من الحب")), fa, 380, champ)
img.save("public/og-cover.png")
def icon(s):
    im = Image.new("RGB", (s, s), (33, 11, 19)); dd = ImageDraw.Draw(im); m = s * .18
    dd.ellipse([m, m, s - m, s - m], outline=gold, width=max(2, s // 28)); c = s / 2; r = s * .1
    dd.ellipse([c - r, c - r, c + r, c + r], fill=gold); return im
icon(512).save("public/icon.png"); icon(180).save("public/apple-touch-icon.png"); icon(64).save("public/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])
