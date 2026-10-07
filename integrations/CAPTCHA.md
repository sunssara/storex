# Contact form security

Production uses the Plesk PHP handler at https://storex.kz/contact.php and a Managed Cloudflare Turnstile widget restricted to storex.kz. See [deployment instructions](contact-php/README.md).

Only the public site key belongs in public/contact-config.json. The secret is stored outside the document root and Git. Never publish test keys or enable a production bypass.

The widget appears after initial field validation. The visitor completes verification and presses Send again. Tokens are cleared after attempts and expiry. Server-side verification checks success, hostname and contact action; outages fail closed. Receipt at info@storex.kz must be verified separately from mail queue acceptance.
