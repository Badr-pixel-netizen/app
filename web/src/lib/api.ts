import 'server-only';
import { clearSessionToken,getSessionToken } from './session';
import { redirect } from 'next/navigation';
import { ApiError } from './types';
import { demoApiFetch,isDemoMode } from './demoApi';
type ServerOptions=Omit<RequestInit,'body'> & {body?:unknown};
export const API_URL=process.env.NEXT_PUBLIC_API_URL||'http://localhost:3001/api/v1';
export async function apiFetch<T>(path:string,options:ServerOptions={}):Promise<T>{const token=await getSessionToken();if(isDemoMode()){try{return await demoApiFetch(path,token??undefined,options.method||'GET',options.body) as T}catch(error){const failure=error as {statusCode?:number;code?:string;message?:string};if(failure.statusCode===401){try{await clearSessionToken()}catch{}redirect('/login')}throw new ApiError({statusCode:failure.statusCode||500,code:failure.code||'INTERNAL_ERROR',message:failure.message||'Request failed'})}}const headers=new Headers(options.headers);if(token)headers.set('Authorization',`Bearer ${token}`);let body:BodyInit|undefined;if(options.body instanceof FormData)body=options.body;else if(options.body!==undefined){headers.set('Content-Type','application/json');body=JSON.stringify(options.body)}const response=await fetch(`${API_URL}/${path.replace(/^\/+/, '')}`,{...options,headers,body,cache:'no-store'});const data=await response.json().catch(()=>null);if(response.status===401){try{await clearSessionToken()}catch{}redirect('/login')}if(!response.ok)throw new ApiError(data||{statusCode:response.status,code:'INTERNAL_ERROR',message:'Request failed'});return data as T}

