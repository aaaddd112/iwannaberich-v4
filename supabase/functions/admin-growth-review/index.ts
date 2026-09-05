import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const cors = {"Access-Control-Allow-Origin":"https://iwannaberich.xyz","Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json"};
const json=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers:cors});
const url=Deno.env.get("SUPABASE_URL")!;
const key=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const ownerEmail=(Deno.env.get("OWNER_EMAIL")??"").trim().toLowerCase();
const sb=createClient(url,key,{auth:{persistSession:false,autoRefreshToken:false}});

Deno.serve(async req=>{
  if(req.method==='OPTIONS') return new Response(null,{status:204,headers:cors});
  if(req.method!=='POST') return json(405,{error:'method_not_allowed'});
  const auth=req.headers.get('Authorization')??'';
  if(!auth.startsWith('Bearer ')) return json(401,{error:'unauthorized'});
  const {data:{user},error:authError}=await sb.auth.getUser(auth.slice(7));
  if(authError||!user) return json(401,{error:'unauthorized'});
  if(!ownerEmail || (user.email??'').trim().toLowerCase()!==ownerEmail) return json(403,{error:'not_authorized'});
  let body:any; try{body=await req.json()}catch{return json(400,{error:'invalid_json'})}
  const action=typeof body?.action==='string'?body.action:'list';
  if(action==='list'){
    const {data,error}=await sb.rpc('get_admin_growth_submissions',{p_admin_id:user.id});
    if(error) return json(500,{error:'could_not_load_submissions'});
    return json(200,{submissions:data??[]});
  }
  if(action==='review'){
    const id=typeof body?.submission_id==='string'?body.submission_id:'';
    const decision=body?.decision==='approve'||body?.decision==='reject'?body.decision:'';
    const reason=typeof body?.reason==='string'?body.reason.trim():null;
    if(!id||!decision) return json(400,{error:'invalid_review'});
    if(reason&&reason.length>1000) return json(400,{error:'reason_too_long'});
    const {data,error}=await sb.rpc('review_growth_mention',{p_reviewer_id:user.id,p_submission_id:id,p_decision:decision,p_reason:reason});
    if(error) return json(400,{error:error.message||'review_failed'});
    return json(200,{success:Boolean(data)});
  }
  return json(400,{error:'invalid_action'});
});
