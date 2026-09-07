(()=>{
  "use strict";
  const SUPABASE_URL="https://ofcdtwrgyxjrpoxuikxg.supabase.co";
  const SUPABASE_KEY="sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";
  const sb=window.supabase?.createClient(SUPABASE_URL,SUPABASE_KEY,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:true}});
  const $=id=>document.getElementById(id);
  const bell=$("notificationBell"),panel=$("notificationsPanel"),list=$("notificationList"),count=$("notificationCount"),markAll=$("markAllNotifications");
  if(!sb||!bell||!panel||!list)return;
  let notifications=[];
  const escapeText=value=>String(value??"");
  const relativeTime=value=>{
    const ms=Math.max(0,Date.now()-new Date(value).getTime());
    const minutes=Math.floor(ms/60000),hours=Math.floor(minutes/60),days=Math.floor(hours/24);
    if(minutes<1)return "just now"; if(minutes<60)return `${minutes}m ago`; if(hours<24)return `${hours}h ago`; if(days<7)return `${days}d ago`;
    return new Intl.DateTimeFormat(undefined,{dateStyle:"medium"}).format(new Date(value));
  };
  function render(){
    const unread=notifications.filter(n=>!n.read_at).length;
    count.hidden=!unread; count.textContent=unread>99?"99+":String(unread);
    markAll.disabled=unread===0;
    if(!notifications.length){list.innerHTML='<p class="muted">You are all caught up.</p>';return;}
    list.replaceChildren(...notifications.map(n=>{
      const item=document.createElement("article"); item.className=`notification-item${n.read_at?"":" is-unread"}`;
      const title=document.createElement("strong"); title.textContent=escapeText(n.title||"Notification");
      const body=document.createElement("p"); body.textContent=escapeText(n.body||"");
      const meta=document.createElement("small"); meta.textContent=relativeTime(n.created_at);
      const action=document.createElement("button"); action.type="button"; action.className="text-button notification-read"; action.textContent=n.read_at?"Read":"Mark read"; action.disabled=Boolean(n.read_at); action.addEventListener("click",()=>markRead(n));
      const head=document.createElement("div"); head.className="notification-item-head"; head.append(title,meta);
      item.append(head,body,action); return item;
    }));
  }
  async function load(){
    const {data:{session}}=await sb.auth.getSession();
    if(!session){return;}
    const {data,error}=await sb.from("notifications").select("id,type,title,body,data,read_at,created_at").eq("user_id",session.user.id).order("created_at",{ascending:false}).limit(30);
    if(error){list.innerHTML='<p class="muted">Notifications are temporarily unavailable.</p>';return;}
    notifications=data||[]; render();
  }
  async function markRead(notification){
    const {data:{session}}=await sb.auth.getSession(); if(!session)return;
    const {error}=await sb.rpc("mark_notification_read",{p_user_id:session.user.id,p_notification_id:notification.id});
    if(error)return;
    notification.read_at=new Date().toISOString(); render();
  }
  markAll.addEventListener("click",async()=>{
    const {data:{session}}=await sb.auth.getSession(); if(!session)return;
    const ids=notifications.filter(n=>!n.read_at).map(n=>n.id);
    for(const id of ids){await sb.rpc("mark_notification_read",{p_user_id:session.user.id,p_notification_id:id});}
    const now=new Date().toISOString(); notifications.forEach(n=>{if(!n.read_at)n.read_at=now;}); render();
  });
  bell.addEventListener("click",()=>{const open=!panel.hidden;panel.hidden=open;bell.setAttribute("aria-expanded",String(!open));if(!open)load();});
  sb.auth.onAuthStateChange((event)=>{if(event==="SIGNED_IN"||event==="TOKEN_REFRESHED")load();});
  load();
})();
