'use client';
import {useEffect,useState} from 'react';
import {ChevronDown, MessageCircle, Phone, ArrowUpRight} from 'lucide-react';
import './legal-advisor.css';

const NUMBER='971566382220';
function LegalMark({size=56}:{size?:number}){
 return <svg width={size} height={size} viewBox="0 0 100 100" fill="none" aria-hidden="true" className="legal-mark">
  <path d="M50 7V77M45 18V70M55 24V70M37 74Q50 84 63 74M26 29H74M26 33H74M26 33L18 54M26 33L34 54M18 54Q26 65 34 54ZM74 33L66 54M74 33L82 54M66 54Q74 65 82 54ZM37 80Q50 84 63 80" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/>
 </svg>;
}
export default function LegalAdvisor(){
 const [open,setOpen]=useState(false);
 const [arabic,setArabic]=useState(true);
 useEffect(()=>{
  const update=()=>setArabic(document.documentElement.lang==='ar');
  update();
  const observer=new MutationObserver(update);
  observer.observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
  return ()=>observer.disconnect();
 },[]);
 const wa='https://wa.me/'+NUMBER+'?text='+encodeURIComponent(arabic?'السلام عليكم، أود طلب استشارة قانونية.':'Hello, I would like to request a legal consultation.');
 const jump=()=>{setOpen(true);document.getElementById('legal-advisor')?.scrollIntoView({behavior:'smooth',block:'start'});};
 return <>
  <div className="legal-dock" dir={arabic?'rtl':'ltr'}>
   <button className="legal-dock-trigger" onClick={jump} aria-label={arabic?'استشارة قانونية':'Legal advisor'} title={arabic?'اسأل المستشار القانوني':'Ask a legal advisor'}>
    <span className="legal-dock-emblem"><LegalMark size={38}/></span>
    <span className="legal-dock-caption">{arabic?'اسأل المستشار القانوني':'ASK A LEGAL ADVISOR'}</span>
   </button>
  </div>
  <section className="legal-section" id="legal-advisor" aria-label={arabic?'المستشار القانوني':'Legal advisor'}>
   <div className="legal-wrap">
    <div className="legal-section-head">
     <span className="legal-section-eyebrow">{arabic?'خدمات الاستشارات القانونية':'LEGAL CONSULTATION SERVICES'}</span>
     <h2>{arabic?'المستشار القانوني':'Legal Advisor'}</h2>
     <p>{arabic?'للاستفسارات القانونية، تواصل مباشرة مع مكتب الدكتور إبراهيم الملا للمحاماة والاستشارات القانونية.':'For legal enquiries, contact Dr. Ibrahim Al Mulla Advocates & Legal Consultants directly.'}</p>
    </div>
    <div className="legal-profile">
     <div className="legal-brand-lockup">
      <div className="legal-logo-frame"><LegalMark size={118}/></div>
      <div>
       <b dir="rtl">الدكتور إبراهيم الملا</b>
       <small dir="rtl">للمحاماة والاستشارات القانونية</small>
       <b dir="ltr">DR. IBRAHIM AL MULLA</b>
       <small dir="ltr">ADVOCATES & LEGAL CONSULTANTS</small>
      </div>
     </div>
     <button className="legal-expand" onClick={()=>setOpen(v=>!v)} aria-expanded={open} aria-controls="legal-contact-options">
      <span>{arabic?'استفسر عن استشارة قانونية':'Request a legal consultation'}</span>
      <ChevronDown size={20} className={open?'legal-open':''}/>
     </button>
     {open&&<div className="legal-contact-options" id="legal-contact-options">
      <a className="legal-contact-whatsapp" href={wa} target="_blank" rel="noopener noreferrer"><MessageCircle size={20}/>{arabic?'تواصل عبر واتساب':'Chat on WhatsApp'}<ArrowUpRight size={17}/></a>
      <a className="legal-contact-call" href={'tel:+'+NUMBER}><Phone size={20}/>{arabic?'اتصل بالمستشار':'Call the advisor'}<ArrowUpRight size={17}/></a>
      <span className="legal-number" dir="ltr">+971 56 638 2220</span>
     </div>}
    </div>
   </div>
  </section>
 </>;
}
