import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'motion/react';
import { Menu, X, Mail, MessageSquare, Instagram, Facebook, Linkedin, ArrowUp, ClipboardList, Phone, MapPin } from 'lucide-react';
import { useLocation } from 'react-router-dom';
import { translations, Language } from '../translations';
import { fx } from '../translations/fx';
import { asset, Magnetic, TextFill, useLenis, VelocityMarquee, EASE } from '../fx/core';
import { TLink, useQuote } from '../fx/nav';
import { CONTACT } from '../data';

/* ------------------------------------------------------------------ */

export const LanguageSwitcher = ({ current, onChange }: { current: Language; onChange: (l: Language) => void }) => {
  const langs: Language[] = ['nl', 'en', 'pl'];
  return (
    <div className="relative flex items-center rounded-full border border-white/10 bg-white/[0.03] p-1 text-[11px] font-bold tracking-widest">
      {langs.map((l) => (
        <button
          key={l}
          onClick={() => onChange(l)}
          aria-pressed={current === l}
          className={`relative z-10 rounded-full px-2.5 py-1 uppercase transition-colors ${current === l ? 'text-black' : 'text-zinc-400 hover:text-white'}`}
        >
          {current === l && <motion.span layoutId="lang-pill" className="absolute inset-0 -z-10 rounded-full bg-[var(--steel)]" transition={{ type: 'spring', stiffness: 400, damping: 30 }} />}
          {l}
        </button>
      ))}
    </div>
  );
};

const QuoteBadge = ({ lang, onClick }: { lang: Language; onClick?: () => void }) => {
  const { items } = useQuote();
  return (
    <TLink
      to="/contact"
      onClick={onClick}
      className="relative flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-sm font-semibold text-zinc-200 hover:border-[var(--blue-bright)] hover:text-white transition-colors"
      aria-label={`${fx[lang].quote} (${items.length})`}
    >
      <span id="quote-target" className="relative inline-flex">
        <ClipboardList size={18} />
        <AnimatePresence>
          {items.length > 0 && (
            <motion.span
              key={items.length}
              initial={{ scale: 0, y: -6 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0 }}
              className="absolute -right-2.5 -top-2.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-[var(--blue-bright)] px-1 text-[10px] font-bold text-white shadow-[0_0_12px_var(--blue)]"
            >
              {items.length}
            </motion.span>
          )}
        </AnimatePresence>
      </span>
      <span className="hidden xl:inline">{fx[lang].quote}</span>
    </TLink>
  );
};

/** Window mark from the logo, as crisp SVG. */
export const LogoMark = ({ className = '' }: { className?: string }) => (
  <svg viewBox="0 0 28 36" className={className} aria-hidden>
    <defs>
      <linearGradient id="lm-steel" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#f5f7fa" /><stop offset=".5" stopColor="#8b929d" /><stop offset="1" stopColor="#d9dde3" /></linearGradient>
      <linearGradient id="lm-glass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#60a5fa" /><stop offset="1" stopColor="#1d4ed8" /></linearGradient>
    </defs>
    <rect x="1.5" y="1.5" width="25" height="33" rx="1.5" fill="none" stroke="url(#lm-steel)" strokeWidth="3" />
    <rect x="5" y="5" width="7.5" height="26" fill="url(#lm-glass)" />
    <rect x="15.5" y="5" width="7.5" height="9" fill="url(#lm-glass)" />
    <path d="M6 22 L11.5 12 M17 12.5 L21.5 6.5" stroke="#bfdbfe" strokeOpacity=".6" strokeWidth="1" />
  </svg>
);

/* ------------------------------------------------------------------ */
/* Smart sticky header — hides on scroll down, returns on scroll up    */
/* ------------------------------------------------------------------ */

export const Navbar = ({ lang, setLang }: { lang: Language; setLang: (l: Language) => void }) => {
  const t = translations[lang].nav;
  const [hidden, setHidden] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { scrollY } = useScroll();
  const { pathname } = useLocation();

  useMotionValueEvent(scrollY, 'change', (y) => {
    const prev = scrollY.getPrevious() ?? 0;
    setScrolled(y > 40);
    setHidden(y > 160 && y > prev + 2 && !open);
    if (y < prev - 2) setHidden(false);
  });
  useEffect(() => { setOpen(false); setHidden(false); }, [pathname]);
  useEffect(() => { document.documentElement.style.overflow = open ? 'hidden' : ''; }, [open]);

  const links = [
    { name: t.home, href: '/' },
    { name: t.about, href: '/about' },
    { name: t.services, href: '/services' },
    { name: t.portfolio, href: '/portfolio' },
    { name: t.contact, href: '/contact' },
  ];

  return (
    <>
      <motion.header
        animate={{ y: hidden ? '-110%' : '0%' }}
        transition={{ duration: 0.45, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 md:px-6 md:pt-4"
      >
        <nav className={`mx-auto flex max-w-7xl items-center justify-between rounded-2xl px-4 py-3 transition-all duration-500 md:px-5 ${scrolled ? 'border border-white/10 bg-[#0a0c11]/70 shadow-[0_10px_40px_rgba(0,0,0,0.4)] backdrop-blur-xl' : 'border border-transparent'}`}>
          <TLink to="/" className="group flex items-center gap-3" aria-label="JuniorJob Onderhoud — home">
            <LogoMark className="h-9 w-7 transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110" />
            <span className="font-display text-lg font-extrabold leading-none tracking-tight">
              JUNIOR<span className="text-[var(--blue-bright)]">JOB</span>
              <span className="block text-[9px] font-semibold tracking-[0.42em] text-zinc-500">ONDERHOUD</span>
            </span>
          </TLink>

          <div className="hidden items-center gap-1 lg:flex">
            {links.map((l) => (
              <TLink key={l.href} to={l.href} end className="relative px-4 py-2 text-sm font-medium">
                {({ isActive }) => (
                  <>
                    {isActive && <motion.span layoutId="nav-pill" className="absolute inset-0 rounded-full bg-white/[0.07] ring-1 ring-white/10" transition={{ type: 'spring', stiffness: 380, damping: 30 }} />}
                    <span className={`relative ${isActive ? 'text-white' : 'text-zinc-400 hover:text-white transition-colors'}`}>{l.name}</span>
                  </>
                )}
              </TLink>
            ))}
          </div>

          <div className="flex items-center gap-2 md:gap-3">
            <div className="hidden md:block"><LanguageSwitcher current={lang} onChange={setLang} /></div>
            <QuoteBadge lang={lang} />
            <div className="hidden lg:block">
              <Magnetic>
                <TLink to="/contact" className="block rounded-full bg-white px-5 py-2.5 text-sm font-bold text-black hover:bg-[var(--steel)] transition-colors">
                  {translations[lang].hero.ctaPrimary}
                </TLink>
              </Magnetic>
            </div>
            <button className="rounded-full border border-white/10 p-2.5 lg:hidden" onClick={() => setOpen(true)} aria-label="Menu">
              <Menu size={20} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="fixed inset-0 z-[80] flex flex-col bg-[#06070a]/95 px-6 pb-10 pt-6 backdrop-blur-2xl"
            initial={{ clipPath: 'circle(0% at 92% 4%)' }}
            animate={{ clipPath: 'circle(150% at 92% 4%)' }}
            exit={{ clipPath: 'circle(0% at 92% 4%)' }}
            transition={{ duration: 0.7, ease: EASE }}
          >
            <div className="flex items-center justify-between">
              <LanguageSwitcher current={lang} onChange={setLang} />
              <button onClick={() => setOpen(false)} className="rounded-full border border-white/10 p-3" aria-label="Close"><X size={22} /></button>
            </div>
            <div className="mt-14 flex flex-col gap-2">
              {links.map((l, i) => (
                <motion.div key={l.href} initial={{ y: 60, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.15 + i * 0.06, ease: EASE, duration: 0.7 }}>
                  <TLink to={l.href} end onClick={() => setOpen(false)} className={({ isActive }) => `font-display block text-5xl font-extrabold tracking-tight ${isActive ? 'text-blue-gradient' : 'text-white'}`}>
                    {l.name}
                  </TLink>
                </motion.div>
              ))}
            </div>
            <div className="mt-auto space-y-3 border-t border-white/10 pt-6 text-zinc-400">
              <a href={CONTACT.phoneHref} className="flex items-center gap-3"><Phone size={16} /> {CONTACT.phone}</a>
              <a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3"><Mail size={16} /> {CONTACT.email}</a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

/* ------------------------------------------------------------------ */

const Sep = () => (
  <svg viewBox="0 0 24 32" className="mx-8 h-8 w-6 shrink-0 text-[var(--blue-bright)]" aria-hidden>
    <rect x="1.5" y="1.5" width="21" height="29" rx="1.5" fill="none" stroke="currentColor" strokeWidth="2.5" />
    <path d="M12 2v28M2 12h20" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export const SloganMarquee = ({ lang }: { lang: Language }) => {
  const slogans = translations[lang].slogans;
  return (
    <section className="relative overflow-hidden border-y border-white/5 bg-[var(--bg-2)] py-10" aria-label="Slogans">
      <VelocityMarquee
        baseSpeed={2.2}
        items={slogans.map((s, i) => (
          <React.Fragment key={i}>
            <span className={`font-display text-5xl font-extrabold tracking-tight md:text-7xl ${i % 2 ? 'text-transparent [-webkit-text-stroke:1.5px_var(--steel-dim)]' : 'text-steel-gradient'}`}>{s}</span>
            <Sep />
          </React.Fragment>
        ))}
      />
      <VelocityMarquee
        reverse
        baseSpeed={1.6}
        className="mt-4 opacity-60"
        items={['RAMEN', 'DEUREN', 'HST', 'DAKRAMEN', 'KERALIT', 'VENSTERBANKEN', 'AFWERKING'].map((w) => (
          <span key={w} className="mx-6 text-sm font-bold tracking-[0.5em] text-zinc-500">{w} <span className="text-[var(--blue-bright)]">/</span></span>
        ))}
      />
    </section>
  );
};

/* ------------------------------------------------------------------ */

export const Footer = ({ lang }: { lang: Language }) => {
  const t = translations[lang].nav;
  const u = translations[lang].ui;
  const f = fx[lang];
  const lenis = useLenis();
  const toTop = () => (lenis ? lenis.scrollTo(0, { duration: 1.6 }) : window.scrollTo({ top: 0, behavior: 'smooth' }));

  return (
    <footer className="relative overflow-hidden border-t border-white/5 bg-[var(--bg)] pt-24">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="max-w-sm text-zinc-400 leading-relaxed">{u.footerDesc}</p>
            <div className="mt-8 flex gap-3">
              {[Instagram, Facebook, Linkedin].map((Icon, i) => (
                <Magnetic key={i} strength={0.5}>
                  <a href={['https://www.instagram.com/', 'https://www.facebook.com/', 'https://www.linkedin.com/'][i]} target="_blank" rel="noreferrer"
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-zinc-400 hover:border-[var(--blue-bright)] hover:bg-[var(--blue)] hover:text-white transition-colors">
                    <Icon size={18} />
                  </a>
                </Magnetic>
              ))}
            </div>
          </div>
          <div className="md:col-span-3">
            <h6 className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">{u.linksTitle}</h6>
            <ul className="space-y-3">
              {[['/', t.home], ['/about', t.about], ['/services', t.services], ['/portfolio', t.portfolio], ['/contact', t.contact]].map(([href, name]) => (
                <li key={href}><TLink to={href} className="group inline-flex items-center gap-2 text-zinc-300 hover:text-white"><span className="h-px w-0 bg-[var(--blue-bright)] transition-all group-hover:w-4" />{name}</TLink></li>
              ))}
            </ul>
          </div>
          <div className="md:col-span-4">
            <h6 className="mb-6 text-xs font-bold uppercase tracking-[0.3em] text-zinc-500">{translations[lang].contact.infoTitle}</h6>
            <ul className="space-y-3 text-zinc-300">
              <li><a href={CONTACT.phoneHref} className="flex items-center gap-3 hover:text-white"><Phone size={16} className="text-[var(--blue-bright)]" />{CONTACT.phone}</a></li>
              <li><a href={`mailto:${CONTACT.email}`} className="flex items-center gap-3 break-all hover:text-white"><Mail size={16} className="shrink-0 text-[var(--blue-bright)]" />{CONTACT.email}</a></li>
              <li className="flex items-center gap-3"><MapPin size={16} className="shrink-0 text-[var(--blue-bright)]" />{CONTACT.address}</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="mt-20 px-2">
        <TextFill text={f.footerBig} className="text-center text-[15.5vw] font-black" />
      </div>

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 border-t border-white/5 px-6 py-8 text-sm text-zinc-600 md:flex-row">
        <p>© {new Date().getFullYear()} JuniorJob Onderhoud. {translations[lang].footer.rights}</p>
        <button onClick={toTop} className="group flex items-center gap-2 text-zinc-400 hover:text-white">
          {f.backToTop}
          <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/10 transition-transform group-hover:-translate-y-1"><ArrowUp size={14} /></span>
        </button>
      </div>
    </footer>
  );
};

export const FloatingButtons = () => (
  <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3 md:bottom-8 md:right-8">
    <Magnetic strength={0.4}>
      <a href={`mailto:${CONTACT.email}`} title="E-mail" aria-label="E-mail"
        className="flex h-13 w-13 items-center justify-center rounded-full bg-[var(--blue)] text-white shadow-[0_10px_30px_var(--blue-glow)] transition-transform hover:scale-110 h-[52px] w-[52px]">
        <Mail size={22} />
      </a>
    </Magnetic>
    <Magnetic strength={0.4}>
      <a href={`https://wa.me/${CONTACT.whatsapp}`} target="_blank" rel="noreferrer" title="WhatsApp" aria-label="WhatsApp"
        className="relative flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#22c55e] text-white shadow-[0_10px_30px_rgba(34,197,94,0.35)] transition-transform hover:scale-110">
        <span className="absolute inset-0 animate-ping rounded-full bg-[#22c55e]/40" />
        <MessageSquare size={22} className="relative" />
      </a>
    </Magnetic>
  </div>
);
