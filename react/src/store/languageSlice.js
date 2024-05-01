import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
  selectedData: null,
};

const languageSlice = createSlice({
  name: "language",
  initialState,
  reducers: {
    handleLanguage: (state, action) => {
      state.data = action.payload;
    },
    handleSelectedLanguage: (state, action) => {
      state.selectedData = state.data[action.payload];
    },
  },
});

export const { handleLanguage, handleSelectedLanguage } = languageSlice.actions;
export default languageSlice.reducer;
