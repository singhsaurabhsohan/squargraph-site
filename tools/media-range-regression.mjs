import assert from 'node:assert/strict';
import worker from '../workers/site-media.js';
const content=new Uint8Array(Array.from({length:100},(_,i)=>i));let lastRequest;
const env={ASSETS:{async fetch(request){lastRequest=request;return new Response(content,{headers:{'Content-Length':'100','ETag':'"media-v1"','Last-Modified':'Mon, 02 Nov 2026 00:00:00 GMT','Content-Security-Policy':"default-src 'self'"}})}}};
const call=(range,extra={},method='GET')=>worker.fetch(new Request('https://squargraph.com/assets/videos/preview.mp4',{method,headers:{...(range?{Range:range}:{}),...extra}}),env);
for(const [range,start,end]of [['bytes=0-1',0,1],['bytes=20-',20,99],['bytes=-8',92,99],['bytes=90-200',90,99]]){let r=await call(range);assert.equal(r.status,206);assert.equal(r.headers.get('content-range'),`bytes ${start}-${end}/100`);assert.equal(Number(r.headers.get('content-length')),end-start+1);assert.deepEqual(new Uint8Array(await r.arrayBuffer()),content.slice(start,end+1));assert.equal(lastRequest.headers.get('range'),null);assert.equal(r.headers.get('content-security-policy'),"default-src 'self'")}
for(const range of ['bytes=100-','bytes=30-20','bytes=-0','bytes=-','bytes=1-2,4-5']){let r=await call(range);assert.equal(r.status,416);assert.equal(r.headers.get('content-range'),'bytes */100')}
assert.equal((await call('bytes=0-1',{'If-Range':'"old"'})).status,200);
assert.equal((await call('bytes=0-1',{'If-Range':'"media-v1"'})).status,206);
assert.equal((await call('bytes=0-1',{'If-Range':'W/"media-v1"'})).status,200);
let full=await call();assert.equal(full.status,200);assert.equal(full.headers.get('accept-ranges'),'bytes');assert.equal((await full.arrayBuffer()).byteLength,100);
let head=await call('bytes=0-1',{},'HEAD');assert.equal(head.status,200);assert.equal((await head.arrayBuffer()).byteLength,0);
let fallbackEnv={ASSETS:{fetch:()=>new Response('ordinary asset',{status:200})}};let ordinary=await worker.fetch(new Request('https://squargraph.com/assets/css/base.css'),fallbackEnv);assert.equal(await ordinary.text(),'ordinary asset');
console.log('Media ranges passed: Safari probe, open/suffix ranges, bounds, validators, HEAD, security headers, and non-media passthrough.');
