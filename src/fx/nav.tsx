import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { flushSync } from 'react-dom';
import { NavLink, NavLinkProps, useNavigate } from 'react-router-dom';

/* ------------------------------------------------------------------ */
/* Page transitions via the View Transitions API                       */
/* ------------------------------------------------------------------ */

type StartVT = (cb: () => void) => { finished: Promise<void> };

export const useTransitionNavigate = () => {
  const navigate = useNavigate();
  return useCallback((to: string) => {
    const doc = document as Document & { startViewTransition?: StartVT };
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (doc.startViewTransition && !reduce) {
      doc.startViewTransition(() => { flushSync(() => navigate(to)); });
    } else {
      navigate(to);
    }
  }, [navigate]);
};

/** Drop-in replacement for <Link>/<NavLink> that animates the page change. */
export const TLink = ({ to, onClick, ...rest }: Omit<NavLinkProps, 'to'> & { to: string }) => {
  const go = useTransitionNavigate();
  return (
    <NavLink
      to={to}
      {...rest}
      onClick={(e) => {
        onClick?.(e);
        if (e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        go(to);
      }}
    />
  );
};

/* ------------------------------------------------------------------ */
/* Quote basket + fly-to-quote animation                               */
/* ------------------------------------------------------------------ */

type QuoteCtx = { items: string[]; toggle: (s: string) => void; has: (s: string) => boolean; clear: () => void; bump: number };
const Ctx = createContext<QuoteCtx>({ items: [], toggle: () => {}, has: () => false, clear: () => {}, bump: 0 });
export const useQuote = () => useContext(Ctx);

export const QuoteProvider = ({ children }: { children: React.ReactNode }) => {
  const [items, setItems] = useState<string[]>(() => {
    try { return JSON.parse(sessionStorage.getItem('jj_quote') || '[]'); } catch { return []; }
  });
  const [bump, setBump] = useState(0);
  useEffect(() => { try { sessionStorage.setItem('jj_quote', JSON.stringify(items)); } catch { /* blocked */ } }, [items]);
  const toggle = (s: string) => {
    setItems((prev) => {
      if (prev.includes(s)) return prev.filter((x) => x !== s);
      return [...prev, s];
    });
    setBump((b) => b + 1);
  };
  return (
    <Ctx.Provider value={{ items, toggle, has: (s) => items.includes(s), clear: () => setItems([]), bump }}>
      {children}
    </Ctx.Provider>
  );
};

/** Clones an element and flies it along an arc into the header's quote badge. */
export const flyToQuote = (from: HTMLElement, imageSrc?: string) => {
  const target = document.getElementById('quote-target');
  if (!target || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return Promise.resolve();
  const a = from.getBoundingClientRect();
  const b = target.getBoundingClientRect();
  const size = Math.min(140, a.width);
  const ghost = document.createElement('div');
  Object.assign(ghost.style, {
    position: 'fixed', left: `${a.left + a.width / 2 - size / 2}px`, top: `${a.top + a.height / 2 - size / 2}px`,
    width: `${size}px`, height: `${size}px`, borderRadius: '18px', zIndex: '120', pointerEvents: 'none',
    background: imageSrc ? `center/cover url("${imageSrc}")` : 'linear-gradient(135deg,#3b82f6,#1d4ed8)',
    boxShadow: '0 20px 50px rgba(37,99,235,.5), 0 0 0 2px rgba(255,255,255,.6)',
  } as CSSStyleDeclaration);
  document.body.appendChild(ghost);
  const dx = b.left + b.width / 2 - (a.left + a.width / 2);
  const dy = b.top + b.height / 2 - (a.top + a.height / 2);
  const anim = ghost.animate([
    { transform: 'translate(0,0) scale(1) rotate(0deg)', opacity: 1 },
    { transform: `translate(${dx * 0.45}px, ${dy * 0.45 - 140}px) scale(.6) rotate(-12deg)`, opacity: 1, offset: 0.5 },
    { transform: `translate(${dx}px, ${dy}px) scale(.12) rotate(20deg)`, opacity: 0.4 },
  ], { duration: 850, easing: 'cubic-bezier(.5,0,.3,1)' });
  return anim.finished.then(() => {
    ghost.remove();
    target.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.35)' }, { transform: 'scale(1)' }], { duration: 400, easing: 'ease-out' });
  });
};
