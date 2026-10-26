import fs from 'node:fs/promises';
import ts from 'typescript';
const source=await fs.readFile(new URL('../app/catalog-data.ts',import.meta.url),'utf8');
const js=ts.transpileModule(source,{compilerOptions:{module:ts.ModuleKind.ESNext,target:ts.ScriptTarget.ES2022}}).outputText;
const data=await import('data:text/javascript;base64,'+Buffer.from(js).toString('base64'));
await fs.mkdir(new URL('../outputs/',import.meta.url),{recursive:true});
await fs.writeFile(new URL('../outputs/catalog-data.json',import.meta.url),JSON.stringify({products:data.products,materials:data.materials,finishes:data.finishes},null,2));
console.log('Catalog source data exported.');
