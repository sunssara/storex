import { type Locale, L } from '@/lib/content';
const labels = L(['ИНФРАСТРУКТУРА', 'БЕЗОПАСНОСТЬ', 'AV / КОММУНИКАЦИИ', 'ЕДИНАЯ СИСТЕМА'], ['ИНФРАҚҰРЫЛЫМ', 'ҚАУІПСІЗДІК', 'AV / КОММУНИКАЦИЯЛАР', 'БІРЫҢҒАЙ ЖҮЙЕ'], ['INFRASTRUCTURE', 'SECURITY', 'AV / COMMUNICATIONS', 'ONE CONNECTED SYSTEM']);
function Server({ x, y, rows = 3, id }: { x: number; y: number; rows?: number; id: number }) {
  return <g transform={`translate(${x} ${y})`} className={`server server-${id}`}>
    <path d="M0 22 L70 -18 L140 22 L70 62 Z" fill="#102b53" stroke="#367cca" />
    {Array.from({ length: rows }, (_, i) => <g key={i} transform={`translate(0 ${i * 25})`}>
      <path d="M0 22 L70 62 L70 87 L0 47 Z" fill="url(#front)" stroke="#2464a7" strokeWidth=".8" />
      <path d="M70 62 L140 22 L140 47 L70 87 Z" fill="#091c36" stroke="#174571" strokeWidth=".8" />
      <path d="M12 39 L45 58 M12 45 L36 59" stroke="#659ddb" strokeWidth="1.5" />
      <circle cx="58" cy="64" r="2" fill="#58b8ff" className="server-light" style={{ animationDelay: `${i * .4}s` }} />
      <path d="M85 63 L125 40 M85 70 L125 47" stroke="#244e7b" />
    </g>)}
    <path d="M15 21 L70 -11 L125 21 L70 52 Z" fill="none" stroke="#61aaff" opacity=".4" />
    <path d="M44 19 L70 4 L96 19 L70 34 Z" fill="#2b70cf" stroke="#8abfff" />
  </g>;
}
export function Architecture({ locale }: { locale: Locale }) {
  const t = labels[locale];
  return <div className="architecture" role="img" aria-label={t.join(', ')}>
    <div className="architecture-coordinate">SX — 001 / {L('АРХИТЕКТУРА СИСТЕМЫ', 'ЖҮЙЕ АРХИТЕКТУРАСЫ', 'SYSTEM ARCHITECTURE')[locale]}</div>
    <svg viewBox="0 0 600 520" aria-hidden="true">
      <defs>
        <linearGradient id="front" x2="0" y2="1"><stop stopColor="#18417b" /><stop offset="1" stopColor="#0a2141" /></linearGradient>
        <radialGradient id="ground"><stop stopColor="#1975ff" stopOpacity=".2" /><stop offset="1" stopColor="#1975ff" stopOpacity="0" /></radialGradient>
        <pattern id="grid" width="45" height="26" patternUnits="userSpaceOnUse" patternTransform="translate(0 270)"><path d="M0 13L22.5 0L45 13L22.5 26Z" fill="none" stroke="#35659d" strokeWidth=".5" opacity=".32" /></pattern>
      </defs>
      <ellipse cx="305" cy="300" rx="285" ry="190" fill="url(#ground)" />
      <path d="M0 260L300 90L600 260L300 440Z" fill="url(#grid)" />
      <path d="M70 305L300 438L548 294M69 318L300 451L548 307" stroke="#315783" fill="none" opacity=".4" />
      <path className="signal" d="M163 225L300 303L448 220 M300 303V372" fill="none" stroke="#3e91ff" strokeWidth="2" />
      <path d="M188 261L301 326L422 256" fill="none" stroke="#204f86" />
      <Server x={88} y={130} rows={3} id={1} />
      <Server x={358} y={135} rows={2} id={2} />
      <g transform="translate(230 280)" className="core">
        <path d="M-18 62L70 12L158 62L70 113Z" fill="#0d274b" stroke="#438cff" />
        <path d="M-18 62V78L70 129L158 78V62L70 113Z" fill="#0c1d36" stroke="#3166a0" />
        <path d="M0 42L70 2L140 42L70 82Z" fill="#1363d2" stroke="#7abdff" />
        <path d="M0 42V61L70 102L140 61V42L70 82Z" fill="#123770" stroke="#347cdb" />
        <path d="M31 41L70 19L109 41L70 64Z" fill="#4b94ff" />
        <path d="M45 41L70 27L95 41L70 56Z" fill="#b2d3ff" />
        <path d="M70 -4V-73" stroke="#629fff" strokeDasharray="3 5" />
        <circle cx="70" cy="-75" r="4" fill="#8bc0ff" />
      </g>
      <g fontSize="9" fontFamily="monospace" fill="#8ba5c4" letterSpacing="1.5">
        <text x="84" y="100">01 / {t[0]}</text><path d="M89 111H151V124" stroke="#426485" fill="none" />
        <text x="363" y="105">02 / {t[1]}</text><path d="M368 116H410V130" stroke="#426485" fill="none" />
        <text x="230" y="459">03 / {t[2]}</text><path d="M300 431V443" stroke="#426485" />
      </g>
      <g fill="#70aefb"><circle cx="69" cy="305" r="2"/><circle cx="548" cy="294" r="2"/><circle cx="300" cy="451" r="2"/></g>
    </svg>
    <div className="architecture-status"><span className="status-dot" />{t[3]}<span className="architecture-code">IT + AV + SECURITY</span></div>
  </div>;
}
