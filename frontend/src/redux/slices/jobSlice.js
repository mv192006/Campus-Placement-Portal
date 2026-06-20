import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { jobAPI } from '../../services/index.js';

export const fetchJobs = createAsyncThunk('jobs/fetchJobs', async (params) => {
  const { data } = await jobAPI.getJobs(params);
  return data;
});

export const fetchJob = createAsyncThunk('jobs/fetchJob', async (id) => {
  const { data } = await jobAPI.getJob(id);
  return data.data;
});

const jobSlice = createSlice({
  name: 'jobs',
  initialState: {
    jobs: [],
    currentJob: null,
    total: 0,
    pages: 0,
    loading: false,
    filters: { search: '', location: '', skills: '' },
  },
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchJobs.pending, (state) => { state.loading = true; })
      .addCase(fetchJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload.data;
        state.total = action.payload.total;
        state.pages = action.payload.pages;
      })
      .addCase(fetchJobs.rejected, (state) => { state.loading = false; })
      .addCase(fetchJob.fulfilled, (state, action) => { state.currentJob = action.payload; });
  },
});

export const { setFilters } = jobSlice.actions;
export default jobSlice.reducer;
