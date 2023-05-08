import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './loginSlice.js';
import loadingReducer from './loadingSlice.js';
import signupReducer from './signupSlice.js';

export default configureStore({
  reducer: {
    login: loginReducer,
    loading: loadingReducer,
    signup: signupReducer,
  },
});
