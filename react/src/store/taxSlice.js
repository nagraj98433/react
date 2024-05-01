import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
};

const taxSlice = createSlice({
  name: "Tax list",
  initialState,
  reducers: {
    handleTaxList: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { handleTaxList } = taxSlice.actions;
export default taxSlice.reducer;
