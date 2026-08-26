(()=>{
'use strict';
const L=['en','es','fr','de','pt','zh','ja','ar'];
const K='iwbr_language';
const T={
'Skip to content':['Saltar al contenido','Aller au contenu','Zum Inhalt springen','Pular para o conteúdo','跳转到内容','コンテンツへ移動','انتقل إلى المحتوى'],
'Open navigation':['Abrir navegación','Ouvrir la navigation','Navigation öffnen','Abrir navegação','打开导航','ナビゲーションを開く','فتح القائمة'],
'Home':['Inicio','Accueil','Startseite','Início','首页','ホーム','الرئيسية'],
'Numbers':['Números','Chiffres','Zahlen','Números','数据','数字','الأرقام'],
'Milestones':['Hitos','Étapes','Meilensteine','Marcos','里程碑','マイルストーン','المراحل'],
'Story':['Historia','Histoire','Geschichte','História','故事','ストーリー','القصة'],
'The experiment':['El experimento','L’expérience','Das Experiment','O experimento','实验','実験','التجربة'],
'Contributors':['Colaboradores','Contributeurs','Mitwirkende','Contribuidores','贡献者','参加者','المساهمون'],
'Predictions':['Predicciones','Prédictions','Prognosen','Previsões','预测','予測','التوقعات'],
'Updates':['Actualizaciones','Actualités','Updates','Atualizações','更新','更新','التحديثات'],
'About':['Acerca de','À propos','Über uns','Sobre','关于','概要','حول'],
'Trying something absurd in public.':['Intentando algo absurdo en público.','Tenter quelque chose d’absurde en public.','Ich versuche öffentlich etwas Absurdes.','Tentando algo absurdo em público.','公开尝试一些荒唐的事情。','ばかげたことを、公開で試しています。','أحاول القيام بشيء عبثي على الملأ.'],
'THE FIRST €100':['LOS PRIMEROS 100 €','LES 100 PREMIERS €','DIE ERSTEN 100 €','OS PRIMEIROS €100','第一个 €100','最初の €100','أول 100 يورو'],
'Can the internet get me to':['¿Puede internet llevarme a','Internet peut-il m’amener à','Kann das Internet mich auf','Será que a internet consegue me levar a','互联网能让我达到','インターネットは私を','هل يمكن للإنترنت أن يصل بي إلى'],
'CURRENT WEALTH':['PATRIMONIO ACTUAL','PATRIMOINE ACTUEL','AKTUELLER VERMÖGENSSTAND','PATRIMÔNIO ATUAL','当前财富','現在の資産','الثروة الحالية'],
'CURRENT MISSION':['MISIÓN ACTUAL','MISSION ACTUELLE','AKTUELLE MISSION','MISSÃO ATUAL','当前任务','現在のミッション','المهمة الحالية'],
'to the first €100':['para los primeros 100 €','jusqu’aux premiers 100 €','bis zu den ersten 100 €','até os primeiros €100','距离第一个 €100','最初の€100まで','حتى أول 100 يورو'],
'Suggest an idea':['Sugiere una idea','Suggérer une idée','Eine Idee vorschlagen','Sugerir uma ideia','提出一个想法','アイデアを提案','اقترح فكرة'],
'Share this moment':['Comparte este momento','Partager ce moment','Diesen Moment teilen','Compartilhe este momento','分享这一刻','この瞬間をシェア','شارك هذه اللحظة'],
'HOW IT WORKS':['CÓMO FUNCIONA','COMMENT ÇA MARCHE','SO FUNKTIONIERT ES','COMO FUNCIONA','运作方式','仕組み','كيف يعمل'],
'Suggest':['Sugerir','Suggérer','Vorschlagen','Sugerir','提出','提案','اقتراح'],
'Vote':['Votar','Voter','Abstimmen','Votar','投票','投票','تصويت'],
'Try':['Probar','Essayer','Ausprobieren','Tentar','尝试','試す','تجربة'],
'See the result':['Ver el resultado','Voir le résultat','Ergebnis ansehen','Ver o resultado','查看结果','結果を見る','رؤية النتيجة'],
'CURRENT EXPERIMENT':['EXPERIMENTO ACTUAL','EXPÉRIENCE ACTUELLE','AKTUELLES EXPERIMENT','EXPERIMENTO ATUAL','当前实验','現在の実験','التجربة الحالية'],
'VOTING OPEN':['VOTACIÓN ABIERTA','VOTE OUVERT','ABSTIMMUNG OFFEN','VOTAÇÃO ABERTA','投票进行中','投票受付中','التصويت مفتوح'],
'One vote per browser.':['Un voto por navegador.','Un vote par navigateur.','Eine Stimme pro Browser.','Um voto por navegador.','每个浏览器一票。','1ブラウザにつき1票。','صوت واحد لكل متصفح.'],
'LATEST UPDATE':['ÚLTIMA ACTUALIZACIÓN','DERNIÈRE MISE À JOUR','LETZTES UPDATE','ÚLTIMA ATUALIZAÇÃO','最新更新','最新アップデート','آخر تحديث'],
'NOW':['AHORA','MAINTENANT','JETZT','AGORA','现在','今','الآن'],
'Read the full log':['Leer el registro completo','Lire le journal complet','Das vollständige Protokoll lesen','Ler o registro completo','阅读完整记录','完全な記録を見る','اقرأ السجل الكامل'],
'Your moment in financial history':['Tu momento en la historia financiera','Votre moment dans l’histoire financière','Dein Moment in der Finanzgeschichte','Seu momento na história financeira','你的金融史时刻','金融史に残るあなたの瞬間','لحظتك في التاريخ المالي'],
'MAKE A QUESTIONABLE DECISION':['TOMAR UNA DECISIÓN CUESTIONABLE','PRENDRE UNE DÉCISION DOUTEUSE','EINE FRAGWÜRDIGE ENTSCHEIDUNG TREFFEN','TOMAR UMA DECISÃO QUESTIONÁVEL','做一个可疑的决定','怪しい決断をする','اتخذ قرارًا مشكوكًا فيه'],
'Open secure Stripe checkout →':['Abrir pago seguro de Stripe →','Ouvrir le paiement sécurisé Stripe →','Sicheren Stripe-Checkout öffnen →','Abrir checkout seguro do Stripe →','打开 Stripe 安全结账 →','安全なStripe決済を開く →','فتح الدفع الآمن عبر Stripe →'],
'Nickname':['Apodo','Pseudo','Spitzname','Apelido','昵称','ニックネーム','الاسم المستعار'],
'Checking...':['Comprobando...','Vérification...','Wird geprüft...','Verificando...','正在检查...','確認中...','جارٍ التحقق...'],
'Write something first.':['Escribe algo primero.','Écrivez d’abord quelque chose.','Schreibe zuerst etwas.','Escreva algo primeiro.','请先写点什么。','まず何か書いてください。','اكتب شيئًا أولًا.'],
'Please choose a nickname.':['Elige un apodo.','Veuillez choisir un pseudo.','Bitte wähle einen Spitznamen.','Escolha um apelido.','请选择昵称。','ニックネームを選んでください。','يرجى اختيار اسم مستعار.'],
'Nickname must be 3–24 characters.':['El apodo debe tener entre 3 y 24 caracteres.','Le pseudo doit comporter entre 3 et 24 caractères.','Der Spitzname muss 3–24 Zeichen lang sein.','O apelido deve ter de 3 a 24 caracteres.','昵称必须为 3–24 个字符。','ニックネームは3～24文字で入力してください。','يجب أن يتراوح الاسم المستعار بين 3 و24 حرفًا.'],
"Couldn't post your prediction. Try again.":["No se pudo publicar tu predicción. Inténtalo de nuevo.","Impossible de publier votre prédiction. Réessayez.","Deine Prognose konnte nicht veröffentlicht werden. Versuche es erneut.","Não foi possível publicar sua previsão. Tente novamente.","无法发布你的预测。请再试一次。","予測を投稿できませんでした。もう一度お試しください。","تعذر نشر توقعك. حاول مرة أخرى."],
"Couldn't reach the prediction system. Try again.":["No se pudo acceder al sistema de predicciones. Inténtalo de nuevo.","Impossible d’accéder au système de prédictions. Réessayez.","Das Prognosesystem konnte nicht erreicht werden. Versuche es erneut.","Não foi possível acessar o sistema de previsões. Tente novamente.","无法连接预测系统。请再试一次。","予測システムに接続できませんでした。もう一度お試しください。","تعذر الوصول إلى نظام التوقعات. حاول مرة أخرى."],
'Loading...':['Cargando...','Chargement...','Wird geladen...','Carregando...','加载中...','読み込み中...','جارٍ التحميل...'],
'Loading verified support...':['Cargando apoyo verificado...','Chargement du soutien vérifié...','Verifizierte Unterstützung wird geladen...','Carregando apoio verificado...','正在加载已验证的支持...','確認済みの支援を読み込んでいます...','جارٍ تحميل الدعم الموثق...'],
'Loading votes...':['Cargando votos...','Chargement des votes...','Stimmen werden geladen...','Carregando votos...','正在加载投票...','投票を読み込んでいます...','جارٍ تحميل الأصوات...'],
'Loading predictions...':['Cargando predicciones...','Chargement des prédictions...','Prognosen werden geladen...','Carregando previsões...','正在加载预测...','予測を読み込んでいます...','جارٍ تحميل التوقعات...'],
'Back to the experiment':['Volver al experimento','Retour à l’expérience','Zurück zum Experiment','Voltar ao experimento','返回实验','実験に戻る','العودة إلى التجربة'],
'Become a contributor':['Conviértete en colaborador','Devenez contributeur','Mitwirkender werden','Torne-se um contribuidor','成为贡献者','貢献者になる','كن مساهمًا']
};
function getLang(){const s=localStorage.getItem(K);return L.includes(s)?s:(document.documentElement.lang||'en')}
function apply(root=document){const l=getLang(),i=L.indexOf(l);document.documentElement.lang=l;document.documentElement.dir=l==='ar'?'rtl':'ltr';const tr=s=>T[s]?(i?T[s][i-1]:s):null;const w=document.createTreeWalker(root.body||root,NodeFilter.SHOW_TEXT);const a=[];while(w.nextNode())a.push(w.currentNode);a.forEach(n=>{const s=n.nodeValue?.trim(),v=tr(s);if(s&&v)n.nodeValue=n.nodeValue.replace(s,v)});root.querySelectorAll?.('[placeholder],[aria-label],[title]').forEach(e=>['placeholder','aria-label','title'].forEach(x=>{const v=e.getAttribute(x),z=tr(v);if(v&&z)e.setAttribute(x,z)}))}
function init(){apply(document);new MutationObserver(ms=>ms.forEach(m=>m.addedNodes.forEach(n=>{if(n.nodeType===1)apply(n)}))).observe(document.body,{childList:true,subtree:true});window.addEventListener('iwbr:languagechange',()=>apply(document))}
if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
