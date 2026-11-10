'use client';
import { useRouter } from 'next/navigation';
import { NotFound404Page } from '../components/screens/PublicScreens';
export default function NotFound(){const router=useRouter();return <NotFound404Page onNavigate={router.push}/>}

