'use client';
import { useEffect } from 'react';
export default function Error({reset}:{error:Error & {digest?:string};reset:()=>void}) {useEffect(()=>{console.error('CinemaHub route error');},[]);return <main role="alert" className="min-h-[50vh] flex items-center justify-center"><button onClick={reset} className="cinema-btn-outline px-4 py-2">Reload</button></main>}
