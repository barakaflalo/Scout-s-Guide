const fs=require('fs'),path=require('path'),vm=require('vm'),assert=require('assert');
const root=__dirname;
const html=fs.readFileSync(path.join(root,'index.html'),'utf8');
function el(id=''){
 return {id,innerHTML:'',textContent:'',value:'',dataset:{},style:{setProperty(){}},className:'',classList:{add(){},remove(){},contains(){return false},toggle(){}},children:[],setAttribute(k,v){this[k]=v},getAttribute(k){return this[k]},addEventListener(){},querySelector(){return el()},querySelectorAll(){return []},appendChild(x){this.children.push(x);return x},prepend(){},before(){},after(){},replaceChildren(){this.children=[]},insertAdjacentHTML(_,s){this.innerHTML+=s},focus(){},click(){},showModal(){},close(){}};
}
const elements=new Map(),events={},storage=new Map();
const doc={getElementById(id){if(!elements.has(id))elements.set(id,el(id));return elements.get(id)},querySelector(){return el()},querySelectorAll(){return []},createElement:el,body:el('body'),documentElement:el('html'),activeElement:null,addEventListener(name,fn){(events[name]??=[]).push(fn)},hidden:false};
const ctx={document:doc,console,localStorage:{getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v),removeItem:k=>storage.delete(k),key:i=>[...storage.keys()][i],get length(){return storage.size}},location:{protocol:'file:',hash:'',reload(){}},history:{pushState(){}},navigator:{},setTimeout:()=>1,clearTimeout(){},setInterval:()=>2,clearInterval(){},URL,Blob,AbortController,Date,Math,SpeechSynthesisUtterance:class{constructor(t){this.text=t}},confirm:()=>true,matchMedia:()=>({matches:false}),performance:{now:()=>Date.now()}};
ctx.window=ctx;ctx.globalThis=ctx;ctx.addEventListener=()=>{};ctx.scrollTo=()=>{};ctx.speechSynthesis={cancel(){},speak(u){ctx.lastSpeech=u.text}};
vm.createContext(ctx);
let scriptCount=0;
for(const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/g)){
 const src=m[1].match(/src="([^"]+)"/)?.[1],code=src?fs.readFileSync(path.join(root,src),'utf8'):m[2];
 vm.runInContext(code,ctx,{filename:src||'inline-'+scriptCount,timeout:2000});scriptCount++;
}
const run=s=>vm.runInContext(s,ctx,{timeout:3000});
const tests=[];function test(name,fn){fn();tests.push({name,status:'passed'});}
test('140 stable topics and expanded notes',()=>{assert.equal(run('pItems().length'),140);assert.equal(run('Object.keys(PRO_GUIDES).length'),140);assert.equal(run('new Set(pItems().map(x=>x.it.id)).size'),140)});
test('All 140 details and every step render without errors',()=>{
 run("S.age='adults'; for(const {key,it} of pItems()){openItem(key,it.id);if(!$('detailBody').innerHTML.includes(pEsc(L(it.title))))throw Error(it.id);for(let i=0;i<it.steps.length;i++)pRenderStep(i);}");
 assert.equal(run('S.badges.length'),140);
});
test('All 8 category lists render; favourites and basics render',()=>run("for(const key of Object.keys(CONTENT))openCat(key);openBasics();renderFavorites();renderHome();"));
test('Every medical guide has paired HE/EN steps and source references',()=>run("for(const it of CONTENT.firstaid.items){if(it.steps.length<3||!PRO_GUIDES[it.id].sources.length)throw Error(it.id);for(const s of it.steps)if(!s.text.he||!s.text.en)throw Error(it.id);}"));
test('Favourite stays on guide; practice is separate from reading',()=>{run("openItem('knots','bowline');toggleFav('bowline')");assert.equal(run('currentItem'),'bowline');assert.equal(run('pPractised.length'),0);run('pTogglePractice()');assert.equal(run("pPractised.includes('bowline')"),true);assert.equal(run("basicPractised.includes('bowline')"),true);run('pTogglePractice()');});
test('Backup round trip preserves all preferences and excludes credentials',()=>{
 run("S.mode='dark';S.lang='en';S.ai.key='TEST_SECRET';S.quizBadges=['knots'];personalGear=[{name:'<img src=x onerror=alert(1)>',checked:true}];pPractised=['bowline','packing'];chatHistory=[{role:'user',text:'<script>alert(1)</script>'}];var backup=pBackupData();S.mode='light';S.quizBadges=[];pApplyBackup(backup);");
 assert.equal(run('S.mode'),'dark');assert.equal(run('S.quizBadges[0]'),'knots');assert(!run('JSON.stringify(pBackupData()).includes("TEST_SECRET")'));assert.equal(run('pPractised.length'),2);
});
test('Malformed backup rejected before any mutation',()=>{
 const before=run('JSON.stringify({...pBackupData(),date:null})');assert.throws(()=>run("pApplyBackup({app:'scout-guide',version:'2.0',username:'changed',favorites:'not-an-array'})"));assert.equal(run('JSON.stringify({...pBackupData(),date:null})'),before);
 assert.throws(()=>run("pValidateBackup(JSON.parse('{\"app\":\"scout-guide\",\"version\":\"2.0\",\"checklist\":{\"__proto__\":true}}'))"));
});
test('Chat treats content as text and prevents HTML injection',()=>{run('renderChat()');assert.equal(elements.get('chatBody').children[0].textContent,'<script>alert(1)</script>');assert.equal(elements.get('chatBody').children[0].innerHTML,'')});
test('Local answers include medical warning and respect age restrictions',()=>{
 run("S.lang='he';S.age='kids';");assert(run("localAnswer('כווייה')").includes('101'));assert(!run("localAnswer('קשר איטלקי')")?.includes('קשר איטלקי'));assert(run("localAnswer('איך קושרים קשר בית')").includes('בית'));
});
test('Read aloud includes warnings and expanded guide content',()=>{run("readAloud('firstaid','heat')");assert(ctx.lastSpeech.includes('101'));assert(ctx.lastSpeech.includes('מכת חום'))});
test('Timer uses a deadline and keeps running when its panel closes',()=>{run('startTimer(60);closeTimers()');assert.equal(run('tRemain'),60);assert(run('pTimerDeadline')>Date.now());run('pTimerDeadline=Date.now()-100;pTick()');assert.equal(run('tRemain'),0);assert.equal(run('pTimerDeadline'),null)});
test('Local storage fallback returns latest session value',()=>{run("localStorage.setItem=()=>{throw Error('quota')};store.set('sg_test','new')");assert.equal(run("store.get('sg_test')"),'new');run("store.del('sg_test')");assert.equal(run("store.get('sg_test')"),null)});
test('No relative orientation shown as north',()=>{run('window.DeviceOrientationEvent=function(){};bindCompass();var headingCalled=false;updateCompass=()=>headingCalled=true;compassHandler({alpha:50,absolute:false});');assert.equal(run('headingCalled'),false);run('compassHandler({alpha:50,absolute:true})');assert.equal(run('headingCalled'),true)});
test('Every basic illustration exists',()=>{for(const file of run('Object.values(BASIC_GUIDES).flatMap(g=>g.steps.map(s=>s.image))'))assert(fs.existsSync(path.join(root,file)),file)});

test('All 140 application topics have complete local artwork',()=>{
 const expected=JSON.parse(fs.readFileSync(path.join(root,'illustration-coverage.json'))).requiredTopics;
 const manifest=run('FIELD_ILLUSTRATIONS');
 assert.deepEqual(Object.keys(manifest).sort(),Array.from(run('pItems().map(x=>x.it.id)')).sort());
 assert.equal(Object.keys(manifest).length,140);
 for(const id of expected){const g=manifest[id];assert(g,id);assert.equal(g.images.length,g.captions.length,id);assert.equal(g.images.length,g.dimensions.length,id);for(const file of g.images){assert(/^(illustrations\/|art\/packing.webp)/.test(file),file);assert(fs.existsSync(path.join(root,file)),file);}assert(g.images.includes(g.cover),id);}
 assert.equal(Object.values(manifest).reduce((n,g)=>n+g.images.length,0),241);
});
test('All 68 basic step images use the new artwork in both languages',()=>{
 run("S.age='adults';for(const lang of ['he','en']){S.lang=lang;for(const [id,g] of Object.entries(BASIC_GUIDES)){const topic=vTopic(id);openItem(topic.key,id);for(let i=0;i<g.steps.length;i++){pRenderStep(i);const src=FIELD_ILLUSTRATIONS[id].images[i];if(g.steps[i].image!==src||!$('pStepFrame').innerHTML.includes(src))throw Error(id+' '+i);}}}");
});
test('All topic screens and steps avoid retired instructional artwork',()=>{
 run("S.lang='he';S.age='adults';for(const {key,it} of pItems()){openItem(key,it.id);if(/(?:src|href)=[\\\"'](?:assets\\/|basics\\/|field-art\\/)/.test($('detailBody').innerHTML))throw Error(it.id);for(let i=0;i<it.steps.length;i++){pRenderStep(i);if(/(?:assets\\/|basics\\/|field-art\\/|p-svg)/.test($('pStepFrame').innerHTML))throw Error(it.id+' '+i);}}");
});
test('Illustration search, category filter and zoom use the selected image',()=>{
 run("S.age='adults';openVisualLibrary();$('i3ArtSearch').value='עננים';i3RenderGallery();");assert(run("$('i3ArtGrid').innerHTML").includes('weather'));
 run("S.age='adults';openVisualLibrary();$('i3ArtSearch').value='אוהל';i3RenderGallery();");assert(run("$('i3ArtGrid').innerHTML").includes('pitchtent'));assert(!run("$('i3ArtGrid').innerHTML").includes("bowline"));
 run("$('i3ArtSearch').value='';$('i3ArtCategory').value='navigation';i3RenderGallery();");assert(run("$('i3ArtGrid').innerHTML").includes('compass'));assert(!run("$('i3ArtGrid').innerHTML").includes("bowline"));
 run("pZoomReference('weather',9);i3SetZoom(2)");assert.equal(run("$('visualZoomImage').src"),'illustrations/frames/weather-10.webp');assert.equal(run("$('i3ZoomLevel').textContent"),'200%');
 run("i3SetZoom(1)");assert.equal(run("$('visualZoomImage').style.width"),'100%');
});

(async()=>{
run("var requestCount=0; var resolveRequest; callAI=()=>{requestCount++;return new Promise(resolve=>resolveRequest=resolve)}; S.ai.key='TEST'; chatHistory=[]; $('chatText').value='test question'; var pendingSend=sendChat(); $('chatText').value='second question'; sendChat();");
assert.equal(run('requestCount'),1);run('clearChat();resolveRequest("stale answer")');await run('pendingSend');assert.equal(run('chatHistory.length'),0);tests.push({name:'Concurrent send prevented; stale response after clear ignored',status:'passed'});
const report={date:new Date().toISOString(),scriptCount,topics:run('pItems().length'),steps:run('pItems().reduce((a,x)=>a+x.it.steps.length,0)'),expandedNotes:run('Object.keys(PRO_GUIDES).length'),illustratedGuides:run('Object.keys(BASIC_GUIDES).length'),tests,limits:['DOM unit harness; browser visual and interaction results recorded separately.','No live API credentials, physical compass, real emergency call or clinical certification tested.']};
fs.writeFileSync(path.join(__dirname,'verification.unit.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exitCode=1});
