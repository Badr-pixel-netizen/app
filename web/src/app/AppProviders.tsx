'use client';
import { usePathname, useRouter } from 'next/navigation';
import { LanguageProvider } from '../context/LanguageContext';
import { AuthBootstrap } from '../store/auth';
import StoreProvider from '../store/StoreProvider';
import { ThemeProvider } from '../context/ThemeContext';
import { ToastProvider } from '../components/ui/Toast';
import { Navbar, Footer } from '../components/layout/Navbar';
export default function AppProviders({children}:{children:React.ReactNode}) {
 const router=useRouter(); const path=usePathname()||"/"; const navigate=(to:string)=>router.push(to);
 return <StoreProvider><AuthBootstrap/><LanguageProvider><ThemeProvider><ToastProvider><div className="min-h-screen flex flex-col bg-[#FFFDF7] dark:bg-[#0F0F0F] text-[#0F0F0F] dark:text-white transition-colors duration-200"><Navbar currentPath={path} onNavigate={navigate}/><main className="flex-1">{children}</main><Footer onNavigate={navigate}/></div></ToastProvider></ThemeProvider></LanguageProvider></StoreProvider>;
}



