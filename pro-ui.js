/* Scout's Guide · field edition UI. */
const pText=(he,en)=>S.lang==='he'?he:en;
const pEsc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const P_ALIASES={burn:'כווייה כוויה כוויות כויות',bowline:'קשר הצלה דרגון בוליין',clove:'קשר מוט מהוי',halfhitch:'חצי קביעה חצאי קביעות',sprain:'נקעים נקע פריקה',cpr:'החיאה החייאה CPR',packing:'אריזה תרמיל תיק',heat:'מכת חום heatstroke',whistle:'משרוקית'};
const P_ART={knots:'knots',firstaid:'firstaid',fire:'fire',shelter:'shelter',navigation:'navigation',signals:'signals',gear:'packing',nature:'nature'};
const P_TAGS={knots:['חבל, דיוק ותרגול','Rope, precision & practice'],firstaid:['לזהות, להזעיק, לסייע','Recognize, call, help'],fire:['שליטה באש מתחילה בתכנון','Plan before you light'],shelter:['מקום בטוח לסוף היום','A safe place to rest'],navigation:['לדעת איפה אתם','Know where you are'],signals:['להיראות ולהישמע','Be seen. Be heard.'],gear:['לקחת את מה שצריך','Pack with purpose'],nature:['לנוע בעדינות בשטח','Tread thoughtfully']};
const pItems=()=>Object.entries(CONTENT).flatMap(([key,c])=>c.items.map(it=>({key,it})));
let pPractised=loadJSON('sg_practised',basicPractised);
if(!Array.isArray(pPractised))pPractised=[];
pPractised=[...new Set(pPractised.filter(id=>pItems().some(x=>x.it.id===id)))];
let pStep=0,pOrigin='home',pListFilter='',pListDifficulty='all',pReady=false,pRestoring=false,pOffline='pending';
const pPhoto=(key)=>'art/'+P_ART[key]+'.webp';
const pDifficulty=it=>({easy:pText('בסיסי','Essential'),med:pText('תרגול נוסף','More practice'),hard:pText('מתקדם','Advanced')}[it.difficulty]||pText('מדריך','Guide'));
const pBaseGo=go;
go=function(screen){
 if(!$(screen))return;
 pBaseGo(screen);
 if(screen==='home')renderHome();
 if(pReady){
  const route=screen==='detail'?(currentItem?'topic/'+currentCat+'/'+currentItem:'emergency'):screen==='list'?'category/'+currentCat:screen;
  if(!pRestoring&&location.hash!=='#'+route)history.pushState(null,'','#'+route);
  if('speechSynthesis' in window)speechSynthesis.cancel();
  document.querySelectorAll('.p-bottom [data-screen]').forEach(b=>b.setAttribute('aria-current',b.dataset.screen===screen?'page':'false'));
  const heading=$(screen).querySelector('h1');if(heading){heading.tabIndex=-1;heading.focus({preventScroll:true});}
 }
};
function pRestore(){
 const parts=location.hash.slice(1).split('/');pRestoring=true;
 try{
 if(parts[0]==='topic'&&CONTENT[parts[1]]?.items.some(x=>x.id===parts[2]))openItem(parts[1],parts[2]);
 else if(parts[0]==='category'&&CONTENT[parts[1]])openCat(parts[1]);
 else if(parts[0]==='emergency')openEmergency();
 else if(parts[0]==='basics')openBasics();
 else if(parts[0]==='morseTool')openMorseTool();
 else if(parts[0]==='visualLibrary')openVisualLibrary();
 else if(['home','settings','favorites','checklist','achievements','about'].includes(parts[0]))go(parts[0]);
 else go('home');
 }finally{pRestoring=false;}
}
function pStatusText(){return pOffline==='ready'?pText('זמין גם בלי אינטרנט','Available offline'):pOffline==='failed'?pText('הורדת תוכן אופליין לא הושלמה','Offline download incomplete'):location.protocol==='file:'?pText('גרסה מקומית · לפתיחה מהתיקייה','Local edition · keep the folder together'):pText('מכין תוכן לשימוש אופליין…','Preparing offline content…');}
renderHome=function(){
 const hero=$('home').querySelector('.hero');
 hero.className='hero p-hero';
 hero.innerHTML=`<img src="art/hero.webp" alt="" fetchpriority="high" width="1536" height="1024"><div class="p-hero-shade"></div><div class="p-hero-copy"><span class="p-eyebrow">FIELD NOTES / 01</span><h1 id="heroTitle">${pText('השטח מחכה.<br>בואו מוכנים.','Out there.<br>Be prepared.')}</h1><p id="heroSub">${pText('ידע שימושי, איורים והדרכות — מהקשר הראשון ועד התכנון של הטיול הבא.','Practical knowledge and illustrated guides, from your first knot to your next outdoor trip.')}</p><button class="btn p-primary" onclick="openBasics()">${pText('מתחילים ב־20 מיומנויות','Start with 20 essentials')} <span aria-hidden="true">↗</span></button></div><div class="p-hero-index"><b>140</b><span>${pText('מדריכים לשטח','FIELD GUIDES')}</span><b>08</b><span>${pText('תחומי ידע','CHAPTERS')}</span></div>`;
 $('searchInput').placeholder=pText('מה לומדים היום? למשל קשר בית, תרמיל או מפה','What will you learn? Try bowline, backpack or map');
 $('searchInput').setAttribute('aria-label',pText('חיפוש בכל המדריכים','Search all guides'));
 const search=$('home').querySelector('.search');search.classList.add('p-search');
 $('visualFeatured').innerHTML=`<div class="p-toolbar"><button onclick="go('checklist')">${pText('רשימת ציוד','Packing list')}</button><button onclick="go('favorites')">${pText('השמורים שלי','Saved guides')} <span>${S.favorites.length}</span></button><button onclick="openMorseTool()">${pText('תרגול מורס','Morse practice')}</button><button class="p-emergency-link" onclick="openEmergency()">${pText('עזרה בחירום','Emergency help')}</button></div><div class="p-section-title"><div><span class="p-eyebrow">${pText('הספרייה שלכם','YOUR FIELD LIBRARY')}</span><h2>${pText('יוצאים ללמוד','Explore the chapters')}</h2></div><span class="p-subtle" id="pOfflineStatus" role="status">${pStatusText()}</span></div>`;
 $('catGrid').className='p-cat-grid';
 $('catGrid').innerHTML=Object.entries(CONTENT).map(([key,c],i)=>`<button class="p-cat" onclick="openCat('${key}')"><div class="p-cat-photo"><img src="${pPhoto(key)}" alt="" loading="lazy" width="1200" height="800"><span class="p-cat-number">0${i+1}</span></div><div class="p-cat-copy"><div><h3>${pEsc(L(c.title))}</h3><p>${pText(...P_TAGS[key])}</p></div><span class="p-cat-count">${c.items.length}<small>${pText('מדריכים','GUIDES')}</small></span></div></button>`).join('');
 let feature=$('pHomeFeature');if(!feature){feature=document.createElement('div');feature.id='pHomeFeature';$('catGrid').after(feature);}
 const last=store.get('sg_last_read'),lastTopic=pItems().find(x=>x.it.id===last);
 feature.innerHTML=`<section class="p-feature"><img src="art/packing.webp" alt="${pText('חתך המחשה של חלוקת ציוד בתרמיל','Illustrative backpack packing cutaway')}" loading="lazy"><div><span class="p-eyebrow">${pText('מבט מקרוב','A CLOSER LOOK')}</span><h2>${pText('לכל דבר<br>יש מקום.','A place<br>for everything.')}</h2><p>${pText('איפה המשקל הכבד? מה צריך להיות בהישג יד? מדריך אריזה עם חלוקה ברורה של התרמיל לאזורים.','Heavy items, quick access and balance. Explore the different zones of a well-packed backpack.')}</p><button class="btn" onclick="openItem('gear','packing')">${pText('למדריך האריזה','Explore packing')}</button></div></section><section class="p-progress-line"><div><strong>${pPractised.length}</strong> ${pText('מדריכים שסימנתם כמתורגלים','guides marked as practised')}<small>${pText('מעקב אישי, ללא הסמכה','Personal tracking, not certification')}</small></div>${lastTopic?`<button class="btn ghost" onclick="openItem('${lastTopic.key}','${last}')">${pText('ממשיכים: ','Continue: ')}${pEsc(L(lastTopic.it.title))}</button>`:`<button class="btn ghost" onclick="openBasics()">${pText('לבחירת התרגול הראשון','Choose your first practice')}</button>`}</section>`;
 const query=$('searchInput').value;if(query)doSearch(query);
};
function pRow(key,it,index){
 const locked=it.kidsLock&&S.age==='kids',fav=S.favorites.includes(it.id);
 return `<article class="p-row"><button class="p-row-main" onclick="openItem('${key}','${it.id}')" ${locked?'aria-disabled="true"':''}><span class="p-row-index">${String(index+1).padStart(2,'0')}</span><span><span class="p-row-meta">${pDifficulty(it)}${locked?' · '+pText('בליווי מבוגר','Adult supervision'):''}${pPractised.includes(it.id)?' · ✓ '+pText('תרגלתי','Practised'):''}</span><h3>${pEsc(L(it.title))}</h3><p>${pEsc(L(it.lead))}</p></span><span class="p-row-arrow" aria-hidden="true">↗</span></button><button class="p-save" data-fav="${it.id}" onclick="toggleFav('${it.id}')" aria-label="${pEsc(pText('שמירת ','Save ')+L(it.title))}" aria-pressed="${fav}">${fav?'★':'☆'}</button></article>`;
}
openCat=function(key){
 if(!CONTENT[key])return;currentCat=key;lastList=key;currentItem=null;pListFilter='';pListDifficulty='all';
 $('listTitle').textContent=L(CONTENT[key].title);$('listSub').textContent=S.lang==='he'?PRO_CATEGORY_INTROS[key]:L(CONTENT[key].sub);$('badgeBar').innerHTML='';
 let banner=$('pCategoryBanner');if(!banner){banner=document.createElement('div');banner.id='pCategoryBanner';$('listTitle').before(banner);}
 banner.className='p-category-banner';banner.innerHTML=`<img src="${pPhoto(key)}" alt=""><span class="p-eyebrow">FIELD NOTES / 0${Object.keys(CONTENT).indexOf(key)+1}</span>`;
 let filter=$('pListTools');if(!filter){filter=document.createElement('div');filter.id='pListTools';$('listItems').before(filter);}
 filter.className='p-list-tools';filter.innerHTML=`<label>${pText('חיפוש בפרק','Search this chapter')}<input type="search" oninput="pListFilter=this.value;pRenderList()" placeholder="${pText('שם או מילה מתוך המדריך','Title or guide keyword')}"></label><label>${pText('רמת תרגול','Practice level')}<select onchange="pListDifficulty=this.value;pRenderList()"><option value="all">${pText('כל הרמות','All levels')}</option><option value="easy">${pText('בסיסי','Essential')}</option><option value="med">${pText('תרגול נוסף','More practice')}</option><option value="hard">${pText('מתקדם','Advanced')}</option></select></label>`;
 pRenderList();go('list');
};
function pHay(it){const g=PRO_GUIDES[it.id];return [L(it.title),P_ALIASES[it.id]||'',L(it.lead),...it.steps.map(s=>L(s.text)),...(S.lang==='he'?[g.why,g.equipment,g.mistake]:[])].join(' ').toLowerCase().normalize('NFKD').replace(/[\u0591-\u05C7]/g,'');}
function pMatches(it,q){return q.toLowerCase().normalize('NFKD').replace(/[\u0591-\u05C7]/g,'').split(/\s+/).filter(Boolean).every(w=>pHay(it).includes(w));}
function pRenderList(){
 const rows=CONTENT[currentCat].items.filter(it=>pMatches(it,pListFilter)&&(pListDifficulty==='all'||it.difficulty===pListDifficulty));
 $('listItems').innerHTML=`<p class="p-subtle" role="status">${rows.length} ${pText('מדריכים','guides')}</p>`+rows.map((it,i)=>pRow(currentCat,it,i)).join('')+(!rows.length?`<p class="p-empty">${pText('לא נמצאה התאמה. נסו מילה אחרת או רמה אחרת.','No match. Try another word or level.')}</p>`:'')+quizCTA(currentCat);
}
doSearch=function(q){
 const active=q.trim().length>0;$('catGrid').hidden=active;$('visualFeatured').hidden=active;if($('pHomeFeature'))$('pHomeFeature').hidden=active;
 $('catGrid').style.display=active?'none':'';
 const rows=active?pItems().filter(({it})=>pMatches(it,q)):[];
 $('searchResults').innerHTML=active?`<div class="p-section-title"><h2>${pText('תוצאות חיפוש','Search results')}</h2><span role="status">${rows.length} ${pText('תוצאות','results')}</span></div>`+rows.map(({key,it},i)=>pRow(key,it,i)).join('')+(!rows.length?`<p class="p-empty">${pText('לא נמצאה התאמה. נסו שם של מיומנות או פריט ציוד.','No match. Try a skill or equipment name.')}</p>`:''):'';
};
toggleFav=function(id){
 if(!pItems().some(x=>x.it.id===id))return;
 S.favorites=S.favorites.includes(id)?S.favorites.filter(x=>x!==id):[...S.favorites,id];saveJSON('sg_fav',S.favorites);
 document.querySelectorAll('[data-fav="'+id+'"]').forEach(b=>{b.setAttribute('aria-pressed',S.favorites.includes(id));b.textContent=S.favorites.includes(id)?'★':'☆';});
 if($('favorites').classList.contains('active'))renderFavorites();
};
renderFavorites=function(){const rows=pItems().filter(({it})=>S.favorites.includes(it.id));$('favItems').innerHTML=rows.map(({key,it},i)=>pRow(key,it,i)).join('')||`<div class="p-empty"><h2>${pText('מקום למדריכים שתחזרו אליהם','Keep useful guides close')}</h2><p>${pText('סמנו כוכב ליד כל מדריך והוא יופיע כאן.','Select the star beside a guide to save it here.')}</p><button class="btn" onclick="go('home')">${pText('לספריית המדריכים','Explore the library')}</button></div>`;};
function pGuideNotes(it){
 const g=PRO_GUIDES[it.id],basic=BASIC_GUIDES[it.id];
 return S.lang==='he'?g:{why:L(it.lead),equipment:basic?L(basic.equipment):pText('','Prepare equipment suited to the activity and the conditions. Read the safety notes before practising.'),mistake:basic?L(basic.mistake):'',check:basic?L(basic.check):'',sources:g.sources};
}
openItem=function(key,id){
 const it=CONTENT[key]?.items.find(x=>x.id===id);if(!it)return;
 if(it.kidsLock&&S.age==='kids'){toast(pText('הנושא מיועד לתרגול בליווי מבוגר. ניתן לשנות מצב גיל בהגדרות.','This topic requires adult supervision. Age mode is in Settings.'));return;}
 pOrigin=document.querySelector('.screen.active')?.id||'home';if(pOrigin==='detail')pOrigin='list';
 currentCat=key;currentItem=id;lastList=key;pStep=0;
 const g=pGuideNotes(it),basic=BASIC_GUIDES[id],isAid=key==='firstaid';
 const warnings=(it.safety||[]).map(s=>L(s));
 $('detailBody').innerHTML=`<div class="p-breadcrumb"><button onclick="go('home')">${pText('בית','Home')}</button><span>/</span><button onclick="openCat('${key}')">${pEsc(L(CONTENT[key].title))}</button></div><header class="p-detail-header"><span class="p-eyebrow">${pText(...P_TAGS[key])}</span><div class="p-title-row"><h1>${pEsc(L(it.title))}</h1><button class="p-save" data-fav="${id}" onclick="toggleFav('${id}')" aria-label="${pText('שמירת המדריך','Save guide')}" aria-pressed="${S.favorites.includes(id)}">${S.favorites.includes(id)?'★':'☆'}</button></div><p class="lead">${pEsc(L(it.lead))}</p><div class="p-detail-meta"><span>${it.steps.length} ${pText('שלבים','steps')}</span><span>${pDifficulty(it)}</span><button onclick="readAloud('${key}','${id}')">◖)) ${pText('הקראה','Listen')}</button><button onclick="pStopSpeech()">${pText('עצירת הקראה','Stop audio')}</button>${id==='compass'?`<button onclick="openCompass()">${pText('מצפן במכשיר','Device compass')}</button>`:''}</div></header>${warnings.length?`<aside class="p-warning"><strong>${isAid?pText('לפני שמסייעים','Before helping'):pText('לפני שמתחילים','Before starting')}</strong><ul>${warnings.map(w=>`<li>${pEsc(w)}</li>`).join('')}</ul>${isAid?`<a class="p-call" href="tel:101">${pText('חירום בישראל · חיוג 101','Israel emergency · Call 101')}</a>`:''}</aside>`:''}<div class="p-detail-layout"><main class="p-guide-main">${id==='packing'?pPacking():''}${S.lang==='he'&&!isAid?`<section class="p-context"><h2>${pText('להבין לפני שעושים','Understand the task')}</h2><p>${pEsc(g.why)}</p></section>`:''}${pReference(it)}<section class="p-step-section"><div class="p-section-title"><h2>${pText('צעד אחר צעד','Step by step')}</h2><span class="p-subtle">${basic?pText('הדרכה מאוירת','Illustrated guide'):pText('מדריך מעשי','Practical guide')}</span></div><div id="pStepFrame"></div></section><details class="p-all-steps" ${isAid?'open':''}><summary>${pText('כל השלבים ברצף','Read all steps')}</summary><ol>${it.steps.map(st=>`<li>${pEsc(L(st.text))}</li>`).join('')}</ol></details>${g.mistake?`<section class="p-note p-mistake"><span>!</span><div><h2>${pText('הטעות שכדאי למנוע','A mistake to avoid')}</h2><p>${pEsc(g.mistake)}</p></div></section>`:''}${g.check?`<section class="p-note p-check"><span>✓</span><div><h2>${pText('בודקים את התוצאה','Check the result')}</h2><p>${pEsc(g.check)}</p></div></section>`:''}<section class="p-practice"><button id="pPractice" class="btn" onclick="pTogglePractice()" aria-pressed="${pPractised.includes(id)}">${pPractised.includes(id)?pText('✓ סימנתי כמתורגל','✓ Marked as practised'):pText('סימון: תרגלתי את המדריך','Mark as practised')}</button><p>${pText('סימון אישי בלבד. קריאת מדריך או סימון תרגול אינם אישור כשירות.','Personal tracking only. Reading or marking practice does not certify competence.')}</p></section>${pSources(it,key)}</main><aside class="p-guide-side"><div class="p-equipment"><span class="p-eyebrow">${pText('מכינים מראש','BEFORE YOU START')}</span><h2>${pText('מה צריך?','What you need')}</h2><p>${pEsc(g.equipment)}</p><button class="btn ghost" onclick="go('checklist')">${pText('פתיחת רשימת ציוד','Open packing list')}</button></div><figure class="p-side-photo"><img src="${FIELD_ILLUSTRATIONS[id]?.cover||pPhoto(key)}" alt="" loading="lazy"><figcaption>${pText('תמונת המחשה · מסלול הפעולה מוסבר בשלבים','Illustrative image · follow the written steps')}</figcaption></figure><div class="p-related"><h2>${pText('ממשיכים מכאן','Explore next')}</h2>${CONTENT[key].items.filter(x=>x.id!==id&&!(x.kidsLock&&S.age==='kids')).slice(0,3).map(x=>`<button onclick="openItem('${key}','${x.id}')">${pEsc(L(x.title))} ↗</button>`).join('')}</div></aside></div>`;
 if(!S.badges.includes(id)){S.badges.push(id);saveJSON('sg_badges',S.badges);}
 store.set('sg_last_read',id);pRenderStep(0);go('detail');
};
function pRenderStep(n){
 const it=CONTENT[currentCat]?.items.find(x=>x.id===currentItem);if(!it||n<0||n>=it.steps.length)return;
 const prior=document.activeElement?.dataset?.stepAction;pStep=n;
 const basic=BASIC_GUIDES[it.id],st=it.steps[n],bs=basic?.steps[n];
 const image=bs?.image;
 const art=image?`<button class="p-step-art" onclick="pZoom('${image}','${it.id}',${n})" aria-label="${pText('הגדלת האיור','Enlarge diagram')}"><img src="${image}" alt="${pEsc(bs?L(bs.title):L(it.title))}"><span>＋ ${pText('הגדלה','Enlarge')}</span></button>`:st.svg?`<div class="p-step-art p-svg">${st.svg}</div>`:'';
 $('pStepFrame').innerHTML=`<article class="p-step-card">${art}<div class="p-step-copy"><span class="p-step-count">${String(n+1).padStart(2,'0')} <span>/ ${String(it.steps.length).padStart(2,'0')}</span></span><div aria-live="polite"><h3>${bs?pEsc(L(bs.title)):pText('שלב '+(n+1),'Step '+(n+1))}</h3><p>${pEsc(bs?L(bs.text):L(st.text))}</p></div></div></article><div class="p-step-controls"><button class="btn ghost" data-step-action="previous" onclick="pRenderStep(${n-1})" ${n===0?'disabled':''}>${pText('הקודם','Previous')}</button><div class="p-step-dots">${it.steps.map((_,i)=>`<button data-step-action="index-${i}" onclick="pRenderStep(${i})" aria-label="${pText('שלב ','Step ')}${i+1}" aria-current="${i===n?'step':'false'}">${i+1}</button>`).join('')}</div><button class="btn" data-step-action="next" onclick="pRenderStep(${n+1})" ${n===it.steps.length-1?'disabled':''}>${pText('הבא','Next')}</button></div>${bs?i3Sequence(it.id):''}`;
 if(prior){const target=$('pStepFrame').querySelector('[data-step-action="'+prior+'"]:not(:disabled)')||$('pStepFrame').querySelector('[aria-current="step"]');target?.focus({preventScroll:true});}
}
function pZoom(src,id,n){
 const d=$('visualZoom');$('visualZoomImage').src=src;$('visualZoomImage').alt=L(BASIC_GUIDES[id].steps[n].title);$('visualZoomTitle').textContent=L(vTopic(id).it.title)+' · '+(n+1);$('visualZoomCredit').textContent=BASIC_GUIDES[id].steps[n].credit;d.showModal();
}
function pTogglePractice(){
 const id=currentItem;pPractised=pPractised.includes(id)?pPractised.filter(x=>x!==id):[...pPractised,id];saveJSON('sg_practised',pPractised);
 basicPractised=pPractised.filter(x=>Object.hasOwn(BASIC_GUIDES,x));saveJSON('sg_basic_practised',basicPractised);
 const b=$('pPractice');b.setAttribute('aria-pressed',pPractised.includes(id));b.textContent=pPractised.includes(id)?pText('✓ סימנתי כמתורגל','✓ Marked as practised'):pText('סימון: תרגלתי את המדריך','Mark as practised');
}
function pSources(it,key){
 const ids=PRO_GUIDES[it.id].sources||[];
 return `<details class="p-sources"><summary>${pText('מקורות והערות למדריך','Sources and guide notes')}</summary><p>${pText('התוכן נערך והורחב ב־21.09.2026. ההרחבות המלאות הן בעברית; בשפות הממשק האחרות חלק מהתוכן מוצג באנגלית.','Edited on 21 September 2026. Full expanded notes are in Hebrew; some interface languages show English guide content.')}</p>${ids.length?`<ul>${ids.map(id=>PRO_SOURCES[id]?`<li><a href="${pEsc(PRO_SOURCES[id].url)}" target="_blank" rel="noopener noreferrer">${pEsc(PRO_SOURCES[id].name)}</a></li>`:'').join('')}</ul>`:''}<p>${key==='firstaid'?pText('המקורות מסייעים לבדיקה, אך הגרסה אינה בעלת אישור קליני. יש להשלים הכשרה מעשית ולפעול לפי מוקד החירום המקומי.','Source review is not clinical certification. Complete practical training and follow local emergency dispatch.'):pText('ההדרכה מבוססת על חומרי הפרויקט והרחבה עריכתית. לפני שימוש טכני נדרש תרגול ובדיקה עם מדריך מוסמך.','Based on the supplied project with editorial expansion. Technical use requires practice and verification with a qualified instructor.')}</p><a href="credits.html">${pText('מקורות ורישיונות לאיורים','Illustration credits and licences')}</a></details>`;
}
function pPacking(){
 return `<section class="p-packing"><img src="art/packing.webp" alt="${pText('חתך תרמיל: ציוד רך בתחתית, ציוד כבד סמוך לגב ופריטים נגישים בחלק העליון','Backpack cutaway: soft items below, heavy items near the back, quick access on top')}"><div><span class="p-eyebrow">${pText('ארבעה אזורי אריזה','FOUR PACKING ZONES')}</span>${[[pText('בתחתית','Bottom'),pText('ציוד קל ונפחי שלא צריך עד המחנה, כגון שק שינה מוגן מרטיבות.','Light bulky gear not needed until camp, such as a protected sleeping bag.')],[pText('בליבה, קרוב לגב','Core, close to your back'),pText('הפריטים הכבדים מרוכזים ומאוזנים. התאימו את הגובה לשטח ולתרמיל.','Keep heavy items centered and balanced. Adjust their height to terrain and pack.')],[pText('מסביב לליבה','Around the core'),pText('ביגוד ופריטים רכים ממלאים חללים ומצמצמים תזוזה.','Soft clothing fills gaps and limits movement.')],[pText('למעלה ובכיסים','Top and pockets'),pText('גשם, עזרה ראשונה, מפה וחטיף — נגישים בלי לפרוק הכול.','Rainwear, first aid, map and snacks stay accessible.')]].map(([a,b],i)=>`<div class="p-zone"><b>${i+1}</b><div><h3>${a}</h3><p>${b}</p></div></div>`).join('')}</div></section>`;
}
openBasics=function(){
 $('basicsBody').innerHTML=`<span class="p-eyebrow">FIELD NOTES / ESSENTIALS</span><h1>${pText('מתחילים מהבסיס','Start with the essentials')}</h1><p class="lead">${pText('20 מיומנויות עם שלבים מאוירים. הכינו ציוד, קראו את דגשי הבטיחות ובחרו דבר אחד לתרגל.','20 skills with illustrated steps. Gather equipment, read the safety notes and choose one skill to practise.')}</p><p class="p-subtle">${basicPractised.length} / 20 ${pText('סומנו כמתורגלים','marked as practised')}</p><div class="p-essentials-grid">${Object.entries(basicGroups).map(([group,title])=>`<section><h2>${pEsc(L(title))}</h2>${Object.entries(BASIC_GUIDES).filter(([,g])=>g.group===group).map(([id],i)=>{const {key,it}=vTopic(id);return pRow(key,it,i);}).join('')}</section>`).join('')}</div>`;go('basics');
};
goBackList=function(){if(pOrigin==='basics')openBasics();else if(pOrigin==='favorites')go('favorites');else if(pOrigin==='home')go('home');else if(currentCat)openCat(currentCat);else go('home');};
function pStopSpeech(){if('speechSynthesis' in window)speechSynthesis.cancel();}
readAloud=function(key,id){
 if(!('speechSynthesis' in window)){toast(pText('הקראה אינה זמינה בדפדפן הזה','Speech is unavailable in this browser'));return;}
 const it=CONTENT[key].items.find(x=>x.id===id),g=pGuideNotes(it);
 const text=[L(it.title),L(it.lead),...(it.safety||[]).map(L),S.lang==='he'?g.why:'',g.equipment,...it.steps.map((x,i)=>(i+1)+'. '+L(x.text)),g.mistake,g.check].filter(Boolean).join('. ');
 speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(text);u.lang=S.lang==='he'?'he-IL':'en-US';u.rate=.92;speechSynthesis.speak(u);
};
openEmergency=function(){
 currentCat=null;currentItem=null;pOrigin='home';
 $('detailBody').innerHTML=`<div class="p-emergency"><span class="p-eyebrow">${pText('במצב חירום','EMERGENCY')}</span><h1>${pText('מזעיקים עזרה.<br>נשארים בטוחים.','Call for help.<br>Stay safe.')}</h1><p class="lead">${pText('המספרים הבאים מיועדים לישראל. במדינה אחרת השתמשו במספרי החירום המקומיים.','These numbers are for Israel. Elsewhere, use your local emergency numbers.')}</p><div class="p-call-grid"><a href="tel:101"><b>101</b>${pText('מד״א · עזרה רפואית','Medical help')}</a><a href="tel:100"><b>100</b>${pText('משטרה','Police')}</a><a href="tel:102"><b>102</b>${pText('כבאות והצלה','Fire and rescue')}</a></div><ol><li>${pText('בדקו שהמקום בטוח עבורכם ועבור הנפגע.','Check the area is safe for you and the casualty.')}</li><li>${pText('מסרו מיקום, מה קרה וכמה אנשים זקוקים לעזרה.','Give your location, what happened and how many need help.')}</li><li>${pText('בדקו תגובה ונשימה ופעלו לפי המוקד ברמקול.','Check response and breathing; follow dispatch on speakerphone.')}</li><li>${pText('אל תנתקו עד שהמוקדן מנחה אתכם.','Stay on the line until dispatch tells you otherwise.')}</li></ol><h2>${pText('פתיחת מדריך מהיר','Open a quick guide')}</h2><div class="p-toolbar">${['cpr','choking','bleeding','heat'].map(id=>`<button onclick="openItem('firstaid','${id}')">${pEsc(L(vTopic(id).it.title))}</button>`).join('')}</div><button class="btn ghost" onclick="openSOS()">${pText('מסך איתות SOS','SOS signal screen')}</button></div>`;go('detail');
};
document.addEventListener('DOMContentLoaded',()=>{
 const nav=document.createElement('nav');nav.className='p-bottom';nav.setAttribute('aria-label',pText('ניווט ראשי','Main navigation'));
 nav.innerHTML=[['home','בית','Home'],['favorites','שמורים','Saved'],['checklist','ציוד','Gear'],['settings','הגדרות','Settings']].map(([id,he,en])=>`<button data-screen="${id}" onclick="go('${id}')">${pText(he,en)}</button>`).join('')+`<button class="p-nav-emergency" onclick="openEmergency()">${pText('חירום','Emergency')}</button>`;document.body.appendChild(nav);
 const skip=document.createElement('a');skip.href='#home';skip.className='p-skip';skip.textContent=pText('דילוג לתוכן','Skip to content');skip.onclick=e=>{e.preventDefault();document.querySelector('.screen.active h1')?.focus();};document.body.prepend(skip);
 pReady=true;renderHome();pRestore();window.addEventListener('popstate',pRestore);
 const gallery=document.createElement('button');gallery.className='btn ghost';gallery.textContent=pText('ספריית האיורים המלאה','Full illustration library');gallery.onclick=openVisualLibrary;$('home').querySelector('.visual-footer')?.prepend(gallery);
 $('home').querySelector('.appnest-badge').textContent=pText('המדריך לצופה · מהדורת שטח 4.0','Scout’s Guide · Field Edition 4.0');
});

function pReference(it){
 if(BASIC_GUIDES[it.id]||currentCat==='firstaid'||it.id==='packing')return '';
 const pics=SCOUT_VISUALS[it.id]||[];
 if(!pics.length)return '';
 return `<details class="p-reference" ${currentCat==='knots'?'open':''}><summary>${pText('לוח עזר חזותי','Visual reference')}</summary><p class="p-subtle">${pText('השוו את המבנה לתיאור. הלוח מציג את המיומנות בשלמותה, ולא בהכרח שלב אחד בלבד.','Compare the structure with the instructions. This reference may show the whole skill rather than a single step.')}</p><div class="p-reference-grid">${pics.map((p,i)=>`<figure><button onclick="pZoomReference('${it.id}',${i})" aria-label="${pText('הגדלת לוח העזר','Enlarge reference')}"><img src="${pEsc(p.src)}" alt="${pEsc(L(p.title)||L(it.title))}" loading="lazy"></button><figcaption>${pEsc(p.credit||'')} · <a href="credits.html">${pText('מקור ורישיון','Source and licence')}</a></figcaption></figure>`).join('')}</div></details>`;
}
function pZoomReference(id,i){const p=SCOUT_VISUALS[id]?.[i];if(!p)return;$('visualZoomImage').src=p.src;$('visualZoomImage').alt=L(p.title)||L(vTopic(id).it.title);$('visualZoomTitle').textContent=L(vTopic(id).it.title);$('visualZoomCredit').textContent=p.credit;$('visualZoom').showModal();}
