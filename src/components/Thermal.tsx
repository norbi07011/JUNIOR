import React, { useEffect, useMemo, useRef, useState } from 'react';
import { motion } from 'motion/react';
import { Flame, Thermometer, Info } from 'lucide-react';
import type { Language } from '../translations';
import { asset, Reveal, SplitText } from '../fx/core';
import { Eyebrow } from './Shared';

/* ------------------------------------------------------------------ */
/* Thermal camera ("warmtebeeld") comparing glazing types on a facade   */
/* ------------------------------------------------------------------ */

type GlassId = 'enkel' | 'dubbel' | 'hrpp' | 'hrppp';
// Typical centre-of-pane U-values (W/m²K).
const GLASS: Record<GlassId, { u: number; name: Record<Language, string> }> = {
  enkel: { u: 5.8, name: { nl: 'Enkel glas', en: 'Single glazing', pl: 'Szyba pojedyncza' } },
  dubbel: { u: 2.8, name: { nl: 'Dubbel glas', en: 'Double glazing', pl: 'Szyba podwójna' } },
  hrpp: { u: 1.1, name: { nl: 'HR++ glas', en: 'HR++ glass', pl: 'Szyba HR++' } },
  hrppp: { u: 0.6, name: { nl: 'HR+++ (triple)', en: 'HR+++ (triple)', pl: 'HR+++ (potrójna)' } },
};

const TX: Record<Language, Record<string, string>> = {
  nl: {
    kicker: 'Warmtebeeld', title: 'Zie waar uw warmte naar buiten lekt',
    intro: 'Zo ziet een warmtecamera uw gevel op een koude winteravond. Kies uw huidige beglazing en de nieuwe, en schuif om te vergelijken: hoe lichter het glas, hoe meer warmte er verloren gaat.',
    now: 'Huidig', next: 'Nieuw', drag: 'Sleep om te vergelijken', photo: 'Gevel', ir: 'Warmtebeeld',
    surface: 'Glas buiten', calc: 'Indicatieve besparing', area: 'Glasoppervlak', price: 'Gasprijs per m³ (pas aan)',
    loss: 'Warmteverlies door glas', perYear: 'per jaar', gas: 'gas', save: 'Besparing', note: 'Indicatieve berekening met ≈ 2.900 graaddagen, binnen 20 °C en een ketelrendement van 90 %. De werkelijke besparing hangt af van uw woning, kozijnen en stookgedrag.',
  },
  en: {
    kicker: 'Thermal image', title: 'See where your heat leaks out',
    intro: 'This is how a thermal camera sees your facade on a cold winter evening. Pick your current glazing and the new one, then slide to compare: the brighter the glass, the more heat is lost.',
    now: 'Current', next: 'New', drag: 'Drag to compare', photo: 'Facade', ir: 'Thermal',
    surface: 'Glass outside', calc: 'Indicative savings', area: 'Glass area', price: 'Gas price per m³ (adjust)',
    loss: 'Heat loss through glass', perYear: 'per year', gas: 'gas', save: 'Savings', note: 'Indicative estimate using ≈ 2,900 heating degree days, 20 °C indoors and 90 % boiler efficiency. Actual savings depend on your home, frames and heating habits.',
  },
  pl: {
    kicker: 'Termowizja', title: 'Zobacz, którędy ucieka Twoje ciepło',
    intro: 'Tak kamera termowizyjna widzi fasadę w mroźny zimowy wieczór. Wybierz obecne i nowe szyby, a potem przesuń suwak, żeby porównać: im jaśniejsza szyba, tym więcej ciepła ucieka.',
    now: 'Obecnie', next: 'Nowe', drag: 'Przeciągnij, aby porównać', photo: 'Fasada', ir: 'Termowizja',
    surface: 'Szyba na zewnątrz', calc: 'Orientacyjna oszczędność', area: 'Powierzchnia szyb', price: 'Cena gazu za m³ (zmień)',
    loss: 'Strata ciepła przez szyby', perYear: 'rocznie', gas: 'gazu', save: 'Oszczędność', note: 'Szacunek przy ≈ 2900 stopniodniach, 20 °C w środku i sprawności kotła 90 %. Rzeczywista oszczędność zależy od domu, ram okiennych i sposobu ogrzewania.',
  },
};

/* ---------- facade geometry (internal 960×600 canvas) ---------- */
// Real photo of a Dutch terraced house (3:4). Geometry in photo pixels of a 900×1200 canvas.
const W = 900, H = 1200, GX = 180, GY = 240, CELL = W / GX;
const P = (x: number, y: number, w: number, h: number) => ({ x: x * 9, y: y * 12, w: w * 9, h: h * 12 }); // % → px
type R = { x: number; y: number; w: number; h: number };
const WINDOWS: R[] = [P(43.5, 42.6, 17.5, 25), P(89, 42.6, 11, 25)];
const ROOFWIN: R = P(46.5, 15.2, 20.5, 4.6);
const DOOR: R = P(36.5, 87.5, 40, 12.5);
const ROOF_TOP = 13 * 12, ROOF_BOT = 38.5 * 12;
const inR = (x: number, y: number, r: R, pad = 0) => x >= r.x - pad && x < r.x + r.w + pad && y >= r.y - pad && y < r.y + r.h + pad;

/** Outside surface temperature field (°C) for a glazing U-value; outdoor 0 °C, indoor 20 °C. */
function heatField(u: number, lum: Float32Array) {
  const f = new Float32Array(GX * GY);
  const glassT = u * 20 * 0.04; // Rse ≈ 0.04 m²K/W → outside glass surface temperature
  const frameT = 0.5 + u * 0.12;
  const leak = Math.max(0, (u - 1.2) / 4.6);
  for (let j = 0; j < GY; j++) {
    for (let i = 0; i < GX; i++) {
      const x = (i + 0.5) * CELL, y = (j + 0.5) * CELL, k = j * GX + i, L = lum[k];
      let t: number;
      if (y < ROOF_TOP) t = -4.5 + L * 0.8;                                 // sky / tree
      else if (y < ROOF_BOT) t = 0.2 + (1 - L) * 0.5 + leak * 0.6 * (1 - (y - ROOF_TOP) / (ROOF_BOT - ROOF_TOP)); // roof tiles
      else t = -0.4 + (1 - L) * 0.6;                                        // insulated brick, texture from photo
      for (const w of [...WINDOWS, ROOFWIN]) {
        if (inR(x, y, w)) {
          const edge = Math.min(x - w.x, w.x + w.w - x, y - w.y, w.y + w.h - y);
          t = edge < 22 ? frameT + leak * 1.3 : glassT + (1 - (y - w.y) / w.h) * glassT * 0.3;
        } else if (y < w.y && y > w.y - 140 && x > w.x && x < w.x + w.w) {
          t += leak * 1.5 * Math.exp(-(w.y - y) / 50);                       // warm air rising above leaky windows
        } else if (inR(x, y, w, 16)) {
          t += 0.3 + leak * 0.9;                                            // reveal / thermal bridge
        }
      }
      if (inR(x, y, DOOR)) t = 0.9 + leak * 0.5 + (1 - L) * 0.2;
      f[k] = t;
    }
  }
  for (let pass = 0; pass < 3; pass++) {
    const g = f.slice();
    for (let j = 1; j < GY - 1; j++) for (let i = 1; i < GX - 1; i++) {
      const k = j * GX + i;
      f[k] = (g[k] * 4 + g[k - 1] + g[k + 1] + g[k - GX] + g[k + GX]) / 8;
    }
  }
  return f;
}

/** Ironbow-like palette, t in 0..1. */
function ironbow(t: number): [number, number, number] {
  const stops: [number, number, number, number][] = [
    [0, 4, 4, 30], [0.18, 40, 10, 110], [0.36, 140, 10, 150], [0.55, 220, 50, 70],
    [0.72, 250, 130, 10], [0.88, 255, 210, 60], [1, 255, 255, 230],
  ];
  t = Math.min(1, Math.max(0, t));
  for (let i = 1; i < stops.length; i++) {
    if (t <= stops[i][0]) {
      const a = stops[i - 1], b = stops[i], k = (t - a[0]) / (b[0] - a[0]);
      return [a[1] + (b[1] - a[1]) * k, a[2] + (b[2] - a[2]) * k, a[3] + (b[3] - a[3]) * k];
    }
  }
  return [255, 255, 230];
}
const TMIN = -1.5, TMAX = 4.8;

export const Thermal = ({ lang }: { lang: Language }) => {
  const t = TX[lang];
  const [now, setNow] = useState<GlassId>('enkel');
  const [next, setNext] = useState<GlassId>('hrppp');
  const [split, setSplit] = useState(0.5);
  const [irOn, setIrOn] = useState(true);
  const [area, setArea] = useState(12);
  const [price, setPrice] = useState(1.4);
  const [probe, setProbe] = useState<{ x: number; y: number; temp: number } | null>(null);
  const ref = useRef<HTMLCanvasElement>(null);
  const wrap = useRef<HTMLDivElement>(null);
  const state = useRef({ uL: GLASS.enkel.u, uR: GLASS.hrppp.u, split: 0.5, ir: 1, fieldL: null as Float32Array | null, fieldR: null as Float32Array | null });
  const seed = useMemo(() => Float32Array.from({ length: GX * GY }, () => Math.random()), []);

  useEffect(() => { state.current.split = split; }, [split]);

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const g = c.getContext('2d'); if (!g) return;
    c.width = W; c.height = H;
    const photo = new Image();
    photo.src = asset('/okna-dachowe4.jpeg');
    let lum: Float32Array | null = null;
    photo.onload = () => {
      const t = document.createElement('canvas'); t.width = GX; t.height = GY;
      const tg = t.getContext('2d')!; tg.drawImage(photo, 0, 0, GX, GY);
      const d = tg.getImageData(0, 0, GX, GY).data; lum = new Float32Array(GX * GY);
      for (let k = 0; k < GX * GY; k++) lum[k] = (0.299 * d[k * 4] + 0.587 * d[k * 4 + 1] + 0.114 * d[k * 4 + 2]) / 255;
      s.fieldL = s.fieldR = null;
    };
    const ir = document.createElement('canvas'); ir.width = GX; ir.height = GY;
    const ig = ir.getContext('2d')!; const img = ig.createImageData(GX, GY);
    const s = state.current;
    let raf = 0, visible = true, last = performance.now();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(c);
    let cacheL = -1, cacheR = -1;
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible || !lum) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const tL = GLASS[(c.dataset.now as GlassId) || 'enkel'].u, tR = GLASS[(c.dataset.next as GlassId) || 'hrppp'].u;
      s.uL += (tL - s.uL) * Math.min(1, dt * 4); s.uR += (tR - s.uR) * Math.min(1, dt * 4);
      s.ir += ((c.dataset.ir === '1' ? 1 : 0) - s.ir) * Math.min(1, dt * 5);
      if (Math.abs(s.uL - cacheL) > 0.01 || !s.fieldL) { s.fieldL = heatField(s.uL, lum); cacheL = s.uL; }
      if (Math.abs(s.uR - cacheR) > 0.01 || !s.fieldR) { s.fieldR = heatField(s.uR, lum); cacheR = s.uR; }
      const sx = Math.round(s.split * GX);
      const flick = now / 1000;
      for (let j = 0; j < GY; j++) for (let i = 0; i < GX; i++) {
        const k = j * GX + i;
        const v = (i < sx ? s.fieldL! : s.fieldR!)[k] + Math.sin(flick * 2 + seed[k] * 40) * 0.03;
        const [r, gg, b] = ironbow((v - TMIN) / (TMAX - TMIN));
        img.data[k * 4] = r; img.data[k * 4 + 1] = gg; img.data[k * 4 + 2] = b; img.data[k * 4 + 3] = 255;
      }
      ig.putImageData(img, 0, 0);
      g.drawImage(photo, 0, 0, W, H);
      g.globalAlpha = s.ir; g.imageSmoothingEnabled = true; g.drawImage(ir, 0, 0, W, H);
      // keep a hint of the real photo's detail under the thermal colours
      g.globalCompositeOperation = 'soft-light'; g.globalAlpha = 0.35 * s.ir; g.drawImage(photo, 0, 0, W, H);
      g.globalCompositeOperation = 'source-over'; g.globalAlpha = 1;
      const lx = s.split * W;
      g.fillStyle = 'rgba(255,255,255,.95)'; g.fillRect(lx - 2, 0, 4, H);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); io.disconnect(); };
  }, [seed]);

  const tempAt = (px: number, py: number) => {
    const s = state.current; const i = Math.floor(px / CELL), j = Math.floor(py / CELL);
    const f = px < s.split * W ? s.fieldL : s.fieldR; if (!f) return 0;
    return f[Math.min(GY - 1, Math.max(0, j)) * GX + Math.min(GX - 1, Math.max(0, i))];
  };
  const toLocal = (e: React.PointerEvent) => {
    const r = wrap.current!.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * W, y: ((e.clientY - r.top) / r.height) * H, fx: (e.clientX - r.left) / r.width };
  };
  const dragging = useRef(false);
  const onDown = (e: React.PointerEvent) => { dragging.current = true; (e.target as HTMLElement).setPointerCapture?.(e.pointerId); setSplit(Math.min(0.97, Math.max(0.03, toLocal(e).fx))); };
  const onMove = (e: React.PointerEvent) => {
    const p = toLocal(e);
    if (dragging.current) setSplit(Math.min(0.97, Math.max(0.03, p.fx)));
    setProbe({ x: p.x, y: p.y, temp: tempAt(p.x, p.y) });
  };

  // indicative savings
  const DEGREE_HOURS = 2900 * 24, KWH_PER_M3 = 9.77, EFF = 0.9;
  const kwh = (u: number) => (u * area * DEGREE_HOURS) / 1000;
  const m3 = (u: number) => kwh(u) / (KWH_PER_M3 * EFF);
  const saveM3 = Math.max(0, m3(GLASS[now].u) - m3(GLASS[next].u));
  const saveEur = saveM3 * price;
  const surface = (u: number) => (u * 20 * 0.04).toFixed(1);

  const Picker = ({ value, onChange, label, side }: { value: GlassId; onChange: (g: GlassId) => void; label: string; side: 'l' | 'r' }) => (
    <div>
      <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{label}</div>
      <div className="flex flex-wrap gap-2">
        {(Object.keys(GLASS) as GlassId[]).map((id) => (
          <button key={id} onClick={() => onChange(id)} aria-pressed={value === id}
            className={`relative rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${value === id ? 'border-transparent text-white' : 'border-white/10 text-zinc-400 hover:text-white'}`}>
            {value === id && <motion.span layoutId={`glass-${side}`} className={`absolute inset-0 rounded-full ${side === 'l' ? 'bg-[#b45309]' : 'bg-[var(--blue)]'}`} transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
            <span className="relative">{GLASS[id].name[lang]}</span>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <section className="relative py-24 md:py-32">
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 max-w-3xl px-2 md:px-0">
          <Eyebrow>{t.kicker}</Eyebrow>
          <SplitText key={`${lang}-th`} text={t.title} className="font-display mt-6 text-4xl font-extrabold leading-[0.95] tracking-tight md:text-7xl" />
          <Reveal><p className="mt-6 text-lg leading-relaxed text-zinc-400">{t.intro}</p></Reveal>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_1fr] lg:items-start">
          <Reveal>
            <div className="overflow-hidden rounded-[28px] border border-white/10 bg-black">
              <div
                ref={wrap}
                className="relative aspect-[3/4] w-full cursor-ew-resize touch-pan-y select-none"
                onPointerDown={onDown}
                onPointerMove={onMove}
                onPointerUp={() => { dragging.current = false; }}
                onPointerLeave={() => { dragging.current = false; setProbe(null); }}
                data-lenis-prevent-touch
              >
                <canvas ref={ref} data-now={now} data-next={next} data-ir={irOn ? '1' : '0'} className="absolute inset-0 h-full w-full" aria-label={t.title} role="img" />
                {/* HUD */}
                <div className="pointer-events-none absolute left-3 top-3 rounded-lg bg-black/60 px-3 py-1.5 font-mono text-[11px] text-white md:text-xs">
                  {t.now}: <b className="text-amber-300">{GLASS[now].name[lang]}</b>
                </div>
                <div className="pointer-events-none absolute right-3 top-3 rounded-lg bg-black/60 px-3 py-1.5 font-mono text-[11px] text-white md:text-xs">
                  {t.next}: <b className="text-sky-300">{GLASS[next].name[lang]}</b>
                </div>
                <div className="pointer-events-none absolute flex h-9 w-9 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-white bg-black/50 text-white shadow-lg" style={{ left: `${split * 100}%`, top: '50%' }}>
                  ⇆
                </div>
                {irOn && (
                  <div className="pointer-events-none absolute bottom-3 right-3 hidden items-center gap-2 font-mono text-[10px] text-white md:flex">
                    <span>{TMIN}°C</span>
                    <span className="h-2 w-28 rounded-full" style={{ background: 'linear-gradient(90deg,#04041e,#280a6e,#8c0a96,#dc3246,#fa820a,#ffd23c,#ffffe6)' }} />
                    <span>{TMAX}°C</span>
                  </div>
                )}
                {probe && irOn && (
                  <div className="pointer-events-none absolute" style={{ left: `${(probe.x / W) * 100}%`, top: `${(probe.y / H) * 100}%` }}>
                    <div className="absolute -left-3 top-0 h-px w-6 bg-white" /><div className="absolute -top-3 left-0 h-6 w-px bg-white" />
                    <div className="absolute left-3 top-2 whitespace-nowrap rounded bg-black/70 px-1.5 py-0.5 font-mono text-[11px] text-white">{probe.temp.toFixed(1)} °C</div>
                  </div>
                )}
                <div className="pointer-events-none absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-[11px] text-zinc-300">{t.drag}</div>
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/10 p-4">
                <div className="flex rounded-full border border-white/10 p-1 text-xs font-bold">
                  {[[true, t.ir], [false, t.photo]].map(([v, l]) => (
                    <button key={String(v)} onClick={() => setIrOn(v as boolean)} className={`rounded-full px-4 py-1.5 transition-colors ${irOn === v ? 'bg-white text-black' : 'text-zinc-400'}`}>{l as string}</button>
                  ))}
                </div>
                <div className="flex gap-4 font-mono text-xs text-zinc-400">
                  <span><Thermometer size={12} className="mr-1 inline" />{t.surface}: <b className="text-amber-300">{surface(GLASS[now].u)} °C</b> → <b className="text-sky-300">{surface(GLASS[next].u)} °C</b></span>
                </div>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-6 rounded-[28px] border border-white/10 bg-[var(--panel)] p-6 md:p-8">
              <Picker value={now} onChange={setNow} label={t.now} side="l" />
              <Picker value={next} onChange={setNext} label={t.next} side="r" />
              <div className="h-px bg-white/10" />
              <div>
                <div className="mb-2 flex justify-between text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500"><span>{t.area}</span><span className="text-white">{area} m²</span></div>
                <input type="range" min={3} max={40} value={area} onChange={(e) => setArea(+e.target.value)} className="w-full accent-[var(--blue-bright)]" aria-label={t.area} />
              </div>
              <label className="block">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{t.price}</span>
                <div className="mt-2 flex items-center gap-2 rounded-xl border border-white/10 bg-black/40 px-3 py-2">
                  <span className="text-zinc-500">€</span>
                  <input type="number" step="0.05" min={0} value={price} onChange={(e) => setPrice(Math.max(0, +e.target.value))} className="w-full bg-transparent outline-none" />
                </div>
              </label>
              <div className="rounded-2xl bg-gradient-to-br from-[var(--blue)]/25 to-transparent p-5">
                <div className="mb-1 flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.25em] text-[var(--blue-bright)]"><Flame size={14} /> {t.calc}</div>
                <div className="font-display text-4xl font-extrabold">
                  € <motion.span key={Math.round(saveEur)} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="inline-block tabular-nums">{Math.round(saveEur).toLocaleString('nl-NL')}</motion.span>
                  <span className="ml-2 text-base font-semibold text-zinc-400">{t.perYear}</span>
                </div>
                <div className="mt-2 text-sm text-zinc-300">≈ {Math.round(saveM3)} m³ {t.gas} · {t.loss}: {Math.round(GLASS[now].u * area * 20)} W → {Math.round(GLASS[next].u * area * 20)} W</div>
              </div>
              <p className="flex gap-2 text-xs leading-relaxed text-zinc-500"><Info size={14} className="mt-0.5 shrink-0" />{t.note}</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
