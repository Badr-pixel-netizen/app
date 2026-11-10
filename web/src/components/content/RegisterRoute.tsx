'use client';
import { AuthPage } from '../../components/screens/PublicScreens';
import { useRouter } from 'next/navigation';
export default function RegisterRoute({next}:{next?:string}){const router=useRouter();return <AuthPage mode="register" nextPath={next} onNavigate={router.push}/>}

