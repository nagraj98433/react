import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  presignedUrl: "",
};

const staffSlice = createSlice({
  name: "Staff List",
  initialState,
  reducers: {
    handleStaffList: (state, action) => {
      state.data = action.payload;
    },

    handleUrl: (state, action) => {
      state.presignedUrl = action.payload;
    },
  },
});

export const { handleStaffList, handleUrl } = staffSlice.actions;
export default staffSlice.reducer;
