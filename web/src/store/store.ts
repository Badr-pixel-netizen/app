import { configureStore } from '@reduxjs/toolkit';
import currentUserReducer from './currentUserSlice';
export const makeStore=(preloadedState?:{currentUser:import('../lib/types').User|null})=>configureStore({reducer:{currentUser:currentUserReducer},preloadedState});
export type AppStore=ReturnType<typeof makeStore>;export type RootState=ReturnType<AppStore['getState']>;export type AppDispatch=AppStore['dispatch'];
