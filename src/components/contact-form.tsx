'use client';
import { useRef, useState } from 'react';
import Link from 'next/link';
import { Captcha } from './captcha';
import { captchaCopy } from '@/lib/captcha';
import { ArrowUpRight, CheckCircle2, LoaderCircle } from 'lucide-react';
import { copy, type Locale } from '@/lib/content';
export function ContactForm({ locale }: { locale: Locale }) {
  const [state, setState] = useState<'idle' | 'sending' | 'success' | 'unavailable' | 'invalid' | 'failed'>('idle');
  const busy = useRef(false);
  const [siteKey, setSiteKey] = useState('');
  const [captchaToken, setCaptchaToken] = useState('');
  const [captchaError, setCaptchaError] = useState(false);
  const [captchaUnavailable, setCaptchaUnavailable] = useState(false);
  const [captchaAttempt, setCaptchaAttempt] = useState(0);
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy.current) return;
    const form = event.currentTarget;
    if (!form.reportValidity()) return;
    busy.current = true; setState('sending'); setCaptchaUnavailable(false); setCaptchaError(false);
    const data = Object.fromEntries(new FormData(form));
    try {
      const configResponse = await fetch('/contact-config.json', { cache: 'no-store', signal: AbortSignal.timeout(5000) });
      if (!configResponse.ok) { setState('unavailable'); return; }
      const config = await configResponse.json();
      if (typeof config.turnstileSiteKey !== 'string' || !config.turnstileSiteKey.trim()) { setCaptchaUnavailable(true); setState('idle'); return; }
      if (siteKey !== config.turnstileSiteKey || !captchaToken) { setSiteKey(config.turnstileSiteKey); setCaptchaToken(''); setState('idle'); return; }
      if (typeof config.endpoint !== 'string' || !config.endpoint.trim()) { setState('unavailable'); return; }
      let endpoint: URL;
      try { endpoint = new URL(config.endpoint); } catch { setState('unavailable'); return; }
      if (endpoint.protocol !== 'https:') { setState('unavailable'); return; }
      const result = await fetch(endpoint, { method: 'POST', credentials: 'omit', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...data, captchaToken, page: window.location.pathname, consent: data.consent === 'on', locale }), signal: AbortSignal.timeout(20000) });
      setCaptchaToken(''); setCaptchaAttempt(n=>n+1);
      const body = await result.json();
      if (result.ok && body.ok) { setState('success'); form.reset(); }
      else if (body.code === 'CAPTCHA_INVALID') { setCaptchaError(true); setState('idle'); }
      else setState(body.code === 'UNAVAILABLE' ? 'unavailable' : body.code === 'INVALID' ? 'invalid' : 'failed');
    } catch { setCaptchaToken(''); setCaptchaAttempt(n=>n+1); setState('failed'); }
    finally { busy.current = false; }
  }
  return <form className="contact-form" onSubmit={submit}>
    <div className="form-grid">{['name', 'company', 'email', 'phone'].map((name, i) => <label key={name}>{copy.fields[locale][i]}{i !== 3 && <span className="required"> *</span>}<input name={name} type={i === 2 ? 'email' : i === 3 ? 'tel' : 'text'} autoComplete={['name', 'organization', 'email', 'tel'][i]} required={i !== 3} minLength={i === 3 ? undefined : 2} maxLength={i === 3 ? 40 : 200} placeholder={['Alex', 'Company', 'name@company.com', '+7'][i] === 'Alex' ? (locale === 'ru' ? 'Как к вам обращаться?' : locale === 'kk' ? 'Сізге қалай жүгінейік?' : 'How should we address you?') : i === 1 ? 'Storex' : ['','','name@company.com','+7'][i]} /></label>)}</div>
    <label>{copy.fields[locale][4]} <span className="required">*</span><textarea name="message" required minLength={10} maxLength={5000} rows={3} placeholder={copy.contactText[locale]} /></label>
    <div className="honeypot" aria-hidden="true"><label>Website<input name="website" tabIndex={-1} autoComplete="off" /></label></div>
    <label className="consent"><input type="checkbox" name="consent" required /><span>{copy.consent[locale]} <Link href={`/${locale}/privacy`}>{copy.privacy[locale]} ↗</Link></span></label>
    {siteKey && state !== 'success' && <Captcha key={captchaAttempt} siteKey={siteKey} locale={locale} onToken={setCaptchaToken}/>}
    {captchaError && <p className="form-message" role="alert">{captchaCopy.error[locale]}</p>}
    {captchaUnavailable && <p className="form-message" role="alert">{captchaCopy.unavailable[locale]} <a href="mailto:info@storex.kz">info@storex.kz</a> <a href="tel:+77172972086">+7 (7172) 97-20-86</a></p>}
    <button className="button primary form-submit" type="submit" disabled={state === 'sending'}>{state === 'sending' ? copy.sending[locale] : copy.send[locale]}{state === 'sending' ? <LoaderCircle className="spin" size={19} /> : <ArrowUpRight size={19} />}</button>
    <div aria-live="polite" aria-atomic="true">{state !== 'idle' && state !== 'sending' && <p className={`form-message ${state}`} role={state === 'success' ? 'status' : 'alert'}>{state === 'success' && <CheckCircle2 size={19} />}{copy[state][locale]}{state === 'unavailable' && <a href="mailto:info@storex.kz">info@storex.kz ↗</a>}</p>}</div>
  </form>;
}
