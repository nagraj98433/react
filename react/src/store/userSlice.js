import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

const userSlice = createSlice({
  name: "user data",
  initialState,
  reducers: {
    userInfo: (state, action) => {
      state.data = action.payload;
    },
    handleUserAccessToken: (state, action) => {
      state.data[action.payload.name] = action.payload.value;
    },
  },
});

export const { userInfo, handleUserAccessToken } = userSlice.actions;
export default userSlice.reducer;
