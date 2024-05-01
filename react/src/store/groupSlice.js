import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  presignedUrl: "",
};

const staffSlice = createSlice({
  name: "Group List",
  initialState,
  reducers: {
    handleGroupList: (state, action) => {
      state.data = action.payload;
    },

    handleGroupUrl: (state, action) => {
      state.presignedUrl = action.payload;
    },
  },
});

export const { handleGroupList, handleGroupUrl } = staffSlice.actions;
export default staffSlice.reducer;
