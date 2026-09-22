/* Run with Node.js from anywhere: node build-release.cjs */
const fs=require('fs'),path=require('path'),crypto=require('crypto');
const root=__dirname;
function walk(dir,prefix=''){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?walk(path.join(dir,e.name),prefix+e.name+'/'):[prefix+e.name]);}
const files=walk(root).filter(f=>(/\.(html|js|css|json|webp|png|svg|txt)$/.test(f)||f.startsWith('licenses/'))&&!['sw.js','verification.json','verification.unit.json','asset-sources.json','basics-sources.json','field-art-inventory.json'].includes(f)&&! /^(assets|basics|field-art)\//.test(f)).sort();
const hash=crypto.createHash('sha256');for(const file of files){let bytes=fs.readFileSync(path.join(root,file));if(file==='pro-core.js')bytes=Buffer.from(bytes.toString('utf8').replace(/const P_RELEASE='[^']*'/,"const P_RELEASE='BUILD'"));hash.update(file);hash.update(bytes);}
const version='4.0.0-'+hash.digest('hex').slice(0,12);
const core=fs.readFileSync(path.join(root,'pro-core.js'),'utf8').replace(/const P_RELEASE='[^']*'/,"const P_RELEASE='"+version+"'");
fs.writeFileSync(path.join(root,'pro-core.js'),core);
const sw=fs.readFileSync(path.join(root,'sw.js'),'utf8').replace(/const VERSION='[^']*'/,"const VERSION='"+version+"'").replace(/const FILES=\[[\s\S]*?\];/,'const FILES='+JSON.stringify(files)+';');
fs.writeFileSync(path.join(root,'sw.js'),sw);
const bytes=files.reduce((sum,f)=>sum+fs.statSync(path.join(root,f)).size,0);
console.log(JSON.stringify({version,precacheFiles:files.length,bytes},null,2));
