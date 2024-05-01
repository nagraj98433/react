import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
};

const operationSlice = createSlice({
  name: "Operation list",
  initialState,
  reducers: {
    handleOperations: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { handleOperations } = operationSlice.actions;
export default operationSlice.reducer;
