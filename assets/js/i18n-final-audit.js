(()=>{
'use strict';
const L=['en','es','fr','de','pt','zh','ja','ar'];
const K='iwbr_language';
const T={
'so far.':['hasta ahora.','jusqu’ici.','bisher.','até agora.','到目前为止。','これまでのところ。','حتى الآن.'],
'Fund the least realistic plan online.':['Financia el plan menos realista de internet.','Financez le plan le moins réaliste d’Internet.','Finanziere den unrealistischsten Plan im Internet.','Financie o plano menos realista da internet.','支持这个互联网上最不现实的计划。','ネット上で最も非現実的な計画を支援する。','موّل الخطة الأقل واقعية على الإنترنت.'],
'Fund the least':['Financia el plan menos','Financez le plan le moins','Finanziere den unrealistischsten Plan','Financie o plano menos','支持这个最不现实的计划','最も非現実的な計画を支援する','موّل الخطة الأقل'],
'realistic plan online.':['realista de internet.','réaliste d’Internet.','realistischen Plan im Internet.','realista da internet.','现实的计划。','非現実的な計画。','واقعية على الإنترنت.']
};
function apply(){const l=localStorage.getItem(K)||document.documentElement.lang||'en',i=L.indexOf(l);if(i<1)return;const nodes=[];const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT);while(w.nextNode())nodes.push(w.currentNode);nodes.forEach(n=>{const s=n.nodeValue.trim(),v=T[s];if(v)n.nodeValue=n.nodeValue.replace(s,v[i-1])});document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr'}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();window.addEventListener('iwbr:languagechange',apply);
})();
