(()=>{
'use strict';
const LANGS=['en','es','fr','de','pt','zh','ja','ar'];
const T={
 en:{predict:'Make your prediction',since:v=>`+${v} since launch.`,toGo:v=>`${v} to go.`,community:'Community',explore:'Explore',experiment:'The experiment',about:'About',suggest:'Suggest an idea',share:'Share this moment',menus:{numbers:['Numbers','Live wealth counter'],milestones:['Milestones',"What's next"],story:['Story','Why this exists'],experiment:['The experiment','Rules, risks & decisions'],updates:['Updates','The public log'],contributors:['Contributors','Who joined the experiment'],support:['Predictions','Make your call']}},
 es:{predict:'Haz tu predicción',since:v=>`+${v} desde el lanzamiento.`,toGo:v=>`${v} por alcanzar.`,community:'Comunidad',explore:'Explorar',experiment:'El experimento',about:'Acerca de',suggest:'Sugiere una idea',share:'Comparte este momento',menus:{numbers:['Números','Contador de patrimonio en vivo'],milestones:['Hitos','Qué sigue'],story:['Historia','Por qué existe'],experiment:['El experimento','Reglas, riesgos y decisiones'],updates:['Actualizaciones','El registro público'],contributors:['Colaboradores','Quién se unió al experimento'],support:['Predicciones','Da tu opinión']}},
 fr:{predict:'Faire une prédiction',since:v=>`+${v} depuis le lancement.`,toGo:v=>`${v} à atteindre.`,community:'Communauté',explore:'Explorer',experiment:'L’expérience',about:'À propos',suggest:'Suggérer une idée',share:'Partager ce moment',menus:{numbers:['Chiffres','Compteur de patrimoine en direct'],milestones:['Étapes','La suite'],story:['Histoire','Pourquoi ce projet existe'],experiment:['L’expérience','Règles, risques et décisions'],updates:['Actualités','Le journal public'],contributors:['Contributeurs','Qui a rejoint l’expérience'],support:['Prédictions','Donnez votre avis']}},
 de:{predict:'Deine Prognose abgeben',since:v=>`+${v} seit dem Start.`,toGo:v=>`${v} fehlen noch.`,community:'Community',explore:'Entdecken',experiment:'Das Experiment',about:'Über uns',suggest:'Eine Idee vorschlagen',share:'Diesen Moment teilen',menus:{numbers:['Zahlen','Live-Vermögenszähler'],milestones:['Meilensteine','Was als Nächstes kommt'],story:['Geschichte','Warum es das gibt'],experiment:['Das Experiment','Regeln, Risiken & Entscheidungen'],updates:['Updates','Das öffentliche Protokoll'],contributors:['Mitwirkende','Wer beim Experiment dabei ist'],support:['Prognosen','Deine Einschätzung']}},
 pt:{predict:'Faça sua previsão',since:v=>`+${v} desde o lançamento.`,toGo:v=>`${v} restantes.`,community:'Comunidade',explore:'Explorar',experiment:'O experimento',about:'Sobre',suggest:'Sugerir uma ideia',share:'Compartilhe este momento',menus:{numbers:['Números','Contador de patrimônio ao vivo'],milestones:['Marcos','O que vem a seguir'],story:['História','Por que isso existe'],experiment:['O experimento','Regras, riscos e decisões'],updates:['Atualizações','O registro público'],contributors:['Contribuidores','Quem entrou no experimento'],support:['Previsões','Dê sua opinião']}},
 zh:{predict:'做出你的预测',since:v=>`自上线以来 +${v}。`,toGo:v=>`还差 ${v}。`,community:'社区',explore:'探索',experiment:'实验',about:'关于',suggest:'提出一个想法',share:'分享这一刻',menus:{numbers:['数据','实时财富计数器'],milestones:['里程碑','下一步是什么'],story:['故事','为什么要做这件事'],experiment:['实验','规则、风险与决策'],updates:['更新','公开记录'],contributors:['贡献者','谁加入了实验'],support:['预测','做出你的判断']}},
 ja:{predict:'予測する',since:v=>`開始以来 +${v}。`,toGo:v=>`あと ${v}。`,community:'コミュニティ',explore:'探索',experiment:'実験',about:'概要',suggest:'アイデアを提案',share:'この瞬間をシェア',menus:{numbers:['数字','リアルタイム資産カウンター'],milestones:['マイルストーン','次に何が起こるか'],story:['ストーリー','なぜ始めたのか'],experiment:['実験','ルール・リスク・決定'],updates:['更新','公開記録'],contributors:['参加者','実験に参加した人'],support:['予測','あなたの判断']}},
 ar:{predict:'أدلي بتوقعك',since:v=>`+${v} منذ الإطلاق.`,toGo:v=>`متبقي ${v}.`,community:'المجتمع',explore:'استكشف',experiment:'التجربة',about:'عن المشروع',suggest:'اقترح فكرة',share:'شارك هذه اللحظة',menus:{numbers:['الأرقام','عداد الثروة المباشر'],milestones:['المراحل','ما التالي'],story:['القصة','لماذا يوجد هذا المشروع'],experiment:['التجربة','القواعد والمخاطر والقرارات'],updates:['التحديثات','السجل العام'],contributors:['المساهمون','من انضم إلى التجربة'],support:['التوقعات','أدلِ برأيك']}}
};
function lang(){const l=localStorage.getItem('iwbr_language')||document.documentElement.lang||'en';return LANGS.includes(l)?l:'en'}
function setText(el,text){if(el&&el.textContent!==text)el.textContent=text}
function setButton(el,text){if(!el)return;const arrow=el.querySelector('span');el.childNodes.forEach(n=>{if(n.nodeType===Node.TEXT_NODE)n.remove()});el.insertBefore(document.createTextNode(text+' '),arrow||null)}
function apply(){
 const l=lang(),t=T[l];
 document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr';
 document.querySelectorAll('.mission-actions .btn.primary,.hero-intro .btn.primary[href="support.html"]').forEach(el=>setButton(el,t.predict));
 const since=document.getElementById('missionSinceLaunch');
 if(since){const m=since.textContent.match(/[€$£¥]?\s*[\d.,]+/);if(m)setText(since,t.since(m[0]))}
 const remaining=document.getElementById('missionRemaining');
 if(remaining){const m=remaining.textContent.match(/[€$£¥]?\s*[\d.,]+/);if(m)setText(remaining,t.toGo(m[0]))}
 document.querySelectorAll('.nav-drop-trigger').forEach(el=>{
   const text=el.textContent.replace('⌄','').trim();
   const key=['Community','Comunidad','Communauté','Comunidade','社区','コミュニティ','المجتمع'].includes(text)?'community':['The experiment','El experimento','L’expérience','Das Experiment','O experimento','实验','実験','التجربة'].includes(text)?'experiment':['Explore','Explorar','Explorer','Entdecken','探索','استكشف'].includes(text)?'explore':null;
   if(key){setButton(el,t[key])}
 });
 const about=[...document.querySelectorAll('nav a')].find(a=>['About','Acerca de','À propos','Über uns','Sobre','关于','概要','حول'].includes(a.textContent.trim()));
 if(about)setText(about,t.about);
 const suggest=[...document.querySelectorAll('.mission-actions .btn')].find(a=>/Suggest an idea|Sugiere una idea|Suggérer une idée|Eine Idee vorschlagen|Sugerir uma ideia|提出一个想法|アイデアを提案|اقترح فكرة/.test(a.textContent));
 if(suggest)setText(suggest,t.suggest);
 const share=document.getElementById('shareMomentButton');if(share)setText(share,t.share);
 document.querySelectorAll('.nav-drop-menu a').forEach(a=>{
   const href=(a.getAttribute('href')||'').split('#')[0].split('?')[0];
   const key={
     'numbers.html':'numbers','milestones.html':'milestones','story.html':'story','experiment.html':'experiment','updates.html':'updates','contributors.html':'contributors','support.html':'support'
   }[href];
   if(!key||!t.menus[key])return;
   const [title,desc]=t.menus[key];
   const strong=a.querySelector('strong'),small=a.querySelector('small');
   setText(strong,title);setText(small,desc);
 });
}
function init(){apply();document.querySelectorAll('.language-select').forEach(s=>s.addEventListener('change',()=>setTimeout(apply,0)));window.addEventListener('iwbr:languagechange',()=>setTimeout(apply,0));new MutationObserver(()=>setTimeout(apply,0)).observe(document.body,{childList:true,subtree:true})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
