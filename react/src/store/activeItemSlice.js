import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  language: {
    name: "English",
    code: "en",
    icon: "eng-icon",
  },
  sidebar: true,
  isDarkMode: false,
  restaurantName: null,
  restaurantId: null,
  selectedRestaurant: null,
  isMenuUpdating: false,
  isMenuEdit: false,
  isAddOnEdit: false,
  isShowAddon: false,
};

const activeItemSlice = createSlice({
  name: "activeData",
  initialState,
  reducers: {
    handleActiveItem: (state, action) => {
      state[action.payload.name] = action.payload.value;
    },
    handleMenuLanguageList: (state, action) => {
      state.selectedMenuLanguages.push(action.payload);
    },
    handleCurrencyCode: (state, action) => {
      state.selectedRestaurant = action.payload;
    },
  },
});

export const { handleActiveItem, handleMenuLanguageList, handleCurrencyCode } =
  activeItemSlice.actions;
export default activeItemSlice.reducer;
