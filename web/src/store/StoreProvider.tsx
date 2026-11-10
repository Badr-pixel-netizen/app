'use client';
import { Provider } from 'react-redux';
import { useRef } from 'react';
import { makeStore,AppStore } from './store';
import type { User } from '../lib/types';
export default function StoreProvider({children,user=null}:{children:React.ReactNode;user?:User|null}){const ref=useRef<AppStore|null>(null);if(!ref.current)ref.current=makeStore({currentUser:user});return <Provider store={ref.current}>{children}</Provider>}
