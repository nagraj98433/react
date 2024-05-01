import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  overallData: {},
};

const addOnCatalogSlice = createSlice({
  name: "Addon Catalog List",
  initialState,
  reducers: {
    handleAddonData: (state, action) => {
      const firstKey = Object.keys(action.payload)[0];
      state.data = {
        [firstKey]: action.payload[firstKey],
      };
      state.overallData = action.payload;
    },
    handleAddSelectedAddonData: (state, action) => {
      let existingTranslatedMenu = state.data[action.payload];

      if (existingTranslatedMenu) {
        delete state.data[action.payload];
      } else {
        let newObj = {
          ...state.data,
          [action.payload]: state.overallData[action.payload],
        };
        state.data = newObj;
      }
    },
    handleChangeAddOn: (state, action) => {
      const { code, type, idKey, idValue, valueKey, value } = action?.payload;

      if (!state.overallData || !state.data[code][type]) {
        return console.log("state is empty or data[code] is undefined");
      }

      const itemIndex = Object.values(state.data[code][type]).findIndex(
        (item) => item?.[idKey] === idValue
      );

      if (itemIndex < 0) {
        return console.log("itemIndex not found", itemIndex);
      }

      const updatedItemKey = Object.keys(state.data[code][type])[itemIndex];

      state.data[code][type][updatedItemKey][valueKey] = value;

      state.overallData[code][type][itemIndex][valueKey] = value;
    },
    handleAddOnPriceChange: (state, action) => {
      const { id, value } = action?.payload;

      if (!state.data) {
        return console.log("state is empty");
      }

      const firstKey = Object.keys(state.overallData)[0];

      const itemIndex = state.data[firstKey].add_on.findIndex(
        (item) => item?.addon_name_id === id
      );

      if (itemIndex < 0) {
        return console.log("ItemIndex not found");
      }

      for (let key in state.data) {
        state.data[key].add_on[itemIndex].addon_price = value;
      }
      for (let key in state.overallData) {
        state.overallData[key].add_on[itemIndex].addon_price = value;
      }
    },
    handleAddOnNewItem: (state, action) => {
      for (let key in state.overallData) {
        state.overallData[key][action.payload.type].splice(
          0,
          0,
          action.payload.value
        );
      }
      for (let key in state.data) {
        state.data[key][action.payload.type].splice(0, 0, action.payload.value);
      }
    },
    handleAddOnDeleteItem: (state, action) => {
      for (let key in state.overallData) {
        const index = state.overallData[key][action.payload.type].findIndex(
          (item) => item.addon_name_id === action.payload.value.addon_name_id
        );
        if (index !== -1) {
          state.overallData[key][action.payload.type].splice(index, 1);
        }
      }
      for (let key in state.data) {
        const index = state.data[key][action.payload.type].findIndex(
          (item) => item.addon_name_id === action.payload.value.addon_name_id
        );
        if (index !== -1) {
          state.data[key][action.payload.type].splice(index, 1);
        }
      }
    },
    handleAddOnDeleteGroup: (state, action) => {
      for (let key in state.overallData) {
        const index = state.overallData[key][action.payload.type].findIndex(
          (item) => item.addon_group_id === action.payload.value.addon_group_id
        );
        if (index !== -1) {
          state.overallData[key][action.payload.type].splice(index, 1);
        }
      }
      for (let key in state.data) {
        const index = state.data[key][action.payload.type].findIndex(
          (item) => item.addon_group_id === action.payload.value.addon_group_id
        );
        if (index !== -1) {
          state.data[key][action.payload.type].splice(index, 1);
        }
      }
    },
    handleEmptyAddonList: (state, action) => {
      state.overallData = {};
      state.data = {};
    },
    addAddonExpression: (state, action) => {
      const { itemId, expressionId } = action.payload;

      const firstKey = Object.keys(state.overallData)[0];

      const itemIndex = state.overallData[firstKey].add_on.findIndex(
        (item) => item?.addon_name_id === itemId
      );

      if (!itemIndex) {
        return console.log("Item index not found");
      }

      for (let key in state.overallData) {
        if (state.overallData[key].add_on[itemIndex]?.expression) {
          if (
            !state.overallData[key].add_on[itemIndex]?.expression.includes(
              expressionId
            )
          ) {
            state.overallData[key].add_on[itemIndex]?.expression.push(
              expressionId
            );
          }
        } else {
          state.overallData[key].add_on[itemIndex].expression = [expressionId];
        }
      }

      for (let key in state.data) {
        if (state.data[key].add_on[itemIndex]?.expression) {
          if (
            !state.data[key].add_on[itemIndex]?.expression.includes(
              expressionId
            )
          ) {
            state.data[key].add_on[itemIndex]?.expression.push(expressionId);
          }
        } else {
          state.data[key].add_on[itemIndex].expression = [expressionId];
        }
      }
    },
    removeAddonExpression: (state, action) => {
      const { itemId, expressionId } = action.payload;

      const firstKey = Object.keys(state.overallData)[0];

      const itemIndex = state.overallData[firstKey].add_on.findIndex(
        (item) => item?.addon_name_id === itemId
      );

      if (!itemIndex) {
        return console.log("Item index not found");
      }

      for (let key in state.overallData) {
        state.overallData[key].add_on[itemIndex].expression = state.overallData[
          key
        ].add_on[itemIndex].expression?.filter((item) => {
          return item !== expressionId;
        });
      }

      for (let key in state.data) {
        state.data[key].add_on[itemIndex].expression = state.data[key].add_on[
          itemIndex
        ].expression?.filter((item) => {
          return item !== expressionId;
        });
      }
    },
  },
});

export const {
  handleAddonData,
  handleAddSelectedAddonData,
  handleChangeAddOn,
  handleAddOnPriceChange,
  handleAddOnNewItem,
  handleAddOnDeleteItem,
  handleAddOnDeleteGroup,
  handleEmptyAddonList,
  addAddonExpression,
  removeAddonExpression,
} = addOnCatalogSlice.actions;
export default addOnCatalogSlice.reducer;
