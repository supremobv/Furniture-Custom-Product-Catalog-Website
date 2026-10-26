import assert from 'node:assert/strict';
const origin=process.env.TEST_ORIGIN||'http://127.0.0.1:8792';
const good={name:'Local SORA API QA',email:'qa@example.com',phone:'',location:'Test city',productId:'linea-cabinet',material:'walnut',finish:'smoked',quantity:2,dimensions:'100 x 45 x 120 cm',budget:'To be discussed',timeline:'Flexible / exploring',message:'Local integration test for a custom storage project.',consent:'on',estimate:1};
async function post(data,requestOrigin=origin){return fetch(origin+'/api/inquiries',{method:'POST',headers:{'Content-Type':'application/json',Origin:requestOrigin},body:JSON.stringify(data)})}
assert.equal((await fetch(origin+'/api/inquiries')).status,401,'Anonymous inbox rejected');
for(const patch of [{consent:''},{email:'invalid'},{name:' '},{location:''},{productId:'missing'},{material:'invalid'},{finish:'olive'},{quantity:0},{quantity:51},{quantity:1.5},{message:'short'},{budget:'invalid'},{timeline:'invalid'},{productId:'forma-lounge',material:'oak',finish:'chalk'}])assert.equal((await post({...good,...patch})).status,400,JSON.stringify(patch));
assert.equal((await post(good,'https://other.example')).status,403);
const created=await post(good);assert.equal(created.status,201);const saved=await created.json();assert.match(saved.reference,/^SO-[A-F0-9]{8}$/);
const auth={'oai-authenticated-user-id':'local_test_owner','oai-authenticated-user-email':'owner@sites.test'};
const list=await fetch(origin+'/api/inquiries',{headers:auth});assert.equal(list.status,200);const data=await list.json();const row=data.inquiries.find(i=>i.reference===saved.reference);assert(row);assert.equal(row.estimate,53000,'Server ignores forged total');assert.equal(row.finish,'smoked');assert.equal(row.quantity,2);
const custom=await post({...good,productId:'custom',material:'ash',finish:'natural'});assert.equal(custom.status,201);
const update=await fetch(origin+'/api/inquiries',{method:'PATCH',headers:{...auth,Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({id:row.id,status:'Quoted'})});assert.equal(update.status,200);
assert.equal((await fetch(origin+'/api/inquiries',{method:'PATCH',headers:{Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({id:row.id,status:'Closed'})})).status,401);
assert.equal((await fetch(origin+'/api/inquiries',{method:'PATCH',headers:{...auth,Origin:origin,'Content-Type':'application/json'},body:JSON.stringify({id:row.id,status:'Invalid'})})).status,400);
const reloaded=await(await fetch(origin+'/api/inquiries',{headers:auth})).json();assert.equal(reloaded.inquiries.find(i=>i.id===row.id).status,'Quoted');assert(reloaded.inquiries.some(i=>i.productId==='custom'&&i.estimate===null));
console.log('Inquiry API checks passed: validation, consent, origin, saved brief, recalculated total, custom scope, inbox authentication, status persistence. Local test data only.');
