import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
const ORIGIN="https://iwannaberich.xyz";
const cors={"Access-Control-Allow-Origin":ORIGIN,"Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json"};
const json=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers:cors});
const sb=createClient(Deno.env.get("SUPABASE_URL")!,Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,{auth:{persistSession:false,autoRefreshToken:false}});
Deno.serve(async req=>{
 if(req.method==='OPTIONS')return new Response(null,{status:204,headers:cors});
 if(req.method!=='POST')return json(405,{error:'method_not_allowed'});
 const auth=req.headers.get('Authorization')??'';if(!auth.startsWith('Bearer '))return json(401,{error:'unauthorized'});
 const {data:{user},error}=await sb.auth.getUser(auth.slice(7));if(error||!user)return json(401,{error:'unauthorized'});
 const {data:admin}=await sb.from('admin_users').select('role').eq('user_id',user.id).maybeSingle();if(!admin?.role)return json(403,{error:'not_authorized'});
 let body:any;try{body=await req.json()}catch{return json(400,{error:'invalid_json'})}
 const action=body?.action==='review'?'review':'list';
 if(action==='list'){
  const status=typeof body?.status==='string'?body.status:'open';
  if(!['open','reviewed','dismissed','actioned','all'].includes(status))return json(400,{error:'invalid_status'});
  const {data, error:e}=await sb.rpc('get_community_reports',{p_admin_id:user.id,p_status:status,p_limit:100});if(e)return json(500,{error:'load_failed'});return json(200,{reports:data??[]});
 }
 const id=typeof body?.report_id==='string'?body.report_id:'';const decision=typeof body?.decision==='string'?body.decision:'';const note=typeof body?.note==='string'?body.note.trim():null;
 if(!id||!['reviewed','dismissed','actioned'].includes(decision)||note&&note.length>1000)return json(400,{error:'invalid_review'});
 const {data:ok,error:e}=await sb.rpc('review_community_report',{p_admin_id:user.id,p_report_id:id,p_decision:decision,p_note:note});if(e)return json(400,{error:'review_failed'});return json(200,{success:Boolean(ok)});
});
