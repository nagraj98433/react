import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const restoProfileSlice = createSlice({
  name: "restaurant data",
  initialState,
  reducers: {
    getRestaurantData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { getRestaurantData } = restoProfileSlice.actions;
export default restoProfileSlice.reducer;
