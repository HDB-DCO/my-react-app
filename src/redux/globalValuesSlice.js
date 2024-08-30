// globalValuesSlice.js
import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  currentPage: '/',
};

const globalValuesSlice = createSlice({
  name: 'global',
  initialState, 
  reducers: {
    setCurrentPage(state, action) {
      state.currentPage = action.payload.path;
    },
    removeCurrentPage(state) {
      //alert("someone's logging out");
      state.currentPage = '/';
    },
  },
});

export const { setCurrentPage, removeCurrentPage } = globalValuesSlice.actions;
export default globalValuesSlice.reducer;
