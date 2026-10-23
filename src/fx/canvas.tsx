import React, { useEffect, useRef, useState } from 'react';
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
/* Particle logo intro (particle morph)                                */
/* ------------------------------------------------------------------ */

export const ParticleIntro = ({ label = 'Skip' }: { label?: string }) => {
  const reduce = useReducedMotion();
  const [show, setShow] = useState(() => {
    try { return !sessionStorage.getItem('jj_intro'); } catch { return true; }
  });
  const ref = useRef<HTMLCanvasElement>(null);

  const finish = () => {
    try { sessionStorage.setItem('jj_intro', '1'); } catch { /* storage blocked */ }
    setShow(false);
  };

  useEffect(() => {
    if (!show) return;
    if (reduce) { finish(); return; }
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d'); if (!ctx) return;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const W = window.innerWidth, H = window.innerHeight;
    c.width = W * dpr; c.height = H * dpr; ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // Sample target points from the wordmark + window icon.
    const off = document.createElement('canvas');
    const ow = Math.min(W * 0.86, 1100), oh = ow * 0.36;
    off.width = ow; off.height = oh;
    const o = off.getContext('2d')!;
    o.fillStyle = '#fff';
    // window icon
    const ih = oh * 0.62, iw = ih * 0.55, ix = 0, iy = (oh - ih) / 2;
    o.fillRect(ix, iy, iw, ih * 0.08); o.fillRect(ix, iy + ih * 0.92, iw, ih * 0.08);
    o.fillRect(ix, iy, iw * 0.12, ih); o.fillRect(ix + iw * 0.88, iy, iw * 0.12, ih);
    o.fillRect(ix + iw * 0.46, iy, iw * 0.08, ih);
    let fs = oh * 0.5;
    o.font = `800 ${fs}px Archivo, Inter, sans-serif`;
    const avail = ow - iw * 1.25 - 4;
    const full = o.measureText('JUNIORJOB').width;
    if (full > avail) { fs *= avail / full; o.font = `800 ${fs}px Archivo, Inter, sans-serif`; }
    o.textBaseline = 'middle';
    o.fillText('JUNIORJOB', iw * 1.25, oh * 0.5);
    const data = o.getImageData(0, 0, ow, oh).data;
    const gap = Math.max(3, Math.round(ow / 190));
    const targets: { x: number; y: number; blue: boolean }[] = [];
    const textW = o.measureText('JUNIOR').width;
    for (let y = 0; y < oh; y += gap) for (let x = 0; x < ow; x += gap) {
      if (data[(y * ow + x) * 4 + 3] > 128) targets.push({ x: x + (W - ow) / 2, y: y + (H - oh) / 2, blue: x < iw || x > iw * 1.25 + textW });
    }
    const ps = targets.map((t) => {
      const a = Math.random() * Math.PI * 2, d = Math.max(W, H) * (0.6 + Math.random() * 0.6);
      return { sx: W / 2 + Math.cos(a) * d, sy: H / 2 + Math.sin(a) * d, x: 0, y: 0, tx: t.x, ty: t.y, ex: 0, ey: 0, blue: t.blue, delay: Math.random() * 450 };
    });
    for (const p of ps) {
      const a = Math.atan2(p.ty - H / 2, p.tx - W / 2) + (Math.random() - 0.5) * 0.8;
      const s = Math.max(W, H) * (0.5 + Math.random() * 0.7);
      p.ex = Math.cos(a) * s; p.ey = Math.sin(a) * s;
    }

    let raf = 0; const start = performance.now();
    const GATHER = 1000, HOLD = 2000, END = 2700;
    const easeOut = (x: number) => 1 - Math.pow(1 - x, 3);
    const easeIn = (x: number) => x * x * x;
    const frame = (now: number) => {
      const t = now - start;
      ctx.fillStyle = 'rgba(5,6,10,0.35)'; ctx.fillRect(0, 0, W, H);
      const sweep = (t - GATHER) / (HOLD - GATHER);
      for (const p of ps) {
        if (t < HOLD) {
          const k = easeOut(Math.min(1, Math.max(0, (t - p.delay) / GATHER)));
          p.x = p.sx + (p.tx - p.sx) * k; p.y = p.sy + (p.ty - p.sy) * k;
        } else {
          const k = easeIn(Math.min(1, (t - HOLD) / (END - HOLD)));
          p.x = p.tx + p.ex * k; p.y = p.ty + p.ey * k;
        }
        const rel = (p.tx - (W - ow) / 2) / ow;
        const glint = sweep > 0 && sweep < 1.2 ? Math.max(0, 1 - Math.abs(rel - sweep) * 10) : 0;
        ctx.fillStyle = glint > 0.05 ? `rgba(255,255,255,${0.6 + glint * 0.4})` : p.blue ? '#3b82f6' : '#cfd5de';
        ctx.fillRect(p.x, p.y, gap * 0.62, gap * 0.62);
      }
      if (t < END) raf = requestAnimationFrame(frame); else finish();
    };
    raf = requestAnimationFrame(frame);
    document.documentElement.style.overflow = 'hidden';
    return () => { cancelAnimationFrame(raf); document.documentElement.style.overflow = ''; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show, reduce]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] bg-[#05060a]"
          exit={{ opacity: 0, filter: 'blur(10px)' }}
          transition={{ duration: 0.6 }}
        >
          <canvas ref={ref} className="h-full w-full" />
          <button onClick={finish} className="absolute bottom-8 right-8 text-xs uppercase tracking-[0.3em] text-zinc-500 hover:text-white transition-colors">
            {label} →
          </button>
        </motion.div>
      )}
    </AnimatePresence>
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

export const VictoryScene = ({ open, origin, title, text, button, onClose }: {
  open: boolean; origin: { x: number; y: number }; title: string; text: string; button: string; onClose: () => void;
}) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-[150] flex items-center justify-center bg-black/80 backdrop-blur-md"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      >
        <ConfettiBurst origin={origin} />
        {/* shockwave rings */}
        {[0, 0.12, 0.24].map((d) => (
          <motion.div
            key={d}
            aria-hidden
            className="absolute rounded-full border-2 border-[var(--blue-bright)]"
            style={{ left: origin.x, top: origin.y, width: 40, height: 40, marginLeft: -20, marginTop: -20 }}
            initial={{ scale: 0, opacity: 0.9 }}
            animate={{ scale: 60, opacity: 0, borderWidth: 0.5 }}
            transition={{ duration: 1.3, delay: d, ease: [0.2, 0.7, 0.2, 1] }}
          />
        ))}
        <motion.div
          className="relative mx-6 max-w-md rounded-[2rem] border border-white/10 bg-[#0b0d12]/90 p-10 text-center shadow-[0_40px_120px_rgba(37,99,235,0.35)]"
          initial={{ scale: 0.4, rotateX: 50, opacity: 0, y: 40 }}
          animate={{ scale: 1, rotateX: 0, opacity: 1, y: 0 }}
          transition={{ type: 'spring', stiffness: 220, damping: 16, delay: 0.15 }}
          style={{ transformPerspective: 900 }}
        >
          {/* window that swings open */}
          <div className="mx-auto mb-8 h-28 w-24" style={{ perspective: 500 }}>
            <div className="relative h-full w-full rounded-md border-4 border-[var(--steel)] bg-gradient-to-br from-sky-300/30 to-[var(--blue)]/60 shadow-[0_0_60px_rgba(59,130,246,0.6)]">
              <motion.div
                className="absolute inset-0 rounded-sm border-4 border-[var(--steel)] bg-gradient-to-br from-white/40 to-[var(--blue)]/40"
                style={{ transformOrigin: 'left center' }}
                initial={{ rotateY: 0 }}
                animate={{ rotateY: -65 }}
                transition={{ delay: 0.6, type: 'spring', stiffness: 90, damping: 9 }}
              />
              <motion.svg viewBox="0 0 24 24" className="absolute inset-0 m-auto h-12 w-12 text-white" initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.9, type: 'spring' }}>
                <motion.path d="M5 12.5l4.5 4.5L19 7.5" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round"
                  initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ delay: 1, duration: 0.5 }} />
              </motion.svg>
            </div>
          </div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight mb-3">{title}</h2>
          <p className="text-zinc-400 mb-8">{text}</p>
          <button onClick={onClose} className="rounded-full bg-white px-7 py-3 font-bold text-black hover:bg-zinc-200 transition-colors">{button}</button>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);
