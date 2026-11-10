import RegisterRoute from '../../components/content/RegisterRoute';
export default async function Page({searchParams}:{searchParams:Promise<{next?:string}>}){const params=await searchParams;return <RegisterRoute next={params.next}/>}
