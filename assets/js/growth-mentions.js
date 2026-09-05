(()=>{
'use strict';
const URL_BASE='https://ofcdtwrgyxjrpoxuikxg.supabase.co';
const KEY='sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA';
const sb=window.supabase?.createClient(URL_BASE,KEY,{auth:{persistSession:true,autoRefreshToken:true}});
const $=id=>document.getElementById(id);
async function submit(){
 const message=$('growthMentionMessage');
 const {data:{session}}=await sb.auth.getSession();
 if(!session){if(message)message.textContent='Sign in to submit a mention.';return}
 const platform=$('growthMentionPlatform')?.value.trim();
 const url=$('growthMentionUrl')?.value.trim();
 const description=$('growthMentionDescription')?.value.trim();
 if(!platform||!url||!description){if(message)message.textContent='Fill in all three fields.';return}
 try{new URL(url)}catch{if(message)message.textContent='Enter a valid URL.';return}
 const {data,error}=await sb.functions.invoke('submit-growth-mention',{body:{platform,url,description}});
 if(error||data?.error){if(message)message.textContent=data?.error||error?.message||'Submission failed.';return}
 if(message)message.textContent='Submitted. We will review it.';
 $('growthMentionForm')?.reset();
}
function init(){$('growthMentionForm')?.addEventListener('submit',e=>{e.preventDefault();submit()})}
document.addEventListener('DOMContentLoaded',init,{once:true});
})();
