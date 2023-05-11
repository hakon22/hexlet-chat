/* eslint-disable no-param-reassign */
import axios from 'axios';
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../pages/routes.js';

export const fetchSignup = createAsyncThunk(
  'signup/fetchSignup',
  async (data) => {
    const response = await axios.post(routes.signup, data);
    return response.data;
  },
);

const signupAdapter = createEntityAdapter();

const signupSlice = createSlice({
  name: 'signup',
  initialState: { loadingStatus: 'idle', error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSignup.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchSignup.fulfilled, (state, { payload }) => {
        const { token, username } = payload;
        state.token = token;
        state.loadingStatus = 'idle';
        state.error = null;
        window.localStorage.setItem('token', token);
        window.localStorage.setItem('username', username);
      })
      .addCase(fetchSignup.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectors = signupAdapter.getSelectors((state) => state.signup);
export default signupSlice.reducer;
