'use client';
import Script from 'next/script';
import { useEffect, useRef, useState } from 'react';
import { type Locale } from '@/lib/content';
import { captchaCopy } from '@/lib/captcha';
type Turnstile = { render: (container: HTMLElement, options: Record<string, unknown>) => string; remove: (id: string) => void };
declare global { interface Window { turnstile?: Turnstile } }
export function Captcha({ siteKey, locale, onToken }: { siteKey: string; locale: Locale; onToken: (token: string) => void }) {
  const host = useRef<HTMLDivElement>(null);
  const callback = useRef(onToken); callback.current = onToken;
  const [ready, setReady] = useState(false);
  const [error, setError] = useState(false);
  const [attempt, setAttempt] = useState(0);
  useEffect(() => {
    if (!ready || !window.turnstile || !host.current) return;
    const fail = () => { callback.current(''); setError(true); };
    const id = window.turnstile.render(host.current, { sitekey: siteKey, action: 'contact', size: 'flexible', theme: document.documentElement.dataset.theme === 'light' ? 'light' : 'dark', language: locale === 'kk' ? 'auto' : locale, 'response-field': false,
      callback: (token: string) => { setError(false); callback.current(token); }, 'expired-callback': fail, 'error-callback': fail, 'timeout-callback': fail });
    return () => { window.turnstile?.remove(id); callback.current(''); };
  }, [ready, siteKey, locale, attempt]);
  useEffect(() => { const timeout = setTimeout(() => { if (!window.turnstile) setError(true); }, 15000); return () => clearTimeout(timeout); }, [attempt]);
  return <div className="captcha-block"><Script src="https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit" onReady={()=>setReady(true)} onError={()=>setError(true)}/><p>{captchaCopy.prompt[locale]}</p><div ref={host}/>{error&&<div role="alert"><p>{captchaCopy.error[locale]}</p><button className="button secondary" type="button" onClick={()=>{callback.current('');setError(false);setAttempt(n=>n+1); if (window.turnstile) setReady(true); else setError(true);}}>{captchaCopy.retry[locale]}</button></div>}</div>;
}
