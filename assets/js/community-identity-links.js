(()=>{
  "use strict";
  const enhance=()=>{
    document.querySelectorAll(".community-identity,.community-reply").forEach(container=>{
      const handle=container.querySelector(":scope > .community-member-link");
      const name=container.querySelector(":scope > strong");
      if(!handle||!name||handle.contains(name))return;
      handle.prepend(name);
      handle.classList.add("community-identity-link");
    });
  };
  enhance();
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
})();
