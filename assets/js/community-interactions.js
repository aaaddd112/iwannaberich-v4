(()=>{
  "use strict";
  const SUPABASE_URL="https://ofcdtwrgyxjrpoxuikxg.supabase.co";
  const SUPABASE_KEY="sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";
  const VOTE_ENDPOINT=`${SUPABASE_URL}/functions/v1/cast-prediction-vote`;
  const POST_ENDPOINT=`${SUPABASE_URL}/functions/v1/submit-prediction`;
  const REST=`${SUPABASE_URL}/rest/v1`;
  const VOTE_KEY="iwbr_prediction_vote";
  const NICKNAME_KEY="iwbr_community_nickname";
  const MAX=280;
  const $=id=>document.getElementById(id);
  const analytics=(name,data={})=>window.IWBRAnalytics?.trackEvent(name,data);

  async function fetchVotes(){
    const response=await fetch(`${REST}/predictions?id=eq.1&select=yes_count%2Cno_count&limit=1`,{headers:{apikey:SUPABASE_KEY,Authorization:`Bearer ${SUPABASE_KEY}`}});
    if(!response.ok)throw new Error("Vote counts unavailable");
    return (await response.json())?.[0]||{};
  }

  function renderVotes(data){
    const yes=Number(data.yes_count)||0,no=Number(data.no_count)||0,total=yes+no;
    const pct=total?Math.round(yes/total*100):0;
    $("communityYesPercent").textContent=total?`${pct}%`:"–";
    $("communityNoPercent").textContent=total?`${100-pct}%`:"–";
    $("communityVoteYesFill").style.width=`${pct}%`;
    $("communityVoteTotal").textContent=total?`${total.toLocaleString()} votes so far`:"Be the first to vote.";
  }

  function setVoteState(){
    const chosen=localStorage.getItem(VOTE_KEY);
    const yes=$("communityVoteYes"),no=$("communityVoteNo"),status=$("communityVoteStatus");
    yes.classList.toggle("is-selected",chosen==="yes");no.classList.toggle("is-selected",chosen==="no");
    yes.disabled=Boolean(chosen);no.disabled=Boolean(chosen);
    if(chosen)status.textContent=`Your vote: ${chosen.toUpperCase()}`;
  }

  async function castVote(type){
    const yes=$("communityVoteYes"),no=$("communityVoteNo"),status=$("communityVoteStatus");
    if(localStorage.getItem(VOTE_KEY))return;
    yes.disabled=true;no.disabled=true;status.textContent="Recording your vote...";
    try{
      const response=await fetch(VOTE_ENDPOINT,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({prediction_id:1,vote_type:type})});
      const result=await response.json().catch(()=>({}));
      if(!response.ok){
        if(response.status===409){localStorage.setItem(VOTE_KEY,type);setVoteState();status.textContent="Your vote was already recorded.";return;}
        throw new Error(result.error||"Couldn't record your vote.");
      }
      localStorage.setItem(VOTE_KEY,type);setVoteState();status.textContent=`Your vote: ${type.toUpperCase()}`;analytics("community_vote",{vote_type:type});
      renderVotes(await fetchVotes());
    }catch(error){yes.disabled=false;no.disabled=false;status.textContent=error.message||"Couldn't record your vote. Try again.";}
  }

  async function initVoting(){
    if(!$("communityVoteYes"))return;
    $("communityVoteYes").addEventListener("click",()=>castVote("yes"));
    $("communityVoteNo").addEventListener("click",()=>castVote("no"));
    setVoteState();
    try{renderVotes(await fetchVotes())}catch(error){$("communityVoteStatus").textContent="Vote totals are temporarily unavailable."}
  }

  function initComposer(){
    const form=$("communityPredictionForm");if(!form)return;
    const nickname=$("communityNickname"),text=$("communityPrediction"),count=$("communityPredictionCount"),status=$("communityPredictionStatus"),button=$("communityPredictionSubmit");
    const callButtons=[...document.querySelectorAll("[data-community-call]")];
    const stored=localStorage.getItem(NICKNAME_KEY)||"";nickname.value=stored;
    let selectedCall=null;
    const updateCount=()=>{count.textContent=`${MAX-text.value.length} characters left`};
    callButtons.forEach(btn=>btn.addEventListener("click",()=>{selectedCall=btn.dataset.communityCall;callButtons.forEach(x=>x.classList.toggle("is-selected",x===btn));}));
    form.addEventListener("submit",async event=>{
      event.preventDefault();
      const name=nickname.value.trim(),value=text.value.trim();
      if(!/^[a-z0-9 _-]{3,24}$/i.test(name)){status.className="community-composer-status is-error";status.textContent="Nickname must be 3–24 characters.";return}
      if(!selectedCall){status.className="community-composer-status is-error";status.textContent="Choose YES or NO first.";return}
      if(!value||value.length>MAX){status.className="community-composer-status is-error";status.textContent=`Prediction must be 1–${MAX} characters.`;return}
      button.disabled=true;status.className="community-composer-status";status.textContent="Posting...";
      try{
        const response=await fetch(POST_ENDPOINT,{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({comment:`[${selectedCall.toUpperCase()}] ${value}`,nickname:name})});
        const result=await response.json().catch(()=>({}));
        if(!response.ok)throw new Error(result.error||"Couldn't post your prediction.");
        localStorage.setItem(NICKNAME_KEY,name);text.value="";updateCount();status.className="community-composer-status is-success";status.textContent="Prediction posted. It is now part of the public record.";analytics("prediction_submit",{source:"community"});
        document.dispatchEvent(new CustomEvent("iwbr:community-refresh"));
      }catch(error){status.className="community-composer-status is-error";status.textContent=error.message||"Couldn't reach the prediction system. Try again."}
      finally{button.disabled=false}
    });
    text.addEventListener("input",updateCount);updateCount();
  }

  document.addEventListener("DOMContentLoaded",()=>{initVoting();initComposer()});
})();