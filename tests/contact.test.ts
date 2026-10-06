import { test } from 'node:test';
import assert from 'node:assert/strict';
import { deliverEnquiry, validateEnquiry, validRequestOrigin } from '../src/lib/contact';
const valid = { name: 'Test User', company: 'Test Company', email: 'person@example.com', phone: '', message: 'Please discuss our infrastructure project.', consent: true, locale: 'ru', website: '' };
const config = { apiKey: 'test-only', from: 'Website <test@example.com>' };
test('origin validation uses the public host and rejects other hosts and malformed origins',()=>{
  assert.equal(validRequestOrigin('http://127.0.0.1:3000','127.0.0.1:3000'),true);
  assert.equal(validRequestOrigin('https://storex.kz','storex.kz'),true);
  assert.equal(validRequestOrigin('https://other.example','storex.kz'),false);
  assert.equal(validRequestOrigin('null','storex.kz'),false);
  assert.equal(validRequestOrigin('http://127.0.0.1:3001','127.0.0.1:3000'),false);
});
test('valid enquiry trims text and supports three languages', () => {
  for (const locale of ['ru','kk','en']) assert.equal(validateEnquiry({...valid, name:'  Алия  ', locale})?.name, 'Алия');
});
test('required fields, consent, email, types and boundaries are validated', () => {
  for (const value of [null, [], {}, {...valid,name:''}, {...valid,company:'x'}, {...valid,email:'invalid'}, {...valid,email:'a@example.com\r\nBcc: x@example.com'}, {...valid,consent:false}, {...valid,consent:'true'}, {...valid,locale:'de'}, {...valid,message:'short'}, {...valid,message:'x'.repeat(5001)}, {...valid,phone:'x'.repeat(41)}, {...valid,website:'spam.example'}, {...valid,website:5}, {...valid,name:14}]) assert.equal(validateEnquiry(value),null);
});
test('missing mail configuration never calls transport or returns success', async () => {
  const result=await deliverEnquiry(valid,{},async()=>{throw new Error('must not call');});
  assert.equal(result.status,503);assert.equal(result.body.code,'UNAVAILABLE');assert.equal(result.body.ok,false);
});
test('invalid and honeypot submissions never call provider',async()=>{
  const result=await deliverEnquiry({...valid,website:'spam'},config,async()=>{throw new Error('must not call');});assert.equal(result.status,400);
});
test('success requires provider acceptance and correct destination',async()=>{
  let calls=0;
  const result=await deliverEnquiry(valid,config,async(url,options)=>{
    calls++;assert.equal(url,'https://api.resend.com/emails');
    const body=JSON.parse(options?.body as string);assert.deepEqual(body.to,['info@storex.kz']);assert.equal(body.reply_to,valid.email);assert.match(body.text,/Test Company/);assert.equal(body.html,undefined);
    return new Response(JSON.stringify({id:'accepted-message'}),{status:200});
  });assert.equal(calls,1);assert.equal(result.status,200);assert.equal(result.body.ok,true);
});
test('provider errors, bad success payload and network failure do not report success',async()=>{
  for(const transport of [async()=>new Response('{}',{status:429}),async()=>new Response('{}',{status:200}),async()=>new Response('bad json',{status:200}),async()=>{throw new Error('timeout');}]){
    const result=await deliverEnquiry(valid,config,transport);assert.equal(result.status,502);assert.equal(result.body.ok,false);
  }
});
