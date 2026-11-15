def lin(c):
    c = c / 255
    return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4


def L(rgb):
    r, g, b = rgb
    return 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b)


def cr(a, b):
    la, lb = L(a), L(b)
    hi, lo = max(la, lb), min(la, lb)
    return (hi + 0.05) / (lo + 0.05)


def hx(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i + 2], 16) for i in (0, 2, 4))


def mix(fg, bg, a):
    return tuple(round(a * f + (1 - a) * b) for f, b in zip(fg, bg))


G = hx('101317')
T = hx('242a30')
GELO = hx('e9e8e2')
MARTE = hx('e66a2c')
CRIT = hx('ef4a52')
ALE = hx('ffc247')
NOM = hx('34d399')
EM300 = hx('6ee7b7')
EM400 = hx('34d399')

print("== gelo opacities on grafite #101317 ==")
for a in [0.25, 0.3, 0.35, 0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8, 0.85, 0.9, 0.95]:
    print(f"  gelo/{int(a*100)}: {cr(mix(GELO, G, a), G):.2f}")

print("== gelo opacities on titanio #242a30 ==")
for a in [0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.8]:
    print(f"  gelo/{int(a*100)}: {cr(mix(GELO, T, a), T):.2f}")

print("== status colors on grafite ==")
for n, c in [('marte', MARTE), ('critico', CRIT), ('alerta', ALE), ('nominal', NOM), ('emerald300', EM300)]:
    print(f"  {n}: {cr(c, G):.2f}")

print("== status colors on titanio ==")
for n, c in [('marte', MARTE), ('critico', CRIT), ('alerta', ALE), ('nominal', NOM)]:
    print(f"  {n}: {cr(c, T):.2f}")

print("== status on own tint over grafite ==")
for pct in [0.05, 0.08, 0.10, 0.12, 0.15, 0.20, 0.25]:
    row = []
    for n, c in [('marte', MARTE), ('critico', CRIT), ('alerta', ALE), ('nominal', NOM)]:
        bg = mix(c, G, pct)
        row.append(f"{n} {cr(c, bg):.2f}")
    print(f"  tint {int(pct*100)}%: " + " | ".join(row))

print("== text on marte solid bg ==")
print(f"  grafite on marte: {cr(G, MARTE):.2f}")
print(f"  gelo on marte: {cr(GELO, MARTE):.2f}")

print("== gelo/xx on marte/15 over grafite ==")
bg = mix(MARTE, G, 0.15)
for a in [0.6, 0.65, 0.7, 0.85]:
    print(f"  gelo/{int(a*100)}: {cr(mix(GELO, bg, a), bg):.2f}")
print(f"  marte text on marte/15: {cr(MARTE, bg):.2f}")

print("== gelo/xx on black/25 over grafite ==")
bg = mix((0, 0, 0), G, 0.25)
for a in [0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.8, 0.9]:
    print(f"  gelo/{int(a*100)}: {cr(mix(GELO, bg, a), bg):.2f}")

print("== gelo/xx on black/20 over grafite ==")
bg = mix((0, 0, 0), G, 0.20)
for a in [0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7]:
    print(f"  gelo/{int(a*100)}: {cr(mix(GELO, bg, a), bg):.2f}")

print("== card-glass bg (titanio 55% over grafite) ==")
cg = mix(T, G, 0.55)
print(f"  card bg: {cg}")
for a in [0.4, 0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.8, 0.9]:
    print(f"  gelo/{int(a*100)}: {cr(mix(GELO, cg, a), cg):.2f}")
for n, c in [('marte', MARTE), ('critico', CRIT), ('alerta', ALE), ('nominal', NOM)]:
    print(f"  {n}: {cr(c, cg):.2f}")

print("== status on card-glass with own 10% tint ==")
for n, c in [('marte', MARTE), ('critico', CRIT), ('alerta', ALE), ('nominal', NOM)]:
    bg = mix(c, cg, 0.10)
    print(f"  {n} on {n}/10: {cr(c, bg):.2f}")

print("== alerta/90, critico/90, alerta/85 on card ==")
for n, c, a in [('alerta/90', ALE, 0.9), ('critico/90', CRIT, 0.9), ('alerta/85', ALE, 0.85), ('alerta/70', ALE, 0.7)]:
    print(f"  {n}: {cr(mix(c, cg, a), cg):.2f}")

print("== gelo/45 on black/25 ==")
bg = mix((0, 0, 0), G, 0.25)
print(f"  gelo/45: {cr(mix(GELO, bg, 0.45), bg):.2f}")
print(f"  gelo/40: {cr(mix(GELO, bg, 0.40), bg):.2f}")
print(f"  gelo/25: {cr(mix(GELO, bg, 0.25), bg):.2f}")

print("== emerald-400/70 on card ==")
print(f"  emerald400/70: {cr(mix(EM400, cg, 0.7), cg):.2f}")

print("== marte/70 on card ==")
print(f"  marte/70: {cr(mix(MARTE, cg, 0.7), cg):.2f}")

print("== gelo/55 on card ==")
print(f"  gelo/55: {cr(mix(GELO, cg, 0.55), cg):.2f}")
print(f"  gelo/50: {cr(mix(GELO, cg, 0.50), cg):.2f}")
print(f"  gelo/60: {cr(mix(GELO, cg, 0.60), cg):.2f}")
print(f"  gelo/65: {cr(mix(GELO, cg, 0.65), cg):.2f}")
print(f"  gelo/70: {cr(mix(GELO, cg, 0.70), cg):.2f}")
print(f"  gelo/75: {cr(mix(GELO, cg, 0.75), cg):.2f}")
print(f"  gelo/80: {cr(mix(GELO, cg, 0.80), cg):.2f}")
print(f"  gelo/85: {cr(mix(GELO, cg, 0.85), cg):.2f}")
print(f"  gelo/90: {cr(mix(GELO, cg, 0.90), cg):.2f}")

print("== header bg grafite/85 over gradient (approx grafite) ==")
print(f"  gelo/70 on grafite: {cr(mix(GELO, G, 0.70), G):.2f}")
print(f"  gelo/65 on grafite: {cr(mix(GELO, G, 0.65), G):.2f}")
print(f"  gelo/60 on grafite: {cr(mix(GELO, G, 0.60), G):.2f}")
print(f"  gelo/55 on grafite: {cr(mix(GELO, G, 0.55), G):.2f}")
print(f"  gelo/50 on grafite: {cr(mix(GELO, G, 0.50), G):.2f}")
print(f"  gelo/45 on grafite: {cr(mix(GELO, G, 0.45), G):.2f}")
print(f"  gelo/40 on grafite: {cr(mix(GELO, G, 0.40), G):.2f}")
print(f"  gelo/35 on grafite: {cr(mix(GELO, G, 0.35), G):.2f}")
print(f"  gelo/25 on grafite: {cr(mix(GELO, G, 0.25), G):.2f}")

print("== label-micro rgba(233,232,226,0.62) on card ==")
print(f"  {cr(mix(GELO, cg, 0.62), cg):.2f}")

print("== gradient-space lightest stop #242a30 ==")
print(f"  gelo/45 on titanio: {cr(mix(GELO, T, 0.45), T):.2f}")
print(f"  gelo/40 on titanio: {cr(mix(GELO, T, 0.40), T):.2f}")
print(f"  gelo/50 on titanio: {cr(mix(GELO, T, 0.50), T):.2f}")
print(f"  gelo/55 on titanio: {cr(mix(GELO, T, 0.55), T):.2f}")
print(f"  gelo/60 on titanio: {cr(mix(GELO, T, 0.60), T):.2f}")
print(f"  gelo/65 on titanio: {cr(mix(GELO, T, 0.65), T):.2f}")
print(f"  gelo/70 on titanio: {cr(mix(GELO, T, 0.70), T):.2f}")
print(f"  marte on titanio: {cr(MARTE, T):.2f}")
print(f"  critico on titanio: {cr(CRIT, T):.2f}")
print(f"  alerta on titanio: {cr(ALE, T):.2f}")
print(f"  nominal on titanio: {cr(NOM, T):.2f}")

print("== extra ==")
print("critico on critico/15 over card:", round(cr(CRIT, mix(CRIT, cg, 0.15)), 2))
print("critico on critico/15 over grafite:", round(cr(CRIT, mix(CRIT, G, 0.15)), 2))
w10 = mix((255,255,255), cg, 0.10)
w5 = mix((255,255,255), cg, 0.05)
w8 = mix((255,255,255), cg, 0.08)
for a in [0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.85, 0.9]:
    print(f"  gelo/{int(a*100)} on white/10: {cr(mix(GELO, w10, a), w10):.2f}")
for a in [0.45, 0.5, 0.55, 0.6, 0.65, 0.7, 0.85, 0.9]:
    print(f"  gelo/{int(a*100)} on white/5: {cr(mix(GELO, w5, a), w5):.2f}")
print("  gelo/50 on white/8:", round(cr(mix(GELO, w8, 0.5), w8), 2))
print("  gelo/45 on white/8:", round(cr(mix(GELO, w8, 0.45), w8), 2))
print("  gelo/60 on white/8:", round(cr(mix(GELO, w8, 0.6), w8), 2))
print("  gelo/70 on white/8:", round(cr(mix(GELO, w8, 0.7), w8), 2))
print("  gelo/80 on white/8:", round(cr(mix(GELO, w8, 0.8), w8), 2))
print("  gelo/90 on white/8:", round(cr(mix(GELO, w8, 0.9), w8), 2))
print("  gelo/95 on white/8:", round(cr(mix(GELO, w8, 0.95), w8), 2))
print("  gelo/85 on white/8:", round(cr(mix(GELO, w8, 0.85), w8), 2))
print("  gelo/75 on white/8:", round(cr(mix(GELO, w8, 0.75), w8), 2))
print("  gelo/65 on white/8:", round(cr(mix(GELO, w8, 0.65), w8), 2))
print("  gelo/55 on white/8:", round(cr(mix(GELO, w8, 0.55), w8), 2))
print("  gelo/40 on white/8:", round(cr(mix(GELO, w8, 0.4), w8), 2))
print("  gelo/45 on white/10:", round(cr(mix(GELO, w10, 0.45), w10), 2))
print("  gelo/40 on white/10:", round(cr(mix(GELO, w10, 0.4), w10), 2))
print("  gelo/25 on white/10:", round(cr(mix(GELO, w10, 0.25), w10), 2))
print("  gelo/35 on white/10:", round(cr(mix(GELO, w10, 0.35), w10), 2))
print("  gelo/30 on white/10:", round(cr(mix(GELO, w10, 0.3), w10), 2))
print("  gelo/20 on white/10:", round(cr(mix(GELO, w10, 0.2), w10), 2))
print("  gelo/15 on white/10:", round(cr(mix(GELO, w10, 0.15), w10), 2))
print("  gelo/10 on white/10:", round(cr(mix(GELO, w10, 0.1), w10), 2))
print("  gelo/5 on white/10:", round(cr(mix(GELO, w10, 0.05), w10), 2))
print("  gelo/8 on white/10:", round(cr(mix(GELO, w10, 0.08), w10), 2))
print("  gelo/12 on white/10:", round(cr(mix(GELO, w10, 0.12), w10), 2))
print("  gelo/15 on white/8:", round(cr(mix(GELO, w8, 0.15), w8), 2))
print("  gelo/20 on white/8:", round(cr(mix(GELO, w8, 0.2), w8), 2))
print("  gelo/25 on white/8:", round(cr(mix(GELO, w8, 0.25), w8), 2))
print("  gelo/30 on white/8:", round(cr(mix(GELO, w8, 0.3), w8), 2))
print("  gelo/35 on white/8:", round(cr(mix(GELO, w8, 0.35), w8), 2))
print("  gelo/45 on white/5:", round(cr(mix(GELO, w5, 0.45), w5), 2))
print("  gelo/40 on white/5:", round(cr(mix(GELO, w5, 0.4), w5), 2))
print("  gelo/35 on white/5:", round(cr(mix(GELO, w5, 0.35), w5), 2))
print("  gelo/30 on white/5:", round(cr(mix(GELO, w5, 0.3), w5), 2))
print("  gelo/25 on white/5:", round(cr(mix(GELO, w5, 0.25), w5), 2))
print("  gelo/20 on white/5:", round(cr(mix(GELO, w5, 0.2), w5), 2))
print("  gelo/15 on white/5:", round(cr(mix(GELO, w5, 0.15), w5), 2))
print("  gelo/10 on white/5:", round(cr(mix(GELO, w5, 0.1), w5), 2))
print("  gelo/5 on white/5:", round(cr(mix(GELO, w5, 0.05), w5), 2))
print("  gelo/8 on white/5:", round(cr(mix(GELO, w5, 0.08), w5), 2))
print("  gelo/12 on white/5:", round(cr(mix(GELO, w5, 0.12), w5), 2))
print("  gelo/15 on white/8:", round(cr(mix(GELO, w8, 0.15), w8), 2))
print("  gelo/20 on white/8:", round(cr(mix(GELO, w8, 0.2), w8), 2))
print("  gelo/25 on white/8:", round(cr(mix(GELO, w8, 0.25), w8), 2))
print("  gelo/30 on white/8:", round(cr(mix(GELO, w8, 0.3), w8), 2))
print("  gelo/35 on white/8:", round(cr(mix(GELO, w8, 0.35), w8), 2))
print("  gelo/40 on white/8:", round(cr(mix(GELO, w8, 0.4), w8), 2))
print("  gelo/45 on white/8:", round(cr(mix(GELO, w8, 0.45), w8), 2))
print("  gelo/50 on white/8:", round(cr(mix(GELO, w8, 0.5), w8), 2))
print("  gelo/55 on white/8:", round(cr(mix(GELO, w8, 0.55), w8), 2))
print("  gelo/60 on white/8:", round(cr(mix(GELO, w8, 0.6), w8), 2))
print("  gelo/65 on white/8:", round(cr(mix(GELO, w8, 0.65), w8), 2))
print("  gelo/70 on white/8:", round(cr(mix(GELO, w8, 0.7), w8), 2))
print("  gelo/75 on white/8:", round(cr(mix(GELO, w8, 0.75), w8), 2))
print("  gelo/80 on white/8:", round(cr(mix(GELO, w8, 0.8), w8), 2))
print("  gelo/85 on white/8:", round(cr(mix(GELO, w8, 0.85), w8), 2))
print("  gelo/90 on white/8:", round(cr(mix(GELO, w8, 0.9), w8), 2))
print("  gelo/95 on white/8:", round(cr(mix(GELO, w8, 0.95), w8), 2))
print("  gelo/100 on white/8:", round(cr(GELO, w8), 2))
print("  gelo/100 on white/10:", round(cr(GELO, w10), 2))
print("  gelo/100 on white/5:", round(cr(GELO, w5), 2))
print("  gelo/100 on card:", round(cr(GELO, cg), 2))
print("  gelo/100 on grafite:", round(cr(GELO, G), 2))
print("  gelo/100 on titanio:", round(cr(GELO, T), 2))
print("  gelo/100 on black/25:", round(cr(GELO, mix((0,0,0), G, 0.25)), 2))
print("  gelo/100 on black/20:", round(cr(GELO, mix((0,0,0), G, 0.20)), 2))
print("  gelo/100 on black/60:", round(cr(GELO, mix((0,0,0), G, 0.60)), 2))
print("  gelo/100 on black/70:", round(cr(GELO, mix((0,0,0), G, 0.70)), 2))
print("  gelo/100 on black/30:", round(cr(GELO, mix((0,0,0), G, 0.30)), 2))
print("  gelo/100 on black/40:", round(cr(GELO, mix((0,0,0), G, 0.40)), 2))
print("  gelo/100 on black/50:", round(cr(GELO, mix((0,0,0), G, 0.50)), 2))
print("  gelo/100 on black/80:", round(cr(GELO, mix((0,0,0), G, 0.80)), 2))
print("  gelo/100 on black/90:", round(cr(GELO, mix((0,0,0), G, 0.90)), 2))
print("  gelo/100 on black/100:", round(cr(GELO, (0,0,0)), 2))
print("  gelo/100 on black/15:", round(cr(GELO, mix((0,0,0), G, 0.15)), 2))
print("  gelo/100 on black/10:", round(cr(GELO, mix((0,0,0), G, 0.10)), 2))
print("  gelo/100 on black/5:", round(cr(GELO, mix((0,0,0), G, 0.05)), 2))
print("  gelo/100 on black/0:", round(cr(GELO, G), 2))
print("  gelo/100 on black/35:", round(cr(GELO, mix((0,0,0), G, 0.35)), 2))
print("  gelo/100 on black/45:", round(cr(GELO, mix((0,0,0), G, 0.45)), 2))
print("  gelo/100 on black/55:", round(cr(GELO, mix((0,0,0), G, 0.55)), 2))
print("  gelo/100 on black/65:", round(cr(GELO, mix((0,0,0), G, 0.65)), 2))
print("  gelo/100 on black/75:", round(cr(GELO, mix((0,0,0), G, 0.75)), 2))
print("  gelo/100 on black/85:", round(cr(GELO, mix((0,0,0), G, 0.85)), 2))
print("  gelo/100 on black/95:", round(cr(GELO, mix((0,0,0), G, 0.95)), 2))
