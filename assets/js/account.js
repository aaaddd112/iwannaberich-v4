(() => {
  "use strict";
  const SUPABASE_URL = "https://ofcdtwrgyxjrpoxuikxg.supabase.co";
  const SUPABASE_KEY = "sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";
  const sb = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  const $ = (id) => document.getElementById(id);
  const ref = new URLSearchParams(location.search).get("ref");
  if (ref) localStorage.setItem("iwbr_referral", ref.trim().toLowerCase());
  function message(text, type = "") { const el = $("accountMessage"); if (!el) return; el.textContent = text; el.className = `account-message ${type}`; }
  function show(view) { document.querySelectorAll("[data-account-view]").forEach(el => el.hidden = el.dataset.accountView !== view); }
  async function createProfile(session) {
    const username = $("username")?.value.trim().toLowerCase();
    const displayName = $("displayName")?.value.trim() || null;
    if (!/^[a-z0-9_-]{3,24}$/.test(username)) { message("Username must be 3–24 characters: letters, numbers, _ or -.", "error"); return false; }
    const { error } = await sb.functions.invoke("create-profile", { body: { username, display_name: displayName } });
    if (error) {
      const status = error.context?.status;
      if (status === 409) message("That username is unavailable. Try another one.", "error");
      else message("We couldn't create your profile. Please try again.", "error");
      return false;
    }
    const storedRef = localStorage.getItem("iwbr_referral");
    if (storedRef) await sb.rpc("register_referral", { p_code: storedRef, p_referred_user_id: session.user.id });
    localStorage.removeItem("iwbr_referral");
    location.href = "profile.html";
    return true;
  }
  async function refresh() {
    if (!sb) return;
    const { data: { session } } = await sb.auth.getSession();
    if (!session) { show("login"); return; }
    const { data } = await sb.from("profiles").select("id,username,display_name").eq("id", session.user.id).maybeSingle();
    if (data) location.href = "profile.html"; else show("profile");
  }
  document.addEventListener("DOMContentLoaded", async () => {
    if (!sb) return message("Account services are unavailable.", "error");
    $("loginForm")?.addEventListener("submit", async e => { e.preventDefault(); message("Signing you in…"); const email=$("loginEmail").value.trim(), password=$("loginPassword").value; const {error}=await sb.auth.signInWithPassword({email,password}); if(error){message("Invalid email or password.","error");return;} await refresh(); });
    $("signupForm")?.addEventListener("submit", async e => { e.preventDefault(); const email=$("signupEmail").value.trim(), password=$("signupPassword").value; if(password.length<8){message("Use at least 8 characters for your password.","error");return;} message("Creating your account…"); const {data,error}=await sb.auth.signUp({email,password,options:{emailRedirectTo:`${location.origin}/account.html`}}); if(error){message(error.message,"error");return;} if(data.session){ show("profile"); message("Account created. Choose your public identity.","success"); } else { show("verify"); message("Check your email to verify the account.","success"); } });
    $("profileForm")?.addEventListener("submit", async e => { e.preventDefault(); const {data:{session}}=await sb.auth.getSession(); if(session) await createProfile(session); });
    $("signOut")?.addEventListener("click", async()=>{await sb.auth.signOut(); location.href="account.html";});
    $("switchSignup")?.addEventListener("click",()=>show("signup"));
    $("switchLogin")?.addEventListener("click",()=>show("login"));
    $("switchLogin2")?.addEventListener("click",()=>show("login"));
    await refresh();
  });
})();
