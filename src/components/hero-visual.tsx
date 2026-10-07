import { type Locale, L } from '@/lib/content';
export function HeroVisual({ kind, locale }: { kind: 'security' | 'av'; locale: Locale }) {
  const security = kind === 'security';
  const label = security ? L('ЗАЩИЩЁННАЯ СЕТЬ', 'ҚОРҒАЛҒАН ЖЕЛІ', 'PROTECTED NETWORK')[locale] : L('ЕДИНОЕ AV-ПРОСТРАНСТВО', 'БІРЫҢҒАЙ AV-КЕҢІСТІК', 'CONNECTED AV SPACE')[locale];
  return <div className="architecture" role="img" aria-label={label}>
    <svg viewBox="0 0 600 520" aria-hidden="true">
      <path d="M25 320L300 160L575 320L300 480Z M80 350L355 190 M135 380L410 220 M190 410L465 250 M245 440L520 280 M80 288L355 448 M135 256L410 416 M190 224L465 384 M245 192L520 352" fill="none" stroke="#426fa6" opacity=".25"/>
      {security ? <>
        <g stroke="#81a1c4" fill="none"><path className="signal" d="M115 190L300 295L490 185M105 365L300 295L490 365" strokeWidth="2"/><ellipse className="hero-orbit" cx="300" cy="295" rx="205" ry="115" strokeDasharray="4 12"/></g>
        {[[90,155],[465,150],[80,345],[465,345]].map(([x,y],i)=><g key={i} transform={`translate(${x} ${y})`}><path d="M0 15L25 0L55 17L30 33Z" fill="#034288" stroke="#81a1c4"/><path d="M0 15V45L30 63L55 47V17L30 33Z" fill="#102b53" stroke="#426fa6"/><circle cx="15" cy="38" r="3" fill="#a1b9d2" className="server-light"/></g>)}
        <g className="hero-float"><path d="M300 117L391 153V259C391 319 342 354 300 377C258 354 209 319 209 259V153Z" fill="#102b53" stroke="#81a1c4" strokeWidth="2"/><path d="M300 137L372 166V258C372 304 335 335 300 355C265 335 228 304 228 258V166Z" fill="#034288" stroke="#426fa6"/><rect x="264" y="223" width="72" height="65" rx="8" fill="#b2d3ff"/><path d="M277 223V203A23 23 0 0 1 323 203V223" fill="none" stroke="#b2d3ff" strokeWidth="9"/><circle cx="300" cy="250" r="6" fill="#034288"/><path d="M300 250V264" stroke="#034288" strokeWidth="5"/></g>
      </> : <>
        <path d="M100 123L468 105L493 326L118 346Z" fill="#102b53" stroke="#81a1c4" strokeWidth="2"/><path d="M115 138L454 122L475 312L130 330Z" fill="#034288"/>
        <path d="M284 130L300 321M124 234L465 216" stroke="#081d38" strokeWidth="5"/>
        {[[197,184],[369,176],[206,274],[379,263]].map(([x,y],i)=><g key={i} fill="#81a1c4"><circle cx={x} cy={y-9} r="16"/><path d={`M${x-30} ${y+34}Q${x-30} ${y+8} ${x} ${y+8}Q${x+30} ${y+8} ${x+30} ${y+34}Z`}/></g>)}
        <path d="M185 373L350 353L450 406L275 437Z" fill="#102b53" stroke="#81a1c4"/><path d="M275 437V449L450 418V406M185 373V386L275 449" fill="#0c1d36" stroke="#426fa6"/>
        <g transform="translate(285 380)"><ellipse cx="0" cy="20" rx="20" ry="8" fill="#034288" stroke="#81a1c4"/><path d="M0 20V-9" stroke="#81a1c4" strokeWidth="4"/><rect x="-5" y="-22" width="10" height="22" rx="5" fill="#b2d3ff"/><path className="signal" d="M-15 -25Q-27 -10 -15 5M15 -25Q27 -10 15 5" fill="none" stroke="#81a1c4" strokeWidth="2"/></g>
        <circle className="server-light" cx="443" cy="141" r="4" fill="#b2d3ff"/>
      </>}
    </svg>
    <div className="architecture-status"><span className="status-dot"/>{label}</div>
  </div>;
}
