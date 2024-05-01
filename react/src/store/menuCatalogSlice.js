import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
};

const menuCatalogSlice = createSlice({
  name: "Menu Catalog List",
  initialState,
  reducers: {
    handleMenuCatalogList: (state, action) => {
      state.data = action.payload;
    },
    handleUpdateCatalogList: (state, action) => {
      const catalogIndex = state.data.response.catalogs.findIndex(
        (catlog) => catlog?.id === action.payload.id
      );

      if (catalogIndex < 0) {
        return console.log("catalogIndex not found");
      }

      state.data.response.catalogs[catalogIndex].name = action.payload.value;
    },
    handleNewLanguage: (state, action) => {
      if (!state.data.response.language.includes(action.payload)) {
        state.data.response.language.push(action.payload);
      }
    },
  },
});

export const {
  handleMenuCatalogList,
  handleUpdateCatalogList,
  handleNewLanguage,
} = menuCatalogSlice.actions;
export default menuCatalogSlice.reducer;
