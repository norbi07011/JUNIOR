import type React from 'react';
import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'motion/react';

/* ------------------------------------------------------------------ */
/* WebGL shader background — slow, blue-tinted animated smoke          */
/* ------------------------------------------------------------------ */

const VERT = `attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}`;
const FRAG = `
precision mediump float;
uniform vec2 r; uniform float t; uniform vec2 m; uniform float k;
float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);
 return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
float fbm(vec2 p){float v=0.,a=.5;mat2 R=mat2(.8,.6,-.6,.8);for(int i=0;i<6;i++){v+=a*n(p);p=R*p*2.02;a*=.5;}return v;}
void main(){
 vec2 uv=gl_FragCoord.xy/r; vec2 p=(gl_FragCoord.xy-.5*r)/r.y;
 p+=m*.08;
 float T=t*.045;
 vec2 q=vec2(fbm(p*1.6+vec2(0.,T)),fbm(p*1.6+vec2(5.2,1.3)-T));
 vec2 w=vec2(fbm(p*1.4+3.*q+vec2(1.7,9.2)+T*1.3),fbm(p*1.4+3.*q+vec2(8.3,2.8)-T));
 float f=fbm(p*1.2+3.5*w);
 vec3 deep=vec3(.012,.016,.03);
 vec3 blue=vec3(.09,.25,.85);
 vec3 steel=vec3(.55,.6,.7);
 vec3 c=mix(deep,blue,clamp(f*f*1.6,0.,1.)*k);
 c=mix(c,steel,clamp(length(w)*.35-.25,0.,1.)*.35*k);
 c*=smoothstep(1.25,.2,length(uv-.5)*1.6);
 c+=(h(gl_FragCoord.xy+t)-.5)*.025;
 gl_FragColor=vec4(c,1.);
}`;

export const ShaderBackground = ({ className = '', intensity = 1 }: { className?: string; intensity?: number }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const gl = canvas.getContext('webgl', { antialias: false, premultipliedAlpha: false });
    if (!gl) { setFailed(true); return; }

    const sh = (type: number, src: string) => {
      const s = gl.createShader(type)!; gl.shaderSource(s, src); gl.compileShader(s); return s;
    };
    const prog = gl.createProgram()!;
    gl.attachShader(prog, sh(gl.VERTEX_SHADER, VERT));
    gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, FRAG));
    gl.linkProgram(prog);
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) { setFailed(true); return; }
    gl.useProgram(prog);
    const buf = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, buf);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    const loc = gl.getAttribLocation(prog, 'p');
    gl.enableVertexAttribArray(loc);
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
    const uR = gl.getUniformLocation(prog, 'r');
    const uT = gl.getUniformLocation(prog, 't');
    const uM = gl.getUniformLocation(prog, 'm');
    const uK = gl.getUniformLocation(prog, 'k');

    // Render at reduced resolution — smoke is soft, this keeps it cheap.
    const scale = 0.5;
    const resize = () => {
      const w = Math.max(1, Math.floor(canvas.clientWidth * scale));
      const h = Math.max(1, Math.floor(canvas.clientHeight * scale));
      if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
      gl.viewport(0, 0, canvas.width, canvas.height);
    };
    const ro = new ResizeObserver(resize); ro.observe(canvas); resize();

    let mx = 0, my = 0, tmx = 0, tmy = 0;
    const onMove = (e: PointerEvent) => { tmx = e.clientX / window.innerWidth - 0.5; tmy = 0.5 - e.clientY / window.innerHeight; };
    window.addEventListener('pointermove', onMove, { passive: true });

    let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }, { threshold: 0 });
    io.observe(canvas);

    let raf = 0; const start = performance.now();
    const frame = (now: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      mx += (tmx - mx) * 0.04; my += (tmy - my) * 0.04;
      gl.uniform2f(uR, canvas.width, canvas.height);
      gl.uniform1f(uT, reduce ? 20 : (now - start) / 1000);
      gl.uniform2f(uM, mx, my);
      gl.uniform1f(uK, intensity);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
      if (reduce) cancelAnimationFrame(raf);
    };
    raf = requestAnimationFrame(frame);

    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); window.removeEventListener('pointermove', onMove); };
  }, [reduce, intensity]);

  if (failed) return <div aria-hidden className={`${className} bg-[radial-gradient(ellipse_at_30%_20%,rgba(37,99,235,0.25),transparent_60%),#05060a]`} />;
  return <canvas ref={ref} aria-hidden className={`${className} block h-full w-full`} />;
};

/* ------------------------------------------------------------------ */
/* Volumetric spotlights + particle dust                               */
/* ------------------------------------------------------------------ */

export const Spotlights = ({ className = '' }: { className?: string }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let W = 0, H = 0;
    const resize = () => { W = c.clientWidth; H = c.clientHeight; c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0); };
    const ro = new ResizeObserver(resize); ro.observe(c); resize();
    const N = Math.round(Math.min(140, (W * H) / 9000));
    const ps = Array.from({ length: N }, () => ({
      x: Math.random(), y: Math.random(), r: Math.random() * 1.6 + 0.3,
      vx: (Math.random() - 0.5) * 0.00012, vy: -Math.random() * 0.00018 - 0.00004, p: Math.random() * Math.PI * 2,
    }));
    // Dust is only visible inside the two light cones.
    const beams = [{ x: 0.22, a: 0.32 }, { x: 0.78, a: -0.32 }];
    const inBeam = (x: number, y: number, t: number) => {
      let v = 0;
      for (const b of beams) {
        const sway = Math.sin(t / 3000 + b.x * 9) * 0.04;
        const cx = b.x + (b.a + sway) * y;
        const half = 0.05 + y * 0.17;
        const d = Math.abs(x - cx) / half;
        if (d < 1) v = Math.max(v, (1 - d) * (1 - y * 0.35));
      }
      return v;
    };
    let raf = 0; let visible = true;
    const io = new IntersectionObserver(([e]) => { visible = e.isIntersecting; }); io.observe(c);
    const frame = (t: number) => {
      raf = requestAnimationFrame(frame);
      if (!visible) return;
      ctx.clearRect(0, 0, W, H);
      for (const p of ps) {
        if (!reduce) { p.x += p.vx + Math.sin(t / 2000 + p.p) * 0.00006; p.y += p.vy; }
        if (p.y < -0.02) { p.y = 1.02; p.x = Math.random(); }
        if (p.x < 0) p.x = 1; if (p.x > 1) p.x = 0;
        const v = inBeam(p.x, p.y, t);
        if (v <= 0.02) continue;
        const tw = 0.6 + 0.4 * Math.sin(t / 500 + p.p * 3);
        ctx.fillStyle = `rgba(200,215,255,${v * tw * 0.85})`;
        ctx.beginPath(); ctx.arc(p.x * W, p.y * H, p.r, 0, Math.PI * 2); ctx.fill();
      }
    };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); ro.disconnect(); io.disconnect(); };
  }, [reduce]);

  return (
    <div aria-hidden className={`pointer-events-none overflow-hidden ${className}`}>
      <div className="spot-beam spot-beam-left" />
      <div className="spot-beam spot-beam-right" />
      <canvas ref={ref} className="absolute inset-0 h-full w-full" />
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Logo curtain intro — the real 3D logo, a light sweep, curtain up     */
/* ------------------------------------------------------------------ */

export const LogoIntro = ({ label = 'Skip', logo }: { label?: string; logo: string }) => {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(() => {
    try { return !sessionStorage.getItem('jj_intro'); } catch { return false; }
  });
  const [leaving, setLeaving] = useState(false);
  const finish = () => {
    try { sessionStorage.setItem('jj_intro', '1'); } catch { /* storage blocked */ }
    setLeaving(true);
    setTimeout(() => setShow(false), 950);
  };
  useEffect(() => {
    if (!show) return;
    if (reduce) { try { sessionStorage.setItem('jj_intro', '1'); } catch { /* */ } setShow(false); return; }
    document.documentElement.style.overflow = 'hidden';
    const t = setTimeout(finish, 2700);
    return () => { clearTimeout(t); document.documentElement.style.overflow = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, reduce]);
  useEffect(() => { if (!show) document.documentElement.style.overflow = ''; }, [show]);

  if (!show) return null;
  const E = [0.16, 1, 0.3, 1] as const;
  const IO = [0.76, 0, 0.24, 1] as const;
  // the cut-out logo is split into three layers with clip-paths: window icon, wordmark, tagline
  const layer = (clip: string) => ({ clipPath: clip, WebkitClipPath: clip });
  const ICON = 'polygon(0 0, 21% 0, 21% 42%, 12% 42%, 12% 100%, 0 100%)';
  const WORD = 'polygon(12% 42%, 100% 42%, 100% 81%, 12% 81%)';
  const TAG = 'polygon(12% 81%, 100% 81%, 100% 100%, 12% 100%)';
  const mask = { WebkitMaskImage: `url(${logo})`, maskImage: `url(${logo})`, WebkitMaskSize: '100% 100%', maskSize: '100% 100%' } as React.CSSProperties;

  return (
    <div className="fixed inset-0 z-[200]" aria-hidden={leaving}>
      {/* curtain halves */}
      <motion.div className="absolute inset-x-0 top-0 h-1/2 bg-[#040507]" animate={leaving ? { y: '-100%' } : { y: 0 }} transition={{ duration: 0.9, ease: IO, delay: 0.05 }} />
      <motion.div className="absolute inset-x-0 bottom-0 h-1/2 bg-[#040507]" animate={leaving ? { y: '100%' } : { y: 0 }} transition={{ duration: 0.9, ease: IO, delay: 0.05 }} />

      <motion.div className="absolute inset-0 flex items-center justify-center"
        animate={leaving ? { opacity: 0, scale: 1.12 } : { opacity: 1, scale: 1 }}
        transition={{ duration: 0.7, ease: E }}>
        {/* ambient glow */}
        <motion.div className="absolute h-[70vmin] w-[110vmin] bg-[radial-gradient(ellipse_closest-side,rgba(37,99,235,.32),rgba(37,99,235,.08)_55%,transparent)]"
          initial={{ opacity: 0, scale: 0.6 }} animate={{ opacity: [0, 1, 0.6], scale: [0.6, 1.05, 1] }} transition={{ duration: 2.2, ease: E, delay: 0.3 }} />
        {/* light line */}
        <motion.div className="absolute h-px w-[70vmin] bg-gradient-to-r from-transparent via-[var(--blue-bright)] to-transparent shadow-[0_0_20px_var(--blue-bright)]"
          initial={{ scaleX: 0, opacity: 0 }} animate={{ scaleX: [0, 1, 1.4], opacity: [0, 1, 0] }} transition={{ duration: 1.1, ease: E, times: [0, 0.45, 1] }} />

        <div className="relative w-[min(84vw,640px)]" style={{ aspectRatio: '1111 / 446' }}>
          {/* window icon: rises out of a bottom-up wipe */}
          <motion.img src={logo} alt="" draggable={false} className="absolute inset-0 h-full w-full" style={layer(ICON)}
            initial={{ y: 40, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 1, ease: E, delay: 0.35 }} />
          {/* blue glass bloom behind the icon */}
          <motion.div className="absolute left-[-6%] top-[-4%] h-[110%] w-[34%] bg-[radial-gradient(ellipse_closest-side,rgba(37,99,235,.55),transparent)]"
            initial={{ opacity: 0 }} animate={{ opacity: [0, 0.55, 0.2] }} transition={{ duration: 1.6, delay: 0.6 }} style={{ zIndex: -1 }} />
          {/* wordmark: left-to-right mask wipe, sharpening */}
          <motion.img src={logo} alt="JuniorJob Onderhoud" draggable={false} className="absolute inset-0 h-full w-full"
            initial={{ clipPath: 'polygon(12% 42%, 12% 42%, 12% 81%, 12% 81%)', x: -16 }}
            animate={{ clipPath: WORD, x: 0 }}
            transition={{ duration: 1.05, ease: IO, delay: 0.8 }} />
          {/* tagline */}
          <motion.img src={logo} alt="" draggable={false} className="absolute inset-0 h-full w-full" style={layer(TAG)}
            initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: E, delay: 1.45 }} />
          {/* specular sweep, masked to the logo's own shape */}
          <motion.div className="pointer-events-none absolute inset-0 mix-blend-screen" style={{ ...mask, backgroundImage: 'linear-gradient(105deg, transparent 42%, rgba(255,255,255,.95) 50%, rgba(147,197,253,.6) 53%, transparent 60%)', backgroundSize: '300% 100%' }}
            initial={{ backgroundPosition: '100% 0' }} animate={{ backgroundPosition: '-50% 0' }}
            transition={{ duration: 1.1, ease: 'easeInOut', delay: 1.65 }} />
        </div>
      </motion.div>

      {!leaving && (
        <button onClick={finish} className="absolute bottom-8 right-8 z-10 text-xs uppercase tracking-[0.3em] text-zinc-500 transition-colors hover:text-white">{label} →</button>
      )}
    </div>
  );
};

/* ------------------------------------------------------------------ */
/* Victory scene: shockwave + window-shaped confetti + screen shake    */
/* ------------------------------------------------------------------ */

export const shakeScreen = () => {
  const el = document.getElementById('shake-root');
  if (!el || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  el.classList.remove('screen-shake'); void el.offsetWidth; el.classList.add('screen-shake');
  setTimeout(() => el.classList.remove('screen-shake'), 700);
};

export const ConfettiBurst = ({ origin }: { origin: { x: number; y: number } }) => {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth, H = window.innerHeight;
    c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    const colors = ['#2563eb', '#3b82f6', '#93c5fd', '#e5e7eb', '#cbd5e1', '#ffffff'];
    const ps = Array.from({ length: 170 }, () => {
      const a = Math.random() * Math.PI * 2, s = 6 + Math.random() * 16;
      return {
        x: origin.x, y: origin.y, vx: Math.cos(a) * s, vy: Math.sin(a) * s - 6,
        rot: Math.random() * Math.PI, vr: (Math.random() - 0.5) * 0.35,
        w: 9 + Math.random() * 9, h: 12 + Math.random() * 12, tilt: Math.random() * Math.PI,
        color: colors[(Math.random() * colors.length) | 0], life: 1,
      };
    });
    // Each confetto is a tiny window: frame + cross bar.
    const drawWindow = (w: number, h: number, color: string) => {
      ctx.strokeStyle = color; ctx.lineWidth = 2;
      ctx.strokeRect(-w / 2, -h / 2, w, h);
      ctx.beginPath(); ctx.moveTo(0, -h / 2); ctx.lineTo(0, h / 2); ctx.moveTo(-w / 2, 0); ctx.lineTo(w / 2, 0); ctx.stroke();
      ctx.fillStyle = color + '33'; ctx.fillRect(-w / 2, -h / 2, w, h);
    };
    let raf = 0;
    const frame = () => {
      ctx.clearRect(0, 0, W, H);
      let alive = 0;
      for (const p of ps) {
        p.vy += 0.32; p.vx *= 0.985; p.vy *= 0.985;
        p.x += p.vx; p.y += p.vy; p.rot += p.vr; p.tilt += 0.08;
        if (p.y > H + 40) continue;
        p.life -= 0.004; if (p.life <= 0) continue;
        alive++;
        ctx.save(); ctx.globalAlpha = Math.min(1, p.life * 2);
        ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.scale(Math.cos(p.tilt), 1);
        drawWindow(p.w, p.h, p.color);
        ctx.restore();
      }
      if (alive) raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(raf);
  }, [origin.x, origin.y]);
  return <canvas ref={ref} aria-hidden className="pointer-events-none fixed inset-0 z-[160] h-full w-full" />;
};

export const VictoryScene = ({ open, title, text, button, onClose }: {
  open: boolean; origin?: { x: number; y: number }; title: string; text: string; button: string; onClose: () => void;
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        role="dialog" aria-modal="true"
        className="fixed inset-0 z-[150] flex items-center justify-center bg-black/70 px-6 backdrop-blur-md"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <motion.div
          className="relative w-full max-w-md overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0d12] p-10 text-center shadow-[0_40px_120px_rgba(0,0,0,.6)]"
          initial={{ y: 30, opacity: 0, scale: 0.97 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 20, opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="pointer-events-none absolute -top-24 left-1/2 h-48 w-48 -translate-x-1/2 rounded-full bg-[var(--blue)]/30 blur-[70px]" />
          <svg viewBox="0 0 80 80" className="relative mx-auto mb-7 h-20 w-20">
            <motion.circle cx="40" cy="40" r="36" fill="none" stroke="var(--blue-bright)" strokeWidth="3" strokeLinecap="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.8, ease: 'easeInOut', delay: 0.2 }}
              style={{ rotate: -90, transformOrigin: '40px 40px' }} />
            <motion.path d="M25 41l10 10 20-22" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"
              initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 0.45, ease: 'easeOut', delay: 0.9 }} />
          </svg>
          <h2 className="font-display relative text-3xl font-extrabold tracking-tight">{title}</h2>
          <p className="relative mt-3 text-zinc-400">{text}</p>
          <button onClick={onClose} className="relative mt-8 rounded-full bg-white px-7 py-3 font-bold text-black transition-colors hover:bg-[var(--steel)]">{button}</button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
