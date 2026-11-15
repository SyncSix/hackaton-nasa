import sys, re, html, subprocess, urllib.parse, os, tempfile

BASE = os.path.dirname(os.path.abspath(__file__))

def search(q, n=10):
    url = "https://duckduckgo.com/html/?q=" + urllib.parse.quote(q)
    out = os.path.join(BASE, "s_%d.html" % os.getpid())
    subprocess.run(["curl", "-sL", "--max-time", "30", "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    url, "-o", out], check=False)
    s = open(out, encoding="utf-8", errors="ignore").read()
    res = []
    for m in re.finditer(r'class="result__a" href="([^"]+)"[^>]*>(.*?)</a>', s, re.S):
        u = html.unescape(m.group(1))
        if u.startswith("//duckduckgo.com/l/?uddg="):
            qs = urllib.parse.parse_qs(urllib.parse.urlparse("https:" + u).query)
            u = qs.get("uddg", [u])[0]
        t = html.unescape(re.sub('<[^>]+>', '', m.group(2))).strip()
        snap = ""
        sm = re.search(re.escape(m.group(0)) + r'(.*?)class="result__snippet"', s, re.S)
        res.append((t, u))
    for t, u in res[:n]:
        print(f"- {t}\n  {u}")

def fetch(url, chars=12000):
    out = os.path.join(BASE, "p_%d.html" % os.getpid())
    subprocess.run(["curl", "-sL", "--max-time", "40", "-A", "Mozilla/5.0 (Windows NT 10.0; Win64; x64)",
                    url, "-o", out], check=False)
    if os.path.getsize(out) < 500:
        print("[EMPTY]")
        return
    if url.lower().endswith(".pdf") or open(out,'rb').read(4) == b'%PDF':
        txt = out + ".txt"
        subprocess.run(["pdftotext", "-layout", out, txt], check=False)
        s = open(txt, encoding="utf-8", errors="ignore").read()
    else:
        raw = open(out, encoding="utf-8", errors="ignore").read()
        raw = re.sub(r'(?is)<(script|style|noscript|svg|nav|footer|header)[^>]*>.*?</\1>', ' ', raw)
        raw = re.sub(r'(?is)<br\s*/?>|</p>|</div>|</li>|</h[1-6]>', '\n', raw)
        s = re.sub(r'(?s)<[^>]+>', ' ', raw)
        s = html.unescape(s)
    s = re.sub(r'[ \t\xa0]+', ' ', s)
    s = re.sub(r'\n\s*\n+', '\n', s)
    sys.stdout.buffer.write(s[:chars].encode("utf-8","replace"))
    sys.stdout.buffer.write(bytes([10]))

if __name__ == "__main__":
    mode = sys.argv[1]
    arg = " ".join(sys.argv[2:])
    if mode == "s":
        search(arg)
    else:
        fetch(sys.argv[2], int(sys.argv[3]) if len(sys.argv) > 3 else 12000)
