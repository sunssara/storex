<?php
declare(strict_types=1);

// Pure request handler: dependencies are injected for tests, never through HTTP.
function storex_contact(array $input, array $config, callable $verify, callable $send, callable $limit): array {
    foreach (['name'=>[2,200], 'company'=>[2,200], 'email'=>[3,200], 'phone'=>[0,40], 'message'=>[10,5000]] as $key=>$bounds) {
        $value = $input[$key] ?? ($key === 'phone' ? '' : null);
        if (!is_string($value) || str_contains($value, "\0")) return [400, ['ok'=>false,'code'=>'INVALID']];
        $value = trim($value);
        $length = preg_match_all('/./us', $value);
        if ($length === false || $length < $bounds[0] || $length > $bounds[1]) return [400, ['ok'=>false,'code'=>'INVALID']];
        $input[$key] = $value;
    }
    if (($input['consent'] ?? false) !== true || !in_array($input['locale'] ?? '', ['ru','kk','en'], true)
        || !filter_var($input['email'], FILTER_VALIDATE_EMAIL) || preg_match('/[\r\n]/', $input['email'])
        || (isset($input['website']) && (!is_string($input['website']) || trim($input['website']) !== ''))) return [400, ['ok'=>false,'code'=>'INVALID']];
    if (empty($config['turnstile_secret'])) return [503, ['ok'=>false,'code'=>'UNAVAILABLE']];
    $token = $input['captchaToken'] ?? null;
    if (!is_string($token) || trim($token) === '' || strlen($token) > 2048) return [403, ['ok'=>false,'code'=>'CAPTCHA_INVALID']];
    if (!$limit()) return [429, ['ok'=>false,'code'=>'RATE_LIMITED']];
    try { $verified = $verify($token, $config['turnstile_secret']); }
    catch (Throwable $e) { return [503, ['ok'=>false,'code'=>'UNAVAILABLE']]; }
    if (!is_array($verified)) return [503, ['ok'=>false,'code'=>'UNAVAILABLE']];
    if (($verified['success'] ?? false) !== true || ($verified['hostname'] ?? '') !== 'storex.kz' || ($verified['action'] ?? '') !== 'contact') return [403, ['ok'=>false,'code'=>'CAPTCHA_INVALID']];
    $page = $input['page'] ?? '';
    if (!is_string($page) || strlen($page) > 500 || !preg_match('~^/(ru|kk|en)(/|$)[^\r\n]*$~', $page)) $page = '/';
    $id = bin2hex(random_bytes(8));
    $body = "Новая заявка с сайта STOREX\n\n"
        . "Имя: {$input['name']}\nКомпания: {$input['company']}\nТелефон: " . ($input['phone'] ?: 'Не указан')
        . "\nEmail: {$input['email']}\nЯзык: {$input['locale']}\nСтраница: https://storex.kz{$page}\nСогласие на обработку обращения: Да"
        . "\nДата (UTC): " . gmdate('Y-m-d H:i:s') . "\nНомер заявки: {$id}\n\nСообщение:\n{$input['message']}\n";
    try { $accepted = $send('info@storex.kz', 'STOREX — новая заявка с сайта', $body, $input['email']); }
    catch (Throwable $e) { $accepted = false; }
    return $accepted ? [200, ['ok'=>true]] : [502, ['ok'=>false,'code'=>'DELIVERY_FAILED']];
}
