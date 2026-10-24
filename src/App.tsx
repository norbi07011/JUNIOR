import { lazy, Suspense, useEffect, useState } from 'react';
import { BrowserRouter, HashRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, useMotionValue } from 'motion/react';
import { translations, Language } from './translations';
import { fx } from './translations/fx';
import { ScrollProgress, SmoothScroll, SplitText, useLenis, asset } from './fx/core';
import { LogoIntro } from './fx/canvas';
import { Window3D } from './fx/Window3D';
import { QuoteProvider } from './fx/nav';
import { Navbar, Footer, FloatingButtons } from './components/Layout';
import { PrimaryButton } from './components/Shared';
import { Home } from './pages/Home';
const About = lazy(() => import('./pages/About').then((m) => ({ default: m.About })));
const Services = lazy(() => import('./pages/Services').then((m) => ({ default: m.Services })));
const Portfolio = lazy(() => import('./pages/Portfolio').then((m) => ({ default: m.Portfolio })));
const Contact = lazy(() => import('./pages/Contact').then((m) => ({ default: m.Contact })));

/** Preview builds (static hosting without SPA rewrites) set VITE_HASH_ROUTER=1. */
const Router = import.meta.env.VITE_HASH_ROUTER ? HashRouter : BrowserRouter;

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const lenis = useLenis();
  useEffect(() => {
    if (lenis) lenis.scrollTo(0, { immediate: true, force: true });
    else window.scrollTo(0, 0);
  }, [pathname, lenis]);
  return null;
};

const NotFound = ({ lang }: { lang: Language }) => {
  const u = translations[lang].ui;
  const open = useMotionValue(0.7);
  return (
    <section className="flex min-h-[100svh] items-center justify-center px-6 pt-24">
      <div className="grid items-center gap-16 md:grid-cols-2">
        <Window3D image={asset('/okna-dachowe.jpeg')} open={open} width={220} height={300} className="mx-auto" />
        <div>
          <SplitText as="h1" by="char" onView={false} text="404" className="font-display text-9xl font-extrabold text-blue-gradient" />
          <h2 className="font-display mb-4 mt-2 text-3xl font-bold">{u.notFoundTitle}</h2>
          <p className="mb-10 text-lg text-zinc-400">{u.notFoundText}</p>
          <PrimaryButton to="/">{u.notFoundButton}</PrimaryButton>
        </div>
      </div>
    </section>
  );
};

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem('app_lang') as Language | null;
      return saved && saved in translations ? saved : 'nl';
    } catch { return 'nl'; }
  });

  useEffect(() => {
    try { localStorage.setItem('app_lang', lang); } catch { /* storage blocked */ }
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <Router>
      <SmoothScroll>
        <QuoteProvider>
          <ScrollToTop />
          <LogoIntro label={fx[lang].skipIntro} logo={asset('/logo-cut.png')} />
          <ScrollProgress />
          <div id="shake-root" className="grain flex min-h-screen flex-col bg-[var(--bg)] font-sans text-white">
            <Navbar lang={lang} setLang={setLang} />
            <motion.main className="flex-grow">
              <Suspense fallback={<div className="min-h-screen" />}>
              <Routes>
                <Route path="/" element={<Home lang={lang} />} />
                <Route path="/about" element={<About lang={lang} />} />
                <Route path="/services" element={<Services lang={lang} />} />
                <Route path="/portfolio" element={<Portfolio lang={lang} />} />
                <Route path="/contact" element={<Contact lang={lang} />} />
                <Route path="*" element={<NotFound lang={lang} />} />
              </Routes>
              </Suspense>
            </motion.main>
            <Footer lang={lang} />
          </div>
          <FloatingButtons />
        </QuoteProvider>
      </SmoothScroll>
    </Router>
  );
}
