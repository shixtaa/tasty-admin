import { createSlice } from '@reduxjs/toolkit';

export const loadingSlice = createSlice({
  name: 'counter',
  initialState: {
    isLoading:false
  },
  reducers: {
    showLoading:(state)=>{
      state.isLoading = true;
    },
    hideLoading:(state)=>{
      state.isLoading = false;
    }
  },
});

export const { showLoading ,hideLoading } = loadingSlice.actions;

export default loadingSlice.reducer;
