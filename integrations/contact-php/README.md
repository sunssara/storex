# Plesk contact handler

The static site posts to `https://storex.kz/contact.php`. The finalizer copies the two PHP scripts into `out/`. PHP 8+, cURL and the hosting mail transport are required.

Create `/private/storex-contact.php` in the subscription home (outside `storex.kz/out`, outside Git):

```php
<?php
return ['turnstile_secret' => 'REAL_SERVER_SECRET'];
```

Keep this file private. Never commit the secret. Configure the matching public site key in `public/contact-config.json`. The handler validates fields, consent, honeypot, origin, token, hostname and action. It limits attempts to 10 per IP per 10 minutes. User data is included in plain-text email only; the rate-limit file stores hashed addresses and timestamps, with a fixed cap.

Success means the hosting mail server accepted the email for delivery. Actual receipt must be checked in info@storex.kz. There is no test bypass in the HTTP endpoint. The previous Resend Worker remains an optional alternative and is not the production handler.
