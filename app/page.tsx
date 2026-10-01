'use client';

import {useEffect,useMemo,useRef,useState} from 'react';
import {ArrowDown,ArrowUpRight,BookOpen,ChevronLeft,ChevronRight,Download,Globe2,Instagram,Mail,Maximize2,Menu,Moon,Share2,Sun,X,ZoomIn,ZoomOut} from 'lucide-react';

type Lang='ar'|'en';
type Theme='dark'|'light';

const ISSUE={
  titleAr:'أمان',titleEn:'AMAN',issueAr:'العدد 0',issueEn:'Issue 0',year:'2026',
  cover:'/magazines/aman-issue-0/cover.webp',pdf:'/magazines/aman-issue-0/aman-issue-0.pdf',pages:23,
};

const toc=[
  {page:5,ar:'زايد... مهندس الدولة المؤسسية',en:'Zayed — Architect of the Institutional State'},
  {page:8,ar:'هندسة الأمن في «دبي الخمسين»',en:'Security Engineering in “Dubai 50”'},
  {page:10,ar:'الحس الأمني: قراءة الجريمة قبل وقوعها',en:'Security Sense: Reading Crime Before It Happens'},
  {page:12,ar:'الكفاءات التي لا تعوض',en:'The Irreplaceable Competencies'},
  {page:14,ar:'الذكاء الاصطناعي والتحولات الحديثة',en:'AI and Modern Transformations'},
  {page:18,ar:'القانون ببساطة',en:'Law, Simply Explained'},
];

const copy={
  ar:{
    nav:['الرئيسية','العدد الحالي','الأعداد السابقة','أبواب المجلة','الإعلان معنا','تواصل معنا'],
    latest:'أحدث إصدار',heroTitle:'مجلة أمان',heroText:'مجلة شهرية قانونية، إدارية، أمنية، مجتمعية وثقافية. معرفة تعزز الوعي وتجمع الخبرة بالمستقبل.',
    read:'اقرأ العدد',download:'تحميل PDF',archive:'استكشف الأعداد',scroll:'اكتشف المجلة',
    currentTag:'العدد الحالي',currentTitle:'مساحة معرفية مهنية بروح إماراتية',currentText:'هذا الإصدار يجمع موضوعات في القيادة، القانون، الأمن، الإدارة، الذكاء الاصطناعي وقصص النجاح في تجربة تحريرية حديثة.',
    pages:'صفحة',monthly:'مجلة شهرية',categories:'قانون · إدارة · أمن · مجتمع · ثقافة',
    sectionsTag:'أبواب العدد',sectionsTitle:'انتقل مباشرة إلى الموضوع الذي يهمك',
    archiveTag:'أرشيف المجلة',archiveTitle:'كل عدد يبقى جزءاً من الذاكرة',archiveText:'عند نشر إصدار جديد، ينتقل الإصدار السابق تلقائياً إلى هنا ليظل متاحاً للقراءة والتحميل.',
    advertiseTag:'الإعلان والشراكات',advertiseTitle:'ضع علامتك داخل تجربة تحريرية مميزة',advertiseText:'فرص للإعلانات، الرعاية، الشراكات والمحتوى المؤسسي. تواصل معنا للحصول على الباقة الإعلامية.',advertise:'اطلب الباقة الإعلامية',
    contactTag:'تواصل معنا',contactTitle:'لديك فكرة أو مشاركة أو إعلان؟',contactText:'نسعد باستقبال المساهمات والشراكات والاستفسارات.',
    footer:'منصة معرفية تصنع الوعي وتوثق الخبرة.',rights:'جميع الحقوق محفوظة.',language:'تغيير اللغة',theme:'تغيير السمة',
    reader:'قارئ المجلة',contents:'المحتويات',close:'إغلاق',fullscreen:'ملء الشاشة',thumbs:'الصفحات',share:'مشاركة',zoom:'تكبير',
    prev:'السابق',next:'التالي',openIssue:'فتح العدد',coming:'إصدار جديد قريباً',
  },
  en:{
    nav:['Home','Current Issue','Archive','Sections','Advertise','Contact'],
    latest:'LATEST ISSUE',heroTitle:'AMAN Magazine',heroText:'A monthly professional publication spanning law, administration, security, society and culture — knowledge that strengthens awareness.',
    read:'Read Issue',download:'Download PDF',archive:'Browse Archive',scroll:'Discover the magazine',
    currentTag:'CURRENT ISSUE',currentTitle:'A professional knowledge platform with an Emirati identity',currentText:'This issue brings together leadership, law, security, management, artificial intelligence and success stories in a modern editorial experience.',
    pages:'Pages',monthly:'Monthly magazine',categories:'Law · Management · Security · Society · Culture',
    sectionsTag:'INSIDE THIS ISSUE',sectionsTitle:'Jump directly to what matters to you',
    archiveTag:'MAGAZINE ARCHIVE',archiveTitle:'Every issue becomes part of the record',archiveText:'When a new issue is published, the previous one moves here automatically and remains available to read and download.',
    advertiseTag:'ADVERTISING & PARTNERSHIPS',advertiseTitle:'Put your brand inside a premium editorial experience',advertiseText:'Advertising, sponsorship, partnerships and institutional content opportunities. Contact us for the media kit.',advertise:'Request Media Kit',
    contactTag:'CONTACT',contactTitle:'Have a story, contribution or advertising enquiry?',contactText:'We welcome editorial contributions, partnerships and enquiries.',
    footer:'A knowledge platform that builds awareness and documents experience.',rights:'All rights reserved.',language:'Switch language',theme:'Toggle theme',
    reader:'Magazine reader',contents:'Contents',close:'Close',fullscreen:'Fullscreen',thumbs:'Pages',share:'Share',zoom:'Zoom',
    prev:'Previous',next:'Next',openIssue:'Open issue',coming:'New issue coming soon',
  }
};

function PdfPage({pdf,page,zoom=1}:{pdf:any,page:number,zoom?:number}){
  const ref=useRef<HTMLCanvasElement|null>(null);
  useEffect(()=>{
    let cancelled=false;
    if(!pdf||!ref.current||page<1||page>ISSUE.pages)return;
    (async()=>{
      const pg=await pdf.getPage(page);if(cancelled)return;
      const viewport=pg.getViewport({scale:1.15*zoom});
      const canvas=ref.current!;const ctx=canvas.getContext('2d');if(!ctx)return;
      canvas.width=Math.floor(viewport.width);canvas.height=Math.floor(viewport.height);
      await pg.render({canvasContext:ctx,viewport}).promise;
    })();
    return()=>{cancelled=true};
  },[pdf,page,zoom]);
  return <canvas ref={ref} className="pdf-canvas" aria-label={'Page '+page}/>;
}

function MagazineReader({lang,onClose}:{lang:Lang,onClose:()=>void}){
  const t=copy[lang];
  const [pdf,setPdf]=useState<any>(null);
  const [page,setPage]=useState(1);
  const [zoom,setZoom]=useState(1);
  const [drawer,setDrawer]=useState<'toc'|'thumbs'|null>(null);
  const [flip,setFlip]=useState<'next'|'prev'|null>(null);
  const [error,setError]=useState('');
  const shell=useRef<HTMLDivElement|null>(null);
  const rtl=lang==='ar';
  const mobile=typeof window!=='undefined'&&window.innerWidth<820;
  const step=mobile?1:2;

  useEffect(()=>{
    document.body.style.overflow='hidden';
    const load=()=>{
      const lib=(window as any).pdfjsLib;
      if(!lib)return;
      lib.GlobalWorkerOptions.workerSrc='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
      lib.getDocument(ISSUE.pdf).promise.then((doc:any)=>setPdf(doc)).catch(()=>setError(lang==='ar'?'تعذر تحميل ملف المجلة. تأكد من رفع ملف PDF.':'Could not load the magazine PDF. Please confirm the PDF is uploaded.'));
    };
    if((window as any).pdfjsLib){load();return()=>{document.body.style.overflow=''}}
    const s=document.createElement('script');s.src='https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';s.async=true;s.onload=load;s.onerror=()=>setError('PDF reader library failed to load.');document.head.appendChild(s);
    return()=>{document.body.style.overflow=''};
  },[lang]);

  function animate(dir:'next'|'prev',target:number){if(target<1||target>ISSUE.pages)return;setFlip(dir);window.setTimeout(()=>{setPage(target);setFlip(null)},310)}
  function goNext(){animate('next',Math.min(ISSUE.pages,page+step))}
  function goPrev(){animate('prev',Math.max(1,page-step))}

  useEffect(()=>{
    const key=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose();if(e.key==='ArrowRight')rtl?goPrev():goNext();if(e.key==='ArrowLeft')rtl?goNext():goPrev();};
    window.addEventListener('keydown',key);return()=>window.removeEventListener('keydown',key);
  });

  async function full(){try{if(!document.fullscreenElement)await shell.current?.requestFullscreen();else await document.exitFullscreen()}catch{}}
  async function share(){try{if(navigator.share)await navigator.share({title:'AMAN Magazine',url:window.location.href});else await navigator.clipboard.writeText(window.location.href)}catch{}}
  function jump(p:number){setPage(Math.max(1,Math.min(ISSUE.pages,p)));setDrawer(null)}

  return <div className="reader-overlay" ref={shell} role="dialog" aria-modal="true" aria-label={t.reader}>
    <header className="reader-toolbar">
      <div className="reader-title"><img src="/logo-emblem.png" alt=""/><span><b>{t.reader}</b><small>{ISSUE.issueAr} · {ISSUE.year}</small></span></div>
      <div className="reader-actions">
        <button onClick={()=>setDrawer(drawer==='toc'?null:'toc')}><BookOpen size={18}/><span>{t.contents}</span></button>
        <button onClick={()=>setDrawer(drawer==='thumbs'?null:'thumbs')}><Thumbnails size={18}/><span>{t.thumbs}</span></button>
        <button onClick={()=>setZoom(v=>Math.min(1.5,v+.15))} title={t.zoom}><ZoomIn size={18}/></button>
        <button onClick={()=>setZoom(v=>Math.max(.75,v-.15))} title={t.zoom}><ZoomOut size={18}/></button>
        <button onClick={share} title={t.share}><Share2 size={18}/></button>
        <a href={ISSUE.pdf} download title={t.download}><Download size={18}/></a>
        <button onClick={full} title={t.fullscreen}><Maximize2 size={18}/></button>
        <button className="reader-close" onClick={onClose} title={t.close}><X size={20}/></button>
      </div>
    </header>

    {drawer&&<aside className="reader-drawer">
      <div className="drawer-head"><strong>{drawer==='toc'?t.contents:t.thumbs}</strong><button onClick={()=>setDrawer(null)}><X size={18}/></button></div>
      {drawer==='toc'?<div className="toc-list">{toc.map(item=><button key={item.page} onClick={()=>jump(item.page)}><span>{String(item.page).padStart(2,'0')}</span><b>{lang==='ar'?item.ar:item.en}</b></button>)}</div>:
      <div className="thumb-grid">{Array.from({length:ISSUE.pages},(_,i)=><button key={i} onClick={()=>jump(i+1)} className={page===i+1?'active':''}><span>{String(i+1).padStart(2,'0')}</span></button>)}</div>}
    </aside>}

    <main className="reader-stage">
      {error?<div className="reader-error"><BookOpen size={42}/><p>{error}</p><a href={ISSUE.pdf} target="_blank" rel="noreferrer">{t.download}</a></div>:
      !pdf?<div className="reader-loading"><i/><span>{lang==='ar'?'جارٍ تجهيز الصفحات...':'Preparing pages...'}</span></div>:
      <div className={'book-shell '+(flip?'flip-'+flip:'')+' '+(page===1?'cover-state':'')}>
        <div className="book-glow"/>
        <div className="page-sheet page-a"><PdfPage pdf={pdf} page={page} zoom={zoom}/><span className="page-number">{page}</span></div>
        {!mobile&&page<ISSUE.pages&&<div className="page-sheet page-b"><PdfPage pdf={pdf} page={page+1} zoom={zoom}/><span className="page-number">{page+1}</span></div>}
      </div>}
    </main>

    <footer className="reader-footer">
      <button onClick={rtl?goNext:goPrev} disabled={page<=1}><ChevronLeft size={22}/><span>{t.prev}</span></button>
      <div className="reader-progress"><span>{String(page).padStart(2,'0')}</span><i><b style={{width:((page/ISSUE.pages)*100)+'%'}}/></i><span>{ISSUE.pages}</span></div>
      <button onClick={rtl?goPrev:goNext} disabled={page>=ISSUE.pages}><span>{t.next}</span><ChevronRight size={22}/></button>
    </footer>
  </div>
}

export default function Home(){
  const [lang,setLang]=useState<Lang>('ar');const [theme,setTheme]=useState<Theme>('dark');const [menu,setMenu]=useState(false);const [reader,setReader]=useState(false);const [loading,setLoading]=useState(true);
  const t=copy[lang];const wa=process.env.NEXT_PUBLIC_WHATSAPP_NUMBER||'971555470136';const phone=process.env.NEXT_PUBLIC_PHONE_NUMBER||'+971555470136';const contact=process.env.NEXT_PUBLIC_CONTACT_EMAIL||'alasmaamedia@gmail.com';
  const ids=['home','current','archive','sections','advertise','contact'];
  useEffect(()=>{const saved=localStorage.getItem('alassmaa-theme') as Theme|null;const l=localStorage.getItem('alassmaa-lang') as Lang|null;if(saved)setTheme(saved);if(l)setLang(l);const timer=window.setTimeout(()=>setLoading(false),1900);return()=>window.clearTimeout(timer)},[]);
  useEffect(()=>{document.documentElement.lang=lang;document.documentElement.dir=lang==='ar'?'rtl':'ltr';document.documentElement.dataset.theme=theme;localStorage.setItem('alassmaa-lang',lang);localStorage.setItem('alassmaa-theme',theme)},[lang,theme]);
  const heroStyle=useMemo(()=>({backgroundImage:"linear-gradient(90deg,rgba(12,2,18,.96),rgba(35,6,50,.76) 43%,rgba(20,5,24,.25) 75%,rgba(5,1,9,.72)),url('"+ISSUE.cover+"')"}),[]);
  return <>
    {loading&&<div className="cinema-loader"><div className="loader-halo"/><img src="/logo-emblem.png" alt="Alassmaa Media"/><span>ALASSMAA MEDIA</span><i/><b>{lang==='ar'?'معرفة تعزز الوعي':'KNOWLEDGE THAT STRENGTHENS AWARENESS'}</b></div>}
    <header className="site-header">
      <a className="brand" href="#home"><img src="/logo-transparent.png" alt="العصماء الإعلامية — Alassmaa Media LLC"/></a>
      <nav className="desktop-nav">{t.nav.map((n,i)=><a key={n} href={'#'+ids[i]}>{n}</a>)}</nav>
      <div className="header-actions">
        <button className="round-control" onClick={()=>setTheme(theme==='dark'?'light':'dark')} title={t.theme}>{theme==='dark'?<Sun size={18}/>:<Moon size={18}/>}</button>
        <button className="lang-control" onClick={()=>setLang(lang==='ar'?'en':'ar')}><Globe2 size={17}/>{lang==='ar'?'EN':'العربية'}</button>
        <button className="gold-cta" onClick={()=>setReader(true)}><BookOpen size={17}/>{t.read}</button>
        <button className="round-control menu-toggle" onClick={()=>setMenu(!menu)}><Menu size={20}/></button>
      </div>
    </header>
    {menu&&<nav className="mobile-menu">{t.nav.map((n,i)=><a key={n} href={'#'+ids[i]} onClick={()=>setMenu(false)}>{n}<ArrowUpRight size={17}/></a>)}</nav>}

    <main>
      <section id="home" className="mag-hero" style={heroStyle}>
        <div className="hero-grain"/><div className="hero-purple-orb"/><div className="hero-gold-beam"/>
        <div className="container hero-layout">
          <div className="hero-copy">
            <span className="eyebrow"><i/>{t.latest} · {ISSUE.issueAr} · {ISSUE.year}</span>
            <h1>{t.heroTitle}</h1><p>{t.heroText}</p>
            <div className="hero-actions">
              <button className="primary-cta" onClick={()=>setReader(true)}><BookOpen size={20}/>{t.read}<ArrowUpRight size={18}/></button>
              <a className="secondary-cta" href={ISSUE.pdf} download><Download size={19}/>{t.download}</a>
              <a className="text-cta" href="#archive">{t.archive}<ArrowDown size={17}/></a>
            </div>
            <div className="issue-meta"><span><b>{ISSUE.pages}</b>{t.pages}</span><span><b>01</b>{t.monthly}</span><span><b>UAE</b>{t.categories}</span></div>
          </div>
          <button className="hero-cover" onClick={()=>setReader(true)} aria-label={t.read}><img src={ISSUE.cover} alt="غلاف مجلة أمان"/><span className="cover-badge">{t.read}<ArrowUpRight size={18}/></span></button>
        </div>
        <a className="scroll-prompt" href="#current"><ArrowDown size={16}/>{t.scroll}</a>
      </section>

      <section id="current" className="section current-section"><div className="container current-grid">
        <div className="current-cover"><div className="cover-frame"><img src={ISSUE.cover} alt="AMAN magazine current issue"/><button onClick={()=>setReader(true)}><BookOpen size={22}/>{t.openIssue}</button></div></div>
        <div className="current-copy"><span className="section-kicker">01 / {t.currentTag}</span><h2>{t.currentTitle}</h2><p>{t.currentText}</p>
          <div className="current-stats"><div><strong>{ISSUE.pages}</strong><span>{t.pages}</span></div><div><strong>{ISSUE.issueAr}</strong><span>{ISSUE.year}</span></div><div><strong>5</strong><span>{lang==='ar'?'مجالات معرفية':'Knowledge fields'}</span></div></div>
          <div className="hero-actions"><button className="primary-cta" onClick={()=>setReader(true)}><BookOpen size={19}/>{t.read}</button><a className="secondary-cta" href={ISSUE.pdf} download><Download size={18}/>{t.download}</a></div>
        </div>
      </div></section>

      <section id="sections" className="section issue-sections"><div className="container"><div className="section-head"><span className="section-kicker">02 / {t.sectionsTag}</span><h2>{t.sectionsTitle}</h2></div>
        <div className="topic-grid">{toc.map((item,i)=><button key={item.page} className="topic-card" onClick={()=>setReader(true)}><span className="topic-index">0{i+1}</span><div><small>{lang==='ar'?'صفحة':'PAGE'} {item.page}</small><h3>{lang==='ar'?item.ar:item.en}</h3></div><ArrowUpRight size={21}/></button>)}</div>
      </div></section>

      <section id="archive" className="section archive-section"><div className="container"><div className="section-head split"><div><span className="section-kicker">03 / {t.archiveTag}</span><h2>{t.archiveTitle}</h2></div><p>{t.archiveText}</p></div>
        <div className="archive-grid"><article className="issue-card featured"><div className="issue-card-cover"><img src={ISSUE.cover} alt="AMAN Issue 0"/><span>{t.latest}</span></div><div><small>{ISSUE.issueAr} · {ISSUE.year}</small><h3>{lang==='ar'?'مجلة أمان — الإصدار الحالي':'AMAN Magazine — Current Issue'}</h3><button onClick={()=>setReader(true)}>{t.read}<ArrowUpRight size={17}/></button></div></article>
        {[1,2].map(n=><article className="issue-card placeholder" key={n}><div className="placeholder-mark"><img src="/logo-emblem.png" alt=""/></div><div><small>{lang==='ar'?'الأرشيف جاهز للإصدار القادم':'ARCHIVE READY'}</small><h3>{t.coming}</h3></div></article>)}</div>
      </div></section>

      <section id="advertise" className="advertise-section"><div className="container advertise-grid"><div><span className="section-kicker">04 / {t.advertiseTag}</span><h2>{t.advertiseTitle}</h2><p>{t.advertiseText}</p><a className="primary-cta" href={'https://wa.me/'+wa+'?text='+encodeURIComponent(lang==='ar'?'مرحباً، أود الحصول على الباقة الإعلامية والإعلانية لمجلة أمان.':'Hello, I would like the AMAN Magazine advertising media kit.')} target="_blank" rel="noreferrer">{t.advertise}<ArrowUpRight size={19}/></a></div><div className="ad-visual"><span>AMAN</span><b>MEDIA KIT</b><i/></div></div></section>

      <section id="contact" className="section contact-section"><div className="container contact-grid"><div><span className="section-kicker">05 / {t.contactTag}</span><h2>{t.contactTitle}</h2><p>{t.contactText}</p></div><div className="contact-links"><a href={'mailto:'+contact}><Mail size={20}/><span>{contact}</span><ArrowUpRight size={18}/></a><a href={'tel:'+phone}><span>☎</span><b>{phone}</b><ArrowUpRight size={18}/></a></div></div></section>
    </main>

    <footer className="footer"><div className="container footer-grid"><div><img src="/logo-transparent.png" alt="Alassmaa Media"/><p>{t.footer}</p></div><nav>{t.nav.map((n,i)=><a key={n} href={'#'+ids[i]}>{n}</a>)}</nav><div className="footer-social"><a href="https://www.instagram.com/" target="_blank" rel="noreferrer"><Instagram size={19}/>Instagram</a><a href={'mailto:'+contact}><Mail size={19}/>{contact}</a></div></div><div className="container footer-bottom"><span>© {new Date().getFullYear()} ALASSMAA MEDIA LLC. {t.rights}</span><a href="#home">↑ TOP</a></div></footer>

    <div className="contact-floaters"><a className="float wa" href={'https://wa.me/'+wa} target="_blank" rel="noreferrer" aria-label="WhatsApp"><span>◉</span></a><a className="float call" href={'tel:'+phone} aria-label="Call"><span>☎</span></a></div>
    {reader&&<MagazineReader lang={lang} onClose={()=>setReader(false)}/>}
  </>;
}
