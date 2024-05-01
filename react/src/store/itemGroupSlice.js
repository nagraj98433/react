import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
};

const itemGroupSlice = createSlice({
  name: "grouped Item List",
  initialState,
  reducers: {
    getItemGroup: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { getItemGroup } = itemGroupSlice.actions;
export default itemGroupSlice.reducer;
