'use client';
import { AdminShell } from './AdminComponents';
import StoreProvider from '../../store/StoreProvider';
import type { User } from '../../lib/types';
import { usePathname,useRouter } from 'next/navigation';
export default function AdminRouteShell({children,user}:{children:React.ReactNode;user:User}){const p=usePathname()||"/",r=useRouter();return <StoreProvider user={user}><AdminShell currentPath={p} onNavigate={r.push}>{children}</AdminShell></StoreProvider>}

