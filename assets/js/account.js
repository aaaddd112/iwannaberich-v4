(()=>{
  "use strict";
  const SUPABASE_URL = "https://ofcdtwrgyxjrpoxuikxg.supabase.co";
  const SUPABASE_KEY = "sb_publishable_LFdAnDWHYAiilgDgD2324w_ZjZssTpA";
  const sb = window.supabase?.createClient(SUPABASE_URL, SUPABASE_KEY, { auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true } });
  const $ = (id) => document.getElementById(id);
  const params = new URLSearchParams(location.search);
  const ref = params.get("ref") || params.get("g");
  if (ref) localStorage.setItem("iwbr_referral", ref.trim().toLowerCase());
  const analytics=(name,metadata={},options={})=>window.IWBRAnalytics?.trackEvent(name,metadata,options);
  function message(text, type = "") { const el = $("accountMessage"); if (!el) return; el.textContent = text; el.className = `account-message ${type}`; }
  function show(view) { document.querySelectorAll("[data-account-view]").forEach(el => el.hidden = el.dataset.accountView !== view); }
  function addRecoveryViews() {
    const card = document.querySelector(".account-card");
    if (!card || $("recoveryView") || $("resetView")) return;
    const login = document.querySelector('[data-account-view="login"]');
    const recovery = document.createElement("div"); recovery.dataset.accountView = "recovery"; recovery.id = "recoveryView"; recovery.hidden = true;
    recovery.innerHTML = '<p class="label">ACCOUNT RECOVERY</p><h2>Reset your sign-in secret</h2><form id="recoveryForm" class="account-form"><label>Email<input id="recoveryEmail" type="email" autocomplete="email" required></label><button class="btn primary" type="submit">Send recovery email →</button></form><button class="text-button" id="recoveryBack" type="button">Back to sign in.</button>';
    const reset = document.createElement("div"); reset.dataset.accountView = "reset"; reset.id = "resetView"; reset.hidden = true;
    reset.innerHTML = '<p class="label">ACCOUNT RECOVERY</p><h2>Choose a new sign-in secret</h2><form id="resetForm" class="account-form"><label>New secret<input id="resetSecret" type="password" autocomplete="new-password" minlength="8" required><small>At least 8 characters.</small></label><label>Confirm new secret<input id="resetConfirm" type="password" autocomplete="new-password" minlength="8" required></label><button class="btn primary" type="submit">Update →</button></form>';
    card.insertBefore(recovery, login || card.firstChild); card.insertBefore(reset, recovery.nextSibling);
    $("recoveryForm").addEventListener("submit", async e => { e.preventDefault(); const email=$("recoveryEmail").value.trim(); if(!email)return; const button=e.currentTarget.querySelector("button"); button.disabled=true; message("Sending recovery email…"); try { const {error}=await sb.auth.resetPasswordForEmail(email,{redirectTo:`${location.origin}/account.html`}); if(error) return message("We couldn't send the recovery email. Please try again later.","error"); message("If an account exists for that email, a recovery link has been sent.","success"); e.currentTarget.reset(); } finally { button.disabled=false; } });
    $("recoveryBack").addEventListener("click",()=>{show("login");message("")});
    $("resetForm").addEventListener("submit",async e=>{e.preventDefault();const next=$("resetSecret").value,confirm=$("resetConfirm").value;if(next.length<8)return message("Use at least 8 characters.","error");if(next!==confirm)return message("New secrets do not match.","error");const button=e.currentTarget.querySelector("button");button.disabled=true;message("Updating your account…");try{const {error}=await sb.auth.updateUser({password:next});if(error)return message("We couldn't update your account. Please request a new recovery link.","error");e.currentTarget.reset();await sb.auth.signOut();history.replaceState({},document.title,"account.html");show("login");message("Your sign-in secret was updated. You can sign in now.","success")}finally{button.disabled=false}});
  }
  async function createProfile(session) {
    const username = $("username")?.value.trim().toLowerCase(); const displayName = $("displayName")?.value.trim() || null;
    if (!/^[a-z0-9_-]{3,24}$/.test(username)) { message("Username must be 3–24 characters: letters, numbers, _ or -.", "error"); return false; }
    const { error } = await sb.functions.invoke("create-profile", { body: { username, display_name: displayName } });
    if (error) { const status = error.context?.status; if (status === 409) message("That username is unavailable. Try another one.", "error"); else message("We couldn't create your profile. Please try again.", "error"); return false; }
    analytics("profile_complete",{method:"account"},{oncePerSession:true});
    const storedRef = localStorage.getItem("iwbr_referral"); if (storedRef) await sb.rpc("register_referral", { p_code: storedRef, p_referred_user_id: session.user.id }); localStorage.removeItem("iwbr_referral"); location.href = "profile.html"; return true;
  }
  async function refresh() {
    if (!sb) return; const { data: { session } } = await sb.auth.getSession();
    if (!session) { show("login"); return; }
    if (new URLSearchParams(location.hash.replace(/^#/, "")).get("type") === "recovery") { show("reset"); return; }
    const { data } = await sb.from("profiles").select("id,username,display_name").eq("id", session.user.id).maybeSingle();
    if (data) location.href = "profile.html"; else show("profile");
  }
  document.addEventListener("DOMContentLoaded", async () => {
    if (!sb) return message("Account services are unavailable.", "error");
    addRecoveryViews();
    const login = document.querySelector('[data-account-view="login"]');
    if (login && !$("forgotPassword")) { const button=document.createElement("button");button.id="forgotPassword";button.className="text-button";button.type="button";button.textContent="Forgot your password?";login.appendChild(button);button.addEventListener("click",()=>show("recovery")); }
    $("loginForm")?.addEventListener("submit", async e => { e.preventDefault(); message("Signing you in…"); const email=$("loginEmail").value.trim(), password=$("loginPassword").value; const {error}=await sb.auth.signInWithPassword({email,password}); if(error){message("Invalid email or password.","error");return;} analytics("login_success",{method:"password"},{oncePerSession:true}); await refresh(); });
    $("signupForm")?.addEventListener("focusin",()=>analytics("signup_start",{surface:"account"},{oncePerSession:true}));
    $("signupForm")?.addEventListener("submit", async e => { e.preventDefault(); const email=$("signupEmail").value.trim(), password=$("signupPassword").value; if(password.length<8){message("Use at least 8 characters for your password.","error");return;} message("Creating your account…"); const {data,error}=await sb.auth.signUp({email,password,options:{emailRedirectTo:`${location.origin}/account.html`}}); if(error){message(error.message,"error");return;} analytics("signup_complete",{verification_required:!Boolean(data.session)},{oncePerSession:true}); if(data.session){ show("profile"); message("Account created. Choose your public identity.","success"); } else { show("verify"); message("Check your email to verify the account.","success"); } });
    $("profileForm")?.addEventListener("submit", async e => { e.preventDefault(); const {data:{session}}=await sb.auth.getSession(); if(session) await createProfile(session); });
    $("signOut")?.addEventListener("click", async()=>{await sb.auth.signOut(); location.href="account.html";});
    $("switchSignup")?.addEventListener("click",()=>show("signup")); $("switchLogin")?.addEventListener("click",()=>show("login")); $("switchLogin2")?.addEventListener("click",()=>show("login"));
    sb.auth.onAuthStateChange((event) => { if (event === "PASSWORD_RECOVERY") show("reset"); });
    await refresh();
  });
})();
