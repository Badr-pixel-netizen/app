'use client';
import { AuthPage } from '../../components/screens/PublicScreens';
import { useRouter } from 'next/navigation';
export default function LoginRoute({next}:{next?:string}){const router=useRouter();return <AuthPage mode="login" nextPath={next} onNavigate={router.push}/>}

