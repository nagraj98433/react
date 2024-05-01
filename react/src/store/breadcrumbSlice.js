import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: null,
};

const useBreadcrumbSlice = createSlice({
  name: "breadcrumb data",
  initialState,
  reducers: {
    handleBreadcrumbData: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { handleBreadcrumbData } = useBreadcrumbSlice.actions;
export default useBreadcrumbSlice.reducer;
