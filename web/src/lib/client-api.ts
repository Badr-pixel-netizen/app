import { ApiError, type ApiErrorShape } from './types';
type ClientOptions=Omit<RequestInit,'body'> & {body?:unknown;skipAuthRedirect?:boolean};
export async function apiFetch<T>(path:string,options:ClientOptions={}):Promise<T>{
 const headers=new Headers(options.headers);let body:BodyInit|undefined;
 if(options.body instanceof FormData)body=options.body;else if(options.body!==undefined){headers.set('Content-Type','application/json');body=JSON.stringify(options.body)}
 const {skipAuthRedirect:_skip,...requestOptions}=options;
 const response=await fetch(`/api/proxy/${path.replace(/^\/+/, '')}`,{...requestOptions,headers,body});const data=await response.json().catch(()=>null);
 if(response.status===401&&!options.skipAuthRedirect&&typeof window!=='undefined'){const current=window.location.pathname+window.location.search;if(!current.startsWith('/login')&&!current.startsWith('/register'))window.location.assign('/login?next='+encodeURIComponent(current))}
 if(!response.ok){const error=(data||{statusCode:response.status,code:'INTERNAL_ERROR',message:'Request failed'}) as ApiErrorShape;throw new ApiError(error)}return data as T
}
