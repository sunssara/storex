export async function verifyCaptcha(token: unknown, secret: string, hostname: string, transport: typeof fetch): Promise<'ok' | 'invalid' | 'unavailable'> {
  if (typeof token !== 'string' || !token.trim() || token.length > 2048) return 'invalid';
  try {
    const response = await transport('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body: new URLSearchParams({ secret, response: token }), signal: AbortSignal.timeout(10000) });
    if (!response.ok) return 'unavailable';
    const data = await response.json();
    return data.success === true && data.hostname === hostname && data.action === 'contact' ? 'ok' : 'invalid';
  } catch { return 'unavailable'; }
}
