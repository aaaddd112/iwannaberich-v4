import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const ORIGIN = "https://iwannaberich.xyz";
const cors = {"Access-Control-Allow-Origin":ORIGIN,"Access-Control-Allow-Headers":"authorization, x-client-info, apikey, content-type","Access-Control-Allow-Methods":"POST, OPTIONS","Content-Type":"application/json"};
const json=(status:number,body:unknown)=>new Response(JSON.stringify(body),{status,headers:cors});
const url=Deno.env.get("SUPABASE_URL")!;
const serviceKey=Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
const salt=Deno.env.get("ANALYTICS_RATE_LIMIT_SALT")??"iwbr-community-report-v1";
const sb=createClient(url,serviceKey,{auth:{persistSession:false,autoRefreshToken:false}});
const reasons=new Set(["spam","harassment","hate","scam","sexual","other"]);
const ip=(req:Request)=>(req.headers.get("cf-connecting-ip")??req.headers.get("x-real-ip")??req.headers.get("x-forwarded-for")??"unknown").split(",")[0].trim().slice(0,128);
const hash=async(s:string)=>{const b=await crypto.subtle.digest("SHA-256",new TextEncoder().encode(s));return [...new Uint8Array(b)].map(x=>x.toString(16).padStart(2,"0")).join("")};

Deno.serve(async req=>{
 if(req.method==='OPTIONS') return new Response(null,{status:204,headers:cors});
 if(req.method!=='POST') return json(405,{error:'method_not_allowed'});
 const raw=await req.text(); if(raw.length>4096) return json(413,{error:'body_too_large'});
 let body:any; try{body=JSON.parse(raw)}catch{return json(400,{error:'invalid_json'})}
 const commentId=typeof body?.comment_id==='string'?body.comment_id:'';
 const reason=typeof body?.reason==='string'?body.reason.trim():'';
 const details=typeof body?.details==='string'?body.details.trim():'';
 if(!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(commentId)||!reasons.has(reason)) return json(400,{error:'invalid_report'});
 if(details.length>500) return json(400,{error:'details_too_long'});
 let userId:string|null=null;
 const auth=req.headers.get('Authorization')??'';
 if(auth.startsWith('Bearer ')){const {data:{user}}=await sb.auth.getUser(auth.slice(7)); if(user) userId=user.id;}
 const reporterHash=await hash(`${ip(req)}|${userId??''}|${req.headers.get('user-agent')??''}|${salt}`);
 const {data:allowed,error:rateError}=await sb.rpc('consume_api_rate_limit',{p_bucket:'community-report',p_ip_hash:reporterHash,p_max_10m:5,p_max_day:20});
 if(rateError||allowed!==true) return json(429,{error:'rate_limited'});
 const {data,error}=await sb.rpc('submit_community_report',{p_comment_id:commentId,p_reporter_user_id:userId,p_reporter_hash:reporterHash,p_reason:reason,p_details:details||null});
 if(error){const msg=String(error.message??''); if(msg.includes('duplicate_report')) return json(409,{error:'already_reported'}); if(msg.includes('comment_not_found')) return json(404,{error:'comment_not_found'}); return json(400,{error:'report_failed'});}
 return json(201,{success:true,report_id:data});
});
