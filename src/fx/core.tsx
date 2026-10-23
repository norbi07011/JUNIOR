import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';
import {
  motion, useInView, useMotionValue, useReducedMotion, useScroll, useSpring,
  useTransform, useVelocity, useAnimationFrame, useMotionTemplate, MotionValue,
} from 'motion/react';

/* ------------------------------------------------------------------ */
/* Assets                                                              */
/* ------------------------------------------------------------------ */

/** Resolves a /public file against Vite's base so the site works under any base path. */
export const asset = (p: string) => import.meta.env.BASE_URL + p.replace(/^\//, '');

export const EASE = [0.16, 1, 0.3, 1] as const;

/** True on touch-first devices, where hover/tilt effects are skipped. */
export const useCoarsePointer = () => {
  const [coarse, setCoarse] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia('(pointer: coarse)');
    setCoarse(mq.matches);
    const on = () => setCoarse(mq.matches);
    mq.addEventListener?.('change', on);
    return () => mq.removeEventListener?.('change', on);
  }, []);
  return coarse;
};

/* ------------------------------------------------------------------ */
/* Smooth / inertia scroll (Lenis)                                     */
/* ------------------------------------------------------------------ */

const LenisCtx = createContext<Lenis | null>(null);
export const useLenis = () => useContext(LenisCtx);

export const SmoothScroll = ({ children }: { children: React.ReactNode }) => {
  const reduce = useReducedMotion();
  const [lenis, setLenis] = useState<Lenis | null>(null);

  useEffect(() => {
    if (reduce) return;
    const l = new Lenis({ lerp: 0.09, wheelMultiplier: 1, smoothWheel: true });
    let raf = 0;
    const loop = (t: number) => { l.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    setLenis(l);
    return () => { cancelAnimationFrame(raf); l.destroy(); setLenis(null); };
  }, [reduce]);

  return <LenisCtx.Provider value={lenis}>{children}</LenisCtx.Provider>;
};

/* ------------------------------------------------------------------ */
/* Scroll progress bar                                                 */
/* ------------------------------------------------------------------ */

export const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 140, damping: 30, mass: 0.3 });
  return (
    <motion.div
      aria-hidden
      style={{ scaleX }}
      className="fixed top-0 left-0 right-0 h-[3px] origin-left z-[70] bg-gradient-to-r from-[var(--blue)] via-[var(--blue-bright)] to-[var(--steel)] shadow-[0_0_12px_var(--blue)]"
    />
  );
};

/* ------------------------------------------------------------------ */
/* Magnetic button                                                     */
/* ------------------------------------------------------------------ */

export const Magnetic = ({ children, strength = 0.35, className = '' }: { children: React.ReactNode; strength?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 15, mass: 0.4 });
  const sy = useSpring(y, { stiffness: 220, damping: 15, mass: 0.4 });
  const coarse = useCoarsePointer();

  const move = (e: React.PointerEvent) => {
    if (coarse || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * strength);
    y.set((e.clientY - (r.top + r.height / 2)) * strength);
  };
  const leave = () => { x.set(0); y.set(0); };

  return (
    <motion.div ref={ref} onPointerMove={move} onPointerLeave={leave} style={{ x: sx, y: sy }} className={`inline-block ${className}`}>
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Kinetic typography — split text / staggered reveal                  */
/* ------------------------------------------------------------------ */

type SplitProps = {
  text: string;
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'span';
  className?: string;
  by?: 'word' | 'char';
  delay?: number;
  stagger?: number;
  onView?: boolean;
};

export const SplitText = ({ text, as = 'h2', className = '', by = 'word', delay = 0, stagger, onView = true }: SplitProps) => {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-10% 0px' });
  const reduce = useReducedMotion();
  const show = onView ? inView : true;
  const words = text.split(' ');
  const step = stagger ?? (by === 'char' ? 0.025 : 0.07);
  let idx = 0;
  const Tag = motion[as] as typeof motion.h2;
  // background-clip:text does not paint through transformed children, so move gradient classes onto each piece.
  const gradient = className.split(' ').filter((c) => c.startsWith('text-') && c.endsWith('-gradient')).join(' ');
  const outer = className.split(' ').filter((c) => !(c.startsWith('text-') && c.endsWith('-gradient'))).join(' ');

  return (
    <Tag ref={ref as React.Ref<HTMLHeadingElement>} className={outer} aria-label={text}>
      {words.map((w, wi) => (
        <span key={wi} aria-hidden className="inline-block whitespace-nowrap" style={{ perspective: 600 }}>
          {(by === 'char' ? w.split('') : [w]).map((piece, pi) => {
            const i = idx++;
            return (
              <motion.span
                key={pi}
                className={`inline-block will-change-transform ${gradient}`}
                initial={reduce ? false : { y: '0.9em', opacity: 0, rotateX: -70, filter: 'blur(8px)' }}
                animate={show ? { y: 0, opacity: 1, rotateX: 0, filter: 'blur(0px)' } : undefined}
                transition={{ duration: 0.9, ease: EASE, delay: delay + i * step }}
                style={{ transformOrigin: '50% 100%' }}
              >
                {piece}
              </motion.span>
            );
          })}
          {wi < words.length - 1 && <span className="inline-block">&nbsp;</span>}
        </span>
      ))}
    </Tag>
  );
};

/* ------------------------------------------------------------------ */
/* Scroll reveal (blur + 3D)                                           */
/* ------------------------------------------------------------------ */

export const Reveal = ({ children, delay = 0, className = '', y = 60, rotate = 12 }: { children: React.ReactNode; delay?: number; className?: string; y?: number; rotate?: number }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      style={{ transformPerspective: 1000 }}
      initial={reduce ? false : { opacity: 0, y, rotateX: rotate, filter: 'blur(12px)' }}
      whileInView={{ opacity: 1, y: 0, rotateX: 0, filter: 'blur(0px)' }}
      viewport={{ once: true, margin: '-8% 0px' }}
      transition={{ duration: 1, ease: EASE, delay }}
    >
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* 3D tilt card with glare                                             */
/* ------------------------------------------------------------------ */

export const TiltCard = ({ children, className = '', max = 12, glare = true }: { children: React.ReactNode; className?: string; max?: number; glare?: boolean }) => {
  const ref = useRef<HTMLDivElement>(null);
  const rx = useMotionValue(0);
  const ry = useMotionValue(0);
  const gx = useMotionValue(50);
  const gy = useMotionValue(50);
  const go = useMotionValue(0);
  const srx = useSpring(rx, { stiffness: 200, damping: 18 });
  const sry = useSpring(ry, { stiffness: 200, damping: 18 });
  const glareBg = useTransform([gx, gy] as MotionValue<number>[], ([x, y]) =>
    `radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.35), rgba(255,255,255,0.06) 35%, transparent 60%)`);
  const coarse = useCoarsePointer();

  const move = (e: React.PointerEvent) => {
    if (coarse || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width;
    const py = (e.clientY - r.top) / r.height;
    ry.set((px - 0.5) * max * 2);
    rx.set((0.5 - py) * max * 2);
    gx.set(px * 100); gy.set(py * 100); go.set(1);
  };
  const leave = () => { rx.set(0); ry.set(0); go.set(0); };

  return (
    <motion.div
      ref={ref}
      onPointerMove={move}
      onPointerLeave={leave}
      style={{ rotateX: srx, rotateY: sry, transformPerspective: 900, transformStyle: 'preserve-3d' }}
      className={`relative ${className}`}
    >
      {children}
      {glare && (
        <motion.div
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-[inherit] mix-blend-overlay"
          style={{ background: glareBg, opacity: go, transition: 'opacity .3s' }}
        />
      )}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Parallax                                                            */
/* ------------------------------------------------------------------ */

export const Parallax = ({ children, speed = 0.2, className = '' }: { children: React.ReactNode; speed?: number; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], [`${-speed * 100}%`, `${speed * 100}%`]);
  const reduce = useReducedMotion();
  return (
    <div ref={ref} className={`overflow-hidden ${className}`}>
      <motion.div style={{ y: reduce ? 0 : y }} className="h-full w-full scale-[1.25]">
        {children}
      </motion.div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Rolling number (odometer) — count-up on scroll                      */
/* ------------------------------------------------------------------ */

const Digit = ({ d, delay }: { d: number; delay: number }) => (
  <span className="relative inline-block h-[1em] overflow-hidden leading-none" style={{ verticalAlign: 'top' }}>
    <span aria-hidden className="invisible block h-[1em] leading-none">8</span>
    <motion.span
      className="absolute inset-x-0 top-0 flex flex-col items-center"
      initial={{ y: '0%' }}
      animate={{ y: `${-d * 10}%` }}
      transition={{ duration: 1.8, ease: EASE, delay }}
    >
      {Array.from({ length: 10 }, (_, i) => <span key={i} className="block h-[1em] leading-none">{i}</span>)}
    </motion.span>
  </span>
);

export const RollingNumber = ({ value, decimals = 0, suffix = '', prefix = '', className = '' }: { value: number; decimals?: number; suffix?: string; prefix?: string; className?: string }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, margin: '-5% 0px' });
  const str = value.toFixed(decimals);
  return (
    <span ref={ref} className={`inline-flex items-start tabular-nums leading-none ${className}`} aria-label={`${prefix}${str}${suffix}`}>
      {prefix && <span aria-hidden>{prefix}</span>}
      {str.split('').map((ch, i) =>
        /\d/.test(ch)
          ? <Digit key={i} d={inView ? Number(ch) : 0} delay={i * 0.1} />
          : <span key={i} aria-hidden className="leading-none">{ch}</span>)}
      {suffix && <span aria-hidden className="leading-none">{suffix}</span>}
    </span>
  );
};

/* ------------------------------------------------------------------ */
/* Scroll-velocity marquee (speeds up + skews with fast scrolling)     */
/* ------------------------------------------------------------------ */

const wrap = (min: number, max: number, v: number) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

export const VelocityMarquee = ({ items, baseSpeed = 3, className = '', reverse = false }: { items: React.ReactNode[]; baseSpeed?: number; className?: string; reverse?: boolean }) => {
  const baseX = useMotionValue(0);
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-2000, 0, 2000], [-6, 0, 6], { clamp: false });
  const skew = useTransform(smooth, [-2500, 0, 2500], [12, 0, -12]);
  const x = useTransform(baseX, (v) => `${wrap(-50, 0, v)}%`);
  const dir = useRef(reverse ? -1 : 1);
  const reduce = useReducedMotion();

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    let move = dir.current * baseSpeed * (delta / 1000);
    const f = factor.get();
    if (f < 0) dir.current = reverse ? 1 : -1;
    else if (f > 0) dir.current = reverse ? -1 : 1;
    move += dir.current * move * Math.abs(f);
    baseX.set(baseX.get() - move);
  });

  const row = (
    <div className="flex shrink-0 items-center">
      {items.map((it, i) => <div key={i} className="flex items-center">{it}</div>)}
    </div>
  );

  return (
    <div className={`overflow-hidden whitespace-nowrap ${className}`}>
      <motion.div className="flex w-max" style={{ x, skewX: skew }}>
        {row}{row}
      </motion.div>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Scroll-driven text fill (giant footer wordmark)                     */
/* ------------------------------------------------------------------ */

export const TextFill = ({ text, className = '' }: { text: string; className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end end'] });
  const right = useTransform(scrollYProgress, [0.1, 0.9], [100, 0], { clamp: true });
  const clip = useMotionTemplate`inset(-10% ${right}% -10% 0)`;
  return (
    <div ref={ref} className={`relative select-none leading-[0.8] font-display ${className}`} aria-label={text}>
      <span aria-hidden className="block text-transparent [-webkit-text-stroke:1px_rgba(201,206,214,0.25)]">{text}</span>
      <motion.span aria-hidden style={{ clipPath: clip }} className="absolute inset-0 block text-steel-gradient">
        {text}
      </motion.span>
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Image zoom lens (magnifier)                                         */
/* ------------------------------------------------------------------ */

export const ZoomLens = ({ src, alt, className = '', zoom = 2.4, size = 190 }: { src: string; alt: string; className?: string; zoom?: number; size?: number }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ x: number; y: number; w: number; h: number } | null>(null);
  const coarse = useCoarsePointer();

  const move = (e: React.PointerEvent) => {
    if (coarse || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    setPos({ x: e.clientX - r.left, y: e.clientY - r.top, w: r.width, h: r.height });
  };

  return (
    <div ref={ref} onPointerMove={move} onPointerLeave={() => setPos(null)} className={`relative ${pos ? 'cursor-none' : ''} ${className}`}>
      <img src={src} alt={alt} className="block max-h-[78vh] max-w-full rounded-2xl object-contain select-none" draggable={false} />
      {pos && (
        <div
          aria-hidden
          className="pointer-events-none absolute rounded-full border-2 border-white/70 shadow-[0_10px_40px_rgba(0,0,0,0.6),0_0_0_6px_rgba(37,99,235,0.25)]"
          style={{
            width: size, height: size,
            left: pos.x - size / 2, top: pos.y - size / 2,
            backgroundImage: `url("${src}")`,
            backgroundRepeat: 'no-repeat',
            backgroundSize: `${pos.w * zoom}px ${pos.h * zoom}px`,
            backgroundPosition: `${-(pos.x * zoom - size / 2)}px ${-(pos.y * zoom - size / 2)}px`,
          }}
        />
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Floating / levitating (bob) wrapper                                 */
/* ------------------------------------------------------------------ */

export const Float = ({ children, amp = 10, duration = 5, delay = 0, className = '' }: { children: React.ReactNode; amp?: number; duration?: number; delay?: number; className?: string }) => {
  const reduce = useReducedMotion();
  return (
    <motion.div
      className={className}
      animate={reduce ? undefined : { y: [0, -amp, 0], rotate: [0, 0.8, 0, -0.8, 0] }}
      transition={{ duration, repeat: Infinity, ease: 'easeInOut', delay }}
    >
      {children}
    </motion.div>
  );
};

/* ------------------------------------------------------------------ */
/* Mouse parallax (cursor-reactive scene)                              */
/* ------------------------------------------------------------------ */

const MouseCtx = createContext<{ x: MotionValue<number>; y: MotionValue<number> } | null>(null);

export const MouseScene = ({ children, className = '' }: { children: React.ReactNode; className?: string }) => {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 60, damping: 20 });
  const sy = useSpring(y, { stiffness: 60, damping: 20 });
  const coarse = useCoarsePointer();
  const value = useMemo(() => ({ x: sx, y: sy }), [sx, sy]);
  const move = (e: React.PointerEvent<HTMLDivElement>) => {
    if (coarse) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - r.left) / r.width - 0.5);
    y.set((e.clientY - r.top) / r.height - 0.5);
  };
  return (
    <MouseCtx.Provider value={value}>
      <div onPointerMove={move} onPointerLeave={() => { x.set(0); y.set(0); }} className={className}>{children}</div>
    </MouseCtx.Provider>
  );
};

/** A layer that shifts with the cursor; depth in px at the scene edge. Negative = opposite direction. */
export const MouseLayer = ({ children, depth = 20, rotate = 0, className = '', style }: { children: React.ReactNode; depth?: number; rotate?: number; className?: string; style?: React.CSSProperties }) => {
  const ctx = useContext(MouseCtx);
  const fallback = useMotionValue(0);
  const mx = ctx?.x ?? fallback;
  const my = ctx?.y ?? fallback;
  const tx = useTransform(mx, (v) => v * depth);
  const ty = useTransform(my, (v) => v * depth);
  const rY = useTransform(mx, (v) => v * rotate);
  const rX = useTransform(my, (v) => -v * rotate);
  return (
    <motion.div className={className} style={{ ...style, x: tx, y: ty, rotateY: rY, rotateX: rX }}>
      {children}
    </motion.div>
  );
};
