import { useEffect, useRef, useState } from 'react';
import {
  animate, motion, useInView, useMotionTemplate, useMotionValue, useMotionValueEvent,
  useReducedMotion, useScroll, useSpring, useTransform,
} from 'motion/react';
import { ArrowDown, ArrowRight, MapPin, ChevronsLeftRight } from 'lucide-react';
import type { Language } from '../translations';
import { translations } from '../translations';
import { asset, EASE, Reveal, SplitText } from '../fx/core';
import { TLink } from '../fx/nav';
import { serviceImages } from '../data';
import { Eyebrow, GhostButton, PrimaryButton } from './Shared';

type L = Record<Language, string>;
const useMedia = (q: string) => {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => { const mq = window.matchMedia(q); const on = () => setM(mq.matches); on(); mq.addEventListener?.('change', on); return () => mq.removeEventListener?.('change', on); }, [q]);
  return m;
};

/* ================================================================== */
/* Cinematic hero: full-bleed photo that shrinks into a card on scroll */
/* ================================================================== */

const HX: Record<string, L> = {
  place: { nl: 'Zoetermeer · Zuid-Holland', en: 'Zoetermeer · South Holland', pl: 'Zoetermeer · Holandia Płd.' },
  scroll: { nl: 'Scroll', en: 'Scroll', pl: 'Przewiń' },
  caption: { nl: 'Gevelbekleding & kozijnen — recent project', en: 'Cladding & frames — recent project', pl: 'Elewacja i okna — niedawna realizacja' },
};

export const CinemaHero = ({ lang }: { lang: Language }) => {
  const t = translations[lang].hero;
  const u = translations[lang].ui;
  const ref = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end start'] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const inset = useTransform(p, [0, 0.6], [0, 6]);
  const radius = useTransform(p, [0, 0.6], [0, 36]);
  const clip = useMotionTemplate`inset(${inset}% ${inset}% 0% ${inset}% round ${radius}px)`;
  const imgScale = useTransform(p, [0, 1], [1.08, 1.22]);
  const textY = useTransform(p, [0, 0.3], [0, -60]);
  const textO = useTransform(p, [0, 0.22], [1, 0]);
  const shade = useTransform(p, [0.05, 0.6], [0, 0.35]);

  return (
    <section ref={ref} className="relative h-[170svh]">
      <div className="sticky top-0 h-[100svh] overflow-hidden">
        <motion.div className="absolute inset-0"
          initial={reduce ? false : { clipPath: 'inset(100% 0% 0% 0%)' }}
          animate={reduce ? undefined : { clipPath: 'inset(0% 0% 0% 0%)' }}
          transition={{ duration: 1.4, ease: [0.76, 0, 0.24, 1], delay: 0.15 }}>
        <motion.div className="absolute inset-0" style={{ clipPath: reduce ? undefined : clip }}>
          <motion.img
            src={asset('/elewacje8.jpeg')}
            alt={HX.caption[lang]}
            className="absolute inset-0 h-full w-full object-cover object-[60%_50%]"
            style={{ scale: reduce ? 1 : imgScale }}
            initial={reduce ? false : { scale: 1.35 }}
            animate={reduce ? undefined : { scale: 1.08 }}
            transition={{ duration: 2.4, ease: EASE, delay: 0.15 }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,7,10,.86)_0%,rgba(6,7,10,.55)_42%,rgba(6,7,10,.05)_75%)]" />
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gradient-to-t from-[rgba(6,7,10,.9)] to-transparent" />
          <motion.div className="absolute inset-0 bg-black" style={{ opacity: shade }} />
        </motion.div>
        </motion.div>

        <motion.div style={{ y: textY, opacity: textO }} className="relative z-10 mx-auto flex h-full max-w-7xl flex-col justify-end px-5 pb-16 md:px-6 md:pb-24">
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.8, ease: EASE }} className="mb-6 flex flex-wrap items-center gap-3">
            <Eyebrow>{u.heroBadge}</Eyebrow>
            <span className="flex items-center gap-1.5 text-xs font-semibold text-zinc-300"><MapPin size={14} className="text-[var(--blue-bright)]" />{HX.place[lang]}</span>
          </motion.div>
          <SplitText as="h1" onView={false} delay={1.0} stagger={0.07} text={t.title}
            className="font-display max-w-4xl text-[2.7rem] font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-[6.2rem]" />
          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.5, duration: 0.9, ease: EASE }}
            className="mt-6 max-w-xl text-base leading-relaxed text-zinc-300 md:text-lg">{t.subtitle}</motion.p>
          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.7, duration: 0.9, ease: EASE }}
            className="mt-8 flex flex-wrap items-center gap-3">
            <PrimaryButton to="/contact">{t.ctaPrimary}</PrimaryButton>
            <GhostButton to="/portfolio">{translations[lang].nav.portfolio}</GhostButton>
          </motion.div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 2.2 }} style={{ opacity: textO }}
          className="absolute bottom-6 right-6 z-10 hidden items-center gap-3 text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 md:flex">
          {HX.scroll[lang]}
          <span className="relative h-10 w-[2px] overflow-hidden rounded bg-white/15">
            <motion.span className="absolute inset-x-0 top-0 h-1/2 bg-white" animate={{ y: ['-100%', '200%'] }} transition={{ repeat: Infinity, duration: 1.6, ease: 'easeInOut' }} />
          </span>
          <ArrowDown size={14} />
        </motion.div>
      </div>
    </section>
  );
};

/* ================================================================== */
/* Services: pinned horizontal rail (desktop) / snap rail (mobile)     */
/* ================================================================== */

const SR: Record<string, L> = {
  kicker: { nl: 'Diensten', en: 'Services', pl: 'Usługi' },
  title: { nl: 'Alles voor ramen, deuren en gevels', en: 'Everything for windows, doors and facades', pl: 'Wszystko dla okien, drzwi i elewacji' },
  more: { nl: 'Bekijk dienst', en: 'View service', pl: 'Zobacz usługę' },
  drag: { nl: 'Swipe', en: 'Swipe', pl: 'Przesuń' },
};

export const ServicesRail = ({ lang }: { lang: Language }) => {
  const items = translations[lang].services.items;
  const desktop = useMedia('(min-width: 1024px)');
  const ref = useRef<HTMLDivElement>(null);
  const track = useRef<HTMLDivElement>(null);
  const [dist, setDist] = useState(0);
  const [idx, setIdx] = useState(0);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  const x = useTransform(p, (v) => -v * dist);
  useMotionValueEvent(p, 'change', (v) => setIdx(Math.min(items.length - 1, Math.round(v * (items.length - 1)))));

  useEffect(() => {
    const measure = () => { if (track.current) setDist(Math.max(0, track.current.scrollWidth - window.innerWidth + 48)); };
    measure(); window.addEventListener('resize', measure); return () => window.removeEventListener('resize', measure);
  }, [desktop, items.length]);

  const Card = ({ i }: { i: number }) => {
    const s = items[i];
    return (
      <TLink to="/services" className="group relative block h-full w-full overflow-hidden rounded-[28px] border border-white/10 bg-[var(--panel)]">
        <img src={serviceImages[i]} alt={s.title} loading="lazy" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1.6s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.06]" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/25 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
          <div className="font-display mb-3 text-sm font-bold text-[var(--blue-bright)]">{String(i + 1).padStart(2, '0')}</div>
          <h3 className="font-display text-2xl font-extrabold leading-tight md:text-4xl">{s.title}</h3>
          <p className="mt-3 max-w-md text-sm leading-relaxed text-zinc-300 md:text-base">{s.description}</p>
          <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-white">
            {SR.more[lang]} <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </span>
        </div>
      </TLink>
    );
  };

  const Header = (
    <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-5 md:px-6">
      <div>
        <Eyebrow>{SR.kicker[lang]}</Eyebrow>
        <SplitText key={`${lang}-sr`} text={SR.title[lang]} className="font-display mt-5 max-w-3xl text-4xl font-extrabold leading-[0.95] tracking-tight md:text-7xl" />
      </div>
      <div className="hidden font-mono text-sm text-zinc-500 md:block">
        <span className="text-2xl font-bold text-white">{String(idx + 1).padStart(2, '0')}</span> / {String(items.length).padStart(2, '0')}
      </div>
    </div>
  );

  if (!desktop) {
    return (
      <section className="py-24">
        {Header}
        <div className="mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 [scrollbar-width:none]" data-lenis-prevent>
          {items.map((_, i) => <div key={i} className="h-[62svh] w-[82vw] shrink-0 snap-center"><Card i={i} /></div>)}
        </div>
        <p className="mt-3 px-5 text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">{SR.drag[lang]} →</p>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative" style={{ height: `${items.length * 55 + 60}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center gap-10 overflow-hidden">
        {Header}
        <motion.div ref={track} style={{ x }} className="flex gap-6 pl-[max(1.5rem,calc((100vw-80rem)/2+1.5rem))] pr-6">
          {items.map((_, i) => <div key={i} className="h-[58vh] w-[min(46vw,640px)] shrink-0"><Card i={i} /></div>)}
          <div className="w-6 shrink-0" />
        </motion.div>
        <div className="mx-auto h-[2px] w-full max-w-7xl px-6"><div className="h-full w-full bg-white/10"><motion.div className="h-full origin-left bg-[var(--blue-bright)]" style={{ scaleX: p }} /></div></div>
      </div>
    </section>
  );
};

/* ================================================================== */
/* Before / after — real project photo pairs with a drag slider        */
/* ================================================================== */

const BA: Record<string, L> = {
  kicker: { nl: 'Voor & na', en: 'Before & after', pl: 'Przed i po' },
  title: { nl: 'Het verschil zie je pas als je schuift', en: 'Slide to see the difference', pl: 'Przesuń, żeby zobaczyć różnicę' },
  before: { nl: 'Tijdens', en: 'During', pl: 'W trakcie' },
  after: { nl: 'Na', en: 'After', pl: 'Po' },
  hint: { nl: 'Sleep de schuif', en: 'Drag the slider', pl: 'Przeciągnij suwak' },
};
export const PAIRS: { before: string; after: string; title: L; text: L }[] = [
  { before: '/elewacje7.jpeg', after: '/elewacie-77.jpeg',
    title: { nl: 'Gevelbekleding naast de voordeur', en: 'Cladding next to the front door', pl: 'Elewacja obok drzwi wejściowych' },
    text: { nl: 'Van waterkerende folie en regelwerk naar strakke panelen in dezelfde kleur als de deur.', en: 'From weather membrane and battens to crisp panels matching the door colour.', pl: 'Od folii i rusztu do równych paneli w kolorze drzwi.' } },
  { before: '/projekt-okna-11.jpeg', after: '/projekt-okna-1.jpeg',
    title: { nl: 'Hoog smal raam in metselwerk', en: 'Tall narrow window in brickwork', pl: 'Wysokie wąskie okno w murze' },
    text: { nl: 'Het kozijn staat, daarna volgt het bovenlicht: beglaasd, afgekit en klaar.', en: 'Frame set, then the top light follows: glazed, sealed and done.', pl: 'Rama stoi, potem górne pole: oszklone, uszczelnione i gotowe.' } },
  { before: '/projekt-reperacje-w-drewnie-11.jpeg', after: '/projekt-reperacje-w-drewnie-1.jpeg',
    title: { nl: 'Voordeur en luifel', en: 'Front door and canopy', pl: 'Drzwi wejściowe i daszek' },
    text: { nl: 'Deur gesteld met de waterpas, luifel hersteld en strak afgewerkt.', en: 'Door set with the level, canopy repaired and neatly finished.', pl: 'Drzwi ustawione poziomicą, daszek naprawiony i wykończony.' } },
  { before: '/elewacje3.jpeg', after: '/elewacje4.jpeg',
    title: { nl: 'Aanbouw met houtlook-gevel', en: 'Extension with wood-look cladding', pl: 'Dobudówka z elewacją drewnopodobną' },
    text: { nl: 'Van regelwerk op folie naar een warme, onderhoudsarme gevel.', en: 'From battens on membrane to a warm, low-maintenance facade.', pl: 'Od rusztu na folii do ciepłej, bezobsługowej elewacji.' } },
];

export const BeforeAfter = ({ lang, pairs = PAIRS }: { lang: Language; pairs?: typeof PAIRS }) => {
  const [k, setK] = useState(0);
  const pos = useMotionValue(50);
  const [val, setVal] = useState(50);
  const wrap = useRef<HTMLDivElement>(null);
  const inView = useInView(wrap, { once: true, margin: '-20% 0px' });
  const clip = useMotionTemplate`inset(0 0 0 ${pos}%)`;
  const left = useMotionTemplate`${pos}%`;
  useMotionValueEvent(pos, 'change', (v) => setVal(Math.round(v)));

  // one hint sweep when it first comes into view, and on every switch
  useEffect(() => {
    if (!inView) return;
    pos.set(50);
    const c = animate(pos, [50, 78, 24, 50], { duration: 2.2, ease: 'easeInOut', delay: 0.3 });
    return () => c.stop();
  }, [inView, k, pos]);

  const setFromClient = (clientX: number) => {
    const r = wrap.current!.getBoundingClientRect();
    pos.set(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  const dragging = useRef(false);
  const cur = pairs[k];

  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <div className="mb-10 max-w-3xl">
          <Eyebrow>{BA.kicker[lang]}</Eyebrow>
          <SplitText key={`${lang}-ba`} text={BA.title[lang]} className="font-display mt-5 text-4xl font-extrabold leading-[0.95] tracking-tight md:text-7xl" />
        </div>
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr] lg:items-center">
          <Reveal>
            <div
              ref={wrap}
              className="relative aspect-[4/5] cursor-ew-resize touch-pan-y select-none overflow-hidden rounded-[28px] border border-white/10 bg-black md:aspect-[4/3.6]"
              onPointerDown={(e) => { dragging.current = true; (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId); setFromClient(e.clientX); }}
              onPointerMove={(e) => { if (dragging.current) setFromClient(e.clientX); }}
              onPointerUp={() => { dragging.current = false; }}
              onPointerCancel={() => { dragging.current = false; }}
              data-lenis-prevent-touch
            >
              <img src={asset(cur.before)} alt={`${BA.before[lang]}: ${cur.title[lang]}`} className="absolute inset-0 h-full w-full object-cover" draggable={false} />
              <motion.img key={cur.after} src={asset(cur.after)} alt={`${BA.after[lang]}: ${cur.title[lang]}`} className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: clip }} draggable={false} />
              <span className="pointer-events-none absolute left-4 top-4 rounded-full bg-black/60 px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] backdrop-blur">{BA.before[lang]}</span>
              <span className="pointer-events-none absolute right-4 top-4 rounded-full bg-[var(--blue)] px-3 py-1 text-xs font-bold uppercase tracking-[0.2em]">{BA.after[lang]}</span>
              <motion.div className="pointer-events-none absolute inset-y-0 w-[2px] -translate-x-1/2 bg-white shadow-[0_0_20px_rgba(0,0,0,.5)]" style={{ left }}>
                <div className="absolute left-1/2 top-1/2 flex h-12 w-12 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full bg-white text-black shadow-xl">
                  <ChevronsLeftRight size={22} />
                </div>
              </motion.div>
              <input type="range" min={0} max={100} value={val} aria-label={BA.hint[lang]}
                onChange={(e) => pos.set(+e.target.value)}
                className="absolute inset-x-0 bottom-0 h-10 w-full cursor-ew-resize opacity-0" />
            </div>
          </Reveal>
          <div>
            <motion.div key={k} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: EASE }}>
              <div className="font-mono text-sm text-zinc-500">{String(k + 1).padStart(2, '0')} / {String(pairs.length).padStart(2, '0')}</div>
              <h3 className="font-display mt-3 text-3xl font-extrabold leading-tight md:text-5xl">{cur.title[lang]}</h3>
              <p className="mt-4 max-w-md text-lg leading-relaxed text-zinc-400">{cur.text[lang]}</p>
            </motion.div>
            <div className="mt-8 grid grid-cols-4 gap-3">
              {pairs.map((pr, i) => (
                <button key={pr.after} onClick={() => setK(i)} aria-pressed={k === i} aria-label={pr.title[lang]}
                  className={`relative aspect-[3/4] overflow-hidden rounded-xl border-2 transition-all ${k === i ? 'border-[var(--blue-bright)]' : 'border-transparent opacity-50 hover:opacity-100'}`}>
                  <img src={asset(pr.after)} alt="" className="h-full w-full object-cover" loading="lazy" />
                </button>
              ))}
            </div>
            <div className="mt-8"><PrimaryButton to="/portfolio">{translations[lang].nav.portfolio}</PrimaryButton></div>
          </div>
        </div>
      </div>
    </section>
  );
};
