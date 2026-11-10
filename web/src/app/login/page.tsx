import LoginRoute from '../../components/content/LoginRoute';
export default async function Page({searchParams}:{searchParams:Promise<{next?:string}>}){const params=await searchParams;return <LoginRoute next={params.next}/>}
