import React, { useRef } from 'react';
import { motion, useScroll, useSpring, useTransform, MotionValue } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { Language } from '../translations';
import { fx } from '../translations/fx';
import { Magnetic, SplitText, Reveal } from '../fx/core';
import { ShaderBackground } from '../fx/canvas';
import { TLink } from '../fx/nav';

export const Eyebrow = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => (
  <div className={`inline-flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-1.5 backdrop-blur-md ${className}`}>
    <span className="relative flex h-2 w-2">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--blue-bright)] opacity-70" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--blue-bright)]" />
    </span>
    <span className="text-[11px] font-bold uppercase tracking-[0.28em] text-zinc-300">{children}</span>
  </div>
);

export const PrimaryButton = ({ to, children, className = '' }: { to: string; children: React.ReactNode; className?: string }) => (
  <Magnetic>
    <TLink to={to} className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full bg-white px-8 py-4 font-bold text-black ${className}`}>
      <span className="absolute inset-0 translate-y-full rounded-full bg-[var(--blue)] transition-transform duration-500 ease-[cubic-bezier(.16,1,.3,1)] group-hover:translate-y-0" />
      <span className="relative transition-colors duration-300 group-hover:text-white">{children}</span>
      <ArrowRight size={18} className="relative transition-all duration-300 group-hover:translate-x-1 group-hover:text-white" />
    </TLink>
  </Magnetic>
);

export const GhostButton = ({ to, children }: { to: string; children: React.ReactNode }) => (
  <Magnetic>
    <TLink to={to} className="inline-flex items-center gap-3 rounded-full border border-white/15 bg-white/[0.03] px-8 py-4 font-bold text-white backdrop-blur-md hover:border-white/40 transition-colors">
      {children}
    </TLink>
  </Magnetic>
);

/* ------------------------------------------------------------------ */
/* Closing CTA with smoke shader                                       */
/* ------------------------------------------------------------------ */

export const CTASection = ({ lang }: { lang: Language }) => {
  const f = fx[lang];
  return (
    <section className="relative px-3 py-24 md:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden rounded-[2.5rem] border border-white/10 md:rounded-[4rem]">
        <ShaderBackground className="absolute inset-0" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
        <div className="relative px-6 py-24 text-center md:py-36">
          <SplitText as="h2" text={f.ctaTitle} className="font-display text-5xl font-extrabold leading-[0.95] tracking-tight md:text-8xl" />
          <SplitText as="h2" text={f.ctaTitleSub} delay={0.2} className="font-display text-blue-gradient text-5xl font-extrabold leading-[1.05] tracking-tight md:text-8xl" />
          <Reveal delay={0.3}>
            <p className="mx-auto mb-12 mt-8 max-w-xl text-lg text-zinc-300 md:text-xl">{f.ctaText}</p>
            <PrimaryButton to="/contact">{f.ctaButton}</PrimaryButton>
          </Reveal>
        </div>
      </div>
    </section>
  );
};

/* ------------------------------------------------------------------ */
/* Scroll-scrubbed process timeline                                    */
/* ------------------------------------------------------------------ */

const Step = ({ i, n, progress, title, description }: { i: number; n: number; progress: MotionValue<number>; title: string; description: string }) => {
  const at = (i + 0.5) / n;
  const active = useTransform(progress, [at - 0.12, at], [0, 1]);
  const color = useTransform(active, [0, 1], ['rgba(255,255,255,0.08)', 'rgba(59,130,246,1)']);
  const opacity = useTransform(active, [0, 1], [0.35, 1]);
  const x = useTransform(active, [0, 1], [24, 0]);
  return (
    <div className="relative grid grid-cols-[56px_1fr] gap-6 py-10 md:grid-cols-[96px_1fr] md:gap-10">
      <motion.div style={{ borderColor: color }} className="relative z-10 flex h-14 w-14 items-center justify-center rounded-2xl border-2 bg-[var(--bg)] md:h-24 md:w-24 md:rounded-3xl">
        <motion.span style={{ color }} className="font-display text-lg font-extrabold md:text-3xl">0{i + 1}</motion.span>
      </motion.div>
      <motion.div style={{ opacity, x }}>
        <h4 className="font-display mb-3 text-2xl font-bold md:text-4xl">{title}</h4>
        <p className="max-w-xl text-zinc-400 md:text-lg">{description}</p>
      </motion.div>
    </div>
  );
};

export const ScrubSteps = ({ title, steps }: { title: string; steps: { title: string; description: string }[] }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 70%', 'end 60%'] });
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30 });
  const scaleY = useTransform(p, [0, 1], [0, 1]);
  return (
    <section className="relative py-28 md:py-40">
      <div className="mx-auto max-w-5xl px-6">
        <SplitText text={title} className="font-display mb-16 text-5xl font-extrabold tracking-tight md:text-7xl" />
        <div ref={ref} className="relative">
          <div className="absolute bottom-10 left-[27px] top-10 w-[2px] bg-white/[0.06] md:left-[47px]" />
          <motion.div style={{ scaleY }} className="absolute bottom-10 left-[27px] top-10 w-[2px] origin-top bg-gradient-to-b from-[var(--blue-bright)] to-[var(--steel)] shadow-[0_0_14px_var(--blue)] md:left-[47px]" />
          {steps.map((s, i) => <Step key={i} i={i} n={steps.length} progress={p} title={s.title} description={s.description} />)}
        </div>
      </div>
    </section>
  );
};
