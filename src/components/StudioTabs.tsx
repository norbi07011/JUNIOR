import { lazy, Suspense, useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import type { Language } from '../translations';
import type { StudioContent } from '../fx/studio/StudioView';
import { asset, EASE, Reveal, SplitText } from '../fx/core';
import { Eyebrow } from './Shared';

type Loaded = { factory: (host: HTMLElement, opts: Record<string, unknown>) => unknown; content: Record<Language, StudioContent> };

/** Every montage studio: tab label, poster and a lazy loader (scene + texts). */
export const STUDIOS: { id: string; tab: Record<Language, string>; poster: string; load: () => Promise<Loaded> }[] = [
  {
    id: 'kozijn',
    tab: { nl: 'Kozijnen', en: 'Window frames', pl: 'Okna' },
    poster: '/projekt-okna-1.jpeg',
    load: async () => {
      const [{ createKozijnStudio }, { studioText }] = await Promise.all([import('../fx/studio/kozijnStudio'), import('../fx/studio/studioText')]);
      return { factory: createKozijnStudio, content: studioText as unknown as Record<Language, StudioContent> };
    },
  },
];

const StudioView = lazy(() => import('../fx/studio/StudioView').then((m) => ({ default: m.StudioView })));

export const StudioTabs = ({ lang, title, intro, only }: { lang: Language; title: Record<Language, string>; intro: Record<Language, string>; only?: string[] }) => {
  const list = only ? STUDIOS.filter((s) => only.includes(s.id)) : STUDIOS;
  const [active, setActive] = useState(list[0].id);
  const [loaded, setLoaded] = useState<Record<string, Loaded>>({});
  const entry = list.find((s) => s.id === active)!;
  const data = loaded[active];

  useEffect(() => {
    if (loaded[active]) return;
    let alive = true;
    entry.load().then((d) => { if (alive) setLoaded((p) => ({ ...p, [active]: d })); });
    return () => { alive = false; };
  }, [active, entry, loaded]);

  const content = data?.content[lang];
  const poster = (
    <div className="aspect-[4/5] overflow-hidden rounded-[28px] border border-white/10 bg-[var(--panel)] md:aspect-video">
      <img src={asset(entry.poster)} alt="" className="h-full w-full object-cover opacity-40" />
    </div>
  );

  return (
    <section className="relative py-24 md:py-32">
      <div className="pointer-events-none absolute left-1/2 top-1/4 h-[50vmin] w-[80vmin] -translate-x-1/2 rounded-full bg-[var(--blue)]/10 blur-[140px]" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-6">
        <div className="mb-10 max-w-3xl px-2 md:px-0">
          <Eyebrow>{list.length > 1 ? '3D' : (data?.content[lang].kicker ?? '3D')}</Eyebrow>
          <SplitText key={`${lang}-tabs`} text={title[lang]} className="font-display mt-6 text-4xl font-extrabold leading-[0.95] tracking-tight md:text-7xl" />
          <Reveal><p className="mt-6 text-lg leading-relaxed text-zinc-400">{intro[lang]}</p></Reveal>
        </div>

        {list.length > 1 && (
          <div className="-mx-4 mb-6 overflow-x-auto px-4 md:mx-0 md:px-0" role="tablist">
            <div className="flex w-max gap-2">
              {list.map((s) => (
                <button
                  key={s.id}
                  role="tab"
                  aria-selected={active === s.id}
                  onClick={() => setActive(s.id)}
                  className={`relative whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-bold transition-colors ${active === s.id ? 'text-white' : 'text-zinc-400 hover:text-white'}`}
                >
                  {active === s.id && <motion.span layoutId="studio-tab" className="absolute inset-0 rounded-full bg-[var(--blue)] shadow-[0_8px_30px_var(--blue-glow)]" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                  <span className="relative">{s.tab[lang]}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        <AnimatePresence mode="wait">
          <motion.div key={active} initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -16 }} transition={{ duration: 0.45, ease: EASE }}>
            {content && list.length > 1 && (
              <div className="mb-6 max-w-3xl px-2 md:px-0">
                <p className="text-[11px] font-bold uppercase tracking-[0.28em] text-[var(--blue-bright)]">{content.kicker}</p>
                <h3 className="font-display mt-2 text-2xl font-bold md:text-4xl">{content.title}</h3>
                <p className="mt-3 text-zinc-400">{content.intro}</p>
              </div>
            )}
            {data && content ? (
              <Suspense fallback={poster}>
                <StudioView lang={lang} factory={data.factory as never} content={content} poster={asset(entry.poster)} />
              </Suspense>
            ) : poster}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
