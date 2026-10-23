import React, { useMemo, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check, Plus, Ruler } from 'lucide-react';
import type { Language } from '../translations';
import { Float, Reveal, SplitText, TiltCard } from '../fx/core';
import { flyToQuote, useQuote } from '../fx/nav';
import { Eyebrow } from './Shared';

type L = Record<Language, string>;
const TX: Record<string, L> = {
  kicker: { nl: 'Configurator', en: 'Configurator', pl: 'Konfigurator' },
  title: { nl: 'Stel uw kozijn samen', en: 'Design your window', pl: 'Skonfiguruj swoje okno' },
  intro: {
    nl: 'Kies type, indeling, kleur, glas en maat en zie uw kozijn direct veranderen. Tevreden? Voeg het toe aan uw offerte-aanvraag.',
    en: 'Pick type, layout, colour, glass and size and watch your window change instantly. Happy? Add it to your quote request.',
    pl: 'Wybierz typ, podział, kolor, szybę i wymiar, a okno zmieni się od razu. Pasuje? Dodaj je do zapytania o wycenę.',
  },
  type: { nl: 'Type', en: 'Type', pl: 'Typ' },
  layout: { nl: 'Indeling', en: 'Layout', pl: 'Podział' },
  colour: { nl: 'Kleur', en: 'Colour', pl: 'Kolor' },
  glass: { nl: 'Glas', en: 'Glass', pl: 'Szyba' },
  size: { nl: 'Afmetingen', en: 'Dimensions', pl: 'Wymiary' },
  width: { nl: 'Breedte', en: 'Width', pl: 'Szerokość' },
  height: { nl: 'Hoogte', en: 'Height', pl: 'Wysokość' },
  top: { nl: 'Bovenlicht', en: 'Transom', pl: 'Naświetle' },
  bars: { nl: 'Roeden', en: 'Glazing bars', pl: 'Szprosy' },
  add: { nl: 'Toevoegen aan offerte', en: 'Add to quote', pl: 'Dodaj do wyceny' },
  added: { nl: 'Toegevoegd aan offerte', en: 'Added to quote', pl: 'Dodano do wyceny' },
  sections: { nl: 'vakken', en: 'sections', pl: 'pola' },
  section: { nl: 'vak', en: 'section', pl: 'pole' },
  note: { nl: 'Symbolen volgens bouwtekening: de punt van de driehoek wijst naar de scharnierzijde.', en: 'Drawing symbols: the tip of the triangle points to the hinge side.', pl: 'Symbole jak na rysunku: wierzchołek trójkąta wskazuje stronę zawiasów.' },
};

type TypeId = 'dk' | 'vast' | 'deur' | 'hst';
const TYPES: { id: TypeId; name: L }[] = [
  { id: 'dk', name: { nl: 'Draai-kiepraam', en: 'Tilt & turn', pl: 'Uchylno-rozwierne' } },
  { id: 'vast', name: { nl: 'Vast raam', en: 'Fixed window', pl: 'Okno stałe' } },
  { id: 'deur', name: { nl: 'Tuindeuren', en: 'French doors', pl: 'Drzwi tarasowe' } },
  { id: 'hst', name: { nl: 'HST-schuifpui', en: 'Lift & slide', pl: 'Drzwi HST' } },
];
const COLOURS: { id: string; name: L; hex: string; ral?: string; wood?: boolean }[] = [
  { id: 'wit', name: { nl: 'Wit', en: 'White', pl: 'Biały' }, hex: '#f3f2ee', ral: 'RAL 9016' },
  { id: 'creme', name: { nl: 'Crème', en: 'Cream', pl: 'Kremowy' }, hex: '#e8dfc9', ral: 'RAL 9001' },
  { id: 'antra', name: { nl: 'Antraciet', en: 'Anthracite', pl: 'Antracyt' }, hex: '#383e42', ral: 'RAL 7016' },
  { id: 'zwart', name: { nl: 'Zwart', en: 'Black', pl: 'Czarny' }, hex: '#1c1c1c', ral: 'RAL 9005' },
  { id: 'groen', name: { nl: 'Monumentengroen', en: 'Heritage green', pl: 'Zieleń zabytkowa' }, hex: '#2f4a3a', ral: 'RAL 6009' },
  { id: 'eiken', name: { nl: 'Eiken houtnerf', en: 'Oak woodgrain', pl: 'Dąb (drewnopodobny)' }, hex: '#9a6a3c', wood: true },
];
const GLASS: { id: string; name: L; u: string }[] = [
  { id: 'hrpp', name: { nl: 'HR++', en: 'HR++', pl: 'HR++' }, u: 'Ug 1.1' },
  { id: 'hrppp', name: { nl: 'HR+++ (triple)', en: 'HR+++ (triple)', pl: 'HR+++ (potrójna)' }, u: 'Ug 0.6' },
  { id: 'geluid', name: { nl: 'Geluidwerend', en: 'Acoustic', pl: 'Akustyczna' }, u: 'Rw ≈ 40 dB' },
];

const shade = (hex: string, k: number) => {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v * k)));
  return `rgb(${f(n >> 16)},${f((n >> 8) & 255)},${f(n & 255)})`;
};

/** Front elevation of the configured window as SVG (drawing-style symbols + realistic fill). */
const Elevation = React.forwardRef<SVGSVGElement, { type: TypeId; n: number; top: boolean; bars: boolean; colour: (typeof COLOURS)[number]; glass: string; w: number; h: number; lang: Language }>(
  ({ type, n, top, bars, colour, glass, w, h, lang }, ref) => {
    const S = 300 / Math.max(w, h);
    const W = w * S, H = h * S, P = 9, pad = 46;
    const VW = W + pad * 2, VH = H + pad * 2;
    const topH = top ? Math.min(H * 0.26, 46) : 0;
    const frame = colour.hex, frameD = shade(colour.hex, 0.78), frameL = shade(colour.hex, 1.12);
    const glassFill = glass === 'hrppp' ? 'url(#g3)' : glass === 'geluid' ? 'url(#gs)' : 'url(#g2)';
    const cells = Array.from({ length: n }, (_, i) => i);
    const cw = (W - 2 * P) / n;
    const y0 = pad + P + topH, ch = H - 2 * P - topH;
    const sashKind = (i: number): 'dl' | 'dr' | 'v' | 'sl' | 'sr' => {
      if (type === 'vast') return 'v';
      if (type === 'hst') return i === 0 ? 'sl' : 'v';
      if (type === 'deur') return n === 1 ? 'dl' : i === 0 ? 'dl' : i === n - 1 ? 'dr' : 'v';
      return n === 1 ? 'dr' : i === n - 1 ? 'dr' : i === 0 ? 'dl' : 'v';
    };
    return (
      <svg ref={ref} viewBox={`0 0 ${VW} ${VH}`} className="h-full w-full" role="img" aria-label="Kozijn">
        <defs>
          <linearGradient id="g2" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#a9c7dd" /><stop offset=".5" stopColor="#6f93b3" /><stop offset="1" stopColor="#3f5f7f" /></linearGradient>
          <linearGradient id="g3" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#b7d3c9" /><stop offset=".5" stopColor="#7aa39a" /><stop offset="1" stopColor="#456c66" /></linearGradient>
          <linearGradient id="gs" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#c3c9e6" /><stop offset=".5" stopColor="#8790c2" /><stop offset="1" stopColor="#525a8f" /></linearGradient>
          <linearGradient id="refl" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stopColor="#fff" stopOpacity="0" /><stop offset=".5" stopColor="#fff" stopOpacity=".35" /><stop offset="1" stopColor="#fff" stopOpacity="0" /></linearGradient>
          <pattern id="wood" width="40" height="8" patternUnits="userSpaceOnUse"><rect width="40" height="8" fill={frame} /><path d="M0 3 Q10 1 20 3 T40 3" stroke={shade(frame, 0.75)} strokeWidth="1" fill="none" /><path d="M0 6 Q12 7 24 5 T40 6" stroke={shade(frame, 0.85)} strokeWidth=".6" fill="none" /></pattern>
          <marker id="arr" viewBox="0 0 10 10" refX="5" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse"><path d="M0 0L10 5L0 10z" fill="#60a5fa" /></marker>
        </defs>
        {/* outer frame */}
        <rect x={pad} y={pad} width={W} height={H} rx="2" fill={colour.wood ? 'url(#wood)' : frame} stroke={frameD} strokeWidth="1.5" />
        <rect x={pad + 2} y={pad + 2} width={W - 4} height="3" fill={frameL} opacity=".6" />
        {top && (
          <g>
            <rect x={pad + P} y={pad + P} width={W - 2 * P} height={topH - P / 2} fill={glassFill} />
            <rect x={pad + P} y={pad + P} width={(W - 2 * P) * 0.35} height={topH - P / 2} fill="url(#refl)" />
            <rect x={pad + P} y={pad + topH - P / 2} width={W - 2 * P} height={P} fill={colour.wood ? 'url(#wood)' : frame} stroke={frameD} strokeWidth=".8" />
          </g>
        )}
        {cells.map((i) => {
          const x = pad + P + i * cw, k = sashKind(i);
          const sp = k === 'v' ? 0 : 6;
          const gx = x + sp + 2, gy = y0 + sp + 2, gw = cw - 2 * sp - 4, gh = ch - 2 * sp - 4;
          return (
            <g key={i}>
              {k !== 'v' && <rect x={x + 1} y={y0 + 1} width={cw - 2} height={ch - 2} fill={colour.wood ? 'url(#wood)' : frameL} stroke={frameD} strokeWidth=".8" />}
              <rect x={gx} y={gy} width={gw} height={gh} fill={glassFill} />
              <rect x={gx} y={gy} width={gw * 0.4} height={gh} fill="url(#refl)" />
              {bars && (
                <g fill={colour.wood ? 'url(#wood)' : frame} stroke={frameD} strokeWidth=".4">
                  <rect x={gx + gw / 2 - 1.6} y={gy} width="3.2" height={gh} />
                  <rect x={gx} y={gy + gh * 0.42 - 1.6} width={gw} height="3.2" />
                </g>
              )}
              {/* opening symbols */}
              {(k === 'dr' || k === 'dl') && (
                <g stroke="#60a5fa" strokeWidth="1.1" fill="none" strokeDasharray="5 4" opacity=".9">
                  <path d={k === 'dr' ? `M${gx + gw} ${gy} L${gx} ${gy + gh / 2} L${gx + gw} ${gy + gh}` : `M${gx} ${gy} L${gx + gw} ${gy + gh / 2} L${gx} ${gy + gh}`} />
                  {type === 'dk' && <path d={`M${gx} ${gy + gh} L${gx + gw / 2} ${gy} L${gx + gw} ${gy + gh}`} />}
                </g>
              )}
              {(k === 'sl' || k === 'sr') && <path d={`M${gx + gw * 0.25} ${gy + gh / 2} L${gx + gw * 0.75 + 30} ${gy + gh / 2}`} stroke="#60a5fa" strokeWidth="2" markerEnd="url(#arr)" />}
              {k === 'v' && type !== 'hst' && <text x={gx + gw / 2} y={gy + gh / 2 + 4} textAnchor="middle" fontSize="11" fill="#e2e8f0" opacity=".7">V</text>}
              {/* handle */}
              {(k === 'dr' || k === 'dl' || k === 'sl') && (
                <rect x={k === 'dl' ? x + cw - 10 : x + 5} y={y0 + ch / 2 - 12} width="4" height="24" rx="2" fill="#d4d8de" stroke="#6b7280" strokeWidth=".5" />
              )}
              {i > 0 && <rect x={x - 3} y={y0} width="6" height={ch} fill={colour.wood ? 'url(#wood)' : frame} stroke={frameD} strokeWidth=".8" />}
            </g>
          );
        })}
        {/* dimension lines */}
        <g stroke="#94a3b8" strokeWidth=".8" fill="#cbd5e1" fontSize="11" fontFamily="ui-monospace,monospace">
          <path d={`M${pad} ${pad + H + 18} H${pad + W}`} markerStart="url(#arr)" markerEnd="url(#arr)" />
          <text x={pad + W / 2} y={pad + H + 34} textAnchor="middle" stroke="none">{w * 10} mm</text>
          <path d={`M${pad + W + 18} ${pad} V${pad + H}`} markerStart="url(#arr)" markerEnd="url(#arr)" />
          <text x={pad + W + 26} y={pad + H / 2} stroke="none" transform={`rotate(90 ${pad + W + 26} ${pad + H / 2})`} textAnchor="middle">{h * 10} mm</text>
        </g>
        <text x={pad} y={pad - 14} fontSize="11" fill="#94a3b8">{colour.ral ?? colour.name[lang]}</text>
      </svg>
    );
  },
);
Elevation.displayName = 'Elevation';

export const Configurator = ({ lang }: { lang: Language }) => {
  const [type, setType] = useState<TypeId>('dk');
  const [n, setN] = useState(2);
  const [top, setTop] = useState(false);
  const [bars, setBars] = useState(false);
  const [colourId, setColourId] = useState('antra');
  const [glass, setGlass] = useState('hrpp');
  const [w, setW] = useState(140);
  const [h, setH] = useState(150);
  const svgRef = useRef<SVGSVGElement>(null);
  const { has, toggle } = useQuote();
  const colour = COLOURS.find((c) => c.id === colourId)!;
  const t = (k: string) => TX[k][lang];

  const pickType = (id: TypeId) => {
    setType(id);
    if (id === 'deur') { setW(Math.max(w, 150)); setH(Math.max(h, 210)); setN(2); }
    if (id === 'hst') { setW(Math.max(w, 260)); setH(Math.max(h, 220)); setN(2); setTop(false); }
  };

  const summary = useMemo(() => `${TYPES.find((x) => x.id === type)!.name[lang]} · ${n} ${n === 1 ? t('section') : t('sections')}${top ? ` + ${t('top').toLowerCase()}` : ''} · ${colour.name[lang]} · ${GLASS.find((g) => g.id === glass)!.name[lang]} · ${w}×${h} cm`, [type, n, top, colour, glass, w, h, lang]); // eslint-disable-line react-hooks/exhaustive-deps
  const added = has(summary);

  const add = () => {
    if (!added && svgRef.current) {
      const xml = new XMLSerializer().serializeToString(svgRef.current);
      const url = `data:image/svg+xml;utf8,${encodeURIComponent(xml)}`;
      flyToQuote(svgRef.current as unknown as HTMLElement, url);
    }
    toggle(summary);
  };

  const Pill = ({ on, onClick, children, id }: { on: boolean; onClick: () => void; children: React.ReactNode; id: string }) => (
    <button onClick={onClick} aria-pressed={on} className={`relative rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${on ? 'border-transparent text-white' : 'border-white/10 text-zinc-400 hover:text-white'}`}>
      {on && <motion.span layoutId={id} className="absolute inset-0 rounded-full bg-[var(--blue)]" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
      <span className="relative">{children}</span>
    </button>
  );
  const Label = ({ children }: { children: React.ReactNode }) => <div className="mb-2 text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{children}</div>;

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 max-w-3xl px-2 md:px-0">
          <Eyebrow>{t('kicker')}</Eyebrow>
          <SplitText key={`${lang}-cfg`} text={t('title')} className="font-display mt-6 text-4xl font-extrabold leading-[0.95] tracking-tight md:text-7xl" />
          <Reveal><p className="mt-6 text-lg leading-relaxed text-zinc-400">{t('intro')}</p></Reveal>
        </div>
        <div className="grid gap-6 lg:grid-cols-[1.25fr_1fr]">
          <Reveal>
            <div className="relative flex aspect-[5/4] items-center justify-center overflow-hidden rounded-[28px] border border-white/10 p-6"
              style={{ background: 'radial-gradient(ellipse at 50% 35%, #1c2433, #0b0d12 70%)' }}>
              <div className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black/50 to-transparent" />
              <Float amp={8} duration={6}>
                <TiltCard className="rounded-xl" max={10}>
                  <div className="h-[min(56vw,420px)] w-[min(70vw,520px)]">
                    <AnimatePresence mode="popLayout">
                      <motion.div key={`${type}-${n}-${top}`} className="h-full w-full" initial={{ opacity: 0, scale: 0.94, rotateY: -20 }} animate={{ opacity: 1, scale: 1, rotateY: 0 }} exit={{ opacity: 0, scale: 0.96 }} transition={{ type: 'spring', stiffness: 160, damping: 20 }}>
                        <Elevation ref={svgRef} type={type} n={n} top={top} bars={bars} colour={colour} glass={glass} w={w} h={h} lang={lang} />
                      </motion.div>
                    </AnimatePresence>
                  </div>
                </TiltCard>
              </Float>
              <p className="absolute bottom-3 left-4 right-4 text-center text-[11px] text-zinc-500">{t('note')}</p>
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <div className="flex h-full flex-col gap-5 rounded-[28px] border border-white/10 bg-[var(--panel)] p-6 md:p-8">
              <div><Label>{t('type')}</Label><div className="flex flex-wrap gap-2">{TYPES.map((x) => <Pill key={x.id} id="cfg-type" on={type === x.id} onClick={() => pickType(x.id)}>{x.name[lang]}</Pill>)}</div></div>
              <div>
                <Label>{t('layout')}</Label>
                <div className="flex flex-wrap items-center gap-2">
                  {[1, 2, 3].map((k) => <Pill key={k} id="cfg-n" on={n === k} onClick={() => setN(k)}>{k} {k === 1 ? t('section') : t('sections')}</Pill>)}
                  <button onClick={() => setTop((v) => !v)} aria-pressed={top} disabled={type === 'hst'} className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors disabled:opacity-30 ${top ? 'border-[var(--blue-bright)] text-white' : 'border-white/10 text-zinc-400'}`}>{t('top')}</button>
                  <button onClick={() => setBars((v) => !v)} aria-pressed={bars} className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${bars ? 'border-[var(--blue-bright)] text-white' : 'border-white/10 text-zinc-400'}`}>{t('bars')}</button>
                </div>
              </div>
              <div>
                <Label>{t('colour')} · <span className="normal-case tracking-normal text-zinc-300">{colour.name[lang]}{colour.ral ? ` (${colour.ral})` : ''}</span></Label>
                <div className="flex flex-wrap gap-3">
                  {COLOURS.map((c) => (
                    <button key={c.id} onClick={() => setColourId(c.id)} aria-label={c.name[lang]} aria-pressed={colourId === c.id}
                      className={`h-10 w-10 rounded-full border-2 transition-transform hover:scale-110 ${colourId === c.id ? 'scale-110 border-[var(--blue-bright)] shadow-[0_0_0_4px_rgba(59,130,246,0.25)]' : 'border-white/20'}`}
                      style={{ background: c.wood ? `repeating-linear-gradient(170deg, ${c.hex}, ${c.hex} 4px, ${shade(c.hex, 0.8)} 5px, ${c.hex} 7px)` : c.hex }} />
                  ))}
                </div>
              </div>
              <div><Label>{t('glass')}</Label><div className="flex flex-wrap gap-2">{GLASS.map((g) => <Pill key={g.id} id="cfg-glass" on={glass === g.id} onClick={() => setGlass(g.id)}>{g.name[lang]} <span className="text-xs opacity-60">{g.u}</span></Pill>)}</div></div>
              <div>
                <Label><Ruler size={12} className="mr-1 inline" />{t('size')}</Label>
                {[[t('width'), w, setW, 50, 400] as const, [t('height'), h, setH, 50, 260] as const].map(([lab, val, set, min, max]) => (
                  <div key={lab} className="mb-2">
                    <div className="flex justify-between text-sm text-zinc-400"><span>{lab}</span><span className="font-mono text-white">{val} cm</span></div>
                    <input type="range" min={min} max={max} step={5} value={val} onChange={(e) => set(+e.target.value)} className="w-full accent-[var(--blue-bright)]" aria-label={lab} />
                  </div>
                ))}
              </div>
              <div className="mt-auto rounded-2xl bg-black/30 p-4 text-sm text-zinc-300">{summary}</div>
              <button onClick={add} aria-pressed={added}
                className={`flex items-center justify-center gap-2 rounded-2xl py-4 font-bold transition-colors ${added ? 'bg-emerald-600 text-white' : 'bg-[var(--blue)] text-white shadow-[0_15px_40px_var(--blue-glow)] hover:bg-[var(--blue-bright)]'}`}>
                {added ? <Check size={18} /> : <Plus size={18} />} {added ? t('added') : t('add')}
              </button>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
