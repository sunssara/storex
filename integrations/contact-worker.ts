import { deliverEnquiry } from '../src/lib/contact';

export interface ContactEnvironment {
  RESEND_API_KEY?: string;
  CONTACT_FROM?: string;
  ALLOWED_ORIGIN?: string;
}

// Standalone Fetch API handler. Deploy separately from the static site.
export async function handleContact(request: Request, env: ContactEnvironment, transport: typeof fetch = fetch): Promise<Response> {
  const origin = request.headers.get('origin');
  const configuredOrigin = env.ALLOWED_ORIGIN?.replace(/\/$/, '');
  const allowed = Boolean(configuredOrigin && origin === configuredOrigin);
  const headers = new Headers({ 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store', 'Vary': 'Origin' });
  if (allowed) {
    headers.set('Access-Control-Allow-Origin', configuredOrigin!);
    headers.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    headers.set('Access-Control-Allow-Headers', 'Content-Type');
  }
  const reply = (status: number, body: object) => new Response(JSON.stringify(body), {status, headers});
  if (!configuredOrigin) return reply(503, {ok:false, code:'UNAVAILABLE'});
  if (!allowed) return reply(403, {ok:false, code:'INVALID'});
  if (request.method === 'OPTIONS') return new Response(null, {status:204, headers});
  if (request.method !== 'POST') return reply(405, {ok:false, code:'INVALID'});
  if (!request.headers.get('content-type')?.includes('application/json')) return reply(415, {ok:false, code:'INVALID'});
  if (Number(request.headers.get('content-length')) > 32768) return reply(413, {ok:false, code:'INVALID'});
  let data: unknown;
  try {
    const reader = request.body?.getReader();
    if (!reader) return reply(400, {ok:false, code:'INVALID'});
    const chunks: Uint8Array[] = []; let bytes = 0;
    while (true) {
      const result = await reader.read();
      if (result.done) break;
      bytes += result.value.byteLength;
      if (bytes > 32768) { await reader.cancel(); return reply(413, {ok:false, code:'INVALID'}); }
      chunks.push(result.value);
    }
    const merged = new Uint8Array(bytes); let offset = 0;
    for (const chunk of chunks) { merged.set(chunk, offset); offset += chunk.byteLength; }
    data = JSON.parse(new TextDecoder().decode(merged));
  } catch { return reply(400, {ok:false, code:'INVALID'}); }
  const result = await deliverEnquiry(data, {apiKey:env.RESEND_API_KEY, from:env.CONTACT_FROM}, transport);
  return reply(result.status, result.body);
}

export default { fetch: (request: Request, env: ContactEnvironment) => handleContact(request, env) };
