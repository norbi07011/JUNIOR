import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';
import { Lock, DoorOpen, Wind } from 'lucide-react';
import type { Language } from '../translations';
import { asset, EASE, Reveal, SplitText } from '../fx/core';
import { Eyebrow } from './Shared';

type L = Record<Language, string>;
const TX: Record<string, L> = {
  kicker: { nl: 'Draai-kiep', en: 'Tilt & turn', pl: 'Uchylno-rozwierne' },
  title: { nl: 'Eén greep. Drie standen.', en: 'One handle. Three positions.', pl: 'Jedna klamka. Trzy pozycje.' },
  intro: {
    nl: 'Klik op de greep of kies een stand en zie hoe de buitenlucht binnenkomt.',
    en: 'Click the handle or pick a position and watch the outside air come in.',
    pl: 'Kliknij klamkę albo wybierz pozycję i zobacz, jak wpada powietrze z zewnątrz.',
  },
  s0: { nl: 'Dicht', en: 'Closed', pl: 'Zamknięte' },
  s1: { nl: 'Draaien', en: 'Turn', pl: 'Rozwarcie' },
  s2: { nl: 'Kiepen', en: 'Tilt', pl: 'Uchylenie' },
  d0: { nl: 'Greep naar beneden: het raam zit rondom vast in het kozijn. Wind- en waterdicht, geen tocht, inbraakwerend.', en: 'Handle down: the sash is locked all round in the frame. Wind- and watertight, no draughts, burglar resistant.', pl: 'Klamka w dół: skrzydło zablokowane dookoła w ramie. Szczelne na wiatr i wodę, bez przeciągów, antywłamaniowe.' },
  d1: { nl: 'Greep horizontaal: het raam draait volledig open. Maximale frisse lucht in korte tijd — en de buitenkant is makkelijk schoon te maken.', en: 'Handle horizontal: the sash swings fully open. Maximum fresh air in a short time — and the outside is easy to clean.', pl: 'Klamka poziomo: skrzydło otwiera się całkowicie. Maksimum świeżego powietrza w krótkim czasie — i łatwe mycie szyby z zewnątrz.' },
  d2: { nl: 'Greep omhoog: het raam kiept bovenaan een paar centimeter open. Rustige, continue ventilatie — veilig, ook als het regent.', en: 'Handle up: the sash tilts in a few centimetres at the top. Gentle, continuous ventilation — safe, even when it rains.', pl: 'Klamka do góry: skrzydło uchyla się u góry o kilka centymetrów. Spokojne, ciągłe wietrzenie — bezpiecznie, nawet gdy pada.' },
  air: { nl: 'Luchtstroom', en: 'Airflow', pl: 'Przepływ powietrza' },
  a0: { nl: 'Geen', en: 'None', pl: 'Brak' },
  a1: { nl: 'Maximaal', en: 'Maximum', pl: 'Maksymalny' },
  a2: { nl: 'Rustig', en: 'Gentle', pl: 'Spokojny' },
};

/** Airflow streaks drawn on a canvas in front of the window, coming into the room. */
const Airflow = ({ state }: { state: number }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const st = useRef(state); st.current = state;
  const reduce = useReducedMotion();

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const g = c.getContext('2d'); if (!g) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    const resize = () => { W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; g.setTransform(dpr, 0, 0, dpr, 0, 0); };
    resize(); const ro = new ResizeObserver(resize); ro.observe(c);
    // Each particle is a soft ribbon: a base path + a sideways wave that grows as it comes into the room.
    type P = { x0: number; y0: number; dx: number; dy: number; speed: number; amp: number; freq: number; ph: number; life: number; max: number; w: number; trail: [number, number][] };
    const ps: P[] = [];
    let flow = 0, raf = 0, visible = true, last = performance.now();
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(c);
    const win = () => ({ x: W * 0.2, y: H * 0.08, w: W * 0.6, h: H * 0.8 });
    const rnd = (a: number, b: number) => a + Math.random() * (b - a);

    const spawn = () => {
      const r = win(), s = st.current;
      if (s === 2) {
        // tilt: cool air spills over the top of the sash and sinks into the room
        const x = r.x + r.w * rnd(0.08, 0.92);
        const dir = rnd(-0.35, 0.35);
        ps.push({ x0: x, y0: r.y + r.h * 0.04, dx: dir, dy: 1, speed: rnd(26, 40), amp: rnd(6, 16), freq: rnd(1.2, 2.2), ph: rnd(0, 6.28), life: 0, max: rnd(3.2, 4.6), w: rnd(0.8, 1.6), trail: [] });
      } else if (s === 1) {
        // turn: a broad stream through the opening, drifting into the room and slightly down
        const y = r.y + r.h * rnd(0.05, 0.95);
        const x = r.x + r.w * rnd(0.35, 0.95);
        const side = x > r.x + r.w * 0.6 ? 1 : -1;
        ps.push({ x0: x, y0: y, dx: side * rnd(0.6, 1), dy: rnd(0.05, 0.45), speed: rnd(55, 85), amp: rnd(8, 22), freq: rnd(1, 2), ph: rnd(0, 6.28), life: 0, max: rnd(2.4, 3.6), w: rnd(1, 2), trail: [] });
      }
    };

    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      const dt = Math.min(0.05, (now - last) / 1000); last = now;
      const target = st.current === 1 ? 1 : st.current === 2 ? 0.5 : 0;
      flow += (target - flow) * Math.min(1, dt * 1.4);
      const rate = reduce ? 0 : flow * (st.current === 1 ? 46 : 26);
      let n = rate * dt; while (n > 0) { if (Math.random() < n) spawn(); n -= 1; }

      g.clearRect(0, 0, W, H);
      for (let i = ps.length - 1; i >= 0; i--) {
        const p = ps[i];
        p.life += dt;
        const k = p.life / p.max;
        if (k >= 1) { ps.splice(i, 1); continue; }
        const len = Math.hypot(p.dx, p.dy) || 1, ux = p.dx / len, uy = p.dy / len;
        const dist = p.speed * p.life * (1 + p.life * 0.25);
        const wave = Math.sin(p.life * p.freq * 2.2 + p.ph) * p.amp * Math.min(1, p.life * 0.8);
        const x = p.x0 + ux * dist - uy * wave, y = p.y0 + uy * dist + ux * wave;
        p.trail.push([x, y]); if (p.trail.length > 46) p.trail.shift();
        if (p.trail.length < 3) continue;
        const a = Math.sin(Math.PI * k) * 0.7;
        g.beginPath();
        g.moveTo(p.trail[0][0], p.trail[0][1]);
        for (let j = 1; j < p.trail.length - 1; j++) {
          const mx = (p.trail[j][0] + p.trail[j + 1][0]) / 2, my = (p.trail[j][1] + p.trail[j + 1][1]) / 2;
          g.quadraticCurveTo(p.trail[j][0], p.trail[j][1], mx, my);
        }
        const grd = g.createLinearGradient(p.trail[0][0], p.trail[0][1], x, y);
        grd.addColorStop(0, 'rgba(56,150,230,0)'); grd.addColorStop(0.6, `rgba(56,150,230,${a * 0.55})`); grd.addColorStop(1, `rgba(125,200,250,${a})`);
        g.strokeStyle = grd; g.lineWidth = p.w * (1 + k * 2.2); g.lineCap = 'round'; g.stroke();
      }
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [reduce]);

  return <canvas ref={ref} aria-hidden className="pointer-events-none absolute inset-0 z-20 h-full w-full" />;
};

export const TiltTurn = ({ lang }: { lang: Language }) => {
  const [s, setS] = useState(0);
  const t = (k: string) => TX[k][lang];
  const icons = [Lock, DoorOpen, Wind];
  const spring = { type: 'spring' as const, stiffness: 60, damping: 16 };

  return (
    <section className="relative py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-6">
        <div className="mb-10 max-w-3xl">
          <Eyebrow>{t('kicker')}</Eyebrow>
          <SplitText key={`${lang}-tt`} text={t('title')} className="font-display mt-5 text-4xl font-extrabold leading-[0.95] tracking-tight md:text-7xl" />
          <Reveal><p className="mt-5 text-lg text-zinc-400">{t('intro')}</p></Reveal>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.3fr_1fr]">
          <Reveal>
            {/* stage: inside wall with the window, seen from the room */}
            <div className="relative aspect-[4/3.4] overflow-hidden rounded-[28px] border border-white/10 bg-[#e9e6df]">
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_40%,#f3f1ec,#cfcac0_80%)]" />
              {/* reveal (dagkant) + outside view */}
              <div className="absolute left-[20%] top-[8%] h-[80%] w-[60%] overflow-hidden shadow-[inset_0_10px_30px_rgba(0,0,0,.25)]">
                <img src={asset('/okna-dachowe3.jpeg')} alt="" className="h-full w-full scale-110 object-cover object-[50%_18%]" draggable={false} />
                <motion.div className="absolute inset-0 bg-sky-100/10" animate={{ opacity: s ? 0 : 1 }} />
              </div>
              {/* frame */}
              <div className="pointer-events-none absolute left-[20%] top-[8%] z-10 h-[80%] w-[60%] border-[10px] border-[#f6f5f1] shadow-[0_2px_0_rgba(0,0,0,.08)]" />
              {/* sash */}
              <div className="absolute left-[21.3%] top-[9.6%] z-10 h-[76.8%] w-[57.4%]" style={{ perspective: 1600 }}>
                <motion.div
                  className="absolute inset-0"
                  style={{ transformStyle: 'preserve-3d', transformOrigin: s === 2 ? '50% 100%' : '0% 50%' }}
                  animate={{ rotateY: s === 1 ? -55 : 0, rotateX: s === 2 ? -10 : 0 }}
                  transition={spring}
                >
                  <div className="absolute inset-0 border-[14px] border-[#fbfaf7] shadow-[0_18px_40px_rgba(0,0,0,.28),inset_0_0_0_1px_rgba(0,0,0,.08)]">
                    <div className="absolute inset-0 bg-gradient-to-br from-white/25 via-white/5 to-sky-900/15" />
                    <div className="absolute -inset-y-6 left-[-10%] w-1/3 -skew-x-12 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                  </div>
                  {/* handle */}
                  <button
                    onClick={() => setS((v) => (v + 1) % 3)}
                    aria-label={`${t('s0')} / ${t('s1')} / ${t('s2')}`}
                    className="absolute right-[-2px] top-1/2 h-24 w-10 -translate-y-1/2 cursor-pointer"
                  >
                    <span className="absolute left-1/2 top-1/2 h-9 w-5 -translate-x-1/2 -translate-y-1/2 rounded-md bg-gradient-to-b from-white to-zinc-300 shadow-md ring-1 ring-black/10" />
                    <motion.span
                      className="absolute left-1/2 top-1/2 block h-16 w-3 -ml-1.5 rounded-full bg-gradient-to-r from-zinc-200 via-white to-zinc-300 shadow-lg ring-1 ring-black/10"
                      style={{ transformOrigin: '50% 8%' }}
                      animate={{ rotate: s * 90 }}
                      transition={{ type: 'spring', stiffness: 220, damping: 16 }}
                    />
                  </button>
                </motion.div>
              </div>
              {/* sill */}
              <div className="absolute left-[17%] top-[87.5%] z-10 h-[3%] w-[66%] rounded-sm bg-[#fbfaf7] shadow-[0_8px_16px_rgba(0,0,0,.18)]" />
              <Airflow state={s} />
              {/* status chip */}
              <div className="absolute bottom-4 left-4 z-30 flex items-center gap-3 rounded-full bg-black/70 px-4 py-2 text-xs font-bold text-white backdrop-blur">
                <Wind size={14} className={s ? 'text-sky-300' : 'text-zinc-500'} />
                {t('air')}:
                <span className="flex items-end gap-0.5">
                  {[0, 1, 2, 3, 4].map((i) => (
                    <motion.span key={i} className="w-1 rounded-sm" style={{ height: 6 + i * 3 }}
                      animate={{ backgroundColor: i < (s === 1 ? 5 : s === 2 ? 2 : 0) ? '#7dd3fc' : 'rgba(255,255,255,.2)' }} />
                  ))}
                </span>
                <span className="text-zinc-300">{t(`a${s}`)}</span>
              </div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="flex h-full flex-col rounded-[28px] border border-white/10 bg-[var(--panel)] p-6 md:p-8">
              <div className="grid grid-cols-3 gap-2">
                {[0, 1, 2].map((i) => {
                  const Icon = icons[i];
                  return (
                    <button key={i} onClick={() => setS(i)} aria-pressed={s === i}
                      className={`flex flex-col items-center gap-2 rounded-2xl border px-2 py-4 text-sm font-bold transition-colors ${s === i ? 'border-[var(--blue-bright)] bg-[var(--blue)]/20 text-white' : 'border-white/10 text-zinc-400 hover:border-white/30 hover:text-white'}`}>
                      <Icon size={20} />{t(`s${i}`)}
                    </button>
                  );
                })}
              </div>
              {/* handle positions diagram */}
              <div className="mt-8 flex items-center justify-center gap-8">
                {[0, 1, 2].map((i) => (
                  <div key={i} className={`flex flex-col items-center gap-2 transition-opacity ${s === i ? 'opacity-100' : 'opacity-30'}`}>
                    <div className="relative h-14 w-14 rounded-full border border-white/15">
                      <span className="absolute left-1/2 top-1/2 h-6 w-2 -ml-1 rounded-full bg-white" style={{ transformOrigin: '50% 0%', transform: `rotate(${i * 90}deg)` }} />
                    </div>
                    <span className="font-mono text-xs text-zinc-500">{i * 90}°</span>
                  </div>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.p key={s} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: 0.35, ease: EASE }}
                  className="mt-8 text-lg leading-relaxed text-zinc-200">{t(`d${s}`)}</motion.p>
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
};
