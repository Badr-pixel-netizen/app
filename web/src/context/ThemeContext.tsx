import React, { createContext, useContext, useEffect, useState } from 'react';
type ThemeMode='dark'|'light';
interface ThemeContextValue{theme:ThemeMode;toggleTheme:()=>void;setTheme:(theme:ThemeMode)=>void}
const ThemeContext=createContext<ThemeContextValue|undefined>(undefined);
const THEME_STORAGE_KEY='cinemahub_theme';
export function ThemeProvider({children}:{children:React.ReactNode}){
 const [theme,setThemeState]=useState<ThemeMode>('dark');
 const [ready,setReady]=useState(false);
 useEffect(()=>{const saved=window.localStorage.getItem(THEME_STORAGE_KEY);if(saved==='light'||saved==='dark')setThemeState(saved);setReady(true)},[]);
 useEffect(()=>{if(!ready)return;const root=document.documentElement;if(theme==='dark')root.classList.add('dark');else root.classList.remove('dark');window.localStorage.setItem(THEME_STORAGE_KEY,theme)},[theme,ready]);
 const toggleTheme=()=>setThemeState(prev=>prev==='dark'?'light':'dark');
 return <ThemeContext.Provider value={{theme,toggleTheme,setTheme:setThemeState}}>{children}</ThemeContext.Provider>;
}
export function useTheme():ThemeContextValue{const ctx=useContext(ThemeContext);if(!ctx)throw new Error('useTheme must be used within a ThemeProvider');return ctx}
