import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

const userCredentialsSlice = createSlice({
  name: "user credentials",
  initialState,
  reducers: {
    handleUserCredentials: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { handleUserCredentials } = userCredentialsSlice.actions;
export default userCredentialsSlice.reducer;
