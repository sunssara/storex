export interface Enquiry { name: string; company: string; email: string; phone: string; message: string; consent: true; locale: 'ru' | 'kk' | 'en' }
export type ContactResult = { status: number; body: { ok: boolean; code?: 'INVALID' | 'UNAVAILABLE' | 'DELIVERY_FAILED' } };
export type MailConfig = { apiKey?: string; from?: string };
const invalid = (): ContactResult => ({ status: 400, body: { ok: false, code: 'INVALID' } });
export function validRequestOrigin(origin: string | null, host: string): boolean {
  if (!origin) return true;
  try { const url = new URL(origin); return ['http:', 'https:'].includes(url.protocol) && url.host.toLowerCase() === host.toLowerCase(); }
  catch { return false; }
}
export function validateEnquiry(input: unknown): Enquiry | null {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return null;
  const o = input as Record<string, unknown>;
  if (o.consent !== true || !['ru', 'kk', 'en'].includes(o.locale as string)) return null;
  if (o.website !== undefined && (typeof o.website !== 'string' || o.website.trim() !== '')) return null;
  const field = (key: string, min: number, max: number) => typeof o[key] === 'string' && (o[key] as string).trim().length >= min && (o[key] as string).trim().length <= max && !(o[key] as string).includes('\0');
  if (!field('name',2,200) || !field('company',2,200) || !field('email',3,200) || !field('message',10,5000)) return null;
  const email = (o.email as string).trim();
  if (!/^[^\s@<>]+@[^\s@<>]+\.[^\s@<>]+$/.test(email)) return null;
  if (o.phone !== undefined && !field('phone',0,40)) return null;
  return { name: (o.name as string).trim(), company: (o.company as string).trim(), email, phone: (o.phone as string | undefined)?.trim() || '', message: (o.message as string).trim(), consent: true, locale: o.locale as Enquiry['locale'] };
}
export async function deliverEnquiry(input: unknown, config: MailConfig, transport: typeof fetch = fetch): Promise<ContactResult> {
  const data = validateEnquiry(input);
  if (!data) return invalid();
  if (!config.apiKey?.trim() || !config.from?.trim()) return { status: 503, body: { ok: false, code: 'UNAVAILABLE' } };
  try {
    const response = await transport('https://api.resend.com/emails', {
      method: 'POST', headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({ from: config.from, to: ['info@storex.kz'], reply_to: data.email, subject: 'STOREX — новая заявка с сайта', text: `Имя / Name: ${data.name}\nКомпания / Company: ${data.company}\nEmail: ${data.email}\nТелефон / Phone: ${data.phone || '—'}\nЯзык / Language: ${data.locale}\nСогласие / Consent: yes\n\n${data.message}` }),
      signal: AbortSignal.timeout(12000),
    });
    if (!response.ok) return { status: 502, body: { ok: false, code: 'DELIVERY_FAILED' } };
    const payload = await response.json();
    if (typeof payload.id !== 'string' || !payload.id) return { status: 502, body: { ok: false, code: 'DELIVERY_FAILED' } };
    return { status: 200, body: { ok: true } };
  } catch { return { status: 502, body: { ok: false, code: 'DELIVERY_FAILED' } }; }
}
