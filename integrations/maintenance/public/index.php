<?php
declare(strict_types=1);
ini_set('display_errors', '0');
$local = PHP_SAPI === 'cli-server' && getenv('STOREX_GATEWAY_TEST') === '1';
$site = $local ? (string)getenv('STOREX_TEST_SITE') : dirname(__DIR__, 3) . '/out';
$private = $local ? (string)getenv('STOREX_TEST_PRIVATE') : dirname(__DIR__, 4) . '/private';
header('Cache-Control: private, no-store, max-age=0');
header('X-Content-Type-Options: nosniff');
header('Referrer-Policy: same-origin');
header('X-Robots-Tag: noindex, nofollow, noarchive');
header('X-Frame-Options: SAMEORIGIN');
$rawPath = parse_url($_SERVER['REQUEST_URI'] ?? '/', PHP_URL_PATH);
$path = rawurldecode(is_string($rawPath) ? $rawPath : '/');
if (preg_match('/[\x00-\x1f\x7f]/', $path) || str_starts_with($path, '//') || str_contains($path, '\\') || preg_match('~(?:^|/)\.\.?(/|$)~', $path)) { http_response_code(400); exit; }
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';
$configFile = $private . '/storex-maintenance.php';
$config = is_readable($configFile) ? require $configFile : [];
if (!is_array($config)) $config = [];
ini_set('session.use_strict_mode', '1');
ini_set('session.use_only_cookies', '1');
ini_set('session.gc_maxlifetime', '28800');
session_name($local ? 'storex_dev_test' : '__Host-storex_dev');
session_set_cookie_params(['lifetime'=>0, 'path'=>'/', 'secure'=>!$local, 'httponly'=>true, 'samesite'=>'Strict']);
session_start();
$now = time();
$authenticated = isset($_SESSION['authenticated'], $_SESSION['created'], $_SESSION['seen'])
    && $_SESSION['authenticated'] === true && $now - $_SESSION['created'] < 28800 && $now - $_SESSION['seen'] < 1800;
if (!$authenticated) unset($_SESSION['authenticated'], $_SESSION['created'], $_SESSION['seen']);
else $_SESSION['seen'] = $now;
$_SESSION['csrf'] ??= bin2hex(random_bytes(32));
function escape(string $s): string { return htmlspecialchars($s, ENT_QUOTES | ENT_SUBSTITUTE, 'UTF-8'); }
function loginAllowed(string $private): bool {
    $dir = $private . '/storex-access';
    if (!is_dir($dir) && !mkdir($dir, 0700, true) && !is_dir($dir)) return false;
    $file = fopen($dir . '/attempts.json', 'c+');
    if (!$file || !flock($file, LOCK_EX)) { if ($file) fclose($file); return false; }
    try {
        $all = json_decode(stream_get_contents($file), true) ?: [];
        $now = time();
        foreach ($all as $key=>$entry) if (!is_array($entry) || ($entry['start'] ?? 0) <= $now - 900) unset($all[$key]);
        $key = hash('sha256', $_SERVER['REMOTE_ADDR'] ?? 'unknown');
        $entry = $all[$key] ?? ['start'=>$now, 'count'=>0];
        $global = $all['global'] ?? ['start'=>$now, 'count'=>0];
        $allowed = $entry['count'] < 10 && $global['count'] < 200 && count($all) < 10000;
        if ($allowed) { $entry['count']++; $global['count']++; $all[$key]=$entry; $all['global']=$global; }
        rewind($file); ftruncate($file, 0); fwrite($file, json_encode($all)); fflush($file);
        return $allowed;
    } finally { flock($file, LOCK_UN); fclose($file); }
}
$error = '';
$showLogin = $path === '/__developer/login';
if ($method === 'POST') {
    if ($path !== '/contact.php' && (int)($_SERVER['CONTENT_LENGTH'] ?? 0) > 8192) { http_response_code(413); exit; }
    if (!in_array($path, ['/__developer/login', '/__developer/logout', '/contact.php'], true)) { http_response_code(405); exit; }
    if ($path !== '/contact.php') {
        $token = $_POST['csrf'] ?? '';
        if (!is_string($token) || !hash_equals($_SESSION['csrf'], $token)) {
            http_response_code(403); $error = 'Сессия формы истекла. Повторите вход.'; $showLogin = true;
        } elseif ($path === '/__developer/logout') {
            $_SESSION=[]; session_destroy();
            setcookie(session_name(), '', ['expires'=>1,'path'=>'/','secure'=>!$local,'httponly'=>true,'samesite'=>'Strict']);
            header('Location: /', true, 303); exit;
        } elseif (!loginAllowed($private)) {
            http_response_code(429); header('Retry-After: 900'); $error = 'Слишком много попыток. Попробуйте через 15 минут.';
        } else {
            $username = $_POST['username'] ?? ''; $password = $_POST['password'] ?? '';
            $validPassword = is_string($password) && strlen($password) <= 1024
                && password_verify($password, (string)($config['password_hash'] ?? ''));
            if (is_string($username) && isset($config['username']) && hash_equals((string)$config['username'], $username) && $validPassword) {
                session_regenerate_id(true);
                $_SESSION = ['authenticated'=>true,'created'=>$now,'seen'=>$now,'csrf'=>bin2hex(random_bytes(32))];
                session_write_close(); header('Location: /ru/', true, 303); exit;
            }
            http_response_code(401); $error = 'Неверный логин или пароль.';
        }
    }
}
if ($authenticated && !$showLogin && $path !== '/__developer/logout') {
    session_write_close();
    if ($path === '/contact.php') { require $site . '/contact.php'; exit; }
    if (!in_array($method, ['GET','HEAD'], true)) { http_response_code(405); exit; }
    if ($path === '/' || $path === '/index.php') { header('Location: /ru/', true, 302); exit; }
    $root = realpath($site);
    $target = $root ? realpath($root . $path) : false;
    if ($target && is_dir($target)) {
        if (!str_ends_with($path, '/')) { header('Location: ' . $path . '/', true, 308); exit; }
        $target = realpath($target . '/index.html');
    }
    $types = ['html'=>'text/html; charset=utf-8','txt'=>'text/plain; charset=utf-8','css'=>'text/css; charset=utf-8','js'=>'text/javascript; charset=utf-8','json'=>'application/json','svg'=>'image/svg+xml','png'=>'image/png','jpg'=>'image/jpeg','jpeg'=>'image/jpeg','webp'=>'image/webp','avif'=>'image/avif','ico'=>'image/x-icon','woff'=>'font/woff','woff2'=>'font/woff2','ttf'=>'font/ttf','xml'=>'application/xml','pdf'=>'application/pdf','webmanifest'=>'application/manifest+json'];
    $ext = $target ? strtolower(pathinfo($target, PATHINFO_EXTENSION)) : '';
    if (!$target || !$root || !str_starts_with($target, $root . DIRECTORY_SEPARATOR) || !is_file($target) || !isset($types[$ext])) {
        http_response_code(404); header('Content-Type: text/plain; charset=utf-8'); echo 'Страница не найдена'; exit;
    }
    header('Content-Type: ' . $types[$ext]); header('Content-Length: ' . filesize($target));
    if ($method !== 'HEAD') readfile($target);
    exit;
}
if ($path === '/contact.php') { http_response_code(401); header('Content-Type: application/json'); echo '{"ok":false,"code":"UNAVAILABLE"}'; exit; }
if (!$error && !$showLogin) { http_response_code(503); header('Retry-After: 3600'); }
header("Content-Security-Policy: default-src 'none'; style-src 'self'; img-src 'self'; font-src 'self'; form-action 'self'; base-uri 'none'; frame-ancestors 'none'");
header('Content-Type: text/html; charset=utf-8');
$csrf = $_SESSION['csrf'];
session_write_close();
if ($method === 'HEAD') exit;
?>
<!doctype html><html lang="ru"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="robots" content="noindex,nofollow"><title>STOREX — Сайт находится на реконструкции</title><link rel="icon" href="/maintenance-assets/favicon.svg" type="image/svg+xml"><link rel="stylesheet" href="/maintenance-assets/style.css"></head>
<body><div class="shell"><header><a href="/" aria-label="STOREX — главная"><img src="/maintenance-assets/logo.svg" width="172" height="28" alt="STOREX"></a><span class="header-label">IT · AV · INTEGRATION</span></header>
<main><div class="status"><span></span>Обновляем сайт</div><h1>Сайт находится<br>на реконструкции</h1><p class="intro">Готовим новое пространство для наших решений и проектов.<br class="desktop"> По вопросам сотрудничества свяжитесь с командой STOREX.</p><div class="contacts"><a href="mailto:info@storex.kz">info@storex.kz <span>↗</span></a><a href="tel:+77172972086">+7 (7172) 97-20-86 <span>↗</span></a></div>
<?php if ($showLogin): ?><section class="login" aria-labelledby="login-title"><h2 id="login-title"><?= $authenticated ? 'Доступ открыт' : 'Вход для разработчиков' ?></h2>
<?php if ($authenticated): ?><p>Вы авторизованы для просмотра сайта.</p><a class="submit" href="/ru/">Перейти на сайт →</a><form method="post" action="/__developer/logout"><input type="hidden" name="csrf" value="<?= escape($csrf) ?>"><button class="developer" type="submit">Выйти</button></form>
<?php else: ?><form method="post" action="/__developer/login"><input type="hidden" name="csrf" value="<?= escape($csrf) ?>"><label for="username">Логин</label><input id="username" name="username" autocomplete="username" maxlength="100" required><label for="password">Пароль</label><input id="password" name="password" type="password" autocomplete="current-password" maxlength="1024" required><?php if ($error): ?><p role="alert" class="error"><?= escape($error) ?></p><?php endif; ?><button class="submit" type="submit">Войти <span>→</span></button></form><?php endif; ?></section><?php endif; ?>
</main><footer><span>© <?= date('Y') ?> STOREX</span><a class="developer" href="/__developer/login">Для разработчиков <span>↗</span></a></footer></div></body></html>
