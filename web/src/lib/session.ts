import 'server-only';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { cache } from 'react';
export const SESSION_COOKIE='cinemahub_session';
export const getSessionToken=cache(async()=> (await cookies()).get(SESSION_COOKIE)?.value ?? null);
export async function setSessionToken(token:string){(await cookies()).set(SESSION_COOKIE,token,{httpOnly:true,sameSite:'lax',secure:process.env.NODE_ENV==='production',path:'/',maxAge:60*60*24*7});}
export async function clearSessionToken(){(await cookies()).delete(SESSION_COOKIE);}
export async function requireSessionToken(){const token=await getSessionToken();if(!token)redirect('/login');return token;}
