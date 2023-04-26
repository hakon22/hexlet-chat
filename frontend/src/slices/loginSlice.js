import axios from 'axios';
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../routes/routes.js';

export const fetchToken = createAsyncThunk(
  'token/fetchToken',
  async (data) => {
    const response = await axios.post(routes.login, data);
    return response.data.token;
  },
);

const loginAdapter = createEntityAdapter();

const loginSlice = createSlice({
  name: 'login',
  initialState: { loadingStatus: 'idle', error: null },
  extraReducers: (builder) => {
    builder
      .addCase(fetchToken.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchToken.fulfilled, (state, { payload }) => {
        state.token = payload;
        state.loadingStatus = 'idle';
        state.error = null;
      })
      .addCase(fetchToken.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error;
      })
  },
});

export const selectors = loginAdapter.getSelectors((state) => state.login);
export default loginSlice.reducer;
