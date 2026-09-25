"""
Gộp landing page Arcadia thành 1 file HTML "fragment" để đăng lên WordPress.

Chạy (từ thư mục arcadia-landing):
    python wordpress/build_wp.py

Kết quả:
    wordpress/arcadia-at-lavila.html  ← 1 file duy nhất: <style> + markup + <script>
    wordpress/images/                 ← ảnh jpg/png (tên file không trùng), để upload lên Media

Những gì script làm:
  - CSS được "đóng khung" trong #arcadia-lp để không đụng theme WordPress (và ngược lại).
  - JS được nhúng thẳng vào file.
  - Ảnh SVG (logo, icon) được nhúng dạng data URI vì WordPress mặc định chặn upload SVG.
  - Ảnh jpg/png được chép vào wordpress/images/ với tên "arcadia-..." và đổi đường dẫn tương ứng.

Mỗi lần sửa index.html / css / js, chạy lại script này rồi đăng cập nhật.
"""

import base64
import re
import shutil
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
OUT_DIR = ROOT / "wordpress"
IMG_DIR = OUT_DIR / "images"
OUT_HTML = OUT_DIR / "arcadia-at-lavila.html"
SCOPE = "#arcadia-lp"


# ---------------------------------------------------------------------------
# CSS: thêm tiền tố #arcadia-lp cho mọi selector
# ---------------------------------------------------------------------------
def scope_selector(sel: str) -> str:
    sel = sel.strip()
    if not sel:
        return sel
    if sel in (":root", "body"):
        return SCOPE
    if sel == "html":
        return "html"
    if sel.startswith("body."):  # vd body.alp-no-scroll: giữ nguyên, áp lên <body>
        return sel
    if sel.startswith(("*", "::")):
        return f"{SCOPE} {sel}"
    return f"{SCOPE} {sel}"


def split_blocks(css: str):
    """Tách CSS thành danh sách (phần đầu, nội dung trong ngoặc {})."""
    i, n, out = 0, len(css), []
    while i < n:
        start = css.find("{", i)
        if start == -1:
            break
        head = css[i:start].strip()
        depth, j = 1, start + 1
        while j < n and depth:
            if css[j] == "{":
                depth += 1
            elif css[j] == "}":
                depth -= 1
            j += 1
        out.append((head, css[start + 1 : j - 1]))
        i = j
    return out


def scope_css(css: str, keyframe_names: set, top: bool = True) -> str:
    parts = []
    for head, body in split_blocks(css):
        if head.startswith("@media") or head.startswith("@supports"):
            parts.append(f"{head}{{\n{scope_css(body, keyframe_names, top=False)}}}\n")
        elif head.startswith("@keyframes"):
            name = head.split()[1]
            parts.append(f"@keyframes alp-{name}{{{body}}}\n")
        elif head == "html":
            # biến --header-h nằm trong #arcadia-lp nên <html> không đọc được → ghi số cứng
            parts.append("html{" + body.replace("var(--header-h)", "76px") + "}\n")
        else:
            selectors = ",".join(scope_selector(s) for s in head.split(","))
            parts.append(f"{selectors}{{{body}}}\n")
    out = "".join(parts)
    if not top:
        return out
    # đổi tên animation để không trùng với theme
    for name in keyframe_names:
        out = re.sub(rf"(animation[^;{{}}]*?)\b{name}\b", rf"\1alp-{name}", out)
    return out


def build_css() -> str:
    css = (ROOT / "css" / "style.css").read_text(encoding="utf-8")
    css = re.sub(r"/\*.*?\*/", "", css, flags=re.S)  # bỏ comment
    keyframes = set(re.findall(r"@keyframes\s+([\w-]+)", css))
    scoped = scope_css(css, keyframes)
    # Chặn theme WordPress chen font/màu vào tiêu đề và form
    guard = (
        f"{SCOPE}{{display:block;position:relative;margin:0;padding:0;max-width:none;}}\n"
        f"{SCOPE} h1,{SCOPE} h2,{SCOPE} h3,{SCOPE} h4,{SCOPE} h5,{SCOPE} h6"
        "{font-family:inherit;color:inherit;letter-spacing:normal;text-transform:none;margin:0;padding:0;}\n"
        f"{SCOPE} p,{SCOPE} figure,{SCOPE} blockquote,{SCOPE} dl,{SCOPE} dd{{margin:0;padding:0;}}\n"
        f"{SCOPE} input,{SCOPE} select,{SCOPE} button{{font-family:inherit;line-height:normal;}}\n"
        f"{SCOPE} button{{padding:0;margin:0;border:0;background:none;box-shadow:none;text-shadow:none;min-height:0;}}\n"
        f"{SCOPE} ul{{list-style:none;padding:0;margin:0;}}\n"
        f"{SCOPE} img{{border:0;box-shadow:none;border-radius:0;padding:0;max-width:100%;}}\n"
    )
    return guard + scoped


# ---------------------------------------------------------------------------
# Ảnh: SVG → data URI, jpg/png → wordpress/images/arcadia-*.ext
# ---------------------------------------------------------------------------
def flat_name(rel: str) -> str:
    p = rel.replace("assets/", "", 1).replace("images/", "", 1)
    p = p.replace("amenities/v2_desktop/", "amenities-").replace("amenities/v2_mobile/", "amenities-")
    p = p.replace("master-plan/v2/", "mat-bang-").replace("location-connectivity/", "vi-tri-")
    p = p.replace("slideshow/", "slide-").replace("/", "-")
    return "arcadia-" + p


def rewrite_assets(html: str) -> str:
    if IMG_DIR.exists():
        shutil.rmtree(IMG_DIR)
    IMG_DIR.mkdir(parents=True)
    cache = {}

    def repl(m):
        rel = m.group(0)
        if rel in cache:
            return cache[rel]
        src = ROOT / rel
        if not src.exists():
            raise SystemExit(f"Thiếu file ảnh: {rel}")
        if rel.endswith(".svg"):
            data = base64.b64encode(src.read_bytes()).decode()
            new = f"data:image/svg+xml;base64,{data}"
        else:
            name = flat_name(rel)
            shutil.copy2(src, IMG_DIR / name)
            new = f"images/{name}"
        cache[rel] = new
        return new

    return re.sub(r"assets/[\w./-]+\.(?:jpg|jpeg|png|svg|webp)", repl, html)


# ---------------------------------------------------------------------------
def main():
    page = (ROOT / "index.html").read_text(encoding="utf-8")
    head = re.search(r"<head>(.*?)</head>", page, re.S).group(1)
    body = re.search(r"<body>(.*?)</body>", page, re.S).group(1)

    fonts = "\n".join(
        l.strip() for l in head.splitlines() if "fonts.googleapis" in l or "fonts.gstatic" in l
    )
    body = re.sub(r'\s*<script src="js/main.js"></script>', "", body)
    js = (ROOT / "js" / "main.js").read_text(encoding="utf-8")
    css = build_css()

    html = (
        "<!-- ARCADIA AT LAVILA – landing page (build tự động từ wordpress/build_wp.py, đừng sửa tay) -->\n"
        f"{fonts}\n"
        f"<style>\n{css}</style>\n"
        f'<div id="arcadia-lp">\n{body.strip()}\n</div>\n'
        f"<script>\n{js}</script>\n"
    )
    html = rewrite_assets(html)
    OUT_HTML.write_text(html, encoding="utf-8")

    imgs = list(IMG_DIR.iterdir())
    size = sum(f.stat().st_size for f in imgs) / 1024 / 1024
    print(f"Đã tạo {OUT_HTML.relative_to(ROOT)} ({OUT_HTML.stat().st_size // 1024} KB)")
    print(f"Ảnh cần upload: {len(imgs)} file, {size:.1f} MB trong {IMG_DIR.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
