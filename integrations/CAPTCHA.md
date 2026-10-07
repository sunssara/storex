# Cloudflare Turnstile activation

The integration is implemented but inactive until real keys and a mail handler are configured. Do not publish test keys. Never put a secret in public/contact-config.json or Git.

1. Create a Cloudflare account and a Managed Turnstile widget restricted to `storex.kz` (add `www.storex.kz` only if the site uses it). No DNS migration is required.
2. Put its public site key in `public/contact-config.json` as `turnstileSiteKey`.
3. Deploy `contact-worker.ts` with server secrets `TURNSTILE_SECRET_KEY`, `RESEND_API_KEY`, and `CONTACT_FROM`. Set `ALLOWED_ORIGIN=https://storex.kz`. `CONTACT_FROM` must be a verified Resend sender.
4. Set the handler HTTPS address as `endpoint` in `public/contact-config.json`, rebuild and publish the static export.
5. Verify a real submission from the production domain and receipt at info@storex.kz. Missing, expired, replayed, wrong-host and wrong-action tokens must never result in mail.

CAPTCHA appears after initial validation when the visitor presses Send. After verification they press Send again. Tokens are cleared after attempts and expiry; the server checks Cloudflare Siteverify success, hostname and `contact` action before sending mail. A provider outage fails closed. No real delivery or CAPTCHA activation has been verified without production keys.

Documentation: https://developers.cloudflare.com/turnstile/get-started/ and https://developers.cloudflare.com/turnstile/get-started/server-side-validation/
