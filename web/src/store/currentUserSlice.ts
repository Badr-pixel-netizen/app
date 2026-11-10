import { createSlice,PayloadAction } from '@reduxjs/toolkit';
import type { User } from '../lib/types';
const currentUserSlice=createSlice({name:'currentUser',initialState:null as User|null,reducers:{setCurrentUser(_state,action:PayloadAction<User|null>){return action.payload}}});
export const {setCurrentUser}=currentUserSlice.actions;export default currentUserSlice.reducer;
