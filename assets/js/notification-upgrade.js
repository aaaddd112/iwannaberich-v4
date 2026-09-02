(()=>{
  "use strict";

  const messages=[
    {title:"🚨 The billionaire plan has been reviewed.",amount:"It survived peer review. Barely."},
    {title:"📈 Net worth update.",amount:"Still €13. But now it’s personal."},
    {title:"👀 Someone is watching the experiment.",amount:"No idea who. Probably you."},
    {title:"💸 €13 has been raised.",amount:"The billion is still taking the scenic route."},
    {title:"🧠 A terrible idea is gaining traction.",amount:"Please don’t encourage it."},
    {title:"📋 Business plan status.",amount:"Step 1: get rich. Step 2: figure out Step 1."},
    {title:"🏦 The bank balance was checked.",amount:"The bank remains cautiously optimistic."},
    {title:"🌐 The internet has been asked to help.",amount:"The internet has seen worse ideas."},
    {title:"🎯 Current objective: €100.",amount:"€87 to go. No pressure."},
    {title:"🫡 Another visitor has entered the experiment.",amount:"Welcome. There are no refunds on curiosity."},
    {title:"⚠️ Billionaire status remains unconfirmed.",amount:"Authorities have been notified."},
    {title:"📊 Financial strategy updated.",amount:"The strategy is still ‘see what happens’."}
  ];

  const oldToNew={
    "🔔 €1.00 has entered the building.":messages[3],
    "🔔 Your net worth was checked.":messages[1],
    "🔔 The billionaire department called.":messages[10],
    "🔔 Someone opened the business plan.":messages[5],
    "🔔 A financial advisor has concerns.":messages[0],
    "🔔 The internet has been notified.":messages[7],
    "🔔 Forbes has not called.":messages[10],
    "🔔 Your accountant is typing…":messages[6],
    "🔔 Someone suggested getting a real job.":messages[4],
    "🔔 Billionaire status detected.":messages[10]
  };

  function install(){
    const notice=document.getElementById("financialCommentary");
    const text=document.getElementById("commentaryText");
    const amount=document.getElementById("commentaryAmount");
    if(!notice||!text)return;

    const style=document.createElement("style");
    style.textContent=`
      .notification{
        bottom:92px !important;
        z-index:2147483000 !important;
      }
      @media (max-width:1099px){
        .notification{
          bottom:max(86px,calc(env(safe-area-inset-bottom) + 72px)) !important;
        }
      }
    `;
    document.head.appendChild(style);

    const replace=()=>{
      const item=oldToNew[text.textContent.trim()];
      if(!item)return;
      text.textContent=item.title;
      if(amount)amount.textContent=item.amount;
    };

    replace();
    new MutationObserver(replace).observe(text,{childList:true,characterData:true,subtree:true});
  }

  if(document.readyState==="loading")document.addEventListener("DOMContentLoaded",install);else install();
})();
