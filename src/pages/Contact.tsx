import React, { useRef, useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Phone, Mail, MapPin, Clock, MessageSquare, Send, X } from 'lucide-react';
import { translations, Language } from '../translations';
import { fx } from '../translations/fx';
import { EASE, Magnetic, Reveal, SplitText, TiltCard, Float, asset } from '../fx/core';
import { shakeScreen, Spotlights, VictoryScene } from '../fx/canvas';
import { useQuote, useTransitionNavigate } from '../fx/nav';
import { CONTACT } from '../data';
import { Eyebrow } from '../components/Shared';

const Field = ({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) => (
  <label className="block space-y-2">
    <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{label}</span>
    {children}
    <AnimatePresence>
      {error && <motion.span initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="block text-xs text-red-400">{error}</motion.span>}
    </AnimatePresence>
  </label>
);

const inputCls = (err?: string) =>
  `w-full rounded-2xl border bg-black/40 px-4 py-3.5 outline-none transition-all placeholder:text-zinc-700 focus:border-[var(--blue-bright)] focus:shadow-[0_0_0_4px_rgba(59,130,246,0.15)] ${err ? 'border-red-500/70' : 'border-white/10'}`;

export const Contact = ({ lang }: { lang: Language }) => {
  const t = translations[lang].contact;
  const u = translations[lang].ui;
  const f = fx[lang];
  const services = translations[lang].services.items;
  const { items: quote, toggle, clear } = useQuote();
  const navigate = useTransitionNavigate();

  const [form, setForm] = useState({ name: '', email: '', phone: '', service: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [victory, setVictory] = useState<{ origin: { x: number; y: number }; via: 'mail' | 'wa' } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t.validationRequired;
    if (!form.email.trim()) e.email = t.validationRequired;
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = t.validationEmail;
    if (!form.message.trim()) e.message = t.validationRequired;
    setErrors(e);
    if (Object.keys(e).length) {
      formRef.current?.animate([{ transform: 'translateX(0)' }, { transform: 'translateX(-10px)' }, { transform: 'translateX(10px)' }, { transform: 'translateX(-6px)' }, { transform: 'translateX(0)' }], { duration: 380 });
    }
    return Object.keys(e).length === 0;
  };

  const change = (ev: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((p) => ({ ...p, [ev.target.name]: ev.target.value }));
    if (errors[ev.target.name]) setErrors((p) => ({ ...p, [ev.target.name]: '' }));
  };

  const allServices = [...quote, ...(form.service && !quote.includes(form.service) ? [form.service] : [])];
  const body = () =>
    `${t.formName}: ${form.name}\n${t.formEmail}: ${form.email}\n${t.formPhone}: ${form.phone}\n${t.formService}: ${allServices.join(', ') || '—'}\n\n${form.message}`;

  const celebrate = (el: HTMLElement, via: 'mail' | 'wa') => {
    const r = el.getBoundingClientRect();
    shakeScreen();
    setVictory({ origin: { x: r.left + r.width / 2, y: r.top + r.height / 2 }, via });
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    const btn = (e.nativeEvent as SubmitEvent).submitter as HTMLElement | null;
    celebrate(btn ?? formRef.current!, 'mail');
    const subject = encodeURIComponent(`${allServices[0] || 'Aanvraag'} - ${form.name}`);
    const href = `mailto:${CONTACT.email}?subject=${subject}&body=${encodeURIComponent(body())}`;
    setTimeout(() => { window.location.href = href; }, 1200);
  };

  const whatsapp = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!validate()) return;
    // open synchronously inside the click so popup blockers allow it
    window.open(`https://wa.me/${CONTACT.whatsapp}?text=${encodeURIComponent(`Hallo JuniorJob!\n\n${body()}`)}`, '_blank');
    celebrate(e.currentTarget, 'wa');
  };

  const closeVictory = () => {
    setVictory(null);
    clear();
    setForm({ name: '', email: '', phone: '', service: '', message: '' });
    navigate('/');
  };

  return (
    <div>
      {/* Business cards */}
      <section className="relative overflow-hidden pb-16 pt-36">
        <Spotlights className="absolute inset-0 opacity-60" />
        <div className="relative mx-auto max-w-7xl px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}><Eyebrow>{f.cardBadge}</Eyebrow></motion.div>
          <SplitText as="h1" by="char" onView={false} delay={0.1} text={t.title} className="font-display mt-6 text-5xl font-extrabold tracking-tight md:text-8xl" />
          <p className="mt-4 text-zinc-500">{f.cardTagline}</p>
          <div className="mt-14 flex flex-col items-center justify-center gap-10 lg:flex-row lg:gap-16">
            {['/wizytowka-przow.jpeg', '/wizytowka-tyl.jpeg'].map((src, i) => (
              <motion.div key={src} initial={{ opacity: 0, y: 60, rotateX: 30 }} animate={{ opacity: 1, y: 0, rotateX: 0 }} transition={{ delay: 0.3 + i * 0.2, duration: 1.1, ease: EASE }} style={{ transformPerspective: 1000 }}>
                <Float amp={9} duration={5 + i} delay={i}>
                  <TiltCard className="rounded-2xl" max={16}>
                    <div className="aspect-[1050/600] w-[min(86vw,460px)] overflow-hidden rounded-2xl ring-1 ring-white/15 shadow-[0_40px_80px_rgba(0,0,0,0.6),0_0_70px_rgba(37,99,235,0.18)]">
                      <img src={asset(src)} alt={`JuniorJob ${i ? 'back' : 'front'}`} className="h-full w-full object-cover" />
                    </div>
                  </TiltCard>
                </Float>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-28 pt-12">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-[1fr_1.15fr] lg:gap-16">
          {/* info */}
          <div>
            <Reveal><p className="mb-10 text-lg text-zinc-400">{u.contactIntro}</p></Reveal>
            <div className="space-y-3">
              {[
                { icon: Phone, label: u.phoneLabel, value: CONTACT.phone, href: CONTACT.phoneHref },
                { icon: Mail, label: u.emailLabel, value: CONTACT.email, href: `mailto:${CONTACT.email}` },
                { icon: MapPin, label: u.locationLabel, value: CONTACT.address, href: `https://maps.google.com/?q=${encodeURIComponent(CONTACT.address)}` },
                { icon: Clock, label: u.hoursLabel, value: t.hours },
              ].map(({ icon: Icon, label, value, href }, i) => (
                <Reveal key={label} delay={i * 0.06}>
                  <a href={href} target={href?.startsWith('http') ? '_blank' : undefined} rel="noreferrer"
                    className="group flex items-center gap-5 rounded-2xl border border-white/[0.06] bg-[var(--panel)] p-5 transition-colors hover:border-[var(--blue)]/50">
                    <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[var(--blue)]/15 text-[var(--blue-bright)] transition-all group-hover:bg-[var(--blue)] group-hover:text-white"><Icon size={22} /></span>
                    <span className="min-w-0">
                      <span className="block text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{label}</span>
                      <span className="block break-words font-semibold">{value}</span>
                    </span>
                  </a>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <div className="mt-6 h-64 overflow-hidden rounded-2xl border border-white/[0.06] grayscale invert-[0.92] hue-rotate-180 transition-all duration-700 hover:grayscale-0 hover:invert-0 hover:hue-rotate-0">
                <iframe title="Map" src={`https://maps.google.com/maps?q=${encodeURIComponent(CONTACT.address)}&t=&z=15&ie=UTF8&iwloc=&output=embed`} width="100%" height="100%" style={{ border: 0 }} loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
              </div>
            </Reveal>
          </div>

          {/* form */}
          <Reveal>
            <form ref={formRef} onSubmit={submit} noValidate className="relative space-y-5 overflow-hidden rounded-[2rem] border border-white/[0.08] bg-gradient-to-b from-[var(--panel)] to-[var(--bg-2)] p-6 md:p-10">
              <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-[var(--blue)]/20 blur-[90px]" />

              {/* selected services from the quote basket */}
              <div className="relative">
                <span className="text-[11px] font-bold uppercase tracking-[0.25em] text-zinc-500">{f.quoteSelected}</span>
                <div className="mt-3 flex min-h-[44px] flex-wrap gap-2">
                  <AnimatePresence>
                    {quote.length === 0 && (
                      <motion.p key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="text-sm text-zinc-600">{f.quoteEmpty}</motion.p>
                    )}
                    {quote.map((q) => (
                      <motion.button
                        type="button" key={q} layout
                        initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
                        onClick={() => toggle(q)}
                        className="flex items-center gap-2 rounded-full border border-[var(--blue-bright)]/50 bg-[var(--blue)]/20 px-4 py-2 text-sm font-semibold"
                      >
                        {q} <X size={14} className="text-zinc-400" />
                      </motion.button>
                    ))}
                  </AnimatePresence>
                </div>
              </div>

              <div className="relative grid gap-5 md:grid-cols-2">
                <Field label={t.formName} error={errors.name}><input name="name" value={form.name} onChange={change} placeholder={t.placeholderName} className={inputCls(errors.name)} autoComplete="name" /></Field>
                <Field label={t.formEmail} error={errors.email}><input type="email" name="email" value={form.email} onChange={change} placeholder={t.placeholderEmail} className={inputCls(errors.email)} autoComplete="email" /></Field>
              </div>
              <div className="relative grid gap-5 md:grid-cols-2">
                <Field label={t.formPhone}><input type="tel" name="phone" value={form.phone} onChange={change} placeholder={t.placeholderPhone} className={inputCls()} autoComplete="tel" /></Field>
                <Field label={t.formService}>
                  <select name="service" value={form.service} onChange={change} className={`${inputCls()} appearance-none text-zinc-300`}>
                    <option value="">—</option>
                    {services.map((s) => <option key={s.title} value={s.title}>{s.title}</option>)}
                  </select>
                </Field>
              </div>
              <Field label={t.formMessage} error={errors.message}>
                <textarea rows={5} name="message" value={form.message} onChange={change} placeholder={t.placeholderMessage} className={`${inputCls(errors.message)} resize-none`} />
              </Field>

              <div className="relative grid gap-3 pt-2 sm:grid-cols-2">
                <Magnetic strength={0.2} className="w-full">
                  <button type="submit" className="group flex w-full items-center justify-center gap-3 rounded-2xl bg-[var(--blue)] py-4 font-bold text-white shadow-[0_15px_40px_var(--blue-glow)] transition-colors hover:bg-[var(--blue-bright)]">
                    <Send size={18} className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-1" /> {t.sendEmail}
                  </button>
                </Magnetic>
                <Magnetic strength={0.2} className="w-full">
                  <button type="button" onClick={whatsapp} className="flex w-full items-center justify-center gap-3 rounded-2xl bg-[#16a34a] py-4 font-bold text-white shadow-[0_15px_40px_rgba(22,163,74,0.3)] transition-colors hover:bg-[#22c55e]">
                    <MessageSquare size={18} /> {t.sendWhatsApp}
                  </button>
                </Magnetic>
              </div>
            </form>
          </Reveal>
        </div>
      </section>

      <VictoryScene
        open={!!victory}
        origin={victory?.origin ?? { x: 0, y: 0 }}
        title={f.victoryTitle}
        text={victory?.via === 'wa' ? f.victoryWhatsApp : f.victoryMail}
        button={f.victoryButton}
        onClose={closeVictory}
      />
    </div>
  );
};
