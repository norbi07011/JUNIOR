import React, { lazy, Suspense, useEffect, useRef, useState } from 'react';
import {
  motion, useAnimationFrame, useMotionTemplate, useMotionValue, useReducedMotion,
  useScroll, useSpring, useTransform, MotionValue,
} from 'motion/react';
import { ArrowDown, Star, Quote } from 'lucide-react';
import { translations, Language } from '../translations';
import { fx } from '../translations/fx';
import {
  asset, EASE, Float, MouseLayer, MouseScene, Reveal, RollingNumber, SplitText, TiltCard,
} from '../fx/core';
import { ShaderBackground } from '../fx/canvas';
import { Window3D } from '../fx/Window3D';
import { TLink } from '../fx/nav';
import { serviceImages } from '../data';
import { CTASection, Eyebrow, GhostButton, PrimaryButton, ScrubSteps } from '../components/Shared';
import { SloganMarquee } from '../components/Layout';
import { studioText } from '../fx/studio/studioText';

const MontageStudio = lazy(() => import('../fx/studio/MontageStudio').then((m) => ({ default: m.MontageStudio })));

export const useMediaQuery = (q: string) => {
  const [m, setM] = useState(() => typeof window !== 'undefined' && window.matchMedia(q).matches);
  useEffect(() => {
    const mq = window.matchMedia(q);
    const on = () => setM(mq.matches);
    on(); mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, [q]);
  return m;
};

/* ------------------------------------------------------------------ */
/* Hero — scroll-driven camera dolly through a window frame            */
/* ------------------------------------------------------------------ */

const HeroDolly = ({ lang }: { lang: Language }) => {
  const t = translations[lang].hero;
  const u = translations[lang].ui;
  const f = fx[lang];
  const ref = useRef<HTMLDivElement>(null);
  const mobile = useMediaQuery('(max-width: 767px)');
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start start', 'end end'] });
  const p = useSpring(scrollYProgress, { stiffness: 140, damping: 32, mass: 0.4 });

  // Window rectangle as insets (top, right, bottom, left) in % of the viewport.
  const s = mobile ? [54, 14, 7, 14] : [17, 7, 13, 57];
  const top = useTransform(p, [0, 0.6], [s[0], 0]);
  const right = useTransform(p, [0, 0.6], [s[1], 0]);
  const bottom = useTransform(p, [0, 0.6], [s[2], 0]);
  const left = useTransform(p, [0, 0.6], [s[3], 0]);
  const radius = useTransform(p, [0, 0.6], [10, 0]);
  const clip = useMotionTemplate`inset(${top}% ${right}% ${bottom}% ${left}% round ${radius}px)`;
  const imgScale = useTransform(p, [0, 0.65], [1.45, 1.02]);
  const frameOpacity = useTransform(p, [0.35, 0.58], [1, 0]);
  const barsOpacity = useTransform(p, [0.08, 0.3], [1, 0]);
  const frameTop = useMotionTemplate`${top}%`;
  const frameRight = useMotionTemplate`${right}%`;
  const frameBottom = useMotionTemplate`${bottom}%`;
  const frameLeft = useMotionTemplate`${left}%`;

  const introOpacity = useTransform(p, [0, 0.22], [1, 0]);
  const introY = useTransform(p, [0, 0.22], [0, -80]);
  const introBlur = useTransform(p, [0, 0.22], ['blur(0px)', 'blur(10px)']);
  const outroOpacity = useTransform(p, [0.58, 0.72], [0, 1]);
  const outroY = useTransform(p, [0.58, 0.75], [60, 0]);
  const shade = useTransform(p, [0.45, 0.8], [0, 0.6]);
  const hint = useTransform(p, [0, 0.06], [1, 0]);

  return (
    <section ref={ref} className="relative h-[280vh]" aria-label="Intro">
      <MouseScene className="sticky top-0 h-[100svh] overflow-hidden">
        <ShaderBackground className="absolute inset-0" />

        {/* photo seen through the window — expands as the camera dollies in */}
        <motion.div className="absolute inset-0 z-10" style={{ clipPath: clip }}>
          <MouseLayer depth={-28} className="absolute -inset-8">
            <motion.img
              src={asset('/hero.jpeg')}
              alt="JuniorJob Onderhoud — project"
              style={{ scale: imgScale }}
              className="h-full w-full object-cover"
            />
          </MouseLayer>
          <motion.div className="absolute inset-0 bg-black" style={{ opacity: shade }} />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30" />
        </motion.div>

        {/* steel window frame that rushes past the camera */}
        <motion.div
          aria-hidden
          className="pointer-events-none absolute z-20"
          style={{ top: frameTop, right: frameRight, bottom: frameBottom, left: frameLeft, opacity: frameOpacity }}
        >
          <div className="absolute -inset-[14px] rounded-[14px] border-[14px] [border-image:linear-gradient(135deg,#f5f7fa,#8b929d_35%,#e7eaef_55%,#5b616b)_1] shadow-[0_30px_80px_rgba(0,0,0,0.6),0_0_60px_rgba(37,99,235,0.25)]" />
          <motion.div style={{ opacity: barsOpacity }} className="absolute inset-0">
            <div className="absolute bottom-0 left-1/2 top-0 w-[10px] -translate-x-1/2 bg-gradient-to-r from-[#8b929d] via-[#eef0f3] to-[#6b7280]" />
            <div className="absolute left-0 right-0 top-[40%] h-[10px] bg-gradient-to-b from-[#8b929d] via-[#eef0f3] to-[#6b7280]" />
          </motion.div>
        </motion.div>

        {/* intro copy */}
        <motion.div
          style={{ opacity: introOpacity, y: introY, filter: introBlur }}
          className="relative z-30 mx-auto flex h-full max-w-7xl flex-col justify-start px-6 pt-28 md:justify-center md:pt-0"
        >
          <MouseLayer depth={12} className="max-w-[22rem] sm:max-w-xl md:max-w-[50%]">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: EASE }}>
              <Eyebrow>{u.heroBadge}</Eyebrow>
            </motion.div>
            <SplitText
              as="h1"
              by="char"
              onView={false}
              delay={0.2}
              stagger={0.018}
              text={t.title}
              className="font-display mt-6 text-[2.6rem] font-extrabold leading-[0.95] tracking-tight sm:text-6xl lg:text-[5.4rem]"
            />
            <motion.p
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9, duration: 0.9, ease: EASE }}
              className="mt-6 max-w-lg text-base leading-relaxed text-zinc-300 md:text-lg"
            >
              {t.subtitle}
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1, duration: 0.9, ease: EASE }}
              className="mt-8 hidden flex-wrap gap-3 sm:flex"
            >
              <PrimaryButton to="/contact">{t.ctaPrimary}</PrimaryButton>
              <GhostButton to="/portfolio">{translations[lang].nav.portfolio}</GhostButton>
            </motion.div>
          </MouseLayer>
        </motion.div>

        {/* outro copy over the full photo */}
        <motion.div style={{ opacity: outroOpacity, y: outroY }} className="pointer-events-none absolute inset-x-0 bottom-0 z-30 px-6 pb-20 md:pb-28">
          <div className="mx-auto max-w-7xl">
            <p className="font-display text-5xl font-extrabold leading-[0.9] tracking-tight text-steel-gradient md:text-[8rem]">{f.heroLine}</p>
            <p className="mt-6 max-w-xl text-lg text-zinc-200 md:text-2xl">{f.heroLineSub}</p>
            <div className="pointer-events-auto mt-8 sm:hidden"><PrimaryButton to="/contact">{t.ctaPrimary}</PrimaryButton></div>
          </div>
        </motion.div>

        <motion.div style={{ opacity: hint }} className="absolute bottom-6 left-1/2 z-30 flex -translate-x-1/2 flex-col items-center gap-2 text-[10px] font-bold uppercase tracking-[0.4em] text-zinc-400 md:bottom-8">
          {f.scroll}
          <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.6 }}><ArrowDown size={16} /></motion.span>
        </motion.div>
      </MouseScene>
    </section>
  );
};

/* ------------------------------------------------------------------ */

const Stats = ({ lang }: { lang: Language }) => {
  const u = translations[lang].ui;
  const f = fx[lang];
  const stats = [
    { label: u.statsExperience, value: 10, suffix: '+', unit: f.years },
    { label: u.statsProjects, value: 500, suffix: '+' },
    { label: u.statsWarranty, value: 10, suffix: '', unit: f.years },
    { label: u.statsSatisfaction, value: 9.8, suffix: '/10', decimals: 1 },
  ];
  return (
    <section className="relative border-b border-white/5 bg-[var(--bg)]">
      <div className="mx-auto grid max-w-7xl grid-cols-2 md:grid-cols-4">
        {stats.map((s, i) => (
          <Reveal key={i} delay={i * 0.08} className={`border-white/5 px-6 py-12 md:py-16 ${i % 2 === 0 ? 'border-r' : ''} ${i < 2 ? 'border-b md:border-b-0' : ''} ${i === 1 ? 'md:border-r' : ''}`}>
            <div className="font-display text-5xl font-extrabold tracking-tight md:text-7xl">
              <RollingNumber value={s.value} decimals={s.decimals} suffix={s.suffix} className="text-zinc-100" />
              {s.unit && <span className="ml-2 text-lg font-semibold text-zinc-500 md:text-2xl">{s.unit}</span>}
            </div>
            <div className="mt-3 text-[11px] font-bold uppercase tracking-[0.3em] text-zinc-500">{s.label}</div>
          </Reveal>
        ))}
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* 3D orbit carousel — services circling a CSS-3D window               */
/* ------------------------------------------------------------------ */

const OrbitCard = ({ i, n, rot, radius, title, img }: { i: number; n: number; rot: MotionValue<number>; radius: number; title: string; img: string }) => {
  const base = (360 / n) * i;
  const facing = useTransform(rot, (r) => Math.cos(((base + r) * Math.PI) / 180));
  const opacity = useTransform(facing, [-1, 0, 1], [0.25, 0.55, 1]);
  const bright = useTransform(facing, [-1, 1], ['brightness(0.35)', 'brightness(1)']);
  return (
    <motion.div
      className="absolute left-1/2 top-1/2"
      style={{ transform: `translate(-50%,-50%) rotateY(${base}deg) translateZ(${radius}px)`, transformStyle: 'preserve-3d' }}
    >
      <Float amp={8} duration={4 + (i % 3)} delay={i * 0.4}>
        <TLink to="/services" className="group block" tabIndex={-1}>
          <motion.div style={{ opacity, filter: bright }} className="relative h-56 w-40 overflow-hidden rounded-2xl border border-white/15 shadow-[0_30px_60px_rgba(0,0,0,0.5)] md:h-72 md:w-52">
            <img src={img} alt="" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110" draggable={false} />
            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
            <div className="absolute inset-x-0 bottom-0 p-4">
              <div className="text-[10px] font-bold tracking-[0.3em] text-[var(--blue-bright)]">0{i + 1}</div>
              <div className="font-display text-base font-bold leading-tight md:text-lg">{title}</div>
            </div>
          </motion.div>
        </TLink>
      </Float>
    </motion.div>
  );
};

const OrbitServices = ({ lang }: { lang: Language }) => {
  const items = translations[lang].services.items;
  const f = fx[lang];
  const ref = useRef<HTMLDivElement>(null);
  const mobile = useMediaQuery('(max-width: 767px)');
  const reduce = useReducedMotion();
  const radius = mobile ? 230 : 470;

  const auto = useMotionValue(0);
  const drag = useMotionValue(0);
  const hovering = useRef(false);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const scrollRot = useTransform(scrollYProgress, [0, 1], [60, -160]);
  const rot = useTransform([auto, drag, scrollRot] as MotionValue<number>[], (v: number[]) => v[0] + v[1] + v[2]);
  const counterRot = useTransform(rot, (r) => -r);
  const windowY = useTransform(rot, (r) => -r * 0.25);

  useAnimationFrame((_, dt) => {
    if (reduce || hovering.current) return;
    auto.set(auto.get() - dt * 0.006);
  });

  return (
    <section ref={ref} className="relative overflow-hidden pb-10 pt-28 md:pt-40">
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[60vmin] w-[60vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--blue)]/20 blur-[120px]" />
      <div className="relative mx-auto max-w-7xl px-6 text-center">
        <Eyebrow>{f.orbitBadge}</Eyebrow>
        <SplitText text={f.orbitTitle} className="font-display mt-6 text-5xl font-extrabold tracking-tight md:text-8xl" />
        <p className="mt-4 text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">{f.orbitHint}</p>
      </div>

      <motion.div
        className="relative mx-auto mt-10 h-[460px] cursor-grab touch-pan-y active:cursor-grabbing md:h-[620px]"
        style={{ perspective: 1600 }}
        onPointerEnter={() => { hovering.current = true; }}
        onPointerLeave={() => { hovering.current = false; }}
        onPan={(_, info) => drag.set(drag.get() + info.delta.x * 0.35)}
      >
        <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', transform: 'rotateX(-8deg)' }}>
          <motion.div className="absolute inset-0" style={{ transformStyle: 'preserve-3d', rotateY: rot }}>
            {/* centre window counter-rotates slightly so it stays mostly facing the viewer */}
            <motion.div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" style={{ transformStyle: 'preserve-3d', rotateY: counterRot }}>
              <Float amp={14} duration={6}>
                <Window3D image={asset('/projekt-okna-11.jpeg')} width={mobile ? 150 : 240} height={mobile ? 200 : 320} rotateY={windowY} />
              </Float>
            </motion.div>
            {items.map((s, i) => (
              <OrbitCard key={i} i={i} n={items.length} rot={rot} radius={radius} title={s.title} img={serviceImages[i]} />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Interactive 3D montage studio (Three.js, 10 installation steps)     */
/* ------------------------------------------------------------------ */

const Studio = ({ lang }: { lang: Language }) => {
  const tx = studioText[lang];
  return (
    <section className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/3 h-[50vmin] w-[80vmin] -translate-x-1/2 rounded-full bg-[var(--blue)]/10 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-12 max-w-3xl px-2 md:px-0">
          <Eyebrow>{tx.kicker}</Eyebrow>
          <SplitText key={`${lang}-studio`} text={tx.title} className="font-display mt-6 text-4xl font-extrabold leading-[0.95] tracking-tight md:text-7xl" />
          <Reveal><p className="mt-6 text-lg leading-relaxed text-zinc-400">{tx.intro}</p></Reveal>
        </div>
        <Reveal rotate={6}>
          <Suspense fallback={<div className="aspect-[4/5] overflow-hidden rounded-[28px] border border-white/10 bg-[var(--panel)] md:aspect-video"><img src={asset('/projekt-okna-1.jpeg')} alt="" className="h-full w-full object-cover opacity-50" /></div>}>
            <MontageStudio lang={lang} />
          </Suspense>
        </Reveal>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */

const WhyUs = ({ lang }: { lang: Language }) => {
  const t = translations[lang].whyUs;
  const f = fx[lang];
  return (
    <section className="relative py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <div className="mb-16 grid gap-8 md:grid-cols-2 md:items-end">
          <SplitText text={t.title} className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-7xl" />
          <Reveal><p className="max-w-md text-lg text-zinc-400 md:justify-self-end">{f.whyIntro}</p></Reveal>
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3" style={{ perspective: 1200 }}>
          {t.items.map((it, i) => (
            <Reveal key={i} delay={(i % 3) * 0.1}>
              <TiltCard className="h-full rounded-[2rem]">
                <div className="group relative h-full overflow-hidden rounded-[2rem] border border-white/[0.07] bg-gradient-to-b from-white/[0.05] to-white/[0.01] p-8">
                  <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-[var(--blue)]/0 blur-3xl transition-colors duration-700 group-hover:bg-[var(--blue)]/30" />
                  <div className="font-display mb-10 text-6xl font-extrabold text-white/[0.06] transition-colors group-hover:text-[var(--blue-bright)]/40" style={{ transform: 'translateZ(40px)' }}>
                    0{i + 1}
                  </div>
                  <h4 className="font-display mb-3 text-2xl font-bold" style={{ transform: 'translateZ(30px)' }}>{it.title}</h4>
                  <p className="leading-relaxed text-zinc-400">{it.description}</p>
                </div>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = ({ lang }: { lang: Language }) => {
  const t = translations[lang].testimonials;
  return (
    <section className="relative bg-[var(--bg-2)] py-28 md:py-40">
      <div className="mx-auto max-w-7xl px-6">
        <SplitText text={t.title} className="font-display mb-16 text-center text-5xl font-extrabold tracking-tight md:text-7xl" />
        <div className="grid gap-6 md:grid-cols-3">
          {t.items.map((it, i) => (
            <Reveal key={i} delay={i * 0.12}>
              <Float amp={6} duration={5 + i} delay={i * 0.6}>
                <TiltCard className="rounded-[2rem]" max={8}>
                  <figure className="relative rounded-[2rem] border border-white/[0.07] bg-[var(--panel)] p-8">
                    <Quote className="absolute right-6 top-6 text-white/5" size={64} />
                    <div className="mb-6 flex gap-1 text-[var(--blue-bright)]">
                      {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
                    </div>
                    <blockquote className="mb-8 text-lg leading-relaxed text-zinc-200">“{it.text}”</blockquote>
                    <figcaption className="flex items-center gap-4">
                      <div className="font-display flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[var(--steel)] to-zinc-600 font-extrabold text-black">{it.name[0]}</div>
                      <div>
                        <div className="font-bold">{it.name}</div>
                        <div className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{it.service}</div>
                      </div>
                    </figcaption>
                  </figure>
                </TiltCard>
              </Float>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Home = ({ lang }: { lang: Language }) => (
  <>
    <HeroDolly lang={lang} />
    <Stats lang={lang} />
    <SloganMarquee lang={lang} />
    <OrbitServices lang={lang} />
    <Studio lang={lang} />
    <WhyUs lang={lang} />
    <ScrubSteps title={translations[lang].process.title} steps={translations[lang].process.steps} />
    <Testimonials lang={lang} />
    <CTASection lang={lang} />
  </>
);
