import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
};

const amazonBucketUrlSlice = createSlice({
  name: "urls",
  initialState,
  reducers: {
    handleAmazonUrls: (state, action) => {
      state.data[action.payload.name] = {
        url: action.payload.url,
        expiry: action.payload.expiry,
      };
    },
    removeAmazonUrls: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { handleAmazonUrls, removeAmazonUrls } =
  amazonBucketUrlSlice.actions;
export default amazonBucketUrlSlice.reducer;
