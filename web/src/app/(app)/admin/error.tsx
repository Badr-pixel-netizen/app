'use client';
export default function Error({reset}:{error:Error & {digest?:string};reset:()=>void}){return <div role="alert" className="p-8 text-center"><button onClick={reset}>Retry</button></div>}
