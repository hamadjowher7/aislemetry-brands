(function(root){
  'use strict';
  const pct=(n,d)=>Math.round(n/d*100);
  const examples={
    availability:{question:'Where are priority SKUs missing from the shelf?',context:'Give the field team exact model references, consistent availability responses and clear photo requirements.',evidence:['Exact-model confirmation','Product and shelf photographs','Not visible / unreadable exceptions'],title:'Know where the range needs attention.',kpis:[[`${pct(40,48)}%`,'Visible availability'],['48','Outlets reviewed'],['8','Need follow-up']],chartTitle:'Priority SKU availability by city',unit:'% of reviewed outlets',rows:[['Bengaluru',pct(14,16)],['Hyderabad',pct(12,16)],['Chennai',pct(14,16)]],actionTitle:'Focus the next visit.',action:'Open the outlets with a priority SKU not visible, review the image and assign a follow-up to your team.',boundary:'Visible availability describes the display observation. It does not establish total store inventory or sales.'},
    visibility:{question:'How does our display presence compare by store format?',context:'Use the same category boundary to count your brand’s visible facings and the total category display.',evidence:['Brand and category facing counts','A full category display photograph','Store format and exact product scope'],title:'See where your brand has room to grow.',kpis:[[`${pct(480,1500)}%`,'Share of visible display'],['10','Brand facings / outlet'],['48','Outlets reviewed']],chartTitle:'Brand display share by outlet format',unit:'Brand facings / all category facings',rows:[['Modern trade',pct(270,750)],['Independent',pct(210,750)],['All outlets',pct(480,1500)]],actionTitle:'Make visibility actionable.',action:'Compare like-for-like display presence, then review the outlets where agreed placement or priority facings need attention.',boundary:'Compare within the same product category. Display share is based on visible facings, not hidden stock or market sales share.'},
    execution:{question:'Is our intended store execution showing up in the aisle?',context:'Define the display, branding, promotion and price-communication checks that matter to this campaign.',evidence:['Agreed display and campaign checklist','Readable branding and price evidence','Store-level exceptions and review notes'],title:'Bring the execution gaps into focus.',kpis:[[`${pct(36,48)}%`,'Execution standard met'],['48','Outlets reviewed'],['12','Need follow-up']],chartTitle:'Execution checks across reviewed outlets',unit:'% meeting each check',rows:[['Brand identity',pct(42,48)],['Promo material',pct(36,48)],['Price labels',pct(39,48)]],actionTitle:'Give each issue a clear next step.',action:'Share an outlet-level exception list with the relevant territory, promoter or agency team, with the supporting evidence in view.',boundary:'Assess only the standards agreed for the audit. Execution observations alone do not establish the cause of a sales result.'}
  };
  function googleBookingUrl(value,embed=false){
    if(!value)return '';
    try{const url=new URL(value);if(url.protocol!=='https:'||url.username||url.password||url.port)return '';const allowed=embed?url.hostname==='calendar.google.com'&&url.pathname.includes('/appointments/'):['calendar.google.com','calendar.app.google'].includes(url.hostname);return allowed?url.href:'';}catch{return '';}
  }
  function bookingState(config={}){
    const email=String(config.bookingEmail||'').trim();if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))throw new Error('A valid booking contact is required.');
    const calendar=googleBookingUrl(config.calendarBookingUrl),embed=googleBookingUrl(config.calendarEmbedUrl,true);
    if(config.calendarBookingUrl&&!calendar)throw new Error('Use a public Google Calendar appointment-booking URL.');
    if(config.calendarEmbedUrl&&!embed)throw new Error('Use the Google Calendar inline appointment-booking embed URL.');
    const subject='Aislemetry — book a call',body='Hi,\n\nI’d like to discuss Aislemetry for our brand.\n\nBrand / organisation:\nRetail question we want to answer:\nCurrent field team / agency setup:\n\nPlease suggest a time to talk.\n\nThank you';
    return {email,calendar:calendar||embed,embed,mailto:`mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`};
  }
  if(typeof module==='object'&&module.exports){module.exports={examples,bookingState,googleBookingUrl};return;}
  if(!root.document)return;
  const doc=root.document;
  doc.documentElement.classList.add('js');
  const nav=doc.querySelector('.nav-wrap'),toggle=doc.querySelector('.nav-toggle'),links=doc.querySelector('#main-navigation');
  function closeMenu(){nav.classList.remove('menu-open');toggle.setAttribute('aria-expanded','false');toggle.setAttribute('aria-label','Open navigation');}
  toggle.addEventListener('click',()=>{const open=!nav.classList.contains('menu-open');nav.classList.toggle('menu-open',open);toggle.setAttribute('aria-expanded',String(open));toggle.setAttribute('aria-label',open?'Close navigation':'Open navigation');});
  links.addEventListener('click',event=>{if(event.target.closest('a'))closeMenu();});
  doc.addEventListener('keydown',event=>{if(event.key==='Escape'&&nav.classList.contains('menu-open')){closeMenu();toggle.focus();}});
  doc.addEventListener('click',event=>{if(!nav.contains(event.target))closeMenu();});
  root.matchMedia('(min-width:701px)').addEventListener('change',event=>{if(event.matches)closeMenu();});
  const buttons=[...doc.querySelectorAll('[data-insight]')];
  function selectExample(key,focus=false){
    const example=examples[key];if(!example)return;
    buttons.forEach(button=>{const current=button.dataset.insight===key;button.setAttribute('aria-selected',String(current));button.tabIndex=current?0:-1;});
    doc.querySelector('#insight-panel').setAttribute('aria-labelledby','tab-'+key);
    const labels={'example-question':example.question,'example-context':example.context,'example-report-title':example.title,'example-chart-title':example.chartTitle,'example-chart-unit':example.unit,'example-action-title':example.actionTitle,'example-action':example.action,'example-boundary':example.boundary};
    Object.entries(labels).forEach(([id,value])=>{doc.getElementById(id).textContent=value;});
    const evidence=doc.getElementById('example-evidence');evidence.replaceChildren(...example.evidence.map(value=>{const li=doc.createElement('li');li.textContent=value;return li;}));
    const kpis=doc.getElementById('example-kpis');kpis.replaceChildren(...example.kpis.map(([value,label])=>{const item=doc.createElement('div'),strong=doc.createElement('strong'),span=doc.createElement('span');strong.textContent=value;span.textContent=label;item.append(strong,span);return item;}));
    const chart=doc.getElementById('example-chart');chart.replaceChildren(...example.rows.map(([label,value])=>{const row=doc.createElement('div'),name=doc.createElement('span'),track=doc.createElement('b'),bar=doc.createElement('i'),number=doc.createElement('strong');name.textContent=label;bar.style.width=value+'%';number.textContent=value+'%';track.append(bar);row.append(name,track,number);return row;}));chart.setAttribute('aria-label','Illustrative '+example.chartTitle+': '+example.rows.map(([label,value])=>label+' '+value+'%').join(', '));
    if(focus)buttons.find(button=>button.dataset.insight===key)?.focus();
  }
  buttons.forEach(button=>{button.addEventListener('click',()=>selectExample(button.dataset.insight));button.addEventListener('keydown',event=>{if(!['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Home','End'].includes(event.key))return;event.preventDefault();const index=buttons.indexOf(button),next=event.key==='Home'?0:event.key==='End'?buttons.length-1:(index+(['ArrowLeft','ArrowUp'].includes(event.key)?-1:1)+buttons.length)%buttons.length;selectExample(buttons[next].dataset.insight,true);});});
  const booking=bookingState(root.AISLEMETRY_WEBSITE);
  doc.querySelectorAll('[data-booking-link]').forEach(link=>{link.href=booking.calendar||booking.mailto;if(booking.calendar){link.target='_blank';link.rel='noopener noreferrer';}});
  const primary=doc.querySelector('#booking-primary');primary.firstChild.textContent=booking.calendar?'Book a call ':'Arrange a call by email ';
  doc.getElementById('booking-email').href=booking.mailto;
  doc.getElementById('copyright-year').textContent=String(new Date().getFullYear());
})(typeof window!=='undefined'?window:globalThis);
