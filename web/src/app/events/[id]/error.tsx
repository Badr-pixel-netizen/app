'use client';
export default function Error({reset}:{error:Error & {digest?:string};reset:()=>void}) {return <div className="p-8 text-center" role="alert"><button onClick={reset}>Retry</button></div>}
