import { lazy, Suspense, useEffect, useState } from 'react';

import { Star, Quote } from 'lucide-react';
import { translations, Language } from '../translations';
import { fx } from '../translations/fx';
import { asset, Reveal, RollingNumber, SplitText, TiltCard } from '../fx/core';
import { CTASection, Eyebrow, ScrubSteps } from '../components/Shared';
import { SloganMarquee } from '../components/Layout';
import { studioText } from '../fx/studio/studioText';
import { Thermal } from '../components/Thermal';
import { CinemaHero, ServicesRail, BeforeAfter } from '../components/Premium';

const MontageStudio = lazy(() => import('../fx/studio/StudioView').then((m) => ({ default: m.MontageStudio })));

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
              <div>
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
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
};

export const Home = ({ lang }: { lang: Language }) => (
  <>
    <CinemaHero lang={lang} />
    <Stats lang={lang} />
    <SloganMarquee lang={lang} />
    <ServicesRail lang={lang} />
    <BeforeAfter lang={lang} />
    <Studio lang={lang} />
    <Thermal lang={lang} />
    <WhyUs lang={lang} />
    <ScrubSteps title={translations[lang].process.title} steps={translations[lang].process.steps} />
    <Testimonials lang={lang} />
    <CTASection lang={lang} />
  </>
);
