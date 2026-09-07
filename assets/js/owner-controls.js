(()=>{
  "use strict";
  const U="https://ofcdtwrgyxjrpoxuikxg.supabase.co",K="sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA",db=window.supabase?.createClient(U,K,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  const $=(s,r=document)=>r.querySelector(s);
  const esc=v=>String(v??"").replace(/[&<>\"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
  async function isOwner(){if(!db)return false;const{data:{session}}=await db.auth.getSession();if(!session)return false;const{data,error}=await db.rpc("get_my_admin_role");return !error&&data==="owner"}
  const actionButton=(label,handler)=>{const b=document.createElement("button");b.type="button";b.className="btn owner-moderation-action";b.textContent=label;b.addEventListener("click",handler);return b};
  async function deleteThread(id){if(!confirm("Delete this discussion? It will be removed from the public community."))return;const{error}=await db.rpc("owner_delete_community_thread",{p_thread_id:id});if(error){alert(error.message||"Could not delete discussion.");return}location.href="community.html"}
  async function deleteReply(id,el){if(!confirm("Delete this reply?"))return;const{error}=await db.rpc("owner_delete_community_reply",{p_reply_id:id});if(error){alert(error.message||"Could not delete reply.");return}el.remove()}
  async function hideComment(id,el){if(!confirm("Hide this community post?"))return;const{error}=await db.rpc("owner_hide_prediction_comment",{p_comment_id:id});if(error){alert(error.message||"Could not hide post.");return}el.remove()}
  function threadControls(){const app=$("threadApp"),id=new URLSearchParams(location.search).get("id"),detail=$(".thread-detail",app);if(!id||!detail||detail.querySelector(".owner-thread-actions"))return;const box=document.createElement("div");box.className="owner-thread-actions";box.appendChild(actionButton("Delete discussion",()=>deleteThread(id)));detail.querySelector(".thread-detail-top")?.appendChild(box);detail.querySelectorAll(".thread-reply[data-reply-id]").forEach(reply=>{if(reply.querySelector(".owner-reply-delete"))return;const controls=$(".thread-reply-actions",reply);if(!controls)return;const b=actionButton("Delete",()=>deleteReply(reply.dataset.replyId,reply));b.classList.add("owner-reply-delete");controls.appendChild(b)})}
  function commentControls(){document.querySelectorAll(".community-post[data-comment-id]").forEach(post=>{if(post.querySelector(".owner-comment-delete"))return;const controls=$(".community-post-controls",post);if(!controls)return;const b=actionButton("Hide",()=>hideComment(post.dataset.commentId,post));b.classList.add("owner-comment-delete");controls.appendChild(b)})}
  async function init(){if(!(await isOwner()))return;threadControls();commentControls();const observer=new MutationObserver(()=>{threadControls();commentControls()});observer.observe(document.body,{childList:true,subtree:true})}
  document.addEventListener("DOMContentLoaded",init,{once:true});
})();
