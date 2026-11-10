import HomeRoute from '../components/content/HomeRoute';
export default async function Page({searchParams}:{searchParams:Promise<{q?:string}>}){const query=await searchParams;return <HomeRoute query={query.q||''}/>}
