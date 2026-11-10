import { NextRequest,NextResponse } from 'next/server';
import { API_URL } from '../../../../lib/api';
import { SESSION_COOKIE } from '../../../../lib/session';
import { demoApiFetch,isDemoMode } from '../../../../lib/demoApi';
async function handleProxy(request:NextRequest,{params}:{params:Promise<{path:string[]}>}){
 const {path}=await params,token=request.cookies.get(SESSION_COOKIE)?.value,method=request.method;
 let body:unknown; if(!['GET','HEAD'].includes(method)){if(request.headers.get('content-type')?.includes('application/json'))body=await request.json().catch(()=>undefined);else body=await request.formData().catch(()=>undefined)}
 let response:Response,payload:unknown;
 if(isDemoMode()){try{payload=await demoApiFetch(`/${path.join('/')}${request.nextUrl.search}`,token,method,body);response=NextResponse.json(payload)}catch(error){const failure=error as {statusCode?:number;code?:string;message?:string;path?:string};response=NextResponse.json({statusCode:failure.statusCode||500,code:failure.code||'INTERNAL_ERROR',message:failure.message||'Preview request failed',path:failure.path||request.nextUrl.pathname},{status:failure.statusCode||500})}}
 else{const headers=new Headers(request.headers);headers.delete('host');headers.delete('cookie');if(token)headers.set('Authorization',`Bearer ${token}`);let rawBody:BodyInit|undefined;if(body instanceof FormData){rawBody=body;headers.delete('content-length')}else if(body!==undefined){headers.set('Content-Type','application/json');rawBody=JSON.stringify(body)}const upstream=await fetch(`${API_URL}/${path.join('/')}${request.nextUrl.search}`,{method,headers,body:rawBody,cache:'no-store'});const raw=await upstream.arrayBuffer();payload=raw;response=new NextResponse(raw,{status:upstream.status,headers:{'content-type':upstream.headers.get('content-type')||'application/json'}})}
 const out=response instanceof NextResponse?response:new NextResponse(response.body,{status:response.status});
 if(isDemoMode()&&(path.join('/')==='auth/login'||path.join('/')==='auth/register')&&response.ok){const data=payload as {accessToken?:string};if(data?.accessToken)out.cookies.set(SESSION_COOKIE,data.accessToken,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:604800})}
 if(response.status===401)out.cookies.delete(SESSION_COOKIE);return out
}
export const GET=handleProxy,POST=handleProxy,PATCH=handleProxy,PUT=handleProxy,DELETE=handleProxy;
