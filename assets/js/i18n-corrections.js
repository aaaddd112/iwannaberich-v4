(()=>{
'use strict';
const L=['en','es','fr','de','pt','zh','ja','ar'];
const K='iwbr_language';
const C={
'€1 billion':['1.000 millones de euros','1 milliard d’euros','1 Milliarde Euro','€1 bilhão','10 亿欧元','10億ユーロ','مليار يورو'],
'First coffee paid for by the experiment':['Primer café pagado por el experimento','Premier café payé par l’expérience','Erster vom Experiment bezahlter Kaffee','Primeiro café pago pelo experimento','实验支付的第一杯咖啡','実験で支払った最初のコーヒー','أول قهوة دفعت ثمنها التجربة'],
'Okay, this is actually moving':['Vale, esto realmente avanza','Bon, ça avance vraiment','Okay, das bewegt sich tatsächlich','Ok, isso está realmente avançando','好吧，这真的在推进','よし、実際に進んでいる','حسنًا، هذا يتحرك فعلًا'],
'A stranger is genuinely involved':['Un desconocido participa de verdad','Un inconnu participe vraiment','Eine fremde Person ist wirklich beteiligt','Um desconhecido está realmente envolvido','一个陌生人真的参与进来了','見知らぬ人が本当に参加している','شخص غريب يشارك فعلًا'],
'Halfway to the first real target':['A mitad del primer objetivo real','À mi-chemin du premier vrai objectif','Halbwegs zum ersten echten Ziel','Na metade da primeira meta real','距离第一个真正目标还有一半','最初の本当の目標まであと半分','في منتصف الطريق إلى أول هدف حقيقي'],
'First milestone. Then we figure out €1,000.':['Primer hito. Después nos ocupamos de 1.000 €.','Première étape. Ensuite, on s’occupe de 1 000 €.','Erster Meilenstein. Dann kümmern wir uns um 1.000 €.','Primeiro marco. Depois pensamos nos €1.000.','第一个里程碑。然后再考虑 €1,000。','最初のマイルストーン。その後€1,000を考える。','المرحلة الأولى. ثم نصل إلى 1,000 يورو.'],
'Still wildly optimistic':['Todavía increíblemente optimista','Toujours follement optimiste','Immer noch völlig optimistisch','Ainda muito otimista','依然极度乐观','相変わらず無謀に楽観的','ما زلنا متفائلين بشكل جنوني']
};
function apply(){const l=localStorage.getItem(K)||document.documentElement.lang||'en';const i=L.indexOf(l);if(i<1)return;const w=document.createTreeWalker(document.body,NodeFilter.SHOW_TEXT),a=[];while(w.nextNode())a.push(w.currentNode);a.forEach(n=>{const s=n.nodeValue.trim();if(C[s])n.nodeValue=n.nodeValue.replace(s,C[s][i-1])})}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',apply);else apply();
window.addEventListener('iwbr:languagechange',apply);
})();
