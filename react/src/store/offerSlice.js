import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const offerSlice = createSlice({
  name: "Offer list",
  initialState,
  reducers: {
    handleOfferList: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { handleOfferList } = offerSlice.actions;
export default offerSlice.reducer;
