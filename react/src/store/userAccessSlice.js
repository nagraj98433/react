import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const userAccessSlice = createSlice({
  name: "User Access",
  initialState,
  reducers: {
    getAccessRoles: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { getAccessRoles } = userAccessSlice.actions;
export default userAccessSlice.reducer;
