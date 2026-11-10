'use client';
import { useRouter } from 'next/navigation';
import { ContentDetailPage } from '../../components/screens/PublicScreens';
export default function ContentRoute({kind,id}:{kind:'movie'|'event';id:string}) {const router=useRouter();return <ContentDetailPage kind={kind} id={id} onNavigate={router.push}/>}

