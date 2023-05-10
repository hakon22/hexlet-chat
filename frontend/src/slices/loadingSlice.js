import axios from 'axios';
import { createSlice, createEntityAdapter, createAsyncThunk } from '@reduxjs/toolkit';
import routes from '../pages/routes.js';

export const fetchLoading = createAsyncThunk(
  'token/fetchLoading',
  async (token) => {
    const response = await axios.get(routes.data, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
);

const loadingAdapter = createEntityAdapter({});

const loadingSlice = createSlice({
  name: 'loading',
  initialState: {
    loadingStatus: 'idle', error: null, channels: [], messages: [],
  },
  reducers: {
    addMessage: (state, { payload }) => {
      state.messages.push(payload);
    },
    changeChannel: (state, { payload }) => {
      state.currentChannelId = payload;
    },
    addChannel: (state, { payload }) => {
      state.channels.push(payload);
    },
    removeChannel: (state, { payload }) => {
      const channels = state.channels.filter((e) => e.id !== payload.id);
      state.channels = channels;
      if (payload.id === state.currentChannelId) {
        state.currentChannelId = 1;
      }
      const newMes = state.messages.filter((mes) => mes.channelId !== payload.id);
      state.messages = newMes;
    },
    renameChannel: (state, { payload }) => {
      const channel = state.channels.find((c) => c.id === payload.id);
      channel.name = payload.name;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchLoading.pending, (state) => {
        state.loadingStatus = 'loading';
        state.error = null;
      })
      .addCase(fetchLoading.fulfilled, (state, {
        payload:
        { channels, messages, currentChannelId },
      }) => {
        state.channels = channels;
        state.messages = messages;
        state.currentChannelId = currentChannelId;
        state.loadingStatus = 'finish';
        state.error = null;
      })
      .addCase(fetchLoading.rejected, (state, action) => {
        state.loadingStatus = 'failed';
        state.error = action.error.message;
      });
  },
});

export const selectors = loadingAdapter.getSelectors((state) => state.loading);
export const { actions } = loadingSlice;
export default loadingSlice.reducer;
