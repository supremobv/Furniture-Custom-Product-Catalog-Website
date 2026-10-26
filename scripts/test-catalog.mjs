import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import ts from 'typescript';
const source=await fs.readFile(new URL('../app/catalog-data.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const {products,materials,finishes,estimate}=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
assert.equal(new Set(products.map(p=>p.id)).size,8);
for(const p of products){assert.equal(estimate(p.id,p.materials[0],1),p.price,`${p.id} card price matches default estimate`);for(const m of p.materials){const diff=materials.find(v=>v.id===m).extra-materials.find(v=>v.id===p.materials[0]).extra;assert.equal(estimate(p.id,m,3),(p.price+diff)*3);assert.equal(estimate(p.id,m,50),(p.price+diff)*50)}for(const f of p.finishes)assert(finishes.some(v=>v.id===f));await fs.access(new URL(`../public/images/${p.image}.jpg`,import.meta.url));}
assert.equal(estimate('linea-cabinet','walnut',2),53000);
assert.equal(estimate('spindle-chair','ash',1),7800);
for(const qty of [0,-1,51,1.5,NaN])assert.equal(estimate('linea-cabinet','oak',qty),null);
assert.equal(estimate('custom','oak',1),null);assert.equal(estimate('forma-lounge','oak',1),null);
const pdf=await fs.readFile(new URL('../public/catalogs/sora-collection.pdf',import.meta.url));assert.equal(pdf.subarray(0,5).toString(),'%PDF-');
console.log('Catalog checks passed: all base prices, material surcharges, quantity bounds, product assets, and PDF.');
