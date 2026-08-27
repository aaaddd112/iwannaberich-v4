(()=>{
'use strict';
const LANGS=['en','es','fr','de','pt','zh','ja','ar'];
const T={
  en:{predict:'Make your prediction',since:v=>`+${v} since launch.`,toGo:v=>`${v} to go.`,community:'Community',explore:'Explore',experiment:'The experiment',about:'About',suggest:'Suggest an idea',share:'Share this moment'},
  es:{predict:'Haz tu predicción',since:v=>`+${v} desde el lanzamiento.`,toGo:v=>`${v} por alcanzar.`,community:'Comunidad',explore:'Explorar',experiment:'El experimento',about:'Acerca de',suggest:'Sugiere una idea',share:'Comparte este momento'},
  fr:{predict:'Faire une prédiction',since:v=>`+${v} depuis le lancement.`,toGo:v=>`${v} à atteindre.`,community:'Communauté',explore:'Explorer',experiment:'L’expérience',about:'À propos',suggest:'Suggérer une idée',share:'Partager ce moment'},
  de:{predict:'Deine Prognose abgeben',since:v=>`+${v} seit dem Start.`,toGo:v=>`${v} fehlen noch.`,community:'Community',explore:'Entdecken',experiment:'Das Experiment',about:'Über uns',suggest:'Eine Idee vorschlagen',share:'Diesen Moment teilen'},
  pt:{predict:'Faça sua previsão',since:v=>`+${v} desde o lançamento.`,toGo:v=>`${v} restantes.`,community:'Comunidade',explore:'Explorar',experiment:'O experimento',about:'Sobre',suggest:'Sugerir uma ideia',share:'Compartilhe este momento'},
  zh:{predict:'做出你的预测',since:v=>`自上线以来 +${v}。`,toGo:v=>`还差 ${v}。`,community:'社区',explore:'探索',experiment:'实验',about:'关于',suggest:'提出一个想法',share:'分享这一刻'},
  ja:{predict:'予測する',since:v=>`開始以来 +${v}。`,toGo:v=>`あと ${v}。`,community:'コミュニティ',explore:'探索',experiment:'実験',about:'概要',suggest:'アイデアを提案',share:'この瞬間をシェア'},
  ar:{predict:'أدلي بتوقعك',since:v=>`+${v} منذ الإطلاق.`,toGo:v=>`متبقي ${v}.`,community:'المجتمع',explore:'استكشف',experiment:'التجربة',about:'عن المشروع',suggest:'اقترح فكرة',share:'شارك هذه اللحظة'}
};
function lang(){const l=localStorage.getItem('iwbr_language')||document.documentElement.lang||'en';return LANGS.includes(l)?l:'en'}
function setButton(el,text){if(!el)return;const arrow=el.querySelector('span');el.childNodes.forEach(n=>{if(n.nodeType===Node.TEXT_NODE)n.remove()});el.insertBefore(document.createTextNode(text+' '),arrow||null)}
function apply(){
 const l=lang(),t=T[l];
 document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr';
 document.querySelectorAll('.mission-actions .btn.primary, .hero-intro .btn.primary[href="support.html"]').forEach(el=>setButton(el,t.predict));
 const since=document.getElementById('missionSinceLaunch');
 if(since){const m=since.textContent.match(/[€$£¥]?\s*[\d.,]+/);if(m)since.textContent=t.since(m[0])}
 const remaining=document.getElementById('missionRemaining');
 if(remaining){const m=remaining.textContent.match(/[€$£¥]?\s*[\d.,]+/);if(m)remaining.textContent=t.toGo(m[0])}
 document.querySelectorAll('.nav-drop-trigger').forEach(el=>{const text=el.textContent.replace('⌄','').trim();if(['Explore','Explorar','Explorer','Entdecken','Explorar','探索','استكشف'].includes(text)||['Community','Comunidad','Communauté','Comunidade','社区','コミュニティ','المجتمع'].includes(text)||['The experiment','El experimento','L’expérience','Das Experiment','O experimento','实验','実験','التجربة'].includes(text)){const hasArrow=el.querySelector('span');const raw=hasArrow?.textContent==='⌄';let key;if(['Community','Comunidad','Communauté','Comunidade','社区','コミュニティ','المجتمع'].includes(text))key='community';else if(['The experiment','El experimento','L’expérience','Das Experiment','O experimento','实验','実験','التجربة'].includes(text))key='experiment';else key='explore';el.childNodes.forEach(n=>{if(n.nodeType===Node.TEXT_NODE)n.remove()});el.insertBefore(document.createTextNode(t[key]+' '),hasArrow||null)}});
 const about=[...document.querySelectorAll('nav a')].find(a=>['About','Acerca de','À propos','Über uns','Sobre','关于','概要','حول'].includes(a.textContent.trim()));if(about)about.textContent=t.about;
 const suggest=[...document.querySelectorAll('.mission-actions .btn')].find(a=>/Suggest an idea|Sugiere una idea|Suggérer une idée|Eine Idee vorschlagen|Sugerir uma ideia|提出一个想法|アイデアを提案|اقترح فكرة/.test(a.textContent));if(suggest)suggest.textContent=t.suggest;
 const share=document.getElementById('shareMomentButton');if(share)share.textContent=t.share;
}
function init(){apply();document.querySelectorAll('.language-select').forEach(s=>s.addEventListener('change',()=>setTimeout(apply,0)));window.addEventListener('iwbr:languagechange',()=>setTimeout(apply,0));new MutationObserver(()=>apply()).observe(document.body,{childList:true,subtree:true,characterData:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
