import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleContact } from '../integrations/contact-worker';
const env={ALLOWED_ORIGIN:'https://storex.kz',RESEND_API_KEY:'test',CONTACT_FROM:'test@example.com',TURNSTILE_SECRET_KEY:'secret'};
const payload={name:'Test name',company:'Company',email:'test@example.com',message:'A valid test message',consent:true,locale:'ru',captchaToken:'token'};
const request=(data:unknown)=>new Request('https://handler.example',{method:'POST',headers:{origin:'https://storex.kz','content-type':'application/json'},body:JSON.stringify(data)});
test('CAPTCHA missing or oversized never sends mail or calls provider',async()=>{
 for(const captchaToken of [undefined,'',123,'x'.repeat(2049)]) {
  const r=await handleContact(request({...payload,captchaToken}),env,async()=>{throw Error('must not call provider');});
  assert.equal(r.status,403);assert.equal((await r.json()).code,'CAPTCHA_INVALID');
 }
});
test('missing CAPTCHA secret fails closed',async()=>{
 const r=await handleContact(request(payload),{...env,TURNSTILE_SECRET_KEY:''},async()=>{throw Error('must not call');});
 assert.equal(r.status,503);
});
test('invalid, expired, replayed and wrong-context tokens cannot send mail',async()=>{
 for(const result of [{success:false,'error-codes':['timeout-or-duplicate']},{success:true,hostname:'other.example',action:'contact'},{success:true,hostname:'storex.kz',action:'login'}]) {
  let calls=0;
  const r=await handleContact(request(payload),env,async(url)=>{calls++;assert.match(String(url),/siteverify$/);return new Response(JSON.stringify(result));});
  assert.equal(r.status,403);assert.equal(calls,1);
 }
});
test('provider outage or malformed response cannot send mail',async()=>{
 for(const transport of [async()=>{throw Error('network');},async()=>new Response('bad json'),async()=>new Response('{}',{status:503})]){
  assert.equal((await handleContact(request(payload),env,transport)).status,503);
 }
});
test('verification precedes delivery and tokens are not included in email',async()=>{
 const calls:string[]=[];
 const r=await handleContact(request(payload),env,async(url,init)=>{
  calls.push(String(url));
  if(String(url).includes('siteverify')) {assert.equal(new URLSearchParams(String(init?.body)).get('secret'),'secret');return new Response(JSON.stringify({success:true,hostname:'storex.kz',action:'contact'}));}
  assert.ok(!String(init?.body).includes('captchaToken'));return new Response(JSON.stringify({id:'accepted'}));
 });assert.equal(r.status,200);assert.equal(calls.length,2);assert.match(calls[0],/siteverify$/);
});
