'use server';
import { cookies } from 'next/headers';
export async function setLanguageCookie(lang:'ar'|'en'){const validLang=lang==='en'?'en':'ar';(await cookies()).set('cinema_lang',validLang,{sameSite:'lax',path:'/',maxAge:31536000});return {ok:true,lang:validLang}}
