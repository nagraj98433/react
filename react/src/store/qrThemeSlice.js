import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: [],
  themeData: "",
  qrList: [],
  qrUrl: "",
  activeTab: "orderFlow",
};

const qrThemeSlice = createSlice({
  name: "QR Themes",
  initialState,
  reducers: {
    handleQrTheme: (state, action) => {
      state.qrList = action.payload;
    },
    handleQrList: (state, action) => {
      state.qrList = action.payload;
    },
    handleQRUrl: (state, action) => {
      state.qrUrl = action.payload;
    },
    handleActiveTab: (state, action) => {
      state.activeTab = action.payload;
    },
    handleThemeDelete: (state, action) => {
      state.qrList = action.payload;
    },
    handleActiveTheme: (state, action) => {
      state.themeData = action.payload;
    },

    handleEmptyTheme: (state, action) => {
      // state.data = [];
      state.themeData = "";
      state.qrList = [];
      state.resLogo = "";
      state.data = [];
    },
  },
});

export const {
  handleQrList,
  handleQRUrl,
  handleQrTheme,
  handleActiveTheme,
  handleEmptyTheme,
  handleThemeDelete,
  handleActiveTab,
} = qrThemeSlice.actions;
export default qrThemeSlice.reducer;
