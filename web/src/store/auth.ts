'use client';
import { useCallback,useEffect } from 'react';
import { useAppDispatch,useAppSelector } from './hooks';
import { setCurrentUser } from './currentUserSlice';
import { apiFetch } from '../lib/client-api';
import type { AuthResponse,User,UserRole } from '../lib/types';
interface RegisterInput{fullName:string;email:string;password:string;phone?:string}
export function AuthBootstrap(){const dispatch=useAppDispatch();useEffect(()=>{let active=true;apiFetch<User>('/auth/me',{skipAuthRedirect:true}).then(u=>active&&dispatch(setCurrentUser(u))).catch(()=>active&&dispatch(setCurrentUser(null)));return()=>{active=false}},[dispatch]);return null}
export function useAuth(){const user=useAppSelector(s=>s.currentUser),dispatch=useAppDispatch();const login=useCallback(async(email:string,password:string)=>{const res=await apiFetch<AuthResponse>('/auth/login',{method:'POST',body:{email,password},skipAuthRedirect:true});dispatch(setCurrentUser(res.user));return res.user},[dispatch]);const register=useCallback(async(input:RegisterInput)=>{const res=await apiFetch<AuthResponse>('/auth/register',{method:'POST',body:input,skipAuthRedirect:true});dispatch(setCurrentUser(res.user));return res.user},[dispatch]);const logout=useCallback(()=>{void fetch('/api/session',{method:'DELETE'});dispatch(setCurrentUser(null))},[dispatch]);return {user,loading:false,login,register,logout,refreshUser:async()=>{const me=await apiFetch<User>('/auth/me',{skipAuthRedirect:true});dispatch(setCurrentUser(me))},quickSwitchRole:async(_role:UserRole|'GUEST')=>{}}}
