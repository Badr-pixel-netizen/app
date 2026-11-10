import type { Metadata } from 'next';
import { Cairo, Cinzel, IBM_Plex_Mono, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import AppProviders from './AppProviders';
const cairo=Cairo({subsets:['arabic','latin'],variable:'--font-cairo',display:'swap'});
const cinzel=Cinzel({subsets:['latin'],variable:'--font-cinzel',display:'swap'});
const mono=IBM_Plex_Mono({subsets:['latin'],weight:['400','500','600','700'],variable:'--font-mono',display:'swap'});
const jakarta=Plus_Jakarta_Sans({subsets:['latin'],variable:'--font-jakarta',display:'swap'});
export const metadata:Metadata={title:'Salamiyah Cinema',description:'CinemaHub'};
export default function RootLayout({children}:{children:React.ReactNode}) { return <html lang="ar" dir="rtl" className={`dark ${cairo.variable} ${cinzel.variable} ${mono.variable} ${jakarta.variable}`}><body><AppProviders>{children}</AppProviders></body></html> }
