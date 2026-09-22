/* Interior illustration system, edition 4. */
for(const id of Object.keys(SCOUT_VISUALS))delete SCOUT_VISUALS[id];
for(const [id,g] of Object.entries(FIELD_ILLUSTRATIONS)){
 const topic=vTopic(id);if(!topic)continue;
 SCOUT_VISUALS[id]=g.images.map((src,n)=>({src,title:g.captions[n]||topic.it.title,credit:g.credit,source:'credits.html#edition4',license:g.license||'credits.html#edition4'}));
 if(BASIC_GUIDES[id]){
  const basic=BASIC_GUIDES[id];basic.cover=g.cover;
  basic.steps.forEach((s,n)=>{s.image=g.images[g.stepMap?.[n]??n]||g.cover;s.credit=g.credit;});
 }
 topic.it.steps.forEach(s=>s.svg='');
}
let i3Zoom=1;
function i3SetZoom(factor){
 i3Zoom=Math.max(1,Math.min(3,factor));const img=$('visualZoomImage');
 img.style.width=(100*i3Zoom)+'%';img.style.maxWidth='none';img.style.maxHeight=i3Zoom===1?'75vh':'none';img.style.objectFit='contain';
 if($('i3ZoomLevel'))$('i3ZoomLevel').textContent=Math.round(i3Zoom*100)+'%';
}
function i3OpenZoom(src,title,credit){
 const img=$('visualZoomImage');img.src=src;img.alt=title;
 $('visualZoomTitle').textContent=title;$('visualZoomCredit').textContent=credit||'';
 i3SetZoom(1);$('visualZoom').showModal();
}
pZoom=function(src,id,n){i3OpenZoom(src,L(vTopic(id).it.title)+' · '+L(BASIC_GUIDES[id].steps[n].title),FIELD_ILLUSTRATIONS[id].credit);};
pZoomReference=function(id,n){const g=FIELD_ILLUSTRATIONS[id];if(!g?.images[n])return;i3OpenZoom(g.images[n],L(g.captions[n]||vTopic(id).it.title),g.credit);};
function i3Image(id,n){
 const g=FIELD_ILLUSTRATIONS[id],title=L(g.captions[n]||vTopic(id).it.title);
 return `<figure class="i3-figure"><button class="i3-image-button" onclick="pZoomReference('${id}',${n})" aria-label="${pEsc(pText('הגדלת האיור: ','Enlarge: ')+title)}"><img src="${pEsc(g.images[n])}" alt="${pEsc(title)}" loading="lazy" decoding="async" width="${g.dimensions[n].width}" height="${g.dimensions[n].height}"><span class="i3-enlarge">＋</span></button><figcaption>${pEsc(title)}</figcaption></figure>`;
}
function i3Sequence(id){
 const g=FIELD_ILLUSTRATIONS[id];if(!g||g.images.length<2)return '';
 return `${g.note?`<p class="p-subtle i3-note">${pEsc(L(g.note))}</p>`:""}<details class="i3-sequence"><summary>${pText('כל האיורים ברצף','View all illustrations')} <span>${g.images.length}</span></summary><div class="i3-sequence-grid">${g.images.map((_,i)=>i3Image(id,i)).join('')}</div></details>`;
}
function i3MorseStrip(){
 return `<div class="i3-morse-strip" dir="ltr" aria-label="SOS: three short, three long, three short"><div><b>S</b><span>● ● ●</span></div><div><b>O</b><span>━ ━ ━</span></div><div><b>S</b><span>● ● ●</span></div></div>`;
}
pReference=function(it){
 const g=FIELD_ILLUSTRATIONS[it.id];if(!g||BASIC_GUIDES[it.id]||it.id==='packing')return '';
 return `<section class="p-reference i3-reference"><div class="p-section-title"><h2>${pText('מבט מקרוב','A closer look')}</h2><span class="p-subtle">${pText('לחצו להגדלה','Tap to enlarge')}</span></div>${g.note?`<p class="p-subtle">${pEsc(L(g.note))}</p>`:''}<div class="i3-reference-grid ${g.images.length===1?'i3-single':''}">${g.images.map((_,n)=>i3Image(it.id,n)).join('')}</div>${it.id==='morse'?i3MorseStrip():''}<p class="i3-credit"><a href="credits.html#edition4">${pText('פרטי האיורים ומקורות','Illustration details and sources')}</a></p></section>`;
};
openVisualLibrary=function(){
 $('visualLibraryBody').innerHTML=`<header class="i3-library-header"><span class="p-eyebrow">${pText('לומדים דרך הפרטים','LEARN THROUGH THE DETAILS')}</span><h1>${pText('הספרייה המאוירת','Illustrated field library')}</h1><p>${pText('קשרים, ציוד ומיומנויות שטח — באיורים מפורטים שאפשר לפתוח, להגדיל וללמוד מהם.','Knots, equipment and outdoor skills. Open a guide or enlarge an illustration.')}</p></header><div class="i3-library-filters"><label>${pText('חיפוש איור','Find an illustration')}<input id="i3ArtSearch" type="search" placeholder="${pText('למשל: אוהל, קשר, מצפן','For example: tent, knot, compass')}" oninput="i3RenderGallery()"></label><label>${pText('תחום','Category')}<select id="i3ArtCategory" onchange="i3RenderGallery()"><option value="">${pText('כל התחומים','All categories')}</option>${Object.entries(CONTENT).filter(([key])=>pItems().some(x=>x.key===key&&FIELD_ILLUSTRATIONS[x.it.id])).map(([key,c])=>`<option value="${key}">${pEsc(L(c.title))}</option>`).join('')}</select></label></div><p class="p-subtle" id="i3ArtCount" aria-live="polite"></p><div id="i3ArtGrid" class="i3-library-grid"></div>`;
 i3RenderGallery();go('visualLibrary');
};
function i3RenderGallery(){
 const q=($('i3ArtSearch')?.value||'').trim().toLocaleLowerCase(),cat=$('i3ArtCategory')?.value||'';
 const items=pItems().filter(({key,it})=>FIELD_ILLUSTRATIONS[it.id]&&(!cat||key===cat)&&!(it.kidsLock&&S.age==='kids')&&(!q||[L(it.title),it.title.en,it.title.he,L(it.lead),L(CONTENT[key].title),P_ALIASES[it.id]||'',...FIELD_ILLUSTRATIONS[it.id].captions.flatMap(c=>[c.he,c.en]),it.id==='weather'?'עננים ענן clouds':''].join(' ').toLocaleLowerCase().includes(q)));
 $('i3ArtCount').textContent=items.length+' '+pText('מדריכים מאוירים','illustrated guides');
 $('i3ArtGrid').innerHTML=items.map(({key,it})=>{const g=FIELD_ILLUSTRATIONS[it.id];return `<article class="i3-library-card"><button class="i3-library-cover" onclick="pZoomReference('${it.id}',${g.coverIndex||0})" aria-label="${pEsc(pText('הגדלת איור: ','Enlarge: ')+L(it.title))}"><img src="${pEsc(g.cover)}" alt="${pEsc(L(it.title))}" loading="lazy" decoding="async"><span>＋</span></button><div class="i3-library-copy"><small>${pEsc(L(CONTENT[key].title))} · ${g.images.length} ${g.images.length===1?pText('איור','illustration'):pText('איורים','illustrations')}</small><h2><button onclick="openItem('${key}','${it.id}')">${pEsc(L(it.title))}</button></h2><button class="i3-guide-link" onclick="openItem('${key}','${it.id}')">${pText('למדריך המלא','Open guide')} ↗</button></div></article>`;}).join('')||`<p>${pText('לא נמצאו איורים בחיפוש הזה.','No matching illustrations.')}</p>`;
}
document.addEventListener('DOMContentLoaded',()=>{
 const img=$('visualZoomImage'),dialog=$('visualZoom');if(!img||!dialog)return;
 const stage=document.createElement('div');stage.className='i3-zoom-stage';img.before(stage);stage.appendChild(img);
 const bar=document.createElement('div');bar.className='i3-zoom-toolbar';
 bar.innerHTML=`<button onclick="i3SetZoom(i3Zoom-.5)" aria-label="${pText('הקטנה','Zoom out')}">−</button><span id="i3ZoomLevel">100%</span><button onclick="i3SetZoom(i3Zoom+.5)" aria-label="${pText('הגדלה','Zoom in')}">＋</button><button onclick="i3SetZoom(1)">${pText('התאמה למסך','Fit image')}</button>`;
 stage.before(bar);
});
const i3Sheepshank=vTopic('sheepshank').it;
i3Sheepshank.safety.unshift(FIELD_ILLUSTRATIONS.sheepshank.note);
i3Sheepshank.lead={he:'דגם קשר היסטורי להיכרות בלבד, שאינו מומלץ לקיצור חבל בשימוש מעשי.',en:'A historical knot for study only, not recommended for practical rope shortening.'};
