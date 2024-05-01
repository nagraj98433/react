import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const restoSlice = createSlice({
  name: "restaurant list",
  initialState,
  reducers: {
    getRestaurantList: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { getRestaurantList } = restoSlice.actions;
export default restoSlice.reducer;
