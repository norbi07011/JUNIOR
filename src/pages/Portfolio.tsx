import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { translations, Language } from '../translations';
import { fx } from '../translations/fx';
import { EASE, Reveal, SplitText, ZoomLens, useLenis } from '../fx/core';
import { Spotlights } from '../fx/canvas';
import { galleryImages } from '../data';
import { CTASection, Eyebrow } from '../components/Shared';
import { useMediaQuery } from './Home';

/* ------------------------------------------------------------------ */
/* Coverflow carousel                                                  */
/* ------------------------------------------------------------------ */

const Coverflow = ({ images, index, setIndex, onOpen, label }: { images: string[]; index: number; setIndex: (i: number) => void; onOpen: (i: number) => void; label: string }) => {
  const mobile = useMediaQuery('(max-width: 767px)');
  const spacing = mobile ? 62 : 58;
  return (
    <motion.div
      className="relative mx-auto h-[56svh] max-h-[620px] min-h-[360px] w-full touch-pan-y"
      style={{ perspective: 1400 }}
      onPanEnd={(_, info) => {
        if (info.offset.x < -50) setIndex(Math.min(images.length - 1, index + 1));
        else if (info.offset.x > 50) setIndex(Math.max(0, index - 1));
      }}
    >
      <div className="absolute inset-0" style={{ transformStyle: 'preserve-3d' }}>
        {images.map((src, i) => {
          const off = i - index;
          const abs = Math.abs(off);
          if (abs > 4) return null;
          return (
            <motion.button
              key={src}
              onClick={() => (off === 0 ? onOpen(i) : setIndex(i))}
              aria-label={`${label} ${i + 1}`}
              className="absolute left-1/2 top-1/2 aspect-[3/4] h-[88%] overflow-hidden rounded-[1.75rem] border border-white/10 bg-black shadow-[0_40px_80px_rgba(0,0,0,0.6)]"
              initial={false}
              animate={{
                x: `${-50 + off * spacing}%`,
                rotateY: off === 0 ? 0 : off > 0 ? -48 : 48,
                z: -abs * 160 - (off === 0 ? 0 : 80),
                scale: off === 0 ? 1 : 0.86,
                opacity: abs > 3 ? 0 : 1,
                filter: off === 0 ? 'brightness(1)' : `brightness(${0.75 - abs * 0.12})`,
              }}
              style={{ zIndex: 50 - abs, y: '-50%' }}
              transition={{ type: 'spring', stiffness: 160, damping: 22 }}
            >
              <img src={src} alt="" className="h-full w-full object-cover" draggable={false} loading={abs > 1 ? 'lazy' : 'eager'} />
              {/* floor reflection */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-white/5" />
              {off === 0 && (
                <span className="absolute bottom-4 right-4 flex h-10 w-10 items-center justify-center rounded-full bg-white/15 backdrop-blur-md"><Maximize2 size={16} /></span>
              )}
            </motion.button>
          );
        })}
      </div>
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */

export const Portfolio = ({ lang }: { lang: Language }) => {
  const t = translations[lang].portfolio;
  const f = fx[lang];
  const [cat, setCat] = useState(t.categories[0].id);
  const [index, setIndex] = useState(0);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const lenis = useLenis();
  const images = galleryImages[cat] ?? [];
  const active = t.categories.find((c) => c.id === cat)!;

  useEffect(() => { setIndex(Math.min(1, images.length - 1)); }, [cat, images.length]);
  useEffect(() => {
    if (lightbox === null) { lenis?.start(); return; }
    lenis?.stop();
    const key = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null);
      if (e.key === 'ArrowRight') setLightbox((i) => (i === null ? i : (i + 1) % images.length));
      if (e.key === 'ArrowLeft') setLightbox((i) => (i === null ? i : (i - 1 + images.length) % images.length));
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [lightbox, images.length, lenis]);

  useEffect(() => {
    if (lightbox !== null) return;
    const key = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight') setIndex((i) => Math.min(images.length - 1, i + 1));
      if (e.key === 'ArrowLeft') setIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, [lightbox, images.length]);

  return (
    <div>
      <section className="relative overflow-hidden pb-10 pt-36 md:pt-44">
        <Spotlights className="absolute inset-0 opacity-70" />
        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><Eyebrow>{translations[lang].nav.portfolio}</Eyebrow></motion.div>
          <SplitText as="h1" by="char" onView={false} delay={0.1} text={t.title} className="font-display mt-6 text-6xl font-extrabold tracking-tight md:text-9xl" />

          {/* category selector */}
          <div className="mt-10 flex flex-wrap gap-2" role="tablist">
            {t.categories.map((c) => (
              <button
                key={c.id}
                role="tab"
                aria-selected={cat === c.id}
                onClick={() => setCat(c.id)}
                className={`relative rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${cat === c.id ? 'text-black' : 'text-zinc-400 hover:text-white'}`}
              >
                {cat === c.id && <motion.span layoutId="cat-pill" className="absolute inset-0 rounded-full bg-[var(--steel)]" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                <span className="relative">{c.name} <span className={cat === c.id ? 'text-black/50' : 'text-zinc-600'}>{galleryImages[c.id]?.length ?? 0}</span></span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden pb-24">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-[50vmin] w-[80vmin] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[var(--blue)]/15 blur-[120px]" />
        <AnimatePresence mode="wait">
          <motion.div key={cat} initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -30 }} transition={{ duration: 0.5, ease: EASE }}>
            <Coverflow images={images} index={index} setIndex={setIndex} onOpen={(i) => setLightbox(i)} label={active.name} />
          </motion.div>
        </AnimatePresence>

        <div className="relative mx-auto mt-6 flex max-w-7xl flex-col items-center gap-6 px-6">
          <div className="flex items-center gap-4">
            <button onClick={() => setIndex(Math.max(0, index - 1))} disabled={index === 0} aria-label={f.prev} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 disabled:opacity-30 hover:border-white/40"><ChevronLeft size={20} /></button>
            <span className="font-display min-w-[5ch] text-center text-lg font-bold tabular-nums">{String(index + 1).padStart(2, '0')}<span className="text-zinc-600"> / {String(images.length).padStart(2, '0')}</span></span>
            <button onClick={() => setIndex(Math.min(images.length - 1, index + 1))} disabled={index >= images.length - 1} aria-label={f.next} className="flex h-12 w-12 items-center justify-center rounded-full border border-white/15 disabled:opacity-30 hover:border-white/40"><ChevronRight size={20} /></button>
          </div>
          <div className="flex max-w-full gap-2 overflow-x-auto pb-2">
            {images.map((src, i) => (
              <button key={src} onClick={() => setIndex(i)} aria-label={`${active.name} ${i + 1}`}
                className={`h-16 w-12 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${i === index ? 'border-[var(--blue-bright)] opacity-100' : 'border-transparent opacity-40 hover:opacity-80'}`}>
                <img src={src} alt="" className="h-full w-full object-cover" loading="lazy" />
              </button>
            ))}
          </div>
          <Reveal className="max-w-2xl text-center">
            <h2 className="font-display text-3xl font-bold">{active.name}</h2>
            <p className="mt-3 text-zinc-400">{active.description}</p>
          </Reveal>
        </div>
      </section>

      {/* Lightbox with magnifier */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            role="dialog" aria-modal="true"
          >
            <motion.div key={lightbox} initial={{ scale: 0.9, opacity: 0, rotateX: 10 }} animate={{ scale: 1, opacity: 1, rotateX: 0 }} transition={{ ease: EASE, duration: 0.6 }} onClick={(e) => e.stopPropagation()}>
              <ZoomLens src={images[lightbox]} alt={`${active.name} ${lightbox + 1}`} />
            </motion.div>
            <p className="mt-4 hidden text-xs uppercase tracking-[0.3em] text-zinc-500 md:block">{f.galleryHint}</p>
            <button onClick={() => setLightbox(null)} aria-label={f.close} className="absolute right-5 top-5 flex h-12 w-12 items-center justify-center rounded-full border border-white/15 bg-black/50 hover:border-white/40"><X size={22} /></button>
            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox - 1 + images.length) % images.length); }} aria-label={f.prev} className="absolute left-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50"><ChevronLeft /></button>
                <button onClick={(e) => { e.stopPropagation(); setLightbox((lightbox + 1) % images.length); }} aria-label={f.next} className="absolute right-4 top-1/2 flex h-12 w-12 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/50"><ChevronRight /></button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <CTASection lang={lang} />
    </div>
  );
};
