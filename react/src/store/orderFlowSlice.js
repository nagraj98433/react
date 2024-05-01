import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const orderFlowSlice = createSlice({
  name: "User Roles",
  initialState,
  reducers: {
    orderFlowList: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { orderFlowList } = orderFlowSlice.actions;
export default orderFlowSlice.reducer;
