import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
};
const paymentSlice = createSlice({
  name: "payment mode list",
  initialState,
  reducers: {
    handlePaymentModeList: (state, action) => {
      return {
        ...state,
        data: action.payload,
      };
    },
  },
});

export const { handlePaymentModeList } = paymentSlice.actions;
export default paymentSlice.reducer;
