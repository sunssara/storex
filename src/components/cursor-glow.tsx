'use client';

import { useEffect, useRef } from 'react';

export function CursorGlow() {
  const glow = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = glow.current;
    if (!element) return;
    const desktop = matchMedia('(min-width: 769px) and (hover: hover) and (pointer: fine)');
    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
    let cleanup = () => {};

    const configure = () => {
      cleanup();
      element.dataset.visible = 'false';
      if (!desktop.matches || reducedMotion.matches) return;
      let frame = 0;
      let previousTime = 0;
      let visible = false;
      let x = 0, y = 0, targetX = 0, targetY = 0;
      const draw = () => { element.style.transform = `translate3d(${x}px, ${y}px, 0)`; };
      const tick = (time: number) => {
        const delta = previousTime ? Math.min(time - previousTime, 50) : 16;
        previousTime = time;
        const ease = 1 - Math.exp(-delta / 55);
        x += (targetX - x) * ease;
        y += (targetY - y) * ease;
        draw();
        if (Math.abs(targetX - x) + Math.abs(targetY - y) > .15) {
          frame = requestAnimationFrame(tick);
        } else {
          x = targetX; y = targetY; draw(); frame = 0; previousTime = 0;
        }
      };
      const hide = () => {
        visible = false;
        element.dataset.visible = 'false';
        cancelAnimationFrame(frame); frame = 0; previousTime = 0;
      };
      const move = (event: PointerEvent) => {
        if (event.pointerType !== 'mouse') { hide(); return; }
        targetX = event.clientX; targetY = event.clientY;
        if (!visible) {
          x = targetX; y = targetY; draw(); visible = true;
          element.dataset.visible = 'true';
        }
        element.dataset.interactive = String(event.target instanceof Element && !!event.target.closest('a[href], button:not(:disabled), [role="button"]'));
        if (!frame) frame = requestAnimationFrame(tick);
      };
      const visibility = () => { if (document.hidden) hide(); };
      window.addEventListener('pointermove', move, { passive: true });
      document.documentElement.addEventListener('pointerleave', hide);
      window.addEventListener('blur', hide);
      document.addEventListener('visibilitychange', visibility);
      cleanup = () => {
        hide();
        window.removeEventListener('pointermove', move);
        document.documentElement.removeEventListener('pointerleave', hide);
        window.removeEventListener('blur', hide);
        document.removeEventListener('visibilitychange', visibility);
      };
    };
    configure();
    desktop.addEventListener('change', configure);
    reducedMotion.addEventListener('change', configure);
    return () => {
      cleanup();
      desktop.removeEventListener('change', configure);
      reducedMotion.removeEventListener('change', configure);
    };
  }, []);

  return <div ref={glow} className="cursor-glow" aria-hidden="true" data-visible="false"><span/></div>;
}
