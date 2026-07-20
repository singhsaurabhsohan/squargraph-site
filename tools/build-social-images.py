from pathlib import Path

from PIL import Image, ImageDraw, ImageFont, ImageOps


ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "assets" / "images" / "social" / "og-v20260720"
SOURCES = OUT / "sources"
WIDTH = 1200
HEIGHT = 630
VERSION = "v20260720"

COLORS = {
    "ink": "#11110f",
    "forest": "#394536",
    "warm": "#f5f2ec",
    "brass": "#bd8427",
    "muted_dark": "#c9cec5",
    "muted_light": "#5d625a",
}

FONT_REGULAR = Path("C:/Windows/Fonts/segoeui.ttf")
FONT_MEDIUM = Path("C:/Windows/Fonts/seguisb.ttf")
FONT_BOLD = Path("C:/Windows/Fonts/segoeuib.ttf")

SPECS = [
    {
        "slug": "home",
        "base": "dark",
        "eyebrow": "BRAND STRATEGY  CREATIVE SYSTEMS  DIGITAL GROWTH",
        "title": "One strategic direction across brand, creative, media, and growth.",
        "support": "SQUARGRAPH aligns every visible action to one clear system.",
    },
    {
        "slug": "work",
        "base": "dark",
        "eyebrow": "SELECTED WORK",
        "title": "Strategy made visible.",
        "support": "Brand systems, campaigns, digital experiences, film, and communication.",
    },
    {
        "slug": "capabilities",
        "base": "dark",
        "eyebrow": "CAPABILITY SYSTEM",
        "title": "Connected capability. One direction.",
        "support": "Brand, digital, content, media, influence, and visibility aligned.",
    },
    {
        "slug": "engagements",
        "base": "warm",
        "eyebrow": "ENGAGEMENTS",
        "title": "Start with the right strategic move.",
        "support": "Focused entry points for clarity, foundation, digital experience, and growth.",
    },
    {
        "slug": "intelligence",
        "base": "dark",
        "eyebrow": "BRAND INTELLIGENCE",
        "title": "Perception leaves clues.",
        "support": "Observations, studies, and frameworks for sharper brand decisions.",
    },
    {
        "slug": "studio",
        "base": "people",
        "eyebrow": "THE STUDIO",
        "title": "The room where brand decisions become sharper.",
        "support": "Founder-led direction across every important touchpoint.",
    },
    {
        "slug": "project-direction",
        "base": "warm",
        "eyebrow": "PROJECT DIRECTION",
        "title": "Tell us what needs to move.",
        "support": "A guided requirement journey that maps the right connected capabilities.",
    },
    {
        "slug": "partners",
        "base": "people",
        "eyebrow": "PARTNER WITH SQUARGRAPH",
        "title": "One strategic direction. Every capability aligned.",
        "support": "Specialist expertise connected through one operating standard.",
    },
    {
        "slug": "founder",
        "base": "people",
        "eyebrow": "SAURABH SOHAN SINGH",
        "title": "Built by understanding how brands move in the real world.",
        "support": "Founder and Creative Strategist at SQUARGRAPH.",
    },
    {
        "slug": "blog",
        "base": "warm",
        "eyebrow": "SQUARGRAPH INTELLIGENCE",
        "title": "Strategy notes, when we have something worth saying.",
        "support": "Clear thinking on positioning, execution, perception, and growth.",
    },
    {
        "slug": "why-execution-matters",
        "base": "dark",
        "eyebrow": "BRAND STRATEGY",
        "title": "Why execution matters more than ideas.",
        "support": "Ideas create possibility. Delivery creates perception.",
    },
    {
        "slug": "discovery",
        "base": "warm",
        "eyebrow": "DISCOVERY SESSION",
        "title": "Start with a focused strategic conversation.",
        "support": "Thirty minutes to identify the clearest next move.",
    },
    {
        "slug": "brand-growth-audit",
        "base": "warm",
        "eyebrow": "BRAND GROWTH AUDIT",
        "title": "Find the gap between intent and perception.",
        "support": "A structured diagnosis of what the market may be reading differently.",
    },
    {
        "slug": "brand-foundation-sprint",
        "base": "warm",
        "eyebrow": "BRAND FOUNDATION SPRINT",
        "title": "Build clarity before scale.",
        "support": "Positioning, message architecture, identity direction, and launch logic.",
    },
    {
        "slug": "website-digital-experience",
        "base": "dark",
        "eyebrow": "WEBSITE AND DIGITAL EXPERIENCE",
        "title": "Make the brand easier to understand and choose.",
        "support": "Strategic digital experiences built for clarity, trust, and action.",
    },
    {
        "slug": "integrated-growth-partnership",
        "base": "dark",
        "eyebrow": "INTEGRATED GROWTH PARTNERSHIP",
        "title": "Keep brand and growth moving in one direction.",
        "support": "Ongoing strategic leadership across creative, digital, media, and learning.",
    },
    {
        "slug": "creative-agency-delhi",
        "base": "warm",
        "eyebrow": "NEW DELHI  INDIA",
        "title": "Brand strategy, creative, and digital systems.",
        "support": "A founder-led studio for connected brand growth.",
    },
    {
        "slug": "utility",
        "base": "dark",
        "eyebrow": "SQUARGRAPH",
        "title": "Perception leaves clues. We follow them.",
        "support": "Brand strategy, creative, and digital systems from New Delhi.",
    },
]

SPECIAL_SOURCES = [
    {
        "slug": "zucero",
        "path": ROOT / "assets" / "images" / "work" / "zucero" / "zucero-hero-v20260720.webp",
    },
]


def load_font(path: Path, size: int) -> ImageFont.FreeTypeFont:
    fallback = FONT_REGULAR if FONT_REGULAR.exists() else Path("C:/Windows/Fonts/arial.ttf")
    return ImageFont.truetype(str(path if path.exists() else fallback), size=size)


def source_path(base: str) -> Path:
    webp = SOURCES / f"base-{base}-{VERSION}.webp"
    if webp.exists():
        return webp
    png = SOURCES / f"base-{base}-{VERSION}.png"
    if not png.exists():
        raise FileNotFoundError(f"Missing social-image source: {png}")
    return png


def prepare_source(base: str) -> Image.Image:
    source = Image.open(source_path(base)).convert("RGB")
    prepared = ImageOps.fit(source, (WIDTH, HEIGHT), method=Image.Resampling.LANCZOS, centering=(0.5, 0.5))
    source_webp = SOURCES / f"base-{base}-{VERSION}.webp"
    if not source_webp.exists():
        prepared.save(source_webp, "WEBP", quality=90, method=6)
    return prepared


def wrap_text(draw: ImageDraw.ImageDraw, text: str, font: ImageFont.FreeTypeFont, max_width: int) -> list[str]:
    words = text.split()
    lines: list[str] = []
    current = ""
    for word in words:
        candidate = f"{current} {word}".strip()
        if draw.textbbox((0, 0), candidate, font=font)[2] <= max_width:
            current = candidate
        else:
            if current:
                lines.append(current)
            current = word
    if current:
        lines.append(current)
    return lines


def draw_tracking_text(draw: ImageDraw.ImageDraw, xy: tuple[int, int], text: str, font: ImageFont.FreeTypeFont, fill: str, tracking: int) -> None:
    x, y = xy
    for char in text:
        draw.text((x, y), char, font=font, fill=fill)
        x += draw.textlength(char, font=font) + tracking


def prepare_logo(dark: bool) -> Image.Image:
    logo = Image.open(ROOT / "logo.webp").convert("RGBA")
    target_width = 310
    target_height = round(logo.height * target_width / logo.width)
    logo = logo.resize((target_width, target_height), Image.Resampling.LANCZOS)
    if dark:
        pixels = logo.load()
        for y in range(logo.height):
            for x in range(logo.width):
                r, g, b, a = pixels[x, y]
                if a:
                    pixels[x, y] = (255 - r, 255 - g, 255 - b, a)
    return logo


def build(spec: dict[str, str]) -> Path:
    dark = spec["base"] == "dark"
    image = prepare_source(spec["base"]).convert("RGBA")
    overlay_color = (8, 10, 8, 212) if dark else (245, 242, 236, 225)
    panel = Image.new("RGBA", (640, HEIGHT), overlay_color)
    image.alpha_composite(panel, (0, 0))

    draw = ImageDraw.Draw(image)
    draw.rectangle((38, 54, 40, 576), fill=COLORS["brass"])

    logo = prepare_logo(dark)
    image.alpha_composite(logo, (72, 54))

    eyebrow_font = load_font(FONT_BOLD, 18)
    title_font = load_font(FONT_MEDIUM, 54)
    support_font = load_font(FONT_REGULAR, 22)
    footer_font = load_font(FONT_MEDIUM, 19)

    title_color = COLORS["warm"] if dark else COLORS["ink"]
    support_color = COLORS["muted_dark"] if dark else COLORS["muted_light"]

    draw_tracking_text(draw, (72, 145), spec["eyebrow"].upper(), eyebrow_font, COLORS["brass"], 1)

    title_lines = wrap_text(draw, spec["title"], title_font, 500)
    title_y = 190
    line_height = 62
    for line in title_lines:
        draw.text((72, title_y), line, font=title_font, fill=title_color)
        title_y += line_height

    support_y = min(title_y + 18, 485)
    support_lines = wrap_text(draw, spec["support"], support_font, 500)
    for line in support_lines[:2]:
        draw.text((72, support_y), line, font=support_font, fill=support_color)
        support_y += 31

    draw.line((72, 554, 568, 554), fill=COLORS["brass"], width=2)
    draw.text((72, 568), "squargraph.com", font=footer_font, fill=title_color)

    output = OUT / f"og-{spec['slug']}-{VERSION}.webp"
    image.convert("RGB").save(output, "WEBP", quality=88, method=6)
    return output


def build_special(spec: dict[str, object]) -> Path:
    source = Image.open(spec["path"]).convert("RGB")
    image = ImageOps.fit(
        source,
        (WIDTH, HEIGHT),
        method=Image.Resampling.LANCZOS,
        centering=(0.5, 0.5),
    )
    output = OUT / f"og-{spec['slug']}-{VERSION}.webp"
    image.save(output, "WEBP", quality=84, method=6)
    return output


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)
    SOURCES.mkdir(parents=True, exist_ok=True)
    for spec in SPECS:
        output = build(spec)
        with Image.open(output) as rendered:
            if rendered.size != (WIDTH, HEIGHT):
                raise ValueError(f"Unexpected size for {output}: {rendered.size}")
        print(output.relative_to(ROOT))
    for spec in SPECIAL_SOURCES:
        output = build_special(spec)
        with Image.open(output) as rendered:
            if rendered.size != (WIDTH, HEIGHT):
                raise ValueError(f"Unexpected size for {output}: {rendered.size}")
        print(output.relative_to(ROOT))


if __name__ == "__main__":
    main()
