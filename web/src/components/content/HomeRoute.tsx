'use client';
import { useSearchParams,useRouter } from 'next/navigation';
import { HomePage } from '../../components/screens/PublicScreens';
export default function HomeRoute({query}:{query:string}){const router=useRouter();return <HomePage initialQuery={query} onNavigate={router.push}/>}


