<?php
declare(strict_types=1);
require __DIR__ . '/../integrations/contact-php/handler.php';
$valid=['name'=>'Тест Әлия','company'=>'STOREX test','phone'=>'+7 700 000 00 00','email'=>'test@example.com','message'=>"Тестовая заявка\nВторая строка",'consent'=>true,'locale'=>'kk','page'=>'/kk/contacts/','captchaToken'=>'token','website'=>''];
$config=['turnstile_secret'=>'test-secret'];
$verified=fn()=>['success'=>true,'hostname'=>'storex.kz','action'=>'contact'];
$pass=fn()=>true;
$count=0;
function check($actual,$expected,$label): void { global $count; if ($actual !== $expected) throw new Exception($label . ': ' . json_encode($actual)); $count++; }
foreach (['name'=>'','company'=>'','message'=>'short','email'=>"test@example.com\r\nBcc: attacker@example.com",'consent'=>false,'website'=>'bot'] as $key=>$value) {
    $p=$valid; $p[$key]=$value; check(storex_contact($p,$config,$verified,fn()=>throw new Exception('No email expected'),$pass)[0],400,'Invalid '.$key);
}
check(storex_contact($valid,[],$verified,$pass,$pass)[0],503,'Missing configuration');
foreach (['',str_repeat('x',2049),null,123] as $token) { $p=$valid;$p['captchaToken']=$token;check(storex_contact($p,$config,$verified,fn()=>throw new Exception('No email expected'),$pass)[0],403,'Invalid token'); }
foreach ([['success'=>false,'error-codes'=>['timeout-or-duplicate']],['success'=>true,'hostname'=>'other.kz','action'=>'contact'],['success'=>true,'hostname'=>'storex.kz','action'=>'login']] as $result) {
    check(storex_contact($valid,$config,fn()=>$result,$pass,$pass)[0],403,'Rejected verification');
}
check(storex_contact($valid,$config,fn()=>null,$pass,$pass)[0],503,'Provider failure');
check(storex_contact($valid,$config,$verified,$pass,fn()=>false)[0],429,'Rate limit');
check(storex_contact($valid,$config,$verified,fn()=>false,$pass)[0],502,'Mail failure');
$send=function($to,$subject,$body,$replyTo) use ($valid): bool {
    check($to,'info@storex.kz','Recipient');check($replyTo,'test@example.com','Reply-To');
    foreach (['name','company','phone','email','message','locale','page'] as $key) check(str_contains($body,$valid[$key]),true,'Field '.$key);
    check(str_contains($body,'captchaToken'),false,'No token in email');return true;
};
check(storex_contact($valid,$config,$verified,$send,$pass),[200,['ok'=>true]],'Success');
echo "PHP handler: {$count} checks passed\n";
