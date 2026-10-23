import React, { useEffect, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useScroll, useSpring, useTransform } from 'motion/react';
import { Lock, Wind, DoorOpen, Volume2, Car, Clock } from 'lucide-react';
import type { Language } from '../translations';
import { Reveal, SplitText } from '../fx/core';
import { Eyebrow } from './Shared';

type L = Record<Language, string>;

/* ================================================================== */
/* Draai-kiep handle demo                                              */
/* ================================================================== */

const DK: Record<string, L> = {
  kicker: { nl: 'Draai-kiep', en: 'Tilt & turn', pl: 'Uchylno-rozwierne' },
  title: { nl: 'Eén greep, drie standen', en: 'One handle, three positions', pl: 'Jedna klamka, trzy pozycje' },
  hint: { nl: 'Klik op de greep of kies een stand', en: 'Click the handle or pick a position', pl: 'Kliknij klamkę albo wybierz pozycję' },
  s0: { nl: 'Dicht', en: 'Closed', pl: 'Zamknięte' },
  s1: { nl: 'Draaien', en: 'Turn', pl: 'Rozwarcie' },
  s2: { nl: 'Kiepen', en: 'Tilt', pl: 'Uchylenie' },
  d0: { nl: 'Greep naar beneden: het raam zit rondom vast in het kozijn — wind- en waterdicht en inbraakwerend.', en: 'Handle down: the sash is locked all round in the frame — wind- and watertight and burglar resistant.', pl: 'Klamka w dół: skrzydło zablokowane dookoła w ramie — szczelne i antywłamaniowe.' },
  d1: { nl: 'Greep horizontaal: het raam draait helemaal open naar binnen. Ideaal om te luchten en de buitenkant schoon te maken.', en: 'Handle horizontal: the sash swings fully open inwards. Ideal for airing and cleaning the outside.', pl: 'Klamka poziomo: skrzydło otwiera się całkowicie do środka. Idealne do wietrzenia i mycia szyby z zewnątrz.' },
  d2: { nl: 'Greep omhoog: het raam kiept bovenaan een paar centimeter naar binnen. Zo ventileert u veilig, ook als het regent.', en: 'Handle up: the sash tilts in a few centimetres at the top, for safe ventilation even when it rains.', pl: 'Klamka do góry: skrzydło uchyla się u góry o kilka centymetrów. Bezpieczne wietrzenie, nawet gdy pada.' },
};

export const DraaiKiep = ({ lang }: { lang: Language }) => {
  const [s, setS] = useState(0);
  const t = (k: string) => DK[k][lang];
  const icons = [Lock, DoorOpen, Wind];
  const handleAngle = s * 90;
  return (
    <div className="flex h-full flex-col rounded-[28px] border border-white/10 bg-[var(--panel)] p-6 md:p-8">
      <Eyebrow>{t('kicker')}</Eyebrow>
      <h3 className="font-display mt-5 text-3xl font-extrabold tracking-tight md:text-4xl">{t('title')}</h3>
      <p className="mt-2 text-sm text-zinc-500">{t('hint')}</p>
      <div className="relative mx-auto mt-6 flex aspect-[4/5] w-full max-w-[320px] items-center justify-center" style={{ perspective: 900 }}>
        {/* outside view */}
        <div className="absolute inset-[9%] overflow-hidden rounded-sm" style={{ background: 'linear-gradient(180deg,#7fb2e5 0%,#c9def0 55%,#7a8f6a 56%,#5f7552 100%)' }}>
          <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
            <path d="M0 56 L8 40 L16 56 M20 56 V36 H38 V56 M44 56 L56 30 L68 56 M72 56 V42 H96 V56" fill="#55606e" opacity=".55" />
          </svg>
          {s > 0 && (
            <div className="absolute inset-0">
              {[0, 1, 2, 3].map((i) => (
                <motion.div key={i} className="absolute h-[2px] w-10 rounded-full bg-white/80" style={{ top: `${s === 2 ? 8 + i * 4 : 25 + i * 15}%`, left: '-20%' }}
                  animate={{ x: ['0%', '700%'], opacity: [0, 1, 0] }} transition={{ duration: 2.2, delay: i * 0.4, repeat: Infinity, ease: 'easeInOut' }} />
              ))}
            </div>
          )}
        </div>
        {/* frame */}
        <div className="absolute inset-0 rounded-md border-[14px] border-[#eceae4] shadow-[0_30px_60px_rgba(0,0,0,0.5)]" style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.2), 0 30px 60px rgba(0,0,0,.5)' }} />
        {/* sash */}
        <motion.div
          className="absolute inset-[5%]"
          style={{ transformStyle: 'preserve-3d', transformOrigin: s === 2 ? '50% 100%' : '0% 50%' }}
          animate={{ rotateY: s === 1 ? -62 : 0, rotateX: s === 2 ? -11 : 0 }}
          transition={{ type: 'spring', stiffness: 70, damping: 14 }}
        >
          <div className="absolute inset-0 rounded-sm border-[16px] border-[#f6f5f1] bg-gradient-to-br from-sky-200/20 via-transparent to-sky-900/20" style={{ boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.15), 0 10px 30px rgba(0,0,0,.35)' }}>
            <div className="absolute -inset-y-6 left-[-30%] w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          </div>
          {/* handle */}
          <button
            onClick={() => setS((v) => (v + 1) % 3)}
            aria-label={`${t('s0')} / ${t('s1')} / ${t('s2')}`}
            className="absolute right-[2px] top-1/2 h-16 w-10 -translate-y-1/2 cursor-pointer"
          >
            <span className="absolute left-1/2 top-1/2 h-6 w-4 -translate-x-1/2 -translate-y-1/2 rounded-md bg-gradient-to-b from-zinc-100 to-zinc-400 shadow" />
            <motion.span
              className="absolute left-1/2 top-1/2 block h-12 w-[10px] -translate-x-1/2 rounded-full bg-gradient-to-r from-zinc-200 via-white to-zinc-400 shadow-md"
              style={{ transformOrigin: '50% 8%' }}
              animate={{ rotate: handleAngle }}
              transition={{ type: 'spring', stiffness: 200, damping: 14 }}
            />
            <span className="absolute -inset-2 animate-ping rounded-full border border-[var(--blue-bright)]/50" />
          </button>
        </motion.div>
      </div>
      <div className="mt-6 grid grid-cols-3 gap-2">
        {[0, 1, 2].map((i) => {
          const Icon = icons[i];
          return (
            <button key={i} onClick={() => setS(i)} aria-pressed={s === i}
              className={`flex flex-col items-center gap-1 rounded-2xl border px-2 py-3 text-xs font-bold transition-colors ${s === i ? 'border-[var(--blue-bright)] bg-[var(--blue)]/20 text-white' : 'border-white/10 text-zinc-400 hover:text-white'}`}>
              <Icon size={18} />{t(`s${i}`)}<span className="font-mono text-[10px] opacity-60">{i * 90}°</span>
            </button>
          );
        })}
      </div>
      <motion.p key={s} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="mt-4 min-h-[4.5em] text-sm leading-relaxed text-zinc-300">{t(`d${s}`)}</motion.p>
    </div>
  );
};

/* ================================================================== */
/* Acoustic insulation — sound waves through different glazing         */
/* ================================================================== */

const AC: Record<string, L> = {
  kicker: { nl: 'Geluidsisolatie', en: 'Sound insulation', pl: 'Izolacja akustyczna' },
  title: { nl: 'Hoor het verschil', en: 'Hear the difference', pl: 'Usłysz różnicę' },
  outside: { nl: 'Drukke straat', en: 'Busy street', pl: 'Ruchliwa ulica' },
  inside: { nl: 'Binnen', en: 'Inside', pl: 'W środku' },
  rule: { nl: 'Vuistregel: 10 dB minder klinkt ongeveer half zo hard.', en: 'Rule of thumb: 10 dB less sounds about half as loud.', pl: 'Zasada: 10 dB mniej brzmi mniej więcej o połowę ciszej.' },
  note: { nl: 'Indicatieve waarden (Rw) voor het glas; de totale isolatie hangt ook af van kozijn, aansluitingen en ventilatieroosters.', en: 'Indicative Rw values for the glass; total insulation also depends on frame, joints and trickle vents.', pl: 'Orientacyjne wartości Rw dla szyb; całkowita izolacja zależy też od ramy, połączeń i nawiewników.' },
};
const ACG: { id: string; name: L; rw: number; panes: number }[] = [
  { id: 'enkel', name: { nl: 'Enkel glas', en: 'Single glass', pl: 'Pojedyncza' }, rw: 26, panes: 1 },
  { id: 'dubbel', name: { nl: 'HR++', en: 'HR++', pl: 'HR++' }, rw: 32, panes: 2 },
  { id: 'triple', name: { nl: 'HR+++', en: 'HR+++', pl: 'HR+++' }, rw: 34, panes: 3 },
  { id: 'geluid', name: { nl: 'Geluidwerend', en: 'Acoustic', pl: 'Akustyczna' }, rw: 41, panes: 2 },
];
const OUT_DB = 72;

export const Acoustic = ({ lang }: { lang: Language }) => {
  const [g, setG] = useState(ACG[0]);
  const ref = useRef<HTMLCanvasElement>(null);
  const gRef = useRef(g); gRef.current = g;
  const t = (k: string) => AC[k][lang];
  const inside = OUT_DB - g.rw;

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    let raf = 0, visible = true, amp = 1;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(c);
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const resize = () => { c.width = c.clientWidth * dpr; c.height = c.clientHeight * dpr; };
    resize(); const ro = new ResizeObserver(resize); ro.observe(c);
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const W = c.width, H = c.height, s = dpr, cur = gRef.current;
      const target = Math.max(0.06, 1 - (cur.rw - 18) / 28);
      amp += (target - amp) * 0.06;
      ctx.clearRect(0, 0, W, H);
      const wx = W * 0.55, cy = H * 0.5;
      // waves outside (full) and inside (damped)
      for (let k = 0; k < 3; k++) {
        ctx.beginPath();
        for (let x = 0; x <= W; x += 3 * s) {
          const inside2 = x > wx;
          const a = (inside2 ? amp : 1) * H * 0.16 * (1 - k * 0.25);
          const y = cy + Math.sin(x / (22 * s) - now / 180 + k * 0.9) * a * (inside2 ? Math.exp(-(x - wx) / (W * 0.6)) : 1);
          if (x === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        }
        ctx.strokeStyle = k === 0 ? 'rgba(96,165,250,.95)' : `rgba(96,165,250,${0.45 - k * 0.12})`;
        ctx.lineWidth = (k === 0 ? 2.5 : 1.5) * s; ctx.stroke();
      }
      // window: panes
      const gap = 7 * s;
      for (let p = 0; p < cur.panes; p++) {
        const x = wx - ((cur.panes - 1) * gap) / 2 + p * gap;
        const gr = ctx.createLinearGradient(x - 2 * s, 0, x + 2 * s, 0); gr.addColorStop(0, 'rgba(200,230,255,.2)'); gr.addColorStop(.5, 'rgba(220,240,255,.9)'); gr.addColorStop(1, 'rgba(200,230,255,.2)');
        ctx.fillStyle = gr; ctx.fillRect(x - (cur.id === 'geluid' && p === 0 ? 3 : 1.5) * s, H * 0.12, (cur.id === 'geluid' && p === 0 ? 6 : 3) * s, H * 0.76);
      }
      ctx.fillStyle = '#eceae4'; ctx.fillRect(wx - 16 * s, H * 0.08, 32 * s, H * 0.05); ctx.fillRect(wx - 16 * s, H * 0.87, 32 * s, H * 0.05);
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); io.disconnect(); ro.disconnect(); };
  }, []);

  return (
    <div className="flex h-full flex-col rounded-[28px] border border-white/10 bg-[var(--panel)] p-6 md:p-8">
      <Eyebrow>{t('kicker')}</Eyebrow>
      <h3 className="font-display mt-5 text-3xl font-extrabold tracking-tight md:text-4xl">{t('title')}</h3>
      <div className="relative mt-6 overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-r from-[#141a24] via-[#10141c] to-[#0c0f15]">
        <canvas ref={ref} className="block h-52 w-full md:h-60" aria-hidden />
        <div className="absolute left-3 top-3 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs text-zinc-300"><Car size={14} />{t('outside')} · <b className="font-mono text-white">{OUT_DB} dB</b></div>
        <div className="absolute right-3 top-3 flex items-center gap-2 rounded-full bg-black/50 px-3 py-1 text-xs text-zinc-300"><Volume2 size={14} />{t('inside')} · <motion.b key={inside} initial={{ scale: 1.4, color: '#60a5fa' }} animate={{ scale: 1, color: '#ffffff' }} className="font-mono">{inside} dB</motion.b></div>
        {/* VU meter */}
        <div className="absolute bottom-3 right-3 flex h-24 items-end gap-1">
          {Array.from({ length: 12 }, (_, i) => {
            const on = i < Math.round((inside / OUT_DB) * 12);
            return <motion.span key={i} className="w-2 rounded-sm" style={{ height: `${20 + i * 6}%` }} animate={{ backgroundColor: on ? (i > 8 ? '#ef4444' : i > 5 ? '#f59e0b' : '#22c55e') : 'rgba(255,255,255,.08)' }} />;
          })}
        </div>
      </div>
      <div className="mt-5 grid grid-cols-2 gap-2 sm:grid-cols-4">
        {ACG.map((x) => (
          <button key={x.id} onClick={() => setG(x)} aria-pressed={g.id === x.id}
            className={`rounded-2xl border px-3 py-3 text-left transition-colors ${g.id === x.id ? 'border-[var(--blue-bright)] bg-[var(--blue)]/20' : 'border-white/10 hover:border-white/30'}`}>
            <div className="text-sm font-bold">{x.name[lang]}</div>
            <div className="font-mono text-xs text-zinc-400">Rw ≈ {x.rw} dB</div>
          </button>
        ))}
      </div>
      <p className="mt-4 text-sm text-zinc-300">{t('rule')}</p>
      <p className="mt-2 text-xs leading-relaxed text-zinc-500">{t('note')}</p>
    </div>
  );
};

export const ComfortDemos = ({ lang }: { lang: Language }) => (
  <section className="relative py-24 md:py-32">
    <div className="mx-auto max-w-7xl px-4 md:px-6">
      <div className="grid gap-6 lg:grid-cols-2">
        <Reveal className="h-full"><DraaiKiep lang={lang} /></Reveal>
        <Reveal delay={0.1} className="h-full"><Acoustic lang={lang} /></Reveal>
      </div>
    </div>
  </section>
);

/* ================================================================== */
/* A montage day — scroll-driven clock and house                       */
/* ================================================================== */

const MD: Record<string, L> = {
  kicker: { nl: 'Een montagedag', en: 'An installation day', pl: 'Dzień montażu' },
  title: { nl: 'Van 07:30 tot 17:00 — zo verloopt de dag', en: 'From 07:30 to 17:00 — how the day goes', pl: 'Od 07:30 do 17:00 — tak wygląda dzień' },
  example: { nl: 'Voorbeeld: woning met 4 ramen. Wij vervangen raam voor raam, zodat uw huis nooit lang open staat.', en: 'Example: a home with 4 windows. We replace one window at a time, so your home is never open for long.', pl: 'Przykład: dom z 4 oknami. Wymieniamy okno po oknie, więc dom nigdy nie stoi długo otwarty.' },
};
type Ev = { at: number; title: L; text: L };
const h = (hh: number, mm = 0) => (hh - 7.5) * 60 + mm; // minutes since 07:30
const EVENTS: Ev[] = [
  { at: h(7, 30), title: { nl: 'Aankomst en afdekken', en: 'Arrival and protection', pl: 'Przyjazd i zabezpieczenie' }, text: { nl: 'Wij dekken vloeren en meubels af en bespreken de dag met u.', en: 'We cover floors and furniture and go through the day with you.', pl: 'Zabezpieczamy podłogi i meble i omawiamy z Tobą plan dnia.' } },
  { at: h(8), title: { nl: 'Raam 1 en 2', en: 'Windows 1 and 2', pl: 'Okna 1 i 2' }, text: { nl: 'Oud kozijn eruit, nieuw kozijn erin — per raam is de opening hooguit een uur open.', en: 'Old frame out, new frame in — each opening is open for an hour at most.', pl: 'Stara rama wychodzi, nowa wchodzi — każdy otwór jest otwarty najwyżej godzinę.' } },
  { at: h(10, 30), title: { nl: 'Koffie', en: 'Coffee', pl: 'Kawa' }, text: { nl: 'Korte pauze — alle openingen zijn dicht.', en: 'Short break — all openings are closed.', pl: 'Krótka przerwa — wszystkie otwory są zamknięte.' } },
  { at: h(10, 45), title: { nl: 'Raam 3', en: 'Window 3', pl: 'Okno 3' }, text: { nl: 'Dezelfde werkwijze: één voor één, zodat er weinig warmte verloren gaat.', en: 'Same routine: one by one, so little heat is lost.', pl: 'Ten sam sposób: jedno po drugim, żeby uciekło mało ciepła.' } },
  { at: h(12), title: { nl: 'Lunchpauze', en: 'Lunch break', pl: 'Przerwa obiadowa' }, text: { nl: 'Raam 1 t/m 3 zitten erin en alles is dicht. Na de lunch volgt raam 4.', en: 'Windows 1 to 3 are in and everything is closed. Window 4 follows after lunch.', pl: 'Okna 1–3 są już zamontowane i wszystko zamknięte. Po obiedzie okno 4.' } },
  { at: h(12, 30), title: { nl: 'Raam 4', en: 'Window 4', pl: 'Okno 4' }, text: { nl: 'Het laatste kozijn gaat erin.', en: 'The last frame goes in.', pl: 'Montujemy ostatnią ramę.' } },
  { at: h(13, 45), title: { nl: 'Beglazen en afstellen', en: 'Glazing and adjusting', pl: 'Szklenie i regulacja' }, text: { nl: 'Het isolatieglas gaat erin, ramen worden afgehangen en afgesteld.', en: 'The insulating glass goes in, sashes are hung and adjusted.', pl: 'Wstawiamy szyby zespolone, wieszamy i regulujemy skrzydła.' } },
  { at: h(15), title: { nl: 'Afkitten en afwerken', en: 'Sealing and finishing', pl: 'Uszczelnianie i wykończenie' }, text: { nl: 'Buiten kitten we af, binnen werken we de dagkanten en vensterbanken af.', en: 'Outside we seal, inside we finish the reveals and sills.', pl: 'Na zewnątrz uszczelniamy, w środku wykańczamy ościeża i parapety.' } },
  { at: h(16, 15), title: { nl: 'Opruimen en oplevering', en: 'Clean-up and handover', pl: 'Sprzątanie i odbiór' }, text: { nl: 'Alles wordt schoongemaakt. Samen lopen we de ramen na en u krijgt uitleg over het gebruik.', en: 'Everything is cleaned. We check the windows together and explain how to use them.', pl: 'Wszystko sprzątamy. Razem sprawdzamy okna i tłumaczymy obsługę.' } },
];
const TOTAL = h(17);
const SLOTS = [[h(8), h(9, 15)], [h(9, 15), h(10, 30)], [h(10, 45), h(12)], [h(12, 30), h(13, 45)]];

const fmt = (m: number) => { const t = 7.5 * 60 + m; const hh = Math.floor(t / 60), mm = Math.floor(t % 60); return `${String(hh).padStart(2, '0')}:${String(mm).padStart(2, '0')}`; };

export const MontageDay = ({ lang }: { lang: Language }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 90, damping: 24 });
  const [min, setMin] = useState(0);
  useMotionValueEvent(p, 'change', (v) => setMin(Math.max(0, Math.min(TOTAL, v * TOTAL))));
  const hourAngle = useTransform(p, (v) => ((7.5 + (v * TOTAL) / 60) % 12) * 30);
  const minAngle = useTransform(p, (v) => ((v * TOTAL + 30) % 60) * 6);
  const sunX = useTransform(p, [0, 1], ['8%', '86%']);
  const sunY = useTransform(p, (v) => `${42 - Math.sin(v * Math.PI) * 30}%`);
  const sky = useTransform(p, [0, 0.5, 1], ['linear-gradient(180deg,#f6b26b,#7fa7d9)', 'linear-gradient(180deg,#5aa0e6,#bcd8f2)', 'linear-gradient(180deg,#f08a4b,#6d7fb3)']);
  const ev = [...EVENTS].reverse().find((e) => min >= e.at) ?? EVENTS[0];
  const evIdx = EVENTS.indexOf(ev);
  const t = (k: string) => MD[k][lang];

  const winState = (i: number) => {
    const [a, b] = SLOTS[i];
    if (min < a) return 'old';
    if (min < a + 25) return 'open';
    if (min < b) return 'frame';
    if (min < h(13, 45) + i * 15) return 'frame';
    if (min < h(15)) return 'glass';
    return 'done';
  };
  const W = [[60, 70], [180, 70], [60, 170], [180, 170]];

  return (
    <section ref={ref} className="relative" style={{ height: '320vh' }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-4 md:px-6 lg:grid-cols-[1fr_1.1fr]">
          <div className="order-2 lg:order-1">
            <Eyebrow><Clock size={12} className="mr-1 inline" />{t('kicker')}</Eyebrow>
            <SplitText key={`${lang}-day`} text={t('title')} className="font-display mt-5 text-3xl font-extrabold leading-[0.95] tracking-tight md:text-6xl" />
            <p className="mt-4 text-sm text-zinc-500">{t('example')}</p>
            <div className="mt-6 flex items-center gap-5">
              <svg viewBox="0 0 100 100" className="h-24 w-24 shrink-0 md:h-28 md:w-28">
                <circle cx="50" cy="50" r="46" fill="#0b0d12" stroke="rgba(255,255,255,.15)" strokeWidth="2" />
                {Array.from({ length: 12 }, (_, i) => <line key={i} x1="50" y1="8" x2="50" y2={i % 3 ? 13 : 16} stroke="#94a3b8" strokeWidth={i % 3 ? 1 : 2} transform={`rotate(${i * 30} 50 50)`} />)}
                <motion.line x1="50" y1="50" x2="50" y2="26" stroke="#fff" strokeWidth="4" strokeLinecap="round" style={{ rotate: hourAngle, transformOrigin: '50px 50px' }} />
                <motion.line x1="50" y1="50" x2="50" y2="14" stroke="#3b82f6" strokeWidth="2.5" strokeLinecap="round" style={{ rotate: minAngle, transformOrigin: '50px 50px' }} />
                <circle cx="50" cy="50" r="3" fill="#3b82f6" />
              </svg>
              <div>
                <div className="font-display font-mono text-5xl font-extrabold tabular-nums md:text-6xl">{fmt(min)}</div>
                <div className="mt-1 text-xs font-bold uppercase tracking-[0.25em] text-zinc-500">{String(evIdx + 1).padStart(2, '0')} / {String(EVENTS.length).padStart(2, '0')}</div>
              </div>
            </div>
            <motion.div key={evIdx} initial={{ opacity: 0, y: 14, filter: 'blur(6px)' }} animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }} transition={{ duration: 0.4 }} className="mt-6 rounded-2xl border border-white/10 bg-[var(--panel)] p-5">
              <h4 className="font-display text-2xl font-bold">{ev.title[lang]}</h4>
              <p className="mt-2 text-zinc-400">{ev.text[lang]}</p>
            </motion.div>
            <div className="mt-5 h-1.5 overflow-hidden rounded-full bg-white/10">
              <motion.div className="h-full origin-left rounded-full bg-gradient-to-r from-[var(--blue)] to-[var(--steel)]" style={{ scaleX: p }} />
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <motion.div className="relative mx-auto aspect-[4/3] w-full max-w-[560px] overflow-hidden rounded-[28px] border border-white/10" style={{ background: sky }}>
              <motion.div className="absolute h-14 w-14 rounded-full bg-yellow-200 shadow-[0_0_60px_20px_rgba(253,224,71,.5)]" style={{ left: sunX, top: sunY }} />
              <svg viewBox="0 0 300 240" className="absolute inset-x-0 bottom-0 h-[88%] w-full">
                <rect x="0" y="228" width="300" height="12" fill="#4b5563" />
                <path d="M30 100 L150 30 L270 100 Z" fill="#3a3d42" />
                <rect x="40" y="100" width="220" height="128" fill="#8a3b24" />
                {Array.from({ length: 16 }, (_, r) => <line key={r} x1="40" x2="260" y1={100 + r * 8} y2={100 + r * 8} stroke="rgba(0,0,0,.18)" />)}
                <rect x="128" y="160" width="44" height="68" fill="#1f3a5f" />
                {W.map(([x, y], i) => {
                  const st = winState(i);
                  return (
                    <g key={i}>
                      {st === 'old' && <><rect x={x} y={y} width="60" height="48" fill="#e7e0cf" /><rect x={x + 5} y={y + 5} width="50" height="38" fill="#9fb6a3" opacity=".7" /><line x1={x + 30} x2={x + 30} y1={y + 5} y2={y + 43} stroke="#e7e0cf" strokeWidth="3" /></>}
                      {st === 'open' && <><rect x={x} y={y} width="60" height="48" fill="#1a1a1a" /><rect x={x} y={y} width="60" height="48" fill="rgba(200,220,255,.25)" stroke="#93c5fd" strokeDasharray="3 3" /></>}
                      {(st === 'frame' || st === 'glass' || st === 'done') && <rect x={x} y={y} width="60" height="48" fill="#383e42" />}
                      {st === 'frame' && <rect x={x + 5} y={y + 5} width="50" height="38" fill="#1a1a1a" />}
                      {(st === 'glass' || st === 'done') && <><rect x={x + 5} y={y + 5} width="50" height="38" fill="#6f93b3" /><rect x={x + 5} y={y + 5} width="18" height="38" fill="rgba(255,255,255,.25)" /></>}
                      {st === 'done' && <rect x={x - 1.5} y={y - 1.5} width="63" height="51" fill="none" stroke="#9ca3af" strokeWidth="1.5" />}
                      {st === 'open' && <motion.circle cx={x + 30} cy={y + 24} r="5" fill="#3b82f6" style={{ transformBox: 'fill-box', transformOrigin: 'center' }} animate={{ scale: [1, 1.8, 1], opacity: [1, .4, 1] }} transition={{ repeat: Infinity, duration: 1 }} />}
                    </g>
                  );
                })}
                {/* van */}
                <g transform={`translate(${min < h(16, 45) ? 6 : 6 - (min - h(16, 45)) * 3},196)`}>
                  <rect width="34" height="22" rx="3" fill="#f3f4f6" /><rect x="34" y="8" width="12" height="14" rx="2" fill="#f3f4f6" /><rect x="36" y="10" width="8" height="6" fill="#93c5fd" />
                  <rect x="3" y="8" width="26" height="4" fill="#2563eb" /><circle cx="9" cy="24" r="4" fill="#111" /><circle cx="38" cy="24" r="4" fill="#111" />
                </g>
              </svg>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
};
