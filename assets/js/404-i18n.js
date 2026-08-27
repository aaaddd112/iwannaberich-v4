(()=>{
'use strict';
const L=['en','es','fr','de','pt','zh','ja','ar'],K='iwbr_language';
const T={
'The Plan':['El plan','Le plan','Der Plan','O plano','计划','計画','الخطة'],
'Help':['Ayuda','Aide','Hilfe','Ajuda','帮助','ヘルプ','المساعدة'],
'A minor setback':['Un pequeño contratiempo','Un petit contretemps','Ein kleiner Rückschlag','Um pequeno contratempo','一个小挫折','小さなつまずき','انتكاسة بسيطة'],
"This page doesn't exist. Which is unfortunate, but still less concerning than the €1 billion plan.":["Esta página no existe. Es desafortunado, pero sigue siendo menos preocupante que el plan de 1.000 millones de euros.","Cette page n’existe pas. C’est regrettable, mais toujours moins inquiétant que le plan d’un milliard d’euros.","Diese Seite existiert nicht. Bedauerlich, aber immer noch weniger besorgniserregend als der 1-Milliarde-Euro-Plan.","Esta página não existe. É uma pena, mas ainda é menos preocupante que o plano de €1 bilhão.","此页面不存在。虽然遗憾，但仍没有 10 亿欧元计划那么令人担忧。","このページは存在しません。残念ですが、10億ユーロの計画ほど心配ではありません。","هذه الصفحة غير موجودة. هذا مؤسف، لكنه لا يزال أقل إثارة للقلق من خطة المليار يورو."],
'Take me back to the delusion':['Llévame de vuelta a la ilusión','Ramenez-moi à l’illusion','Bring mich zurück zur Illusion','Leve-me de volta à ilusão','带我回到这场幻想','妄想に戻る','أعدني إلى الوهم'],
'No equity. No returns. Not financial advice.':['Sin participación. Sin rendimientos. No es asesoramiento financiero.','Pas de participation. Pas de rendement. Ceci ne constitue pas un conseil financier.','Keine Beteiligung. Keine Rendite. Keine Finanzberatung.','Sem participação. Sem retorno. Não é aconselhamento financeiro.','没有股权。没有回报。不构成财务建议。','株式なし。リターンなし。金融アドバイスではありません。','لا أسهم. لا عوائد. ليست نصيحة مالية.'],
'Barely a business. Definitely a goal.':['Apenas un negocio. Definitivamente un objetivo.','À peine une activité. Définitivement un objectif.','Kaum ein Geschäft. Definitiv ein Ziel.','Mal chega a ser um negócio. Mas é definitivamente uma meta.','勉强算是生意。但绝对是一个目标。','ほとんどビジネスではない。でも確実に目標。','بالكاد مشروع تجاري. لكنه بالتأكيد هدف.']};
function apply(){const l=localStorage.getItem(K)||document.documentElement.lang||'en',i=L.indexOf(l);if(i<1)return;const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),a=[];while(w.nextNode())a.push(w.currentNode);a.forEach(n=>{const s=n.nodeValue.trim(),v=T[s]?.[i-1];if(s&&v)n.nodeValue=n.nodeValue.replace(s,v)});document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr'}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();window.addEventListener('iwbr:languagechange',apply);
})();
