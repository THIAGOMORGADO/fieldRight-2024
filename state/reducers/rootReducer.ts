import { combineReducers } from '@reduxjs/toolkit';

import authSlice, { AuthProps } from './authSlice';

export type RootState = {
  auth: AuthProps;
};

const rootReducer = combineReducers<RootState>({
  auth: authSlice,
});

export default rootReducer;
