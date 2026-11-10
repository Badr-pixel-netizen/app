'use client';
import { ErrorState } from '../../../../components/ui/Kit';
export default function Error({reset}:{error:Error & {digest?:string};reset:()=>void}){return <ErrorState message="Unable to load this page" onRetry={reset}/>}
