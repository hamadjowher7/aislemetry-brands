(function(root){
 'use strict';
 const cases={
  count:{image:'assets/ai-shelf.jpg',alt:'Three-shelf category view with green Verde Daily bottles among competing products.',finding:'26 stores need a range review.',summary:'Find missing priority SKUs by store, with evidence ready for your field team.',affected:26,metrics:[['240','Audits reviewed'],['26','Stores flagged'],['214','No range exception']],issue:'Priority variant not visible',fact:'15 Verde Daily facings visible',detail:'Daily 500 ml is visible in the representative photo. The priority Repair variant is not visible in this category view.',action:'Ask the territory team to check the missing Repair variant and confirm the agreed range with the outlet.',boundary:'Visible facings are counted against catalog references. A product not visible is not proof of zero store stock; uncertain identities need review.',boxes:[[30.5,1,35,26,'Daily · 5 facings'],[2,34,37,25,'Daily · 5 facings'],[23,65,34,27,'Daily · 5 facings']],standard:'Catalog scope: Daily + Repair / 500 ml'},
  share:{image:'assets/ai-share.jpg',alt:'Wide category shelf showing a smaller block of Verde products alongside other brands.',finding:'32 stores are below the display target.',summary:'Find the stores where your brand’s visible facing share falls below target.',affected:32,metrics:[['240','Audits reviewed'],['32','Below target'],['45%','Agreed target']],issue:'Facing share below target',fact:'30% share of visible facings',detail:'The representative view has 9 Verde facings out of 30 category facings (30%), against an illustrative 45% target.',action:'Review the category display with the outlet and agree a facing allocation that meets the brand brief.',boundary:'Share here means visible facing count, within the same category. Physical shelf dimensions require a scale reference; hidden inventory is excluded.',boxes:[[6,2,26,27,'Your brand'],[6,35,26,26,'Your brand'],[6,66,26,27,'Your brand'],[34,35,62,26,'Other brands','neutral']],standard:'Measure: brand facings ÷ category facings'},
  planogram:{image:'assets/ai-planogram.jpg',alt:'Two shelf rows with a clear placement gap between green Verde products and other brands.',finding:'41 stores need a layout correction.',summary:'See which stores have placement and facing gaps against your supplied planogram.',affected:41,metrics:[['240','Audits reviewed'],['41','Layout exceptions'],['199','No layout exception']],issue:'Lower-shelf placement gap',fact:'A gap interrupts the agreed brand block',detail:'The example brief calls for an uninterrupted Verde block on the lower shelf. The marked slot is empty in this photograph.',action:'Ask the merchandising team to restore the agreed lower-shelf placement and capture a follow-up photo.',boundary:'Adherence is checked against the supplied layout and facing requirements. Occluded or incomplete shelf views are flagged for review.',boxes:[[32,47,33,38,'Placement gap','warning'],[1,48,30,36,'Existing brand block']],standard:'Reference brief: continuous lower-shelf block'},
  pricing:{image:'assets/ai-pricing.jpg',alt:'Close-up of a Verde price label and a Save 10% offer sign.',finding:'18 stores need a pricing or offer review.',summary:'Find unreadable price labels and offers that differ from your campaign brief.',affected:18,metrics:[['12','Unreadable displays'],['6','Offer mismatches'],['18','Stores flagged']],issue:'Offer differs from the brief',fact:'“Save 10%” displayed · brief specifies 15%',detail:'The representative photo shows a Save 10% sign. The illustrative campaign brief specifies 15%. A visible Verde price label reads £3.50.',action:'Ask the campaign owner to confirm the current offer and replace the outdated sign if the 15% brief applies.',boundary:'Compare readable displayed text with your approved price and offer brief. Displayed prices do not establish checkout prices; unreadable labels need review.',boxes:[[61,6,34,89,'Displayed · Save 10%','warning'],[13,57,41,33,'Price · £3.50']],standard:'Reference brief: approved campaign offer / 15%'},
  campaign:{image:'assets/ai-campaign.jpg',alt:'Verde promotional endcap in a store aisle with a blank lower campaign fascia.',finding:'29 stores need campaign follow-up.',summary:'See where required campaign materials are missing or incorrectly positioned.',affected:29,metrics:[['240','Audits reviewed'],['29','Campaign exceptions'],['211','No campaign exception']],issue:'Campaign fascia missing',fact:'Required campaign message not visible',detail:'The example brief requires the approved campaign message on the endcap fascia. The lower panel is blank in this photograph.',action:'Ask the promoter or agency partner to install the approved campaign fascia and submit a clear completion photo.',boundary:'Campaign checks use your agreed materials and placement rules. A missing element in this view does not establish absence elsewhere in the store.',boxes:[[32,73,34,17,'Campaign message missing','warning'],[33,2,36,19,'Brand header present']],standard:'Reference brief: approved endcap campaign fascia'}
 };
 const stores=[{name:'Store 014',city:'Bengaluru',owner:'South territory team'},{name:'Store 087',city:'Hyderabad',owner:'Agency merchandising team'},{name:'Store 163',city:'Chennai',owner:'Regional field team'}];
 function photoForStore(key,index){const c=cases[key];if(!c||!Number.isInteger(index)||index<0||index>=stores.length)throw new Error('Unknown AI example or store');return index===0?c.image:c.image.replace('.jpg',index===1?'-hyderabad.jpg':'-chennai.jpg');}
 function evidenceForStore(key,index){
  const image=photoForStore(key,index),c=cases[key];
  const countBoxes=index===1?[[32,3,37,26,'Daily · 6 facings'],[9,37,30,25,'Daily · 5 facings'],[26,68,31,25,'Daily · 5 facings']]:[[32,3,31,26,'Daily · 5 facings'],[5,35,42,26,'Daily · 6 facings'],[25,67,32,25,'Daily · 5 facings']];
  return {image,alt:stores[index].city+' store example: '+c.alt,fact:key==='count'&&index>0?'16 Verde Daily facings visible':c.fact,boxes:key==='count'&&index>0?countBoxes:c.boxes};
 }
 function createPhotoPresenter({load,commit,setBusy,showError}){
  let version=0;
  return async(evidence,context)=>{
   const request=++version;setBusy(true);
   try{const photo=await load(evidence.image);if(request!==version)return false;commit(photo,evidence,context);setBusy(false);return true;}
   catch(error){if(request!==version)return false;setBusy(false);showError(error);return false;}
  };
 }
 if(typeof module==='object'&&module.exports){module.exports={cases,stores,photoForStore,evidenceForStore,createPhotoPresenter};return;}
 const doc=root.document;if(!doc)return;
 const tabs=[...doc.querySelectorAll('[data-ai]')],panel=doc.getElementById('ai-panel'),overlay=doc.getElementById('ai-photo-overlay'),toggle=doc.getElementById('ai-photo-toggle');
 let active='count',selected=0,analysis=true;
 const set=(id,value)=>{doc.getElementById(id).textContent=value;};
 function renderOverlay(c,boxes){
  overlay.replaceChildren(...boxes.map(([x,y,w,h,label,tone])=>{const box=doc.createElement('div'),tag=doc.createElement('span');box.className='ai-box '+(tone||'');Object.assign(box.style,{left:x+'%',top:y+'%',width:w+'%',height:h+'%'});tag.textContent=label;box.append(tag);return box;}));
  const brief=doc.createElement('div');brief.className='ai-reference';brief.textContent=c.standard;overlay.append(brief);
 }
 const photoCache=new Map(),photoFrame=doc.querySelector('.ai-photo'),photoStatus=doc.getElementById('ai-photo-status'),enlarge=doc.getElementById('ai-enlarge');
 function loadPhoto(src,priority='high'){
  if(photoCache.has(src)){const cached=photoCache.get(src);if(priority==='high')cached.image.fetchPriority='high';return cached.ready;}
  const image=new root.Image();image.fetchPriority=priority;image.decoding='async';
  const ready=new Promise((resolve,reject)=>{image.onload=async()=>{try{if(image.decode)await image.decode();resolve(image);}catch(error){reject(error);}};image.onerror=()=>reject(new Error('Unable to load evidence photo.'));});
  photoCache.set(src,{image,ready});ready.catch(()=>photoCache.delete(src));image.src=src;return ready;
 }
 const presentPhoto=createPhotoPresenter({
  load:src=>loadPhoto(src),
  setBusy:busy=>{photoFrame.setAttribute('aria-busy',String(busy));enlarge.disabled=busy;photoStatus.hidden=!busy;if(busy)photoStatus.textContent='Loading photo…';},
  showError:()=>{photoStatus.hidden=false;photoStatus.textContent='Photo unavailable. Select the store again to retry.';enlarge.disabled=true;},
  commit:(photo,evidence,{c,s})=>{
   photo.id='ai-evidence-image';photo.alt=evidence.alt;photo.width=1536;photo.height=1024;
   doc.getElementById('ai-evidence-image').replaceWith(photo);
   renderOverlay(c,evidence.boxes);
   set('ai-store-title',s.name+' · '+s.city);set('ai-store-detail',c.detail);set('ai-photo-fact',evidence.fact);set('ai-next-action',c.action+' Owner: '+s.owner+'.');
  }
 });
 function renderStore(){
  const c=cases[active],s=stores[selected],evidence=evidenceForStore(active,selected);
  doc.getElementById('ai-finding-details').open=false;
  [...doc.querySelectorAll('[data-ai-store]')].forEach((b,i)=>b.setAttribute('aria-pressed',String(i===selected)));
  presentPhoto(evidence,{c,s});
 }
 // Warm the selected capability on intent; preload the remaining examples only
 // when the section approaches the viewport, with at most two background loads.
 function warmCapability(key){stores.forEach((_,i)=>{loadPhoto(photoForStore(key,i),'low').catch(()=>{});});}
 tabs.forEach(b=>{b.addEventListener('pointerenter',()=>warmCapability(b.dataset.ai));b.addEventListener('focus',()=>warmCapability(b.dataset.ai));});
 function warmExamples(){
  const queue=Object.keys(cases).flatMap(key=>stores.map((_,i)=>photoForStore(key,i)));
  async function worker(){while(queue.length){const src=queue.shift();try{await loadPhoto(src,'low');}catch{}}}
  worker();worker();
 }
 if(root.IntersectionObserver){const observer=new root.IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();warmExamples();}},{rootMargin:'300px'});observer.observe(doc.getElementById('aislemetry-ai'));}
 function render(key,focus=false){
  active=key;selected=0;const c=cases[key];
  tabs.forEach(b=>{const on=b.dataset.ai===key;b.setAttribute('aria-selected',String(on));b.tabIndex=on?0:-1;});panel.setAttribute('aria-labelledby','ai-tab-'+key);
  set('ai-finding',c.finding);set('ai-summary',c.summary);set('ai-affected',String(c.affected));set('ai-boundary',c.boundary);
  const metrics=doc.getElementById('ai-metrics');metrics.replaceChildren(...c.metrics.map(([value,label])=>{const div=doc.createElement('div'),strong=doc.createElement('strong'),span=doc.createElement('span');strong.textContent=value;span.textContent=label;div.append(strong,span);return div;}));
  const list=doc.getElementById('ai-stores');list.replaceChildren(...stores.map((s,i)=>{const b=doc.createElement('button');b.type='button';b.dataset.aiStore=i;b.setAttribute('aria-pressed',String(i===selected));const heading=doc.createElement('strong'),city=doc.createElement('small'),issue=doc.createElement('span'),arrow=doc.createElement('i');heading.textContent=s.name;city.textContent=s.city;issue.textContent=c.issue;arrow.textContent='↗';const id=doc.createElement('div');id.append(heading,city);b.append(id,issue,arrow);b.addEventListener('click',()=>{selected=i;renderStore();});return b;}));
  renderStore();if(focus)tabs.find(b=>b.dataset.ai===key).focus();
 }
 tabs.forEach((b,i)=>{b.addEventListener('click',()=>render(b.dataset.ai));b.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(e.key))return;e.preventDefault();const n=e.key==='Home'?0:e.key==='End'?tabs.length-1:(i+(['ArrowLeft','ArrowUp'].includes(e.key)?-1:1)+tabs.length)%tabs.length;render(tabs[n].dataset.ai,true);});});
 toggle.addEventListener('click',()=>{analysis=!analysis;overlay.hidden=!analysis;toggle.setAttribute('aria-pressed',String(analysis));toggle.textContent=analysis?'AI analysis on':'Show AI analysis';});
 const dialog=doc.getElementById('ai-image-dialog');
 doc.getElementById('ai-enlarge').addEventListener('click',()=>{const photo=doc.getElementById('ai-dialog-photo'),evidence=evidenceForStore(active,selected);photo.src=evidence.image;photo.alt=evidence.alt;set('ai-dialog-title',stores[selected].name+' · '+evidence.fact);dialog.showModal();});
 doc.getElementById('ai-close-image').addEventListener('click',()=>dialog.close());
 dialog.addEventListener('click',e=>{if(e.target===dialog){const rect=dialog.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)dialog.close();}});
 render('count');
})(typeof window!=='undefined'?window:globalThis);
