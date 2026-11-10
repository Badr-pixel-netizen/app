import { redirect } from 'next/navigation';
import { apiFetch } from '../../../lib/api';
import { requireSessionToken } from '../../../lib/session';
import type { User } from '../../../lib/types';
import AdminRouteShell from '../../../components/admin/AdminRouteShell';
export default async function AdminLayout({children}:{children:React.ReactNode}){await requireSessionToken();const user=await apiFetch<User>('/auth/me');return <AdminRouteShell user={user}>{children}</AdminRouteShell>}

