import { useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll, useSpring } from 'motion/react';
import { CheckCircle2, Plus, Check, ChevronDown, Star } from 'lucide-react';
import { translations, Language } from '../translations';
import { fx } from '../translations/fx';
import { asset, EASE, Reveal, SplitText, TiltCard } from '../fx/core';


import { flyToQuote, useQuote } from '../fx/nav';
import { serviceImages } from '../data';
import { CTASection, Eyebrow, ScrubSteps } from '../components/Shared';

import { StudioTabs } from '../components/StudioTabs';
import { Configurator } from '../components/Configurator';
import { TiltTurn } from '../components/TiltTurn';

const STUDIO_TITLE = { nl: 'De montage in 3D', en: 'The installation in 3D', pl: 'Montaż w 3D' };
const STUDIO_INTRO = {
  nl: 'Kies een dienst en volg stap voor stap hoe wij monteren. Draai het model, bekijk het opengewerkt of vergelijk voor en na.',
  en: 'Pick a service and follow our installation step by step. Rotate the model, open the cutaway or compare before and after.',
  pl: 'Wybierz usługę i śledź montaż krok po kroku. Obracaj model, zobacz przekrój albo porównaj przed i po.',
};

/* ------------------------------------------------------------------ */
/* Scrollytelling — pinned 3D window spins & opens, copy changes       */
/* ------------------------------------------------------------------ */

/** Pinned story: each chapter's real photo wipes in with a mask while the copy changes. */
const Story = ({ lang }: { lang: Language }) => {
  const d = translations[lang].services.detailed.map((x) => ({ ...x, image: asset(x.image) }));
  const u = translations[lang].ui;
  const n = d.length;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });
  const [active, setActive] = useState(0);
  useMotionValueEvent(p, 'change', (v) => setActive(Math.min(n - 1, Math.floor(v * n * 0.999))));

  return (
    <section ref={ref} className="relative" style={{ height: `${n * 100 + 20}vh` }}>
      <div className="sticky top-0 flex h-[100svh] items-center overflow-hidden">
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-8 px-5 md:px-6 lg:grid-cols-[1fr_1.05fr] lg:gap-16">
          <div className="order-2 lg:order-1">
            <div className="mb-6 flex items-center gap-2">
              {d.map((_, i) => (
                <span key={i} className="h-[3px] overflow-hidden rounded-full bg-white/10 transition-all duration-500" style={{ width: i === active ? 56 : 20 }}>
                  <span className={`block h-full transition-colors ${i <= active ? 'bg-[var(--blue-bright)]' : ''}`} />
                </span>
              ))}
              <span className="ml-3 font-mono text-xs text-zinc-500">{String(active + 1).padStart(2, '0')} / {String(n).padStart(2, '0')} · {u.focusLabel}</span>
            </div>
            <AnimatePresence mode="wait">
              <motion.div key={active} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45, ease: EASE }}>
                <h2 className="font-display mb-4 text-4xl font-extrabold leading-[0.95] tracking-tight md:text-7xl">{d[active].title}</h2>
                <p className="mb-6 max-w-lg text-zinc-400 md:text-lg">{d[active].description}</p>
                <ul className="mb-6 grid gap-2 sm:grid-cols-2">
                  {d[active].features.map((ft) => (
                    <li key={ft} className="flex items-center gap-3 text-sm text-zinc-200 md:text-base"><CheckCircle2 size={16} className="shrink-0 text-[var(--blue-bright)]" /> {ft}</li>
                  ))}
                </ul>
                <div className="hidden gap-10 border-t border-white/10 pt-6 sm:flex">
                  {d[active].stats.map((s) => (
                    <div key={s.label}>
                      <div className="font-display text-3xl font-extrabold">{s.value}</div>
                      <div className="mt-1 text-[10px] font-bold uppercase tracking-[0.25em] text-zinc-500">{s.label}</div>
                    </div>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
          <div className="relative order-1 aspect-[4/3] overflow-hidden rounded-[28px] border border-white/10 lg:order-2 lg:aspect-[4/5] lg:max-h-[76vh]">
            {d.map((x, i) => (
              <motion.img key={i} src={x.image} alt={x.title} draggable={false}
                className="absolute inset-0 h-full w-full object-cover"
                initial={false}
                animate={{ clipPath: i <= active ? 'inset(0% 0% 0% 0%)' : 'inset(100% 0% 0% 0%)', scale: i === active ? 1 : 1.12 }}
                transition={{ clipPath: { duration: 1, ease: [0.76, 0, 0.24, 1] }, scale: { duration: 1.6, ease: EASE } }}
                style={{ zIndex: i }} />
            ))}
            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-t from-black/50 to-transparent" />
          </div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Service cards with fly-to-quote                                     */
/* ------------------------------------------------------------------ */

const ServiceCard = ({ i, title, description, img, lang }: { i: number; title: string; description: string; img: string; lang: Language }) => {
  const { has, toggle } = useQuote();
  const f = fx[lang];
  const ref = useRef<HTMLDivElement>(null);
  const added = has(title);
  const onAdd = () => {
    if (!added && ref.current) flyToQuote(ref.current, img);
    toggle(title);
  };
  return (
    <TiltCard className="h-full rounded-[2rem]" max={7}>
      <article className="group flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/[0.07] bg-[var(--panel)]">
        <div ref={ref} className="relative aspect-[4/3] overflow-hidden">
          <img src={img} alt={title} loading="lazy" className="h-full w-full object-cover transition-transform duration-[1.4s] ease-out group-hover:scale-110" />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--panel)] via-transparent to-transparent" />
          <span className="font-display absolute left-5 top-4 text-sm font-extrabold text-white/70">0{i + 1}</span>
        </div>
        <div className="flex flex-1 flex-col p-7 pt-2">
          <h4 className="font-display mb-2 text-2xl font-bold">{title}</h4>
          <p className="mb-6 flex-1 text-sm leading-relaxed text-zinc-400">{description}</p>
          <button
            onClick={onAdd}
            aria-pressed={added}
            className={`flex items-center justify-center gap-2 rounded-full border px-5 py-3 text-sm font-bold transition-all ${added ? 'border-[var(--blue-bright)] bg-[var(--blue)] text-white' : 'border-white/15 hover:border-white/40 hover:bg-white/5'}`}
          >
            <AnimatePresence mode="wait" initial={false}>
              <motion.span key={String(added)} initial={{ scale: 0, rotate: -90 }} animate={{ scale: 1, rotate: 0 }} exit={{ scale: 0 }} className="flex">
                {added ? <Check size={16} /> : <Plus size={16} />}
              </motion.span>
            </AnimatePresence>
            {added ? f.inQuote : f.addToQuote}
          </button>
        </div>
      </article>
    </TiltCard>
  );
};

/* ------------------------------------------------------------------ */

export const Services = ({ lang }: { lang: Language }) => {
  const t = translations[lang].services;
  const u = translations[lang].ui;
  const f = fx[lang];

  return (
    <div>
      <section className="relative flex min-h-[80svh] items-end overflow-hidden pb-20 pt-40">
        <motion.img src={asset('/elewacje1.jpeg')} alt="" className="absolute inset-0 h-full w-full object-cover" initial={{ scale: 1.15 }} animate={{ scale: 1 }} transition={{ duration: 2.2, ease: EASE }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,7,10,.9),rgba(6,7,10,.55)_50%,rgba(6,7,10,.2))]" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[var(--bg)] to-transparent" />
        <div className="relative mx-auto w-full max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><Eyebrow>{u.servicesBadge}</Eyebrow></motion.div>
          <SplitText as="h1" onView={false} delay={0.1} text={u.servicesHeroTitle} className="font-display mt-8 text-5xl font-extrabold leading-[0.92] tracking-tight md:text-8xl" />
          <SplitText as="h1" onView={false} delay={0.3} text={u.servicesHeroTitleSub} className="font-display text-blue-gradient text-5xl font-extrabold leading-[1] tracking-tight md:text-8xl" />
          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6, ease: EASE, duration: 0.9 }} className="mt-8 max-w-2xl text-lg text-zinc-300 md:text-2xl">
            {u.servicesHeroSubtitle}
          </motion.p>
        </div>
      </section>

      <Story lang={lang} />

      <StudioTabs lang={lang} title={STUDIO_TITLE} intro={STUDIO_INTRO} only={['kozijn']} />

      <Configurator lang={lang} />

      <TiltTurn lang={lang} />

      <section className="relative py-28 md:py-40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-14 flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <SplitText text={f.servicesGridTitle} className="font-display text-5xl font-extrabold tracking-tight md:text-7xl" />
            <p className="max-w-sm text-zinc-500">{t.title}</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: 1200 }}>
            {t.items.map((s, i) => (
              <Reveal key={i} delay={(i % 3) * 0.08} className="h-full">
                <ServiceCard i={i} title={s.title} description={s.description} img={serviceImages[i]} lang={lang} />
              </Reveal>
            ))}
            <Reveal delay={0.2} className="h-full sm:col-span-1 lg:col-span-2">
              <div className="flex h-full flex-col justify-center rounded-[2rem] border border-dashed border-white/10 p-8 md:p-12">
                <Star className="mb-4 text-[var(--blue-bright)]" fill="currentColor" />
                <p className="font-display text-2xl font-bold leading-snug">“{f.serviceQuote}”</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      <div className="bg-[var(--bg-2)]">
        <ScrubSteps title={t.process.title} steps={t.process.steps} />
      </div>

      <section className="py-28 md:py-40">
        <div className="mx-auto max-w-4xl px-6">
          <SplitText text={t.faq.title} className="font-display mb-14 text-center text-5xl font-extrabold tracking-tight md:text-7xl" />
          <div className="space-y-3">
            {t.faq.items.map((it, i) => (
              <Reveal key={i} delay={i * 0.08}>
                <details className="group rounded-[1.75rem] border border-white/[0.07] bg-[var(--panel)] transition-colors open:border-[var(--blue)]/40">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-6 p-6 md:p-8 [&::-webkit-details-marker]:hidden">
                    <h4 className="font-display text-lg font-bold md:text-xl">{it.question}</h4>
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/5 text-[var(--blue-bright)] transition-transform duration-500 group-open:rotate-180"><ChevronDown size={20} /></span>
                  </summary>
                  <div className="px-6 pb-8 leading-relaxed text-zinc-400 md:px-8">{it.answer}</div>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <CTASection lang={lang} />
    </div>
  );
};
