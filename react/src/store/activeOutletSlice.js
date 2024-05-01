import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

const activeOutletSlice = createSlice({
  name: "active outlet",
  initialState,
  reducers: {
    handleActiveOutlet: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { handleActiveOutlet } = activeOutletSlice.actions;
export default activeOutletSlice.reducer;
