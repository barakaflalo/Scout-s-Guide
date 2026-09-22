/* Reliability fixes. No API credentials are included in backups. */
store.get=function(k){if(Object.hasOwn(mem,k))return mem[k];try{return localStorage.getItem(k);}catch{return null;}};
store.set=function(k,v){mem[k]=String(v);try{localStorage.setItem(k,String(v));return true;}catch{return false;}};
store.del=function(k){mem[k]=null;try{localStorage.removeItem(k);}catch{}};
const P_IDS=new Set(pItems().map(x=>x.it.id));
for(const k of ['favorites','badges'])S[k]=Array.isArray(S[k])?S[k].filter(x=>P_IDS.has(x)):[];
S.quizBadges=Array.isArray(S.quizBadges)?S.quizBadges.filter(x=>Object.hasOwn(QUIZ,x)):[];
if(!S.checklist||typeof S.checklist!=='object'||Array.isArray(S.checklist))S.checklist={};
if(!LANGS.some(([x])=>x===S.lang))S.lang='he';
if(!THEMES.includes(S.theme))S.theme='gold';
if(!['kids','youth','adults'].includes(S.age))S.age='youth';
if(!['light','dark'].includes(S.mode))S.mode='light';
if(!store.get('sg_mode'))S.mode='light';
if(typeof S.username!=='string')S.username='';
if(!S.ai||typeof S.ai!=='object'||!Object.hasOwn(AI_PROVIDERS,S.ai.provider))S.ai={provider:'gemini',key:'',model:''};
S.ai.key=typeof S.ai.key==='string'?S.ai.key:'';S.ai.model=typeof S.ai.model==='string'?S.ai.model:'';
personalGear=Array.isArray(personalGear)?personalGear.filter(x=>x&&typeof x.name==='string').slice(0,100).map(x=>({name:x.name.slice(0,100),checked:!!x.checked})):[];
function pChatClean(items){return Array.isArray(items)?items.filter(x=>x&&['user','bot'].includes(x.role)&&typeof x.text==='string').slice(-100).map(x=>({role:x.role,text:x.text.slice(0,20000)})):[];}
chatHistory=pChatClean(chatHistory);
const P_BACKUP_KEYS=['sg_fav','sg_check','sg_badges','sg_qbadges','sg_user','sg_lang','sg_theme','sg_mode','sg_age','sg_personal_gear','sg_basic_practised','sg_practised','sg_chat','sg_streak','sg_lastactive','sg_red','sg_last_read'];
function pBackupData(){return {app:'scout-guide',version:'2.0',date:new Date().toISOString(),username:S.username,lang:S.lang,theme:S.theme,mode:S.mode,age:S.age,favorites:S.favorites,checklist:S.checklist,badges:S.badges,quizBadges:S.quizBadges,personalGear,basicPractised,practised:pPractised,chat:pChatClean(chatHistory),streak:Number(store.get('sg_streak')||0),lastActive:store.get('sg_lastactive')||null,red:store.get('sg_red')==='1',lastRead:store.get('sg_last_read')||null};}
function pValidateBackup(d){
 if(!d||typeof d!=='object'||Array.isArray(d)||d.app!=='scout-guide'||!['1.0','2.0'].includes(d.version))throw new Error('schema');
 const cur=pBackupData(),r={...cur};
 const array=(value,valid)=>{if(!Array.isArray(value)||value.length>2000||value.some(x=>typeof x!=='string'||!valid(x)))throw new Error('array');return [...new Set(value)];};
 for(const field of ['favorites','badges','practised'])if(d[field]!==undefined)r[field]=array(d[field],x=>P_IDS.has(x));
 if(d.basicPractised!==undefined)r.basicPractised=array(d.basicPractised,x=>Object.hasOwn(BASIC_GUIDES,x));
 if(d.practised===undefined&&d.basicPractised!==undefined)r.practised=r.basicPractised;
 if(d.quizBadges!==undefined)r.quizBadges=array(d.quizBadges,x=>Object.hasOwn(QUIZ,x));
 for(const [field,values] of Object.entries({lang:LANGS.map(x=>x[0]),theme:THEMES,mode:['dark','light'],age:['kids','youth','adults']})){
 if(d[field]!==undefined){if(!values.includes(d[field]))throw new Error(field);r[field]=d[field];}}
 const name=d.username??d.user;if(name!==undefined){if(typeof name!=='string'||name.length>100)throw new Error('name');r.username=name;}
 if(d.checklist!==undefined){if(!d.checklist||typeof d.checklist!=='object'||Array.isArray(d.checklist)||Object.keys(d.checklist).length>1000)throw new Error('checklist');r.checklist={};for(const [k,v] of Object.entries(d.checklist)){if(!/^[a-zA-Z0-9_-]{1,80}$/.test(k)||['__proto__','constructor','prototype'].includes(k)||typeof v!=='boolean')throw new Error('checklist');r.checklist[k]=v;}}
 if(d.personalGear!==undefined){if(!Array.isArray(d.personalGear)||d.personalGear.length>100||d.personalGear.some(x=>!x||typeof x.name!=='string'||x.name.length>100||typeof x.checked!=='boolean'))throw new Error('gear');r.personalGear=d.personalGear.map(x=>({name:x.name,checked:x.checked}));}
 if(d.chat!==undefined){if(!Array.isArray(d.chat)||d.chat.length>100||d.chat.some(x=>!x||!['user','bot'].includes(x.role)||typeof x.text!=='string'||x.text.length>20000))throw new Error('chat');r.chat=pChatClean(d.chat);}
 if(d.streak!==undefined){if(!Number.isInteger(d.streak)||d.streak<0||d.streak>100000)throw new Error('streak');r.streak=d.streak;}
 if(d.lastActive!==undefined){if(d.lastActive!==null&&!/^\d{4}-\d{2}-\d{2}$/.test(d.lastActive))throw new Error('date');r.lastActive=d.lastActive;}
 if(d.red!==undefined){if(typeof d.red!=='boolean')throw new Error('red');r.red=d.red;}
 if(d.lastRead!==undefined){if(d.lastRead!==null&&!P_IDS.has(d.lastRead))throw new Error('lastRead');r.lastRead=d.lastRead;}
 return r;
}
function pApplyBackup(d){
 const r=pValidateBackup(d);
 const values={sg_fav:JSON.stringify(r.favorites),sg_check:JSON.stringify(r.checklist),sg_badges:JSON.stringify(r.badges),sg_qbadges:JSON.stringify(r.quizBadges),sg_user:r.username,sg_lang:r.lang,sg_theme:r.theme,sg_mode:r.mode,sg_age:r.age,sg_personal_gear:JSON.stringify(r.personalGear),sg_basic_practised:JSON.stringify(r.practised.filter(x=>Object.hasOwn(BASIC_GUIDES,x))),sg_practised:JSON.stringify(r.practised),sg_chat:JSON.stringify(r.chat),sg_streak:String(r.streak),sg_lastactive:r.lastActive||'',sg_red:r.red?'1':'0',sg_last_read:r.lastRead||''};
 const before=Object.fromEntries(P_BACKUP_KEYS.map(k=>[k,store.get(k)]));
 let persistent=true;
 try{for(const [k,v] of Object.entries(values))localStorage.setItem(k,v);}
 catch{persistent=false;for(const [k,v] of Object.entries(before)){try{v===null?localStorage.removeItem(k):localStorage.setItem(k,v);}catch{}}}
 // Commit in-memory state only after the entire file has passed validation.
 for(const [k,v] of Object.entries(values))mem[k]=v;
 for(const k of ['username','lang','theme','mode','age','favorites','checklist','badges','quizBadges'])S[k]=r[k];
 personalGear=r.personalGear;pPractised=r.practised;basicPractised=r.practised.filter(x=>Object.hasOwn(BASIC_GUIDES,x));chatHistory=r.chat;S.streak=r.streak;
 return persistent;
}
exportBackup=function(){
 const a=document.createElement('a'),url=URL.createObjectURL(new Blob([JSON.stringify(pBackupData(),null,2)],{type:'application/json'}));
 a.href=url;a.download='scout-backup-'+new Date().toISOString().slice(0,10)+'.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);
 toast(pText('הגיבוי כולל התקדמות והעדפות; מפתחות בינה אינם נכללים.','Backup includes progress and preferences, without API keys.'));
};
importBackup=async function(input){
 const file=input.files?.[0];input.value='';if(!file)return;
 if(file.size>2000000){toast(pText('קובץ הגיבוי גדול מדי','Backup file is too large'));return;}
 try{const d=JSON.parse(await file.text());pValidateBackup(d);
 if(!confirm(pText('הקובץ תקין. לשחזר את ההתקדמות וההעדפות ממנו במקום המצב הנוכחי?','Valid backup. Replace current progress and preferences with its contents?')))return;
 pChatCancel();const saved=pApplyBackup(d);
 document.body.dataset.mode=S.mode;document.body.dataset.theme=S.theme;document.body.dataset.age=S.age;document.documentElement.style.setProperty('--font-scale',FONT_SCALE[S.age]);$('modeBtn').textContent=S.mode==='dark'?'🌙':'☀️';applyLang();applyRed();renderSettings();go('settings');
 toast(saved?pText('הגיבוי שוחזר','Backup restored'):pText('שוחזר לפעילות הנוכחית בלבד: הדפדפן חסם שמירה.','Restored for this session only: browser storage is unavailable.'));
 }catch{toast(pText('קובץ לא תקין או לא נתמך. הנתונים הנוכחיים לא שונו.','Invalid or unsupported file. Current data was not changed.'));}
};
resetAll=function(){
 if(!confirm(pText('למחוק את כל ההתקדמות, ההעדפות, השיחה ומפתח הבינה ששמורים במדריך בדפדפן הזה?','Delete all guide progress, preferences, chat and saved API credentials in this browser?')))return;
 pChatCancel();stopTimer();pStopSpeech();
 const keys=new Set([...P_BACKUP_KEYS,'sg_ai','sg_onboarded','sg_safetyack',...Object.keys(mem).filter(k=>k.startsWith('sg_'))]);
 try{for(let i=0;i<localStorage.length;i++){const k=localStorage.key(i);if(k?.startsWith('sg_'))keys.add(k);}}catch{}
 keys.forEach(k=>store.del(k));location.reload();
};
const pBaseApplyLang=applyLang;
applyLang=function(){pBaseApplyLang();if(pReady){const labels={home:['בית','Home'],favorites:['שמורים','Saved'],checklist:['ציוד','Gear'],settings:['הגדרות','Settings']};document.querySelectorAll('.p-bottom [data-screen]').forEach(b=>b.textContent=pText(...labels[b.dataset.screen]));const e=document.querySelector('.p-nav-emergency');if(e)e.textContent=pText('חירום','Emergency');}};
const pBaseSettings=renderSettings;
renderSettings=function(){
 pBaseSettings();$('themeSwatches').querySelectorAll('button').forEach((b,i)=>b.setAttribute('aria-label',THEMES[i]));
 let n=$('pSettingsNote');if(!n){n=document.createElement('p');n.id='pSettingsNote';n.className='p-warning';$('settings').appendChild(n);}
 n.textContent=pText('התוכן המורחב זמין בעברית. באנגלית מוצגים המדריכים הבסיסיים והנחיות העזרה הראשונה המעודכנות; בשפות הנוספות חלק מהתוכן חוזר לאנגלית. הגיבוי אינו כולל מפתחות בינה.','Expanded notes are in Hebrew. English includes core guides and updated first aid. Other interface languages may fall back to English. Backups exclude API keys.');
};
let pChatRun=0,pChatController=null,pChatBusy=false;
function pChatCancel(){pChatRun++;pChatController?.abort();pChatController=null;pChatBusy=false;const b=document.querySelector('.chatinput .send');if(b)b.disabled=false;}
clearChat=function(){pChatCancel();chatHistory=[];saveJSON('sg_chat',chatHistory);renderChat();};
renderChat=function(){
 const body=$('chatBody');body.replaceChildren();
 const messages=chatHistory.length?chatHistory:[{role:'bot',text:pText('אפשר לחפש כאן מידע מתוך המדריכים. בחירום פנו למוקד החירום, ולא לצ׳אט.','Ask about the guide content here. In an emergency contact emergency services, not chat.')}];
 for(const m of messages){const d=document.createElement('div');d.className='msg '+(m.role==='user'?'user':'bot');d.textContent=m.text;body.appendChild(d);}
 $('chatSug').replaceChildren();body.scrollTop=body.scrollHeight;
};
localAnswer=function(q){
 const stop=new Set(['איך','מה','עושים','לעשות','את','של','אני','רוצה','אפשר','the','how','what','does','with','and','you','can','please']);
 const words=q.toLowerCase().split(/[^\p{L}\p{N}]+/u).filter(w=>w.length>1&&!stop.has(w));
 const candidates=pItems().filter(({it})=>!(it.kidsLock&&S.age==='kids')).map(({key,it})=>{
 const title=(L(it.title)+' '+(P_ALIASES[it.id]||'')).toLowerCase(),hay=pHay(it);let score=0;
 for(const w of words){const variants=[w];if(/^[בלמהו]/.test(w)&&w.length>3)variants.push(w.slice(1));score+=Math.max(...variants.map(v=>title.includes(v)?6:hay.includes(v)?1:0));}
 return {key,it,score};}).filter(x=>x.score>=3).sort((a,b)=>b.score-a.score);
 if(!candidates.length)return null;
 const {key,it}=candidates[0],g=pGuideNotes(it);
 return [pText('מתוך המדריך: ','From the guide: ')+L(it.title),L(it.lead),...(it.safety||[]).map(s=>'⚠ '+L(s)),...it.steps.map((st,i)=>(i+1)+'. '+L(st.text)),g.mistake?pText('טעות שכדאי למנוע: ','Avoid: ')+g.mistake:'',key==='firstaid'?pText('במצב חירום חייגו 101 בישראל ופעלו לפי המוקד.','In Israel call 101 in an emergency and follow dispatch. Elsewhere call local services.'):''].filter(Boolean).join('\n\n');
};
sendChat=async function(){
 if(pChatBusy)return;const q=$('chatText').value.trim().slice(0,2000);if(!q)return;
 $('chatText').value='';chatHistory.push({role:'user',text:q});const local=localAnswer(q);
 if(!S.ai.key&&S.ai.provider!=='local'){chatHistory.push({role:'bot',text:local||pText('לא מצאתי התאמה ברורה. נסו שם מדויק, למשל „קשר בית” או „טיהור מים”.','No clear match. Try a specific term such as “bowline” or “water”.')});chatHistory=chatHistory.slice(-100);saveJSON('sg_chat',chatHistory);renderChat();return;}
 const run=++pChatRun;pChatBusy=true;pChatController=new AbortController();const controller=pChatController;
 const pending={role:'bot',text:pText('בודק…','Checking…')};chatHistory.push(pending);renderChat();const button=document.querySelector('.chatinput .send');if(button)button.disabled=true;
 const timeout=setTimeout(()=>controller.abort(),30000);
 try{const answer=await callAI(q,controller.signal);if(run!==pChatRun)return;pending.text=typeof answer==='string'&&answer.trim()?answer.slice(0,20000):local||pText('לא התקבלה תשובה.','No answer received.');}
 catch{if(run!==pChatRun)return;pending.text=(local?local+'\n\n':'')+pText('החיבור לבינה לא הושלם. אפשר להמשיך להשתמש במדריכים המקומיים.','AI connection did not complete. Local guides remain available.');}
 finally{clearTimeout(timeout);if(run===pChatRun){pChatBusy=false;pChatController=null;if(button)button.disabled=false;chatHistory=chatHistory.slice(-100);saveJSON('sg_chat',chatHistory);renderChat();}}
};
let pTimerDeadline=null;
function pTick(){if(pTimerDeadline===null)return;tRemain=Math.max(0,Math.ceil((pTimerDeadline-Date.now())/1000));updateT();if(tRemain===0){stopTimer();timerDone();}}
startTimer=function(sec){if(!Number.isFinite(sec)||sec<=0||sec>10800)return;stopTimer();tRemain=Math.ceil(sec);pTimerDeadline=Date.now()+tRemain*1000;updateT();tInt=setInterval(pTick,250);};
stopTimer=function(){if(tInt)clearInterval(tInt);tInt=null;pTimerDeadline=null;};
closeTimers=function(){$('timerOverlay').classList.remove('show');};
renderTimer=function(){
 $('timerModal').innerHTML=`<h2>${pText('טיימר לתרגול','Practice timer')}</h2><div class="tdisplay" id="tdisplay">${fmt(tRemain)}</div><div class="tpreset">${[1,5,10,20].map(m=>`<button onclick="startTimer(${m*60})">${m} ${pText('דקות','min')}</button>`).join('')}</div><div class="trow"><label for="tcustom">${pText('דקות','Minutes')}</label><input type="number" id="tcustom" min="1" max="180"><button class="btn" onclick="startCustom()">${pText('התחלה','Start')}</button></div><div class="trow"><button class="btn ghost" onclick="stopTimer()">${pText('עצירה','Stop')}</button><button class="btn ghost" onclick="resetTimer()">${pText('איפוס','Reset')}</button></div><p class="hint">${pText('הספירה ממשיכה כשהחלון נסגר. ייתכן שההתראה תישמע רק בחזרה לאפליקציה; אין להסתמך עליה לצורך רפואי או בטיחותי.','The timer continues when this panel closes. Alerts may wait until you return to the app; do not rely on them for medical or safety timing.')}</p><button class="btn ghost" onclick="closeTimers()">${pText('סגירה','Close')}</button>`;
};
document.addEventListener('visibilitychange',()=>{if(!document.hidden)pTick();else closeSOS();});
bindCompass=function(){
 if(compassHandler){window.removeEventListener('deviceorientationabsolute',compassHandler,true);window.removeEventListener('deviceorientation',compassHandler,true);}
 if(!('DeviceOrientationEvent' in window)){compassMsg(T('compassNo'));return;}
 const b=$('compassPerm');if(b)b.style.display='none';
 compassMsg(pText('ממתין לכיוון מוחלט מהחיישן. גם אז יש להשוות למצפן ולמפה; אין להשתמש במכשיר כמצפן יחיד.','Waiting for an absolute heading. Cross-check with a compass and map; never rely on this device alone.'));
 compassHandler=e=>{const heading=Number.isFinite(e.webkitCompassHeading)?e.webkitCompassHeading:e.absolute===true&&Number.isFinite(e.alpha)?360-e.alpha:null;if(heading!==null)updateCompass((heading+360)%360);};
 window.addEventListener('deviceorientationabsolute',compassHandler,true);window.addEventListener('deviceorientation',compassHandler,true);
};
openSOS=function(){
 closeSOS();const s=$('sosScreen');s.onclick=null;s.classList.add('show');s.style.background='#17271f';s.style.color='#fff';
 s.innerHTML=`<div id="sosText">SOS</div><p>· · · — — — · · ·</p><p id="sosHint">${pText('איתות מסך אינו מבטיח שמישהו יראה אותו.','A screen signal does not guarantee visibility.')}</p><div class="p-toolbar"><button class="btn" onclick="pStartSOS()">${pText('הפעלת הבהוב ושמע','Start flashing and sound')}</button><button class="btn ghost" onclick="closeSOS()">${pText('סגירה','Close')}</button></div>`;
};
function pStartSOS(){if(sosRunning)return;if(matchMedia('(prefers-reduced-motion: reduce)').matches){toast(pText('הוגדרה הפחתת תנועה במכשיר. מוצג סימן קבוע; אפשר להשתמש בפנס או במשרוקית.','Reduced motion is enabled. The signal remains static; use a torch or whistle.'));return;}$('sosScreen').style.background='';runSOS();}
const pBaseCloseSOS=closeSOS;
closeSOS=function(){pBaseCloseSOS();$('sosScreen').style.background='';};
document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeSOS();closeCompass();closeTimers();closeChat();pStopSpeech();}});
async function pCheckOffline(){
 if(!('serviceWorker' in navigator)||location.protocol==='file:'){pOffline='failed';return;}
 try{
 const reg=await navigator.serviceWorker.getRegistration();
 if(!reg?.active){pOffline='pending';return;}
 const channel=new MessageChannel();
 channel.port1.onmessage=e=>{pOffline=e.data?.complete?'ready':'failed';if($('pOfflineStatus'))$('pOfflineStatus').textContent=pStatusText();channel.port1.close();};
 reg.active.postMessage({type:'CHECK_OFFLINE'},[channel.port2]);
 }catch{pOffline='failed';}
}
document.addEventListener('DOMContentLoaded',()=>{
 if('serviceWorker' in navigator){navigator.serviceWorker.ready.then(pCheckOffline).catch(()=>{});navigator.serviceWorker.addEventListener('controllerchange',pCheckOffline);setTimeout(pCheckOffline,3500);}
 $('chatText').maxLength=2000;
 const modals=['obOverlay','quizOverlay','timerOverlay','compassOverlay','safetyOverlay'];
 for(const id of modals){const el=$(id);if(el){el.setAttribute('role','dialog');el.setAttribute('aria-modal','true');}}
});

QUIZ.firstaid[1].opts[0]={he:'מקררים במים זורמים קרירים 20 דקות',en:'Cool under cool running water for 20 minutes'};
QUIZ.fire[2].q={he:'באילו תנאים אפשר לשקול הדלקת מדורה?',en:'When can a campfire be considered?'};
QUIZ.fire[2].opts[0]={he:'במקום מותר, בתנאים מתאימים, בהשגחה ועם אמצעי כיבוי',en:'Where permitted, in suitable conditions, supervised, with extinguishing supplies'};
QUIZ.knots[2].q={he:'מה חובה לעשות לפני שמשתמשים בקשר תחת עומס?',en:'What must you do before using a loaded knot?'};
QUIZ.knots[2].opts=[{he:'לבדוק התאמה לחבל ולמשימה ולתרגל בהדרכה',en:'Check suitability for the rope and task, and practise with instruction'},{he:'לבחור את הקשר היפה ביותר',en:'Choose the best-looking knot'},{he:'לסמוך על השם בלבד',en:'Trust the name alone'},{he:'לקצר את הקצוות ככל האפשר',en:'Trim the ends as short as possible'}];
renderQuiz=function(){
 const q=QUIZ[qState.key][qState.i],order=q.opts.map((_,i)=>i);
 for(let i=order.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[order[i],order[j]]=[order[j],order[i]];}
 $('quizModal').innerHTML=`<div class="qprog">${T('qLabel')} ${qState.i+1} / ${QUIZ[qState.key].length}</div><h2 style="text-align:start">${pEsc(L(q.q))}</h2><div id="qopts">${order.map(idx=>`<button class="qopt" data-idx="${idx}" onclick="answerQuiz(${idx})">${pEsc(L(q.opts[idx]))}</button>`).join('')}</div><div class="qfeedback" id="qfeedback" role="status"></div><button class="btn" id="qnext" style="display:none" onclick="nextQuiz()">${qState.i===QUIZ[qState.key].length-1?T('qFinish'):T('qNext')}</button><button class="btn ghost" style="margin-top:8px" onclick="closeQuiz()">${pText('סגירה','Close')}</button>`;
};
document.addEventListener('keydown',e=>{
 if(e.key!=='Tab')return;
 const shown=[...document.querySelectorAll('.overlay.show')].at(-1);if(!shown)return;
 const focusable=[...shown.querySelectorAll('button:not(:disabled),input:not(:disabled),select,a[href],[tabindex="0"]')].filter(x=>x.getClientRects().length);
 if(!focusable.length)return;const first=focusable[0],last=focusable.at(-1);
 if(!shown.contains(document.activeElement)){e.preventDefault();first.focus();}
 else if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}
 else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}
});

const P_RELEASE='4.0.0-7305c24898d7';
let pUpdateRequested=false;
pCheckOffline=async function(){
 if(!('serviceWorker' in navigator)||location.protocol==='file:'){pOffline='failed';if($('pOfflineStatus'))$('pOfflineStatus').textContent=pStatusText();return;}
 try{
 const reg=await navigator.serviceWorker.getRegistration();if(!reg?.active)return;
 const channel=new MessageChannel();
 const timer=setTimeout(()=>{pOffline='failed';if($('pOfflineStatus'))$('pOfflineStatus').textContent=pStatusText();channel.port1.close();},2500);
 channel.port1.onmessage=e=>{clearTimeout(timer);pOffline=e.data?.complete&&e.data.version===P_RELEASE?'ready':'failed';if($('pOfflineStatus'))$('pOfflineStatus').textContent=pStatusText();channel.port1.close();};
 reg.active.postMessage({type:'CHECK_OFFLINE'},[channel.port2]);
 if(reg.waiting)pOfferUpdate(reg);
 }catch{pOffline='failed';}
};
function pOfferUpdate(reg){
 if($('pUpdateBanner'))return;
 const banner=document.createElement('div');banner.id='pUpdateBanner';banner.className='p-update';
 const label=document.createElement('span');label.textContent=pText('גרסה חדשה מוכנה.','A new version is ready.');
 const button=document.createElement('button');button.className='btn';button.textContent=pText('טעינת העדכון','Load update');button.onclick=()=>{if(!reg.waiting)return;pUpdateRequested=true;reg.waiting.postMessage({type:'ACTIVATE_UPDATE'});};
 banner.append(label,button);document.body.appendChild(banner);
}
document.addEventListener('DOMContentLoaded',()=>{
 if(!('serviceWorker' in navigator)||location.protocol==='file:')return;
 navigator.serviceWorker.register('sw.js').then(reg=>{
  if(reg.waiting)pOfferUpdate(reg);
  reg.addEventListener('updatefound',()=>{const worker=reg.installing;worker?.addEventListener('statechange',()=>{if(worker.state==='installed'){if(navigator.serviceWorker.controller)pOfferUpdate(reg);else pCheckOffline();}if(worker.state==='redundant'){pOffline='failed';if($('pOfflineStatus'))$('pOfflineStatus').textContent=pStatusText();}});});
 }).catch(()=>{pOffline='failed';if($('pOfflineStatus'))$('pOfflineStatus').textContent=pStatusText();});
 navigator.serviceWorker.addEventListener('controllerchange',()=>{if(pUpdateRequested)location.reload();else pCheckOffline();});
});

LANG.he.ageHint='משנה את גודל הטקסט ואת הגישה לתרגולים הדורשים ליווי מבוגר';
LANG.en.ageHint='Adjusts text size and access to activities requiring adult supervision';
LANG.he.aiHint='אפשר להשתמש במדריך בלי חיבור בינה. בחיבור לספק חיצוני השאלה ומפתח האימות נשלחים אליו; המפתח נשמר בדפדפן.';
LANG.en.aiHint='Use the guide without AI. With an external provider, your question and credentials are sent to it; the key is saved in this browser.';
document.addEventListener('DOMContentLoaded',()=>{
 $('micBtn').title=pText('הכתבה · עשויה להשתמש בשירות זיהוי של ספק הדפדפן','Dictation · may use the browser vendor’s speech service');
 $('micBtn').setAttribute('aria-label',$('micBtn').title);
});
