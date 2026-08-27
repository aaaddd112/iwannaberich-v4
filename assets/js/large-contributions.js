(()=>{
  "use strict";
  const LINKS={
    custom:"https://buy.stripe.com/bJe5kDfSI9Zf5HEfgpaAw00",
    50000:"https://donate.stripe.com/aFacN5cGw3ARc623xHaAw01",
    100000:"https://donate.stripe.com/5kQeVd4a0gnD3zw4BLaAw02",
    250000:"https://donate.stripe.com/bJe4gzcGw3AR0nk0lvaAw03",
    500000:"https://donate.stripe.com/00w9AT0XO5IZ6LI8S1aAw04",
    750000:"https://donate.stripe.com/3cI5kD9ukfjz3zwgktaAw05",
    1000000:"https://donate.stripe.com/eVq14n35W4EV5HE7NXaAw06"
  };
  const I18N={
    en:{kicker:"A financially questionable decision",title:"Want to fund the experiment?",intro:"Choose any amount you want. Every contribution becomes part of the public experiment.",custom:"Choose your amount",customNote:"€50–€10,000 · enter any amount",customCta:"Continue with custom amount",big:"Go big",bigNote:"For contributions beyond €10,000.",close:"Close support options",foot:"Payments are processed securely by Stripe. Contributions are voluntary and are not investments or purchases of equity."},
    es:{kicker:"Una decisión financieramente cuestionable",title:"¿Quieres financiar el experimento?",intro:"Elige el importe que quieras. Cada contribución pasa a formar parte del experimento público.",custom:"Elige tu importe",customNote:"€50–€10.000 · introduce cualquier cantidad",customCta:"Continuar con importe personalizado",big:"Ve a lo grande",bigNote:"Para contribuciones superiores a €10.000.",close:"Cerrar opciones de apoyo",foot:"Los pagos se procesan de forma segura mediante Stripe. Las contribuciones son voluntarias y no son inversiones ni compras de participación."},
    fr:{kicker:"Une décision financièrement douteuse",title:"Envie de financer l’expérience ?",intro:"Choisissez le montant de votre choix. Chaque contribution devient une partie de l’expérience publique.",custom:"Choisissez votre montant",customNote:"50 €–10 000 € · entrez le montant de votre choix",customCta:"Continuer avec un montant personnalisé",big:"Voyez grand",bigNote:"Pour les contributions supérieures à 10 000 €.",close:"Fermer les options de soutien",foot:"Les paiements sont traités en toute sécurité par Stripe. Les contributions sont volontaires et ne constituent ni un investissement ni un achat de participation."},
    de:{kicker:"Eine finanziell fragwürdige Entscheidung",title:"Willst du das Experiment finanzieren?",intro:"Wähle einen beliebigen Betrag. Jeder Beitrag wird Teil des öffentlichen Experiments.",custom:"Eigenen Betrag wählen",customNote:"50–10.000 € · beliebigen Betrag eingeben",customCta:"Mit eigenem Betrag fortfahren",big:"Geh aufs Ganze",bigNote:"Für Beiträge über 10.000 €.",close:"Unterstützungsoptionen schließen",foot:"Zahlungen werden sicher über Stripe verarbeitet. Beiträge sind freiwillig und keine Investitionen oder Beteiligungen."},
    pt:{kicker:"Uma decisão financeiramente questionável",title:"Quer financiar o experimento?",intro:"Escolha o valor que quiser. Cada contribuição passa a fazer parte do experimento público.",custom:"Escolha o seu valor",customNote:"€50–€10.000 · introduza qualquer valor",customCta:"Continuar com valor personalizado",big:"Vá além",bigNote:"Para contribuições acima de €10.000.",close:"Fechar opções de apoio",foot:"Os pagamentos são processados com segurança pelo Stripe. As contribuições são voluntárias e não são investimentos nem compras de participação."},
    zh:{kicker:"一个财务上值得怀疑的决定",title:"想为这个实验提供支持？",intro:"选择你想支持的金额。每一笔贡献都会成为公开实验的一部分。",custom:"自定义金额",customNote:"€50–€10,000 · 输入任意金额",customCta:"使用自定义金额继续",big:"来点大的",bigNote:"适用于超过 €10,000 的贡献。",close:"关闭支持选项",foot:"付款由 Stripe 安全处理。贡献完全自愿，不代表投资或股权购买。"},
    ja:{kicker:"財政的にはかなり無謀な決断",title:"この実験を支援しますか？",intro:"好きな金額を選んでください。すべての支援が公開実験の一部になります。",custom:"金額を選ぶ",customNote:"€50–€10,000 · 金額を自由に入力",customCta:"任意の金額で続ける",big:"もっと大きく",bigNote:"€10,000を超える支援はこちら。",close:"支援オプションを閉じる",foot:"支払いはStripeによって安全に処理されます。支援は任意であり、投資や株式購入ではありません。"},
    ar:{kicker:"قرار مالي مشكوك فيه",title:"هل تريد تمويل التجربة؟",intro:"اختر المبلغ الذي تريده. كل مساهمة تصبح جزءًا من التجربة العلنية.",custom:"اختر المبلغ",customNote:"€50–€10,000 · أدخل أي مبلغ",customCta:"المتابعة بالمبلغ المخصص",big:"اذهب إلى أبعد من ذلك",bigNote:"للمساهمات التي تتجاوز €10,000.",close:"إغلاق خيارات الدعم",foot:"تتم معالجة المدفوعات بأمان عبر Stripe. المساهمات طوعية وليست استثمارات أو شراءً لحقوق ملكية."}
  };
  const tiers=[
    [50000,"€50K","Make it interesting."],[100000,"€100K","Now we're talking."],[250000,"€250K","Seriously?"],[500000,"€500K","Absolutely unhinged."],[750000,"€750K","This escalated quickly."],[1000000,"€1M","You actually did it."]
  ];
  function lang(){const v=document.querySelector('.language-select')?.value;return I18N[v]?v:'en';}
  function open(url){window.open(url,'_blank','noopener,noreferrer');}
  function build(){
    const modal=document.getElementById('donationModal');if(!modal||modal.dataset.largeReady==='1')return;
    const oldContinue=document.getElementById('continueDonation');
    const oldIntent=modal.querySelector('.donation-intent');
    const oldNote=document.getElementById('amountNote');
    const oldFoot=modal.querySelector('.donation-footnote');
    oldContinue?.remove();oldIntent?.remove();oldNote?.remove();oldFoot?.remove();
    const header=modal.querySelector('.donation-header');
    const section=document.createElement('div');section.className='large-contribution-options';
    section.innerHTML='<div class="large-custom-option"><div><span class="label" data-large="custom"></span><strong data-large="customNote"></strong></div><button class="continue-button large-custom-button" type="button" data-tier="custom"></button></div><div class="large-divider"><span data-large="big"></span><small data-large="bigNote"></small></div><div class="large-tier-grid"></div><p class="donation-footnote" data-large="foot"></p>';
    header?.after(section);
    const grid=section.querySelector('.large-tier-grid');
    tiers.forEach(([amount,label,note])=>{const card=document.createElement('button');card.type='button';card.className='large-tier-card';card.dataset.tier=String(amount);card.innerHTML=`<strong>${label}</strong><span>${note}</span>`;card.addEventListener('click',()=>open(LINKS[amount]));grid.appendChild(card);});
    section.querySelector('[data-tier="custom"]').addEventListener('click',()=>open(LINKS.custom));
    const close=modal.querySelector('#closeDonationModal');if(close)close.setAttribute('aria-label',I18N[lang()].close);
    modal.dataset.largeReady='1';
    translate();
  }
  function translate(){
    const modal=document.getElementById('donationModal');if(!modal)return;build();
    const t=I18N[lang()];
    const kicker=modal.querySelector('.modal-kicker');const title=modal.querySelector('#donationTitle');const intro=modal.querySelector('.donation-header p:not(.modal-kicker)');
    if(kicker)kicker.textContent=t.kicker;if(title)title.innerHTML=t.title;if(intro)intro.textContent=t.intro;
    modal.querySelectorAll('[data-large]').forEach(el=>{const key=el.dataset.large;if(t[key])el.textContent=t[key];});
    const close=modal.querySelector('#closeDonationModal');if(close)close.setAttribute('aria-label',t.close);
  }
  function init(){
    build();
    document.querySelectorAll('#openDonationModal,[data-open-donation]').forEach(b=>b.addEventListener('click',()=>setTimeout(translate,0)));
    document.querySelector('.language-select')?.addEventListener('change',()=>setTimeout(translate,0));
    window.addEventListener('iwbr:languagechange',translate);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init);else init();
})();
