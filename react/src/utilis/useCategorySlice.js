import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const useCategorySlice = createSlice({
  name: "category list",
  initialState,
  reducers: {
    handleCategoryList: (state, action) => {
      state.data = action.payload;
    },
  },
});

export const { handleCategoryList } = useCategorySlice.actions;
export default useCategorySlice.reducer;
