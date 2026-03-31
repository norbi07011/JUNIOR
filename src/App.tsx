import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import { BrowserRouter, Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { 
  Menu, X, Phone, Mail, MapPin, ChevronRight, 
  CheckCircle2, Star, MessageSquare, ArrowRight,
  Instagram, Facebook, Linkedin, Globe,
  DoorOpen, LayoutGrid, Home as HomeIcon, Paintbrush, Ruler, ShieldCheck
} from 'lucide-react';
import { translations, Language } from './translations';

const NotFound = ({ lang }: { lang: Language }) => {
  const u = translations[lang].ui;
  return (
    <section className="min-h-screen flex items-center justify-center bg-black">
      <div className="text-center px-6">
        <h1 className="text-8xl font-bold text-blue-600 mb-6">404</h1>
        <h2 className="text-3xl font-bold mb-4">{u.notFoundTitle}</h2>
        <p className="text-zinc-400 mb-10 text-lg">{u.notFoundText}</p>
        <Link to="/" className="bg-blue-600 text-white px-8 py-4 rounded-full font-bold hover:bg-blue-700 transition-colors">
          {u.notFoundButton}
        </Link>
      </div>
    </section>
  );
};

// --- Helper Components ---

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

const Counter = ({ value, suffix = "", decimals = 0 }: { value: number, suffix?: string, decimals?: number }) => {
  const [count, setCount] = useState(0);
  const ref = React.useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      let startTime: number;
      const duration = 2000;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const progress = Math.min((currentTime - startTime) / duration, 1);
        
        // Ease out expo
        const ease = 1 - Math.pow(2, -10 * progress);
        setCount(ease * value);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [isInView, value]);

  return <span ref={ref}>{count.toFixed(decimals)}{suffix}</span>;
};

const LanguageSwitcher = ({ current, onChange }: { current: Language, onChange: (l: Language) => void }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  const langs: { code: Language, label: string, flag: string }[] = [
    { code: 'nl', label: 'NL', flag: '🇳🇱' },
    { code: 'en', label: 'EN', flag: '🇬🇧' },
    { code: 'pl', label: 'PL', flag: '🇵🇱' }
  ];

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:bg-white/5 transition-colors text-sm font-medium"
      >
        <span>{langs.find(l => l.code === current)?.flag}</span>
        <span>{langs.find(l => l.code === current)?.label}</span>
      </button>
      
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            className="absolute right-0 mt-2 w-24 bg-zinc-900 border border-white/10 rounded-xl overflow-hidden shadow-2xl z-50"
          >
            {langs.map(lang => (
              <button
                key={lang.code}
                onClick={() => {
                  onChange(lang.code);
                  setIsOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-2 text-sm hover:bg-white/5 transition-colors ${current === lang.code ? 'text-blue-400' : 'text-zinc-400'}`}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SloganBanner = ({ lang }: { lang: Language }) => {
  const slogans = translations[lang].slogans;
  return (
    <section className="py-20 bg-blue-600 overflow-hidden relative">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-0 w-full h-full flex flex-col justify-around text-9xl font-black whitespace-nowrap select-none">
          <div className="animate-marquee">JUNIORJOB JUNIORJOB JUNIORJOB JUNIORJOB</div>
          <div className="animate-marquee-reverse">ONDERHOUD ONDERHOUD ONDERHOUD ONDERHOUD</div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {slogans.slice(0, 3).map((slogan, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="text-center md:text-left"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-white leading-tight">
                {slogan}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Navbar = ({ lang, setLang }: { lang: Language, setLang: (l: Language) => void }) => {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const t = translations[lang].nav;

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: t.home, href: '/' },
    { name: t.about, href: '/about' },
    { name: t.services, href: '/services' },
    { name: t.portfolio, href: '/portfolio' },
    { name: t.contact, href: '/contact' },
  ];

  return (
    <nav className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-black/80 backdrop-blur-md py-4' : 'bg-transparent py-6'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <img src="/logo.jpeg" alt="JuniorJob" className="w-10 h-10 rounded-lg object-cover group-hover:scale-110 transition-transform" />
          <span className="text-xl font-bold tracking-tight">JuniorJob <span className="text-zinc-500 font-light">Onderhoud</span></span>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <NavLink 
              key={link.name} 
              to={link.href} 
              className={({ isActive }) => 
                `text-sm font-medium transition-colors ${isActive ? 'text-blue-500' : 'text-zinc-300 hover:text-white'}`
              }
            >
              {link.name}
            </NavLink>
          ))}
          <LanguageSwitcher current={lang} onChange={setLang} />
          <Link to="/contact" className="bg-white text-black px-5 py-2 rounded-full text-sm font-semibold hover:bg-zinc-200 transition-colors">
            {translations[lang].hero.ctaPrimary}
          </Link>
        </div>

        <button className="md:hidden text-white" onClick={() => setMobileMenuOpen(true)}>
          <Menu size={24} />
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            className="fixed inset-0 bg-black z-[60] p-8 flex flex-col"
          >
            <div className="flex justify-end mb-12">
              <button onClick={() => setMobileMenuOpen(false)}>
                <X size={32} />
              </button>
            </div>
            <div className="flex flex-col gap-6 text-2xl font-bold">
              {navLinks.map(link => (
                <NavLink 
                  key={link.name} 
                  to={link.href} 
                  onClick={() => setMobileMenuOpen(false)}
                  className={({ isActive }) => 
                    isActive ? 'text-blue-500' : 'text-white'
                  }
                >
                  {link.name}
                </NavLink>
              ))}
            </div>
            <div className="mt-auto pt-8 border-t border-white/10 flex items-center justify-between">
              <LanguageSwitcher current={lang} onChange={setLang} />
              <div className="flex gap-4">
                <Instagram size={20} className="text-zinc-400" />
                <Facebook size={20} className="text-zinc-400" />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

const Hero = ({ lang }: { lang: Language }) => {
  const t = translations[lang].hero;
  return (
    <section className="relative min-h-screen flex items-center pt-20 overflow-hidden">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img 
          src="/hero.jpeg" 
          alt="JuniorJob Onderhoud" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80"></div>
      </div>

      <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
        <div className="max-w-3xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1 rounded-full bg-blue-600/20 border border-blue-600/30 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6">
              {translations[lang].ui.heroBadge}
            </span>
            <h1 className="text-5xl md:text-7xl font-bold leading-[1.1] mb-8 tracking-tight">
              {t.title}
            </h1>
            <p className="text-lg md:text-xl text-zinc-400 mb-10 leading-relaxed max-w-2xl">
              {t.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/contact" className="bg-white text-black px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all group">
                {t.ctaPrimary}
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/contact" className="bg-zinc-900 text-white border border-white/10 px-8 py-4 rounded-full font-bold flex items-center justify-center gap-2 hover:bg-white/5 transition-all">
                {t.ctaSecondary}
              </Link>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Stats / Features Bar */}
      <div className="absolute bottom-0 left-0 w-full bg-zinc-900/50 backdrop-blur-sm border-t border-white/5 py-8 hidden lg:block">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          {[
            { label: translations[lang].ui.statsExperience, value: 10, suffix: '+ Jaar' },
            { label: translations[lang].ui.statsProjects, value: 500, suffix: '+' },
            { label: translations[lang].ui.statsWarranty, value: 10, suffix: ' Jaar' },
            { label: translations[lang].ui.statsSatisfaction, value: 9.8, suffix: '/10', decimals: 1 },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col">
              <span className="text-zinc-500 text-xs uppercase tracking-widest font-bold mb-1">{stat.label}</span>
              <span className="text-white text-xl font-bold">
                <Counter value={stat.value} suffix={stat.suffix} decimals={stat.decimals} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const About = ({ lang }: { lang: Language }) => {
  const t = translations[lang].about;
  const u = translations[lang].ui;

  return (
    <div className="bg-black text-white selection:bg-blue-500/30">

      {/* About Hero */}
      <section className="relative pt-48 pb-32 overflow-hidden min-h-[80vh] flex items-center">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-blue-600/10 blur-[150px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] bg-indigo-900/10 blur-[150px] rounded-full animate-pulse" style={{ animationDelay: '3s' }}></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 mix-blend-overlay"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10 w-full">
          <div className="flex flex-col lg:flex-row items-center gap-20">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1"
            >
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
              >
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
                <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-blue-400">{t.subtitle}</span>
              </motion.div>
              
              <h1 className="text-7xl md:text-9xl font-bold mb-10 tracking-tighter leading-[0.85]">
                {u.aboutHeading} <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600">{u.aboutBrand}</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed mb-12 max-w-xl font-light">
                {t.description}
              </p>

              <div className="flex flex-wrap gap-8">
                {[
                  { label: u.statsExperience, value: 10, suffix: '+' },
                  { label: u.statsProjects, value: 500, suffix: '+' },
                ].map((stat, i) => (
                  <div key={i}>
                    <div className="text-4xl font-bold text-white mb-1">
                      <Counter value={stat.value} suffix={stat.suffix} />
                    </div>
                    <div className="text-[10px] uppercase tracking-[0.3em] font-bold text-zinc-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, scale: 0.8, rotate: 5 }}
              animate={{ opacity: 1, scale: 1, rotate: 0 }}
              transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1] }}
              className="flex-1 relative"
            >
              <div className="relative z-10 rounded-3xl overflow-hidden shadow-[0_0_100px_rgba(37,99,235,0.2)] bg-zinc-900/50 p-8 flex items-center justify-center">
                <img 
                  src="/logo.jpeg" 
                  alt="JuniorJob Onderhoud Logo" 
                  className="w-full h-auto rounded-2xl object-contain hover:scale-105 transition-transform duration-[2s] ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-transparent mix-blend-overlay rounded-3xl"></div>
              </div>
              
              {/* Floating decorative elements */}
              <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/20 blur-3xl rounded-full animate-pulse"></div>
              <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-indigo-600/20 blur-3xl rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Mission & Vision - Split Layout */}
      <section className="py-40 bg-zinc-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-24 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="space-y-20"
            >
              <div className="group">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-[1px] bg-blue-600 group-hover:w-20 transition-all duration-500"></div>
                  <span className="text-blue-500 text-xs font-bold uppercase tracking-[0.3em]">{t.mission.title}</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter leading-tight">
                  {u.missionHeading} <br />
                  <span className="text-zinc-500">{u.missionHeadingSub}</span>
                </h2>
                <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-lg">
                  {t.mission.text}
                </p>
              </div>

              <div className="group">
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-[1px] bg-indigo-600 group-hover:w-20 transition-all duration-500"></div>
                  <span className="text-indigo-500 text-xs font-bold uppercase tracking-[0.3em]">{t.vision.title}</span>
                </div>
                <h2 className="text-4xl md:text-6xl font-bold mb-8 tracking-tighter leading-tight">
                  {u.visionHeading} <br />
                  <span className="text-zinc-500">{u.visionHeadingSub}</span>
                </h2>
                <p className="text-xl text-zinc-400 font-light leading-relaxed max-w-lg">
                  {t.vision.text}
                </p>
              </div>
            </motion.div>

            <div className="relative">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="rounded-[3rem] overflow-hidden aspect-[4/5] relative z-10 shadow-2xl"
              >
                <img 
                  src="/project-2.jpeg" 
                  alt="Precision Engineering" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/20"></div>
              </motion.div>
              
              {/* Floating Glass Card */}
              <motion.div 
                initial={{ x: 50, opacity: 0 }}
                whileInView={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="absolute -bottom-10 -left-10 z-20 p-10 bg-white/5 backdrop-blur-3xl border border-white/10 rounded-3xl max-w-xs"
              >
                <div className="text-5xl font-bold text-blue-500 mb-4">{u.precisionValue}</div>
                <p className="text-sm text-zinc-300 font-light leading-relaxed">
                  {u.precisionText}
                </p>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Bento Grid */}
      <section className="py-40 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-24">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-5xl md:text-7xl font-bold tracking-tighter mb-6"
            >
              {t.values.title}
            </motion.h2>
            <p className="text-zinc-500 uppercase tracking-[0.4em] text-xs font-bold">{u.valuesSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {t.values.items.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className={`group relative p-10 bg-zinc-900/30 border border-white/5 rounded-[3rem] hover:bg-zinc-900/50 transition-all duration-700 overflow-hidden backdrop-blur-sm
                  ${i === 0 || i === 3 ? 'md:col-span-2' : 'md:col-span-2'}
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative z-10">
                  <div className="w-12 h-12 bg-blue-600/10 rounded-xl flex items-center justify-center text-blue-500 mb-8 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
                    {i === 0 ? <Ruler size={24} /> : i === 1 ? <Paintbrush size={24} /> : i === 2 ? <MessageSquare size={24} /> : <ShieldCheck size={24} />}
                  </div>
                  <h4 className="text-2xl font-bold mb-4 tracking-tight">{value.title}</h4>
                  <p className="text-zinc-400 font-light leading-relaxed">
                    {value.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* History Timeline */}
      <section className="py-40 bg-zinc-950 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-32 gap-8">
            <motion.h2 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-6xl md:text-8xl font-bold tracking-tighter"
            >
              {t.history.title}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="text-zinc-500 max-w-xs text-right hidden md:block"
            >
              {u.historyDesc}
            </motion.p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 relative">
            {/* Horizontal line for desktop */}
            <div className="absolute top-0 left-0 w-full h-[1px] bg-white/10 hidden lg:block"></div>
            
            {t.history.items.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2 }}
                className="relative pt-12 group"
              >
                {/* Dot on the line */}
                <div className="absolute top-[-4px] left-0 w-2 h-2 rounded-full bg-blue-600 hidden lg:block group-hover:scale-150 transition-transform"></div>
                
                <div className="text-5xl font-black text-white/5 mb-6 group-hover:text-blue-600/20 transition-colors">{item.year}</div>
                <h4 className="text-xl font-bold mb-4 text-white group-hover:text-blue-500 transition-colors">{item.title}</h4>
                <p className="text-zinc-500 font-light leading-relaxed text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra-Modern CTA */}
      <section className="py-40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative p-20 md:p-32 rounded-[5rem] bg-gradient-to-br from-zinc-900 to-black border border-white/10 text-center overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
            
            <h2 className="text-5xl md:text-8xl font-bold mb-12 tracking-tighter leading-none">
              {u.ctaHeading} <br />
              <span className="text-blue-600">{u.ctaHeadingSub}</span>
            </h2>
            
            <Link 
              to="/contact" 
              className="group relative inline-flex items-center gap-6 px-12 py-6 bg-blue-600 text-white rounded-full font-bold text-xl overflow-hidden transition-all hover:scale-105 shadow-[0_20px_50px_rgba(37,99,235,0.3)]"
            >
              <span className="relative z-10">{u.ctaButton}</span>
              <ArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" size={28} />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const Services = ({ lang }: { lang: Language }) => {
  const t = translations[lang].services;
  const u = translations[lang].ui;
  const icons = [
    <Globe size={32} />, <DoorOpen size={32} />, <LayoutGrid size={32} />, 
    <HomeIcon size={32} />, <Paintbrush size={32} />, <Ruler size={32} />, <ShieldCheck size={32} />
  ];

  return (
    <div className="bg-black text-white selection:bg-blue-500/30">
      {/* Services Hero */}
      <section className="relative pt-48 pb-32 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-blue-600/20 blur-[120px] rounded-full animate-pulse"></div>
          <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] bg-blue-900/10 blur-[120px] rounded-full animate-pulse" style={{ animationDelay: '2s' }}></div>
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 mix-blend-overlay"></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="max-w-4xl"
          >
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-blue-500 animate-ping"></span>
              <span className="text-xs font-bold uppercase tracking-[0.2em] text-blue-400">{u.servicesBadge}</span>
            </motion.div>
            
            <h1 className="text-7xl md:text-9xl font-bold mb-10 tracking-tighter leading-[0.85] text-white">
              {u.servicesHeroTitle} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-600 to-indigo-600">{u.servicesHeroTitleSub}</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-zinc-400 leading-relaxed mb-12 max-w-2xl font-light">
              {u.servicesHeroSubtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Bento Grid Services Overview */}
      <section className="py-32 bg-zinc-950/50 border-y border-white/5 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-6 gap-6">
            {t.items.map((service, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className={`group relative p-8 bg-zinc-900/30 border border-white/5 rounded-[2.5rem] hover:bg-zinc-900/50 transition-all duration-700 overflow-hidden backdrop-blur-sm
                  ${i === 0 ? 'md:col-span-4 md:row-span-2' : 'md:col-span-2'}
                  ${i === 2 ? 'md:col-span-2 md:row-span-2' : ''}
                  ${i > 2 ? 'md:col-span-2' : ''}
                `}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                
                <div className="relative z-10">
                  <div className="w-16 h-16 bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-8 text-blue-500 group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-700 shadow-2xl">
                    {icons[i] || <CheckCircle2 size={32} />}
                  </div>
                  
                  <h4 className={`font-bold mb-4 tracking-tight ${i === 0 ? 'text-4xl' : 'text-xl'}`}>{service.title}</h4>
                  <p className="text-zinc-400 leading-relaxed text-sm font-light">
                    {service.description}
                  </p>
                  
                  <div className="mt-10 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.2em] text-blue-500 group-hover:gap-5 transition-all">
                    {u.discoverMore} <ArrowRight size={16} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Detailed Service Showcases with Sticky Headers */}
      {t.detailed.map((detail, i) => (
        <section key={i} className={`py-40 relative overflow-hidden ${i % 2 === 1 ? 'bg-zinc-950' : 'bg-black'}`}>
          <div className="max-w-7xl mx-auto px-6">
            <div className={`flex flex-col lg:flex-row gap-20 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}>
              {/* Content Side */}
              <div className="flex-1 lg:sticky lg:top-32 h-fit">
                <motion.div 
                  initial={{ opacity: 0, x: i % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                >
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-[1px] bg-blue-600"></div>
                    <span className="text-blue-500 text-xs font-bold uppercase tracking-[0.3em]">0{i + 1} / {u.focusLabel}</span>
                  </div>
                  
                  <h2 className="text-5xl md:text-7xl font-bold mb-10 tracking-tighter leading-none">{detail.title}</h2>
                  <p className="text-xl text-zinc-400 leading-relaxed mb-12 font-light">
                    {detail.description}
                  </p>
                  
                  <div className="space-y-6 mb-16">
                    {detail.features.map((feature, idx) => (
                      <motion.div 
                        key={idx} 
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: idx * 0.1 }}
                        className="flex items-center gap-4 group/item"
                      >
                        <div className="w-6 h-6 rounded-full bg-blue-600/10 border border-blue-600/20 flex items-center justify-center text-blue-500 group-hover/item:bg-blue-600 group-hover/item:text-white transition-all">
                          <CheckCircle2 size={14} />
                        </div>
                        <span className="text-zinc-300 font-medium tracking-wide">{feature}</span>
                      </motion.div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-12 pt-12 border-t border-white/10">
                    {detail.stats.map((stat, idx) => (
                      <div key={idx} className="group/stat">
                        <div className="text-4xl font-bold text-white mb-2 group-hover/stat:text-blue-500 transition-colors">{stat.value}</div>
                        <div className="text-xs text-zinc-500 uppercase tracking-[0.2em] font-bold">{stat.label}</div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>

              {/* Image Side with Parallax Effect */}
              <div className="flex-1">
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
                  className="relative group"
                >
                  <div className="relative z-10 rounded-[3rem] overflow-hidden aspect-[3/4] shadow-[0_0_50px_rgba(0,0,0,0.5)]">
                    <img 
                      src={detail.image} 
                      alt={detail.title} 
                      className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-[2s] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
                  </div>
                  
                  {/* Floating glass card */}
                  <motion.div 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="absolute -bottom-10 -right-10 z-20 p-8 bg-white/5 backdrop-blur-2xl border border-white/10 rounded-3xl hidden md:block max-w-[240px]"
                  >
                    <Star className="text-blue-500 mb-4" fill="currentColor" />
                    <p className="text-sm font-medium text-white leading-relaxed italic">
                      "De afwerking van de {detail.title.toLowerCase()} overtrof al onze verwachtingen."
                    </p>
                  </motion.div>

                  {/* Decorative Glows */}
                  <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full group-hover:bg-blue-600/30 transition-all duration-1000"></div>
                  <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-indigo-600/10 blur-[100px] rounded-full"></div>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      ))}

      {/* Modern Process Timeline */}
      <section className="py-40 bg-black relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="text-center mb-32">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-8xl font-bold tracking-tighter mb-8"
            >
              {t.process.title}
            </motion.h2>
            <div className="w-24 h-1 bg-blue-600 mx-auto"></div>
          </div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-[1px] bg-white/10 hidden lg:block"></div>
            
            <div className="space-y-32">
              {t.process.steps.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ margin: "-100px" }}
                  className={`flex flex-col lg:flex-row items-center gap-12 lg:gap-0 ${i % 2 === 1 ? 'lg:flex-row-reverse' : ''}`}
                >
                  <div className="flex-1 lg:px-20 text-center lg:text-left">
                    <div className={`text-8xl font-black text-white/5 mb-4 ${i % 2 === 1 ? 'lg:text-right' : ''}`}>0{i + 1}</div>
                    <h4 className="text-3xl font-bold mb-6 text-white">{step.title}</h4>
                    <p className="text-zinc-400 text-lg font-light leading-relaxed max-w-md mx-auto lg:mx-0">
                      {step.description}
                    </p>
                  </div>
                  
                  <div className="relative z-10 w-16 h-16 rounded-full bg-zinc-900 border-4 border-black flex items-center justify-center text-blue-500 shadow-[0_0_30px_rgba(37,99,235,0.3)]">
                    <div className="w-3 h-3 rounded-full bg-blue-600 animate-pulse"></div>
                  </div>
                  
                  <div className="flex-1 hidden lg:block"></div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Modern FAQ Accordion */}
      <section className="py-40 bg-zinc-950">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-5xl md:text-7xl font-bold tracking-tighter mb-20 text-center">{t.faq.title}</h2>
          
          <div className="space-y-4">
            {t.faq.items.map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                className="group"
              >
                <details className="bg-zinc-900/50 border border-white/5 rounded-[2rem] overflow-hidden transition-all duration-500 open:bg-zinc-900 open:border-blue-600/30">
                  <summary className="flex items-center justify-between p-8 cursor-pointer list-none">
                    <h4 className="text-xl font-bold tracking-tight pr-8">{item.question}</h4>
                    <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-blue-500 group-open:rotate-180 transition-transform duration-500">
                      <ChevronRight size={20} />
                    </div>
                  </summary>
                  <div className="px-8 pb-8 text-zinc-400 leading-relaxed font-light">
                    {item.answer}
                  </div>
                </details>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Ultra-Modern CTA */}
      <section className="py-40 relative overflow-hidden">
        <div className="absolute inset-0 bg-blue-600 opacity-5 blur-[150px] rounded-full -translate-y-1/2"></div>
        
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="relative p-20 md:p-32 rounded-[5rem] bg-zinc-900/50 border border-white/10 backdrop-blur-3xl overflow-hidden text-center"
          >
            <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none"></div>
            
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              className="text-6xl md:text-9xl font-bold mb-12 tracking-tighter leading-none"
            >
              Klaar voor de <br />
              <span className="text-blue-600">Toekomst?</span>
            </motion.h2>
            
            <p className="text-xl md:text-2xl text-zinc-400 mb-16 max-w-2xl mx-auto font-light leading-relaxed">
              Transformeer uw woning vandaag nog met de expertise van JuniorJob Onderhoud.
            </p>
            
            <Link 
              to="/contact" 
              className="group relative inline-flex items-center gap-6 px-12 py-6 bg-blue-600 text-white rounded-full font-bold text-xl overflow-hidden transition-all hover:scale-105 active:scale-95 shadow-[0_20px_50px_rgba(37,99,235,0.3)]"
            >
              <span className="relative z-10">Vraag Offerte Aan</span>
              <ArrowRight className="relative z-10 group-hover:translate-x-2 transition-transform" size={28} />
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-indigo-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

const WhyUs = ({ lang }: { lang: Language }) => {
  const t = translations[lang].whyUs;
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-3 gap-12">
          <div className="lg:col-span-1">
            <h2 className="text-4xl font-bold mb-6 tracking-tight leading-tight">{t.title}</h2>
            <p className="text-zinc-400 mb-8">Wij geloven dat elk huis de beste zorg verdient. Daarom werken wij met passie en precisie.</p>
            <Link to="/contact" className="inline-flex items-center gap-2 text-blue-500 font-bold hover:gap-4 transition-all">
              Vraag een offerte aan <ArrowRight size={20} />
            </Link>
          </div>
          <div className="lg:col-span-2 grid md:grid-cols-2 gap-8">
            {t.items.map((item, i) => (
              <div key={i} className="flex gap-4">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-zinc-900 flex items-center justify-center text-blue-500 font-bold">
                  {i + 1}
                </div>
                <div>
                  <h4 className="font-bold mb-2 text-lg">{item.title}</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

const Portfolio = ({ lang }: { lang: Language }) => {
  const t = translations[lang].portfolio;
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [lightboxImg, setLightboxImg] = useState<string | null>(null);

  const galleryImages: Record<string, string[]> = {
    windows: [
      '/projekt%20%20okna%201.jpeg',
      '/projekt%20%20okna%2011.jpeg',
      '/projekt%20%20okna%20111.jpeg',
      '/project-1.jpeg',
      '/projekt%2033.jpeg',
      '/projekt%20111.jpeg',
    ],
    doors: [
      '/projekt%201.jpeg',
      '/projekt%2011.jpeg',
      '/projekt%203.jpeg',
    ],
    hst: [
      '/project-2.jpeg',
      '/projekt%2022.jpeg',
    ],
    roof: [
      '/project-4.jpeg',
      '/projekt%204.jpeg',
      '/projekt%20444.jpeg',
      '/projekt%204444.jpeg',
    ],
    cladding: [
      '/project-3.jpeg',
      '/projekt%20alsmer.jpeg',
      '/projekt%20alsmer1.jpeg',
      '/projekt%20alsmer2.jpeg',
      '/projekt%20alsmer1.4.jpeg',
      '/projekt%2044.jpeg',
    ],
    repair: [
      '/projekt%20%20reperacje%20w%20drewnie%201.jpeg',
      '/projekt%20%20reperacje%20w%20drewnie%2011.jpeg',
      '/projekt%201111.jpeg',
      '/projekt%2011111.jpeg',
    ],
  };

  // First image of each category as the cover
  const coverImages: Record<string, string> = Object.fromEntries(
    Object.entries(galleryImages).map(([k, imgs]) => [k, imgs[0]])
  );

  const activeCat = t.categories.find(c => c.id === activeCategory);

  return (
    <section className="py-24 bg-zinc-950 pt-32 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">

        {/* Lightbox */}
        <AnimatePresence>
          {lightboxImg && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/95 flex items-center justify-center p-4 cursor-pointer"
              onClick={() => setLightboxImg(null)}
            >
              <motion.img
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.8, opacity: 0 }}
                src={lightboxImg}
                alt=""
                className="max-w-full max-h-[90vh] object-contain rounded-lg"
                onClick={e => e.stopPropagation()}
              />
              <button
                onClick={() => setLightboxImg(null)}
                className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors"
              >
                <X size={32} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Header */}
        <div className="mb-12">
          {activeCategory ? (
            <div>
              <button
                onClick={() => setActiveCategory(null)}
                className="flex items-center gap-2 text-blue-500 hover:text-blue-400 transition-colors mb-6 font-medium"
              >
                <ChevronRight size={18} className="rotate-180" />
                {t.backButton}
              </button>
              <h2 className="text-4xl font-bold mb-4 tracking-tight">{activeCat?.name}</h2>
              <div className="w-20 h-1 bg-blue-600 mb-6"></div>
              <p className="text-zinc-400 text-lg max-w-2xl">{activeCat?.description}</p>
            </div>
          ) : (
            <div>
              <h2 className="text-4xl font-bold mb-4 tracking-tight">{t.title}</h2>
              <div className="w-20 h-1 bg-blue-600"></div>
            </div>
          )}
        </div>

        {/* Category cards OR Gallery */}
        <AnimatePresence mode="wait">
          {!activeCategory ? (
            <motion.div
              key="categories"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {t.categories.map((cat) => (
                <motion.div
                  key={cat.id}
                  whileHover={{ y: -8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  onClick={() => setActiveCategory(cat.id)}
                  className="group relative aspect-[4/3] rounded-2xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={coverImages[cat.id]}
                    alt={cat.name}
                    className="w-full h-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
                    <h3 className="text-2xl font-bold text-white tracking-tight mb-2">{cat.name}</h3>
                    <p className="text-zinc-300 text-sm line-clamp-2 mb-3">{cat.description}</p>
                    <div className="flex items-center gap-2 text-blue-400 text-sm font-medium">
                      <span>{galleryImages[cat.id]?.length ?? 0} foto's</span>
                      <ArrowRight size={14} />
                    </div>
                  </div>
                  <div className="absolute inset-0 border border-white/0 group-hover:border-white/10 transition-colors duration-500 rounded-2xl pointer-events-none"></div>
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <motion.div
              key="gallery"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4"
            >
              {galleryImages[activeCategory]?.map((img, i) => (
                <motion.div
                  key={img}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: i * 0.05 }}
                  onClick={() => setLightboxImg(img)}
                  className="group relative aspect-square rounded-xl overflow-hidden cursor-pointer"
                >
                  <img
                    src={img}
                    alt={`${activeCat?.name} ${i + 1}`}
                    className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <ArrowRight size={20} className="text-white rotate-[-45deg]" />
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
};

const Process = ({ lang }: { lang: Language }) => {
  const t = translations[lang].process;
  return (
    <section className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">{t.title}</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-4 gap-8">
          {t.steps.map((step, i) => (
            <div key={i} className="relative text-center">
              <div className="w-20 h-20 bg-zinc-900 border border-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold text-blue-500">
                0{i + 1}
              </div>
              {i < 3 && (
                <div className="hidden md:block absolute top-10 left-[60%] w-full h-[1px] bg-gradient-to-r from-blue-600/50 to-transparent z-0"></div>
              )}
              <h4 className="text-xl font-bold mb-3">{step.title}</h4>
              <p className="text-zinc-400 text-sm leading-relaxed">{step.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Testimonials = ({ lang }: { lang: Language }) => {
  const t = translations[lang].testimonials;
  return (
    <section className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4 tracking-tight">{t.title}</h2>
          <div className="w-20 h-1 bg-blue-600 mx-auto"></div>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {t.items.map((item, i) => (
            <div key={i} className="p-8 bg-zinc-900 border border-white/5 rounded-2xl">
              <div className="flex gap-1 mb-6 text-yellow-500">
                {[...Array(5)].map((_, j) => <Star key={j} size={16} fill="currentColor" />)}
              </div>
              <p className="text-zinc-300 italic mb-8 leading-relaxed">"{item.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-zinc-800 rounded-full flex items-center justify-center font-bold text-zinc-500">
                  {item.name[0]}
                </div>
                <div>
                  <h5 className="font-bold">{item.name}</h5>
                  <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">{item.service}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Contact = ({ lang }: { lang: Language }) => {
  const t = translations[lang].contact;
  const u = translations[lang].ui;
  const serviceOptions = translations[lang].services.items;

  const [formData, setFormData] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!formData.name.trim()) e.name = t.validationRequired;
    if (!formData.email.trim()) e.email = t.validationRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) e.email = t.validationEmail;
    if (!formData.message.trim()) e.message = t.validationRequired;
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleChange = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({ ...prev, [ev.target.name]: ev.target.value }));
    if (errors[ev.target.name]) setErrors(prev => ({ ...prev, [ev.target.name]: '' }));
  };

  const buildBody = () =>
    `${t.formName}: ${formData.name}\n${t.formEmail}: ${formData.email}\n${t.formPhone}: ${formData.phone}\n${t.formService}: ${formData.service}\n\n${formData.message}`;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const subject = encodeURIComponent(`${formData.service || 'Aanvraag'} - ${formData.name}`);
    const body = encodeURIComponent(buildBody());
    window.location.href = `mailto:juniorjob.onderhoud@interia.eu?subject=${subject}&body=${body}`;
    setSubmitted(true);
  };

  const handleWhatsApp = () => {
    if (!validate()) return;
    const text = encodeURIComponent(`Hallo JuniorJob!\n\n${buildBody()}`);
    window.open(`https://wa.me/31619740942?text=${text}`, '_blank');
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <section className="py-24 bg-black pt-32 min-h-[60vh] flex items-center">
        <div className="max-w-xl mx-auto px-6 text-center">
          <CheckCircle2 size={64} className="text-green-500 mx-auto mb-8" />
          <h2 className="text-3xl font-bold mb-4">{t.successMessage}</h2>
          <Link to="/" className="text-blue-500 hover:text-blue-400 font-medium">{u.notFoundButton}</Link>
        </div>
      </section>
    );
  }

  return (
    <section className="py-24 bg-black pt-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16">
          <div>
            <h2 className="text-4xl font-bold mb-8 tracking-tight">{t.title}</h2>
            <p className="text-zinc-400 mb-12 text-lg">{u.contactIntro}</p>
            
            <div className="space-y-8">
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-blue-500 flex-shrink-0">
                  <Phone size={24} />
                </div>
                <div>
                  <h5 className="font-bold mb-1">{u.phoneLabel}</h5>
                  <p className="text-zinc-400">+31 6 19740942</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-blue-500 flex-shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <h5 className="font-bold mb-1">{u.emailLabel}</h5>
                  <p className="text-zinc-400">juniorjob.onderhoud@interia.eu</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-12 h-12 bg-zinc-900 rounded-xl flex items-center justify-center text-blue-500 flex-shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <h5 className="font-bold mb-1">{u.locationLabel}</h5>
                  <p className="text-zinc-400">Engelandlaan 474, 2711EB Zoetermeer</p>
                </div>
              </div>
            </div>

            <div className="mt-12 p-6 bg-zinc-900/50 border border-white/5 rounded-2xl">
              <h6 className="font-bold mb-2 uppercase tracking-widest text-xs text-zinc-500">{u.hoursLabel}</h6>
              <p className="text-zinc-300">{t.hours}</p>
            </div>

            <div className="mt-8 rounded-2xl overflow-hidden h-64 border border-white/5 grayscale hover:grayscale-0 transition-all duration-500">
              <iframe 
                src="https://maps.google.com/maps?q=Engelandlaan%20474,%202711EB%20Zoetermeer&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>

          <div className="bg-zinc-900 p-8 md:p-12 rounded-3xl border border-white/5">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">{t.formName}</label>
                  <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder={t.placeholderName} className={`w-full bg-black border ${errors.name ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 focus:border-blue-600 outline-none transition-all placeholder:text-zinc-700`} />
                  {errors.name && <p className="text-red-500 text-xs">{errors.name}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">{t.formEmail}</label>
                  <input type="email" name="email" value={formData.email} onChange={handleChange} placeholder={t.placeholderEmail} className={`w-full bg-black border ${errors.email ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 focus:border-blue-600 outline-none transition-all placeholder:text-zinc-700`} />
                  {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
                </div>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">{t.formPhone}</label>
                  <input type="tel" name="phone" value={formData.phone} onChange={handleChange} placeholder={t.placeholderPhone} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-blue-600 outline-none transition-all placeholder:text-zinc-700" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">{t.formService}</label>
                  <select name="service" value={formData.service} onChange={handleChange} className="w-full bg-black border border-white/10 rounded-xl px-4 py-3 focus:border-blue-600 outline-none transition-all appearance-none text-zinc-300">
                    <option value="">—</option>
                    {serviceOptions.map((s, i) => <option key={i} value={s.title}>{s.title}</option>)}
                  </select>
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-widest text-zinc-500">{t.formMessage}</label>
                <textarea rows={4} name="message" value={formData.message} onChange={handleChange} placeholder={t.placeholderMessage} className={`w-full bg-black border ${errors.message ? 'border-red-500' : 'border-white/10'} rounded-xl px-4 py-3 focus:border-blue-600 outline-none transition-all resize-none placeholder:text-zinc-700`}></textarea>
                {errors.message && <p className="text-red-500 text-xs">{errors.message}</p>}
              </div>
              <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-xl hover:bg-blue-700 transition-all shadow-lg shadow-blue-600/20">
                {t.sendEmail}
              </button>
              <button 
                type="button"
                onClick={handleWhatsApp}
                className="w-full bg-green-600 text-white font-bold py-4 rounded-xl hover:bg-green-700 transition-all shadow-lg shadow-green-600/20 flex items-center justify-center gap-3 mt-4"
              >
                <MessageSquare size={20} />
                {t.sendWhatsApp}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

const Footer = ({ lang }: { lang: Language }) => {
  const t = translations[lang].nav;
  const u = translations[lang].ui;
  const serviceItems = translations[lang].services.items;
  return (
    <footer className="bg-zinc-950 pt-20 pb-10 border-t border-white/5">
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-4 gap-12 mb-16">
          <div className="col-span-2">
            <Link to="/" className="flex items-center gap-2 mb-6">
              <img src="/logo.jpeg" alt="JuniorJob" className="w-8 h-8 rounded object-cover" />
              <span className="text-xl font-bold tracking-tight">JuniorJob <span className="text-zinc-500 font-light">Onderhoud</span></span>
            </Link>
            <p className="text-zinc-500 max-w-sm leading-relaxed mb-8">
              {u.footerDesc}
            </p>
            <div className="flex gap-4">
              <a href="https://www.instagram.com/" target="_blank" rel="noreferrer" className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-blue-600 transition-all">
                <Instagram size={18} />
              </a>
              <a href="https://www.facebook.com/" target="_blank" rel="noreferrer" className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-blue-600 transition-all">
                <Facebook size={18} />
              </a>
              <a href="https://www.linkedin.com/" target="_blank" rel="noreferrer" className="w-10 h-10 bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 hover:text-white hover:bg-blue-600 transition-all">
                <Linkedin size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h6 className="font-bold mb-6 uppercase tracking-widest text-xs text-zinc-500">{u.linksTitle}</h6>
            <ul className="space-y-4">
              <li><Link to="/" className="text-zinc-400 hover:text-white transition-colors">{t.home}</Link></li>
              <li><Link to="/about" className="text-zinc-400 hover:text-white transition-colors">{t.about}</Link></li>
              <li><Link to="/services" className="text-zinc-400 hover:text-white transition-colors">{t.services}</Link></li>
              <li><Link to="/portfolio" className="text-zinc-400 hover:text-white transition-colors">{t.portfolio}</Link></li>
            </ul>
          </div>

          <div>
            <h6 className="font-bold mb-6 uppercase tracking-widest text-xs text-zinc-500">{u.servicesFooterTitle}</h6>
            <ul className="space-y-4">
              {serviceItems.slice(0, 4).map((item, i) => (
                <li key={i}><Link to="/services" className="text-zinc-400 hover:text-white transition-colors">{item.title}</Link></li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-zinc-600 text-sm">
          <p>© {new Date().getFullYear()} JuniorJob Onderhoud. {translations[lang].footer.rights}</p>
          <div className="flex gap-6">
            <Link to="/privacy" className="hover:text-zinc-400">{u.privacyPolicy}</Link>
            <Link to="/terms" className="hover:text-zinc-400">{u.termsOfService}</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

const FloatingButtons = () => (
  <div className="fixed bottom-8 right-8 z-40 flex flex-col gap-4">
    <a 
      href="mailto:juniorjob.onderhoud@interia.eu" 
      className="w-14 h-14 bg-blue-600 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
      title="Email us"
    >
      <Mail size={28} />
    </a>
    <a 
      href="https://wa.me/31619740942" 
      target="_blank" 
      rel="noreferrer"
      className="w-14 h-14 bg-green-500 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
      title="WhatsApp us"
    >
      <MessageSquare size={28} />
    </a>
  </div>
);

// --- Main App ---

export default function App() {
  const [lang, setLang] = useState<Language>(() => {
    const saved = localStorage.getItem('app_lang');
    return (saved as Language) || 'nl';
  });

  useEffect(() => {
    localStorage.setItem('app_lang', lang);
    document.documentElement.lang = lang;
  }, [lang]);

  return (
    <BrowserRouter>
      <ScrollToTop />
      <div className="bg-black text-white font-sans selection:bg-blue-600 selection:text-white min-h-screen flex flex-col">
        <Navbar lang={lang} setLang={setLang} />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={
              <>
                <Hero lang={lang} />
                <WhyUs lang={lang} />
                <Process lang={lang} />
                <Testimonials lang={lang} />
                <SloganBanner lang={lang} />
              </>
            } />
            <Route path="/about" element={<About lang={lang} />} />
            <Route path="/services" element={<Services lang={lang} />} />
            <Route path="/portfolio" element={<Portfolio lang={lang} />} />
            <Route path="/contact" element={<Contact lang={lang} />} />
            <Route path="*" element={<NotFound lang={lang} />} />
          </Routes>
        </main>
        <Footer lang={lang} />
        <FloatingButtons />
      </div>
    </BrowserRouter>
  );
}
