import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ChevronLeft, ChevronRight, X, Maximize2 } from 'lucide-react';
import { translations, Language } from '../translations';
import { fx } from '../translations/fx';
import { EASE, SplitText, ZoomLens, useLenis } from '../fx/core';

import { galleryImages } from '../data';
import { CTASection, Eyebrow } from '../components/Shared';
import { BeforeAfter } from '../components/Premium';


/* ------------------------------------------------------------------ */

export const Portfolio = ({ lang }: { lang: Language }) => {
  const t = translations[lang].portfolio;
  const f = fx[lang];
  const [cat, setCat] = useState(t.categories[0].id);
  const [lightbox, setLightbox] = useState<number | null>(null);
  const lenis = useLenis();
  const images = galleryImages[cat] ?? [];
  const active = t.categories.find((c) => c.id === cat)!;

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

  return (
    <div>
      <section className="relative overflow-hidden pb-10 pt-36 md:pt-44">
        <div className="relative mx-auto max-w-7xl px-6">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><Eyebrow>{translations[lang].nav.portfolio}</Eyebrow></motion.div>
          <SplitText as="h1" onView={false} delay={0.1} text={t.title} className="font-display mt-6 text-5xl font-extrabold tracking-tight md:text-8xl" />

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

      <section className="relative pb-24">
        <div className="mx-auto max-w-7xl px-5 md:px-6">
          <motion.p key={`d-${cat}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-8 max-w-2xl text-lg text-zinc-400">{active.description}</motion.p>
          <AnimatePresence mode="wait">
            <motion.div key={cat} className="columns-1 gap-4 sm:columns-2 lg:columns-3 [&>*]:mb-4"
              initial="hide" animate="show" exit="hide"
              variants={{ show: { transition: { staggerChildren: 0.05 } }, hide: { opacity: 0, transition: { duration: 0.2 } } }}>
              {images.map((src, i) => (
                <motion.button key={src} onClick={() => setLightbox(i)} aria-label={`${active.name} ${i + 1}`}
                  variants={{ hide: { opacity: 0, y: 24 }, show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE } } }}
                  className="group relative block w-full break-inside-avoid overflow-hidden rounded-[20px] border border-white/10 bg-[var(--panel)]">
                  <img src={src} alt="" loading={i > 3 ? 'lazy' : 'eager'} className="block w-full transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]" />
                  <span className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                  <span className="absolute bottom-4 left-4 flex items-center gap-2 text-sm font-bold opacity-0 transition-all duration-500 group-hover:opacity-100">
                    <Maximize2 size={16} /> {String(i + 1).padStart(2, '0')}
                  </span>
                </motion.button>
              ))}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      <BeforeAfter lang={lang} />

      {/* Lightbox with magnifier */}
      <AnimatePresence>
        {lightbox !== null && (
          <motion.div
            className="fixed inset-0 z-[120] flex flex-col items-center justify-center bg-black/95 p-4 backdrop-blur-xl"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
            role="dialog" aria-modal="true"
          >
            <motion.div key={lightbox} initial={{ scale: 0.96, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ ease: EASE, duration: 0.6 }} onClick={(e) => e.stopPropagation()}>
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
