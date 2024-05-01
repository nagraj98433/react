import { createSlice } from "@reduxjs/toolkit";
import { draggableOrderConfirmedButtonsArray } from "../utilis/constants";

let draggableOrderPlacedButtonsArray;
draggableOrderPlacedButtonsArray = window.orderPlaced();

const initialState = {
  orderPlacedContent: [],
  orderPlacedContentList: draggableOrderPlacedButtonsArray,
  orderConfirmedContent: [],
  orderConfirmedContentList: draggableOrderConfirmedButtonsArray,
};

const notificationContentSlice = createSlice({
  name: "Notification content",
  initialState,
  reducers: {
    handleDragDrop: (state, action) => {
      const { source, destination, index } = action.payload;

      const draggedContent = state[source][index];

      // Remove dragged content from source
      state[source] = state[source].filter((item, idx) => idx !== index);

      // Add dragged content in destination
      state[destination].push(draggedContent);
    },
    handleShuffle: (state, action) => {
      const { currentIndex, updatedIndex, destination } = action.payload;

      const content = state[destination][currentIndex];

      state[destination].splice(currentIndex, 1);

      state[destination].splice(updatedIndex, 0, content);
    },
  },
});

export const { handleDragDrop, handleShuffle } =
  notificationContentSlice.actions;
export default notificationContentSlice.reducer;
