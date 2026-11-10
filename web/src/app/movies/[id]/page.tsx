import { notFound } from 'next/navigation';
import ContentRoute from '../../../components/content/ContentRoute';
export default async function Page({params}:{params:Promise<{id:string}>}) {const {id}=await params;if(!id)notFound();return <ContentRoute kind="movie" id={decodeURIComponent(id)}/>}
