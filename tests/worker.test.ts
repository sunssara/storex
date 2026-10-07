import { test } from 'node:test';
import assert from 'node:assert/strict';
import { handleContact } from '../integrations/contact-worker';
const enquiry={name:'Test user',company:'Test company',email:'test@example.com',message:'Please discuss the project.',phone:'',website:'',consent:true,locale:'kk',captchaToken:'test-token'};
const env={ALLOWED_ORIGIN:'https://storex.kz',RESEND_API_KEY:'test-key',CONTACT_FROM:'test@example.com',TURNSTILE_SECRET_KEY:'test-secret'};
const request=(data:unknown=enquiry,origin='https://storex.kz')=>new Request('https://handler.example/',{method:'POST',headers:{origin,'content-type':'application/json'},body:JSON.stringify(data)});
test('external handler permits CORS for the configured site only',async()=>{
 const preflight=await handleContact(new Request('https://handler.example/',{method:'OPTIONS',headers:{origin:'https://storex.kz'}}),env);
 assert.equal(preflight.status,204);assert.equal(preflight.headers.get('access-control-allow-origin'),'https://storex.kz');
 const wrong=await handleContact(request(enquiry,'https://other.example'),env);assert.equal(wrong.status,403);assert.equal(wrong.headers.get('access-control-allow-origin'),null);
});
test('external handler refuses missing configuration, invalid payloads and oversized streams',async()=>{
 assert.equal((await handleContact(request(),{})).status,503);
 assert.equal((await handleContact(request(),{ALLOWED_ORIGIN:env.ALLOWED_ORIGIN})).status,503);
 assert.equal((await handleContact(request({}),env)).status,400);
 assert.equal((await handleContact(request({...enquiry,message:'a'.repeat(40000)}),env)).status,413);
});
test('external handler returns delivery results without leaking secrets',async()=>{
 const response=await handleContact(request(),env,async(url)=>new Response(JSON.stringify(String(url).includes('siteverify')?{success:true,hostname:'storex.kz',action:'contact'}:{id:'accepted'})));
 assert.equal(response.status,200);assert.deepEqual(await response.json(),{ok:true});
 const failure=await handleContact(request(),env,async(url)=>String(url).includes('siteverify')?new Response(JSON.stringify({success:true,hostname:'storex.kz',action:'contact'})):new Response('private provider detail',{status:500}));
 assert.equal(failure.status,502);assert.deepEqual(await failure.json(),{ok:false,code:'DELIVERY_FAILED'});
});
