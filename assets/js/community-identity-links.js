(()=>{
  "use strict";
  const makeOwnerLink=(container,name)=>{
    if(!name||name.textContent.trim()!=="IWANNABERICH"||container.querySelector("a.community-identity-link"))return;
    const tag=container.querySelector(":scope > .community-tag");
    const isOfficial=tag?.textContent.trim()==="OFFICIAL" || container.classList.contains("community-reply");
    if(!isOfficial)return;
    const link=document.createElement("a");
    link.href="member.html?u=owneriwbr";
    link.className="community-member-link community-identity-link community-owner-profile-link";
    link.appendChild(name);
    container.prepend(link);
  };
  const enhance=()=>{
    document.querySelectorAll(".community-identity,.community-reply").forEach(container=>{
      const handle=container.querySelector(":scope > .community-member-link");
      const name=container.querySelector(":scope > strong");
      if(handle&&name&&!handle.contains(name)){
        handle.prepend(name);
        handle.classList.add("community-identity-link");
      }else if(!handle&&name){
        makeOwnerLink(container,name);
      }
    });
  };
  enhance();
  new MutationObserver(enhance).observe(document.body,{childList:true,subtree:true});
})();
