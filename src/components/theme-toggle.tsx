'use client';
import { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { type Locale } from '@/lib/content';
export function ThemeToggle({ locale }: { locale: Locale }) {
  const [light, setLight] = useState(false);
  useEffect(() => { setLight(document.documentElement.dataset.theme === 'light'); }, []);
  const label = light ? {ru:'Включить тёмную тему',kk:'Қараңғы тақырыпты қосу',en:'Switch to dark theme'}[locale] : {ru:'Включить светлую тему',kk:'Жарық тақырыпты қосу',en:'Switch to light theme'}[locale];
  return <button type="button" className="theme-toggle" aria-label={label} title={label} onClick={() => {
    const next = !light; setLight(next); document.documentElement.dataset.theme = next ? 'light' : 'dark';
    try { localStorage.setItem('storex-theme', next ? 'light' : 'dark'); } catch {}
  }}>{light ? <Moon size={18}/> : <Sun size={18}/>}</button>;
}