import { configureStore } from '@reduxjs/toolkit';
import loginReducer from './loginSlice.js';
import loadingReducer from './loadingSlice.js';

export default configureStore({
  reducer: {
    login: loginReducer,
    loading: loadingReducer,
  },
});
