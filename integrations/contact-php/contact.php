<?php
declare(strict_types=1);
ini_set('display_errors', '0');
header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');
header('X-Content-Type-Options: nosniff');
function reply(int $status, array $body): never { http_response_code($status); echo json_encode($body, JSON_UNESCAPED_UNICODE); exit; }
if ($_SERVER['REQUEST_METHOD'] !== 'POST') { header('Allow: POST'); reply(405, ['ok'=>false,'code'=>'INVALID']); }
if (($_SERVER['HTTP_ORIGIN'] ?? '') !== 'https://storex.kz') reply(403, ['ok'=>false,'code'=>'INVALID']);
if (!str_starts_with(strtolower($_SERVER['CONTENT_TYPE'] ?? ''), 'application/json')) reply(415, ['ok'=>false,'code'=>'INVALID']);
$raw = file_get_contents('php://input', false, null, 0, 32769);
if ($raw === false || strlen($raw) > 32768) reply(413, ['ok'=>false,'code'=>'INVALID']);
$input = json_decode($raw, true);
if (!is_array($input)) reply(400, ['ok'=>false,'code'=>'INVALID']);
$private = dirname(__DIR__, 2) . '/private';
$configFile = $private . '/storex-contact.php';
if (!is_readable($configFile) || !function_exists('curl_init') || !function_exists('mail')) reply(503, ['ok'=>false,'code'=>'UNAVAILABLE']);
$config = require $configFile;
if (!is_array($config)) reply(503, ['ok'=>false,'code'=>'UNAVAILABLE']);
require __DIR__ . '/contact-handler.php';
$verify = function(string $token, string $secret): ?array {
    $curl = curl_init('https://challenges.cloudflare.com/turnstile/v0/siteverify');
    curl_setopt_array($curl, [CURLOPT_POST=>true, CURLOPT_POSTFIELDS=>http_build_query(['secret'=>$secret,'response'=>$token]), CURLOPT_RETURNTRANSFER=>true, CURLOPT_CONNECTTIMEOUT=>5, CURLOPT_TIMEOUT=>10, CURLOPT_HTTPHEADER=>['Content-Type: application/x-www-form-urlencoded']]);
    $body = curl_exec($curl); $status = curl_getinfo($curl, CURLINFO_HTTP_CODE); curl_close($curl);
    if (!is_string($body) || $status !== 200) return null;
    $data = json_decode($body, true); return is_array($data) ? $data : null;
};
$limit = function() use ($private): bool {
    $dir = $private . '/storex-rate';
    if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) return false;
    // One bounded file; store only hashed addresses and timestamps, never form contents.
    $file = fopen($dir . '/limits.json', 'c+');
    if (!$file || !flock($file, LOCK_EX)) { if ($file) fclose($file); return false; }
    try {
        $now = time(); $all = json_decode(stream_get_contents($file), true) ?: [];
        foreach ($all as $key=>$entry) { if (!is_array($entry) || ($entry['start'] ?? 0) < $now - 600) unset($all[$key]); }
        $key = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
        $entry = $all[$key] ?? ['start'=>$now,'count'=>0];
        $ok = $entry['count'] < 10 && count($all) < 10000;
        if ($ok) { $entry['count']++; $all[$key]=$entry; }
        rewind($file); ftruncate($file, 0); fwrite($file, json_encode($all)); fflush($file);
        return $ok;
    } finally { flock($file, LOCK_UN); fclose($file); }
};
$send = function(string $to, string $subject, string $body, string $replyTo): bool {
    return mail($to, '=?UTF-8?B?' . base64_encode($subject) . '?=', $body, [
        'From'=>'STOREX Website <info@storex.kz>', 'Reply-To'=>$replyTo,
        'MIME-Version'=>'1.0', 'Content-Type'=>'text/plain; charset=UTF-8', 'Content-Transfer-Encoding'=>'8bit',
    ], '-finfo@storex.kz');
};
try { [$status,$body] = storex_contact($input,$config,$verify,$send,$limit); reply($status,$body); }
catch (Throwable $e) { error_log('STOREX contact handler failed'); reply(503,['ok'=>false,'code'=>'UNAVAILABLE']); }
