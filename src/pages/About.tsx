import React, { useRef, useState } from 'react';
import { motion, useScroll, useSpring, useTransform } from 'motion/react';
import { Ruler, Paintbrush, MessageSquare, ShieldCheck } from 'lucide-react';
import { translations, Language } from '../translations';
import { fx } from '../translations/fx';
import { asset, EASE, Float, Parallax, Reveal, RollingNumber, SplitText, TiltCard } from '../fx/core';
import { Spotlights } from '../fx/canvas';
import { CTASection, Eyebrow } from '../components/Shared';
import { useMediaQuery } from './Home';

/* ------------------------------------------------------------------ */
/* Scroll-pinned horizontal timeline                                   */
/* ------------------------------------------------------------------ */

const Timeline = ({ lang }: { lang: Language }) => {
  const t = translations[lang].about.history;
  const u = translations[lang].ui;
  const ref = useRef<HTMLDivElement>(null);
  const desktop = useMediaQuery('(min-width: 1024px)');
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const x = useTransform(p, [0.05, 0.95], ['0%', `-${Math.max(0, t.items.length * 45 - 100)}%`]);
  const line = useTransform(p, [0, 1], [0, 1]);

  if (!desktop) {
    return (
      <section className="py-28">
        <div className="mx-auto max-w-7xl px-6">
          <SplitText text={t.title} className="font-display mb-12 text-5xl font-extrabold tracking-tight" />
          <div className="space-y-6">
            {t.items.map((it, i) => (
              <Reveal key={i}>
                <div className="rounded-3xl border border-white/[0.07] bg-[var(--panel)] p-8">
                  <div className="font-display text-5xl font-extrabold text-blue-gradient">{it.year}</div>
                  <h4 className="font-display mt-4 text-2xl font-bold">{it.title}</h4>
                  <p className="mt-2 text-zinc-400">{it.description}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <section ref={ref} className="relative" style={{ height: `${t.items.length * 80}vh` }}>
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-16 flex w-full max-w-7xl items-end justify-between px-6">
          <SplitText text={t.title} className="font-display text-7xl font-extrabold tracking-tight xl:text-8xl" />
          <p className="max-w-xs text-right text-zinc-500">{u.historyDesc}</p>
        </div>
        <div className="relative mx-auto w-full max-w-7xl px-6">
          <div className="absolute left-6 right-6 top-[3px] h-[2px] bg-white/[0.06]" />
          <motion.div style={{ scaleX: line }} className="absolute left-6 right-6 top-[3px] h-[2px] origin-left bg-gradient-to-r from-[var(--blue-bright)] to-[var(--steel)] shadow-[0_0_14px_var(--blue)]" />
          <motion.div style={{ x }} className="flex">
            {t.items.map((it, i) => (
              <div key={i} className="w-[45%] shrink-0 pr-16 pt-12">
                <div className="mb-8 h-2 w-2 -translate-y-[54px] rounded-full bg-[var(--blue-bright)] shadow-[0_0_0_6px_rgba(59,130,246,0.15)]" />
                <div className="font-display text-[9rem] font-extrabold leading-none text-steel-gradient opacity-90">{it.year}</div>
                <h4 className="font-display mt-6 text-4xl font-bold">{it.title}</h4>
                <p className="mt-4 max-w-md text-lg text-zinc-400">{it.description}</p>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Business card — tilt with glare + flip                              */
/* ------------------------------------------------------------------ */

export const BusinessCardFlip = ({ lang }: { lang: Language }) => {
  const [flipped, setFlipped] = useState(false);
  const f = fx[lang];
  const face = (src: string, back = false) => (
    <div className="absolute inset-0 overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-[0_40px_80px_rgba(0,0,0,0.6),0_0_80px_rgba(37,99,235,0.15)]"
      style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden', transform: back ? 'rotateY(180deg)' : undefined }}>
      <img src={src} alt={`JuniorJob ${back ? 'back' : 'front'}`} className="h-full w-full object-cover" draggable={false} />
      <div className="holo-shimmer pointer-events-none absolute inset-0 opacity-50" />
    </div>
  );
  return (
    <div className="flex flex-col items-center">
      <p className="mb-8 text-xs uppercase tracking-[0.3em] text-zinc-500">{flipped ? `← ${f.cardFlipBack}` : `${f.cardFlip} →`}</p>
      <Float amp={10} duration={6}>
        <TiltCard className="rounded-2xl" max={14}>
          <motion.button
            onClick={() => setFlipped((v) => !v)}
            aria-label={flipped ? f.cardFlipBack : f.cardFlip}
            className="relative block aspect-[1050/600] w-[min(88vw,560px)] cursor-pointer"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: flipped ? 180 : 0 }}
            transition={{ duration: 1, ease: [0.23, 1, 0.32, 1] }}
          >
            {face(asset('/wizytowka-przow.jpeg'))}
            {face(asset('/wizytowka-tyl.jpeg'), true)}
          </motion.button>
        </TiltCard>
      </Float>
    </div>
  );
};

/* ------------------------------------------------------------------ */

export const About = ({ lang }: { lang: Language }) => {
  const t = translations[lang].about;
  const u = translations[lang].ui;
  const icons = [Ruler, Paintbrush, MessageSquare, ShieldCheck];

  return (
    <div>
      {/* Hero with volumetric spotlights + dust */}
      <section className="relative flex min-h-[100svh] items-center overflow-hidden pb-20 pt-36">
        <Spotlights className="absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[var(--bg)] to-transparent" />
        <div className="relative mx-auto grid w-full max-w-7xl items-center gap-16 px-6 lg:grid-cols-2">
          <div>
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ ease: EASE, duration: 0.8 }}>
              <Eyebrow>{t.subtitle}</Eyebrow>
            </motion.div>
            <SplitText as="h1" onView={false} delay={0.15} text={u.aboutHeading} className="font-display mt-8 text-6xl font-extrabold leading-[0.9] tracking-tight md:text-8xl" />
            <SplitText as="h1" onView={false} delay={0.35} by="char" text={u.aboutBrand} className="font-display text-blue-gradient text-6xl font-extrabold leading-[1] tracking-tight md:text-8xl" />
            <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7, duration: 0.9, ease: EASE }}
              className="mt-8 max-w-xl text-lg font-light leading-relaxed text-zinc-300 md:text-xl">
              {t.description}
            </motion.p>
            <div className="mt-10 flex gap-12">
              {[{ label: u.statsExperience, value: 10 }, { label: u.statsProjects, value: 500 }].map((s, i) => (
                <div key={i}>
                  <div className="font-display text-5xl font-extrabold"><RollingNumber value={s.value} suffix="+" className="text-zinc-100" /></div>
                  <div className="mt-2 text-[10px] font-bold uppercase tracking-[0.3em] text-zinc-500">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <motion.div initial={{ opacity: 0, scale: 0.85, rotateX: 25 }} animate={{ opacity: 1, scale: 1, rotateX: 0 }} transition={{ duration: 1.4, ease: EASE, delay: 0.3 }} style={{ transformPerspective: 1000 }}>
            <Float amp={12} duration={7}>
              <TiltCard className="rounded-[2rem]">
                <div className="overflow-hidden rounded-[2rem] border border-white/10 bg-black shadow-[0_0_120px_rgba(37,99,235,0.25)]">
                  <img src={asset('/logo.jpeg')} alt="JuniorJob Onderhoud logo" className="w-full" />
                </div>
              </TiltCard>
            </Float>
          </motion.div>
        </div>
      </section>

      {/* Mission & vision with parallax image */}
      <section className="relative bg-[var(--bg-2)] py-28 md:py-40">
        <div className="mx-auto grid max-w-7xl items-center gap-20 px-6 lg:grid-cols-2">
          <div className="space-y-20">
            {[{ k: t.mission, h: u.missionHeading, s: u.missionHeadingSub }, { k: t.vision, h: u.visionHeading, s: u.visionHeadingSub }].map((b, i) => (
              <Reveal key={i}>
                <div className="mb-6 flex items-center gap-4">
                  <div className="h-px w-12 bg-[var(--blue-bright)]" />
                  <span className="text-xs font-bold uppercase tracking-[0.3em] text-[var(--blue-bright)]">{b.k.title}</span>
                </div>
                <h2 className="font-display mb-6 text-4xl font-extrabold leading-[1] tracking-tight md:text-6xl">{b.h}<br /><span className="text-zinc-500">{b.s}</span></h2>
                <p className="max-w-lg text-lg font-light leading-relaxed text-zinc-400">{b.k.text}</p>
              </Reveal>
            ))}
          </div>
          <div className="relative">
            <Parallax speed={0.15} className="aspect-[4/5] rounded-[2.5rem] border border-white/10">
              <img src={asset('/hst.jpeg')} alt="HST" className="h-full w-full object-cover" />
            </Parallax>
            <Reveal delay={0.3} className="absolute -bottom-10 -left-4 max-w-xs md:-left-10">
              <div className="rounded-3xl border border-white/10 bg-white/[0.06] p-8 backdrop-blur-2xl">
                <div className="font-display mb-3 text-5xl font-extrabold text-blue-gradient">{u.precisionValue}</div>
                <p className="text-sm leading-relaxed text-zinc-300">{u.precisionText}</p>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-28 md:py-40">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mb-16 text-center">
            <SplitText text={t.values.title} className="font-display text-5xl font-extrabold tracking-tight md:text-7xl" />
            <p className="mt-4 text-xs font-bold uppercase tracking-[0.4em] text-zinc-500">{u.valuesSubtitle}</p>
          </div>
          <div className="grid gap-5 md:grid-cols-2">
            {t.values.items.map((v, i) => {
              const Icon = icons[i] ?? ShieldCheck;
              return (
                <Reveal key={i} delay={(i % 2) * 0.1}>
                  <TiltCard className="h-full rounded-[2rem]" max={8}>
                    <div className="group h-full rounded-[2rem] border border-white/[0.07] bg-gradient-to-br from-white/[0.05] to-transparent p-10">
                      <div className="mb-8 flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--blue)]/15 text-[var(--blue-bright)] transition-all duration-500 group-hover:scale-110 group-hover:bg-[var(--blue)] group-hover:text-white" style={{ transform: 'translateZ(40px)' }}>
                        <Icon size={26} />
                      </div>
                      <h4 className="font-display mb-3 text-3xl font-bold">{v.title}</h4>
                      <p className="text-zinc-400">{v.description}</p>
                    </div>
                  </TiltCard>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      <Timeline lang={lang} />

      <section className="relative overflow-hidden py-28">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--blue)]/10 blur-[120px]" />
        <BusinessCardFlip lang={lang} />
      </section>

      <CTASection lang={lang} />
    </div>
  );
};
