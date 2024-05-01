import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  data: {},
  overallData: {},
};

const menuSlice = createSlice({
  name: "Menu",
  initialState,
  reducers: {
    handleMenuData: (state, action) => {
      const firstKey = Object.keys(action.payload)[0];
      state.data = {
        [firstKey]: action.payload[firstKey],
      };
      state.overallData = action.payload;
    },
    handleAddSelectedMenuData: (state, action) => {
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
    handleEmptyMenuData: (state, action) => {
      state.data = action.payload;
      state.overallData = action.payload;
    },
    handleChangeMenu: (state, action) => {
      const { code, type, idKey, idValue, valueKey, value } = action?.payload;
      if (!state.overallData) {
        return console.log("state is empty");
      }

      const itemIndex = state.data[code][type].findIndex(
        (item) => item?.[idKey] === idValue
      );

      if (itemIndex < 0) {
        return console.log("itemIndex not found");
      }

      state.data[code][type][itemIndex][valueKey] = value;
      state.overallData[code][type][itemIndex][valueKey] = value;
    },
    handleCatalogChange: (state, action) => {
      const { code, value } = action?.payload;

      if (!state.data) {
        return console.log("state is empty");
      }

      state.data[code].catalog.catalog_name = value;
      state.overallData[code].catalog.catalog_name = value;
    },
    handlePriceChange: (state, action) => {
      const { id, value } = action?.payload;

      if (!state.data) {
        return console.log("state is empty");
      }

      const firstKey = Object.keys(state.overallData)[0];

      const itemIndex = state.data[firstKey].product.findIndex(
        (item) => item?.product_id === id
      );

      if (itemIndex < 0) {
        return console.log("ItemIndex not found");
      }

      for (let key in state.data) {
        state.data[key].product[itemIndex].product_price = value;
      }
      for (let key in state.overallData) {
        state.overallData[key].product[itemIndex].product_price = value;
      }
    },
    handleAddNewItem: (state, action) => {
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
    handleAddNewAddon: (state, action) => {
      const firstKey = Object.keys(state.overallData)[0];

      const itemIndex = state.overallData[firstKey].product.findIndex(
        (item) => item?.product_id === action.payload.itemId
      );

      if (itemIndex < 0) {
        return console.log("ItemIndex not found");
      }

      for (let key in state.overallData) {
        state.overallData[key].product[itemIndex].addonsGroup =
          action.payload.addons;
      }

      for (let key in state.data) {
        state.data[key].product[itemIndex].addonsGroup = action.payload.addons;
      }
    },
    handleSubcategoryLevelAddons: (state, action) => {
      const { subCatId, addonId } = action.payload;
      const firstKey = Object.keys(state.overallData)[0];

      const filteredItems = state.overallData[firstKey].product.filter(
        (item) => {
          return item.product_id.includes(subCatId);
        }
      );

      const subCatIndex = state.overallData[firstKey].subcategory.findIndex(
        (subcat) => subcat?.subcategory_id === subCatId
      );

      if (!filteredItems.length) {
        return console.log("Filtered items not available");
      }

      for (let key in state.overallData) {
        // create new key in data
        if (!state.overallData[key].subcategory[subCatIndex].addonsGroup) {
          state.overallData[key].subcategory[subCatIndex].addonsGroup = [];
        }

        state.overallData[key].subcategory[subCatIndex].addonsGroup.push(
          addonId
        );

        for (let i = 0; i < filteredItems.length; i++) {
          const itemIndex = state.overallData[key].product.findIndex(
            (item) => item?.product_id === filteredItems[i].product_id
          );

          if (state.overallData[key].product[itemIndex].addonsGroup) {
            if (
              !state.overallData[key].product[itemIndex].addonsGroup.includes(
                addonId
              )
            ) {
              state.overallData[key].product[itemIndex].addonsGroup.push(
                addonId
              );
            }
          } else {
            state.overallData[key].product[itemIndex].addonsGroup = [addonId];
          }
        }
      }

      for (let key in state.data) {
        // create new key in data
        if (!state.data[key].subcategory[subCatIndex].addonsGroup) {
          state.data[key].subcategory[subCatIndex].addonsGroup = [];
        }

        state.data[key].subcategory[subCatIndex].addonsGroup.push(addonId);

        for (let i = 0; i < filteredItems.length; i++) {
          const itemIndex = state.data[key].product.findIndex(
            (item) => item?.product_id === filteredItems[i].product_id
          );

          if (state.data[key].product[itemIndex].addonsGroup) {
            if (
              !state.data[key].product[itemIndex].addonsGroup.includes(addonId)
            ) {
              state.data[key].product[itemIndex].addonsGroup.push(addonId);
            }
          } else {
            state.data[key].product[itemIndex].addonsGroup = [addonId];
          }
        }
      }
    },
    removeSubcategoryLevelAddons: (state, action) => {
      const { subCatId, removeaddonId } = action.payload;
      const firstKey = Object.keys(state.overallData)[0];

      const filteredItems = state.overallData[firstKey].product.filter(
        (item) => {
          return item.product_id.includes(subCatId);
        }
      );

      const subCatIndex = state.overallData[firstKey].subcategory.findIndex(
        (subcat) => subcat?.subcategory_id === subCatId
      );

      if (!filteredItems.length) {
        return console.log("Filtered items not available");
      }

      for (let key in state.overallData) {
        state.overallData[key].subcategory[subCatIndex].addonsGroup =
          state.overallData[key].subcategory[subCatIndex].addonsGroup.filter(
            (addonItem) => {
              return addonItem !== removeaddonId;
            }
          );

        for (let i = 0; i < filteredItems.length; i++) {
          const itemIndex = state.overallData[key].product.findIndex(
            (item) => item?.product_id === filteredItems[i].product_id
          );
          state.overallData[key].product[itemIndex].addonsGroup =
            state.overallData[key].product[itemIndex].addonsGroup.filter(
              (addonItem) => {
                return addonItem !== removeaddonId;
              }
            );
        }
      }

      for (let key in state.data) {
        state.data[key].subcategory[subCatIndex].addonsGroup = state.data[
          key
        ].subcategory[subCatIndex].addonsGroup.filter((addonItem) => {
          return addonItem !== removeaddonId;
        });

        for (let i = 0; i < filteredItems.length; i++) {
          const itemIndex = state.data[key].product.findIndex(
            (item) => item?.product_id === filteredItems[i].product_id
          );
          state.data[key].product[itemIndex].addonsGroup = state.data[
            key
          ].product[itemIndex].addonsGroup.filter((addonItem) => {
            return addonItem !== removeaddonId;
          });
        }
      }
    },
    handleCategoryLevelAddons: (state, action) => {
      const { catId, addonId } = action.payload;
      const firstKey = Object.keys(state.overallData)[0];

      const filteredItems = state.overallData[firstKey].product.filter(
        (item) => {
          return item.product_id.includes(catId);
        }
      );

      if (!filteredItems.length) {
        return console.log("Filtered items not available");
      }

      const catIndex = state.overallData[firstKey].category.findIndex(
        (cat) => cat?.category_id === catId
      );

      if (!catIndex < 0) {
        return console.log("catIndex not found");
      }

      for (let key in state.overallData) {
        // create new key in data
        if (!state.overallData[key].category[catIndex]?.addonsGroup) {
          state.overallData[key].category[catIndex].addonsGroup = [];
        }

        state.overallData[key].category[catIndex].addonsGroup.push(addonId);

        for (let i = 0; i < filteredItems.length; i++) {
          const itemIndex = state.overallData[key].product.findIndex(
            (item) => item?.product_id === filteredItems[i].product_id
          );

          if (state.overallData[key].product[itemIndex].addonsGroup) {
            if (
              !state.overallData[key].product[itemIndex].addonsGroup.includes(
                addonId
              )
            ) {
              state.overallData[key].product[itemIndex].addonsGroup.push(
                addonId
              );
            }
          } else {
            state.overallData[key].product[itemIndex].addonsGroup = [addonId];
          }
        }
      }

      for (let key in state.data) {
        // create new key in data
        if (!state.data[key].category[catIndex].addonsGroup) {
          state.data[key].category[catIndex].addonsGroup = [];
        }

        state.data[key].category[catIndex].addonsGroup.push(addonId);

        for (let i = 0; i < filteredItems.length; i++) {
          const itemIndex = state.data[key].product.findIndex(
            (item) => item?.product_id === filteredItems[i].product_id
          );

          if (state.data[key].product[itemIndex].addonsGroup) {
            if (
              !state.data[key].product[itemIndex].addonsGroup.includes(addonId)
            ) {
              state.data[key].product[itemIndex].addonsGroup.push(addonId);
            }
          } else {
            state.data[key].product[itemIndex].addonsGroup = [addonId];
          }
        }
      }
    },
    removeCategoryLevelAddons: (state, action) => {
      const { catId, removeaddonId } = action.payload;
      const firstKey = Object.keys(state.overallData)[0];

      const filteredItems = state.overallData[firstKey].product.filter(
        (item) => {
          return item.product_id.includes(catId);
        }
      );

      const catIndex = state.overallData[firstKey].category.findIndex(
        (cat) => cat?.category_id === catId
      );

      if (!filteredItems.length) {
        return console.log("Filtered items not available");
      }

      for (let key in state.overallData) {
        state.overallData[key].category[catIndex].addonsGroup =
          state.overallData[key].category[catIndex].addonsGroup.filter(
            (addonItem) => {
              return addonItem !== removeaddonId;
            }
          );

        for (let i = 0; i < filteredItems.length; i++) {
          const itemIndex = state.overallData[key].product.findIndex(
            (item) => item?.product_id === filteredItems[i].product_id
          );
          state.overallData[key].product[itemIndex].addonsGroup =
            state.overallData[key].product[itemIndex].addonsGroup.filter(
              (addonItem) => {
                return addonItem !== removeaddonId;
              }
            );
        }
      }

      for (let key in state.data) {
        state.data[key].category[catIndex].addonsGroup = state.data[
          key
        ].category[catIndex].addonsGroup.filter((addonItem) => {
          return addonItem !== removeaddonId;
        });

        for (let i = 0; i < filteredItems.length; i++) {
          const itemIndex = state.data[key].product.findIndex(
            (item) => item?.product_id === filteredItems[i].product_id
          );
          state.data[key].product[itemIndex].addonsGroup = state.data[
            key
          ].product[itemIndex].addonsGroup.filter((addonItem) => {
            return addonItem !== removeaddonId;
          });
        }
      }
    },
    handleDeleteItem: (state, action) => {
      for (let key in state.overallData) {
        state.overallData[key].product = state.overallData[key].product.filter(
          (item) => {
            return item.product_id !== action.payload;
          }
        );
      }
      for (let key in state.data) {
        state.data[key].product = state.data[key].product.filter((item) => {
          return item.product_id !== action.payload;
        });
      }
    },
    handleSubcategoryWiseDelete: (state, action) => {
      const firstKey = Object.keys(state.overallData)[0];
      const filteredItem = state.overallData[firstKey].product.filter(
        (item) => {
          return item.product_id.includes(action.payload);
        }
      );

      for (let i = 0; i < filteredItem.length; i++) {
        const itemIndex = state.overallData[firstKey].product.findIndex(
          (item) => item?.product_id === filteredItem?.product_id
        );
        if (itemIndex > 0) {
          return console.log("Item index not found");
        }
        for (let key in state.overallData) {
          state.overallData[key].product.splice(itemIndex, 1);
        }
        for (let key in state.data) {
          state.data[key].product.splice(itemIndex, 1);
        }
      }

      for (let key in state.overallData) {
        state.overallData[key].subcategory = state.overallData[
          key
        ].subcategory.filter((subcat) => {
          return subcat.subcategory_id !== action.payload;
        });
      }

      for (let key in state.data) {
        state.data[key].subcategory = state.data[key].subcategory.filter(
          (subcat) => {
            return subcat.subcategory_id !== action.payload;
          }
        );
      }
    },
    handleCategoryWiseDelete: (state, action) => {
      const firstKey = Object.keys(state.overallData)[0];
      const filteredItem = state.overallData[firstKey].product.filter(
        (item) => {
          return item.product_id.includes(action.payload);
        }
      );

      for (let i = 0; i < filteredItem.length; i++) {
        const itemIndex = state.overallData[firstKey].product.findIndex(
          (item) => item?.product_id === filteredItem?.product_id
        );
        if (itemIndex > 0) {
          return console.log("Item index not found");
        }
        for (let key in state.overallData) {
          state.overallData[key].product.splice(itemIndex, 1);
        }
        for (let key in state.data) {
          state.data[key].product.splice(itemIndex, 1);
        }
      }

      for (let key in state.overallData) {
        state.overallData[key].subcategory = state.overallData[
          key
        ].subcategory.filter((subcat) => {
          return !subcat.subcategory_id.includes(action.payload);
        });

        state.overallData[key].category = state.overallData[
          key
        ].category.filter((cat) => {
          return cat.category_id !== action.payload;
        });
      }

      for (let key in state.data) {
        state.data[key].subcategory = state.data[key].subcategory.filter(
          (subcat) => {
            return !subcat.subcategory_id.includes(action.payload);
          }
        );

        state.data[key].category = state.data[key].category.filter((cat) => {
          return cat.category_id !== action.payload;
        });
      }
    },
    handleEmptyMenu: (state, action) => {
      state.overallData = action.payload;
      state.data = action.payload;
    },
    addMenuExpression: (state, action) => {
      const { itemId, expressionId } = action.payload;

      const firstKey = Object.keys(state.overallData)[0];

      const itemIndex = state.overallData[firstKey].product.findIndex(
        (item) => item?.product_id === itemId
      );

      if (!itemIndex) {
        return console.log("Item index not found");
      }

      for (let key in state.overallData) {
        if (state.overallData[key].product[itemIndex]?.expression) {
          if (
            !state.overallData[key].product[itemIndex]?.expression.includes(
              expressionId
            )
          ) {
            state.overallData[key].product[itemIndex]?.expression.push(
              expressionId
            );
          }
        } else {
          state.overallData[key].product[itemIndex].expression = [expressionId];
        }
      }

      for (let key in state.data) {
        if (state.data[key].product[itemIndex]?.expression) {
          if (
            !state.data[key].product[itemIndex]?.expression.includes(
              expressionId
            )
          ) {
            state.data[key].product[itemIndex]?.expression.push(expressionId);
          }
        } else {
          state.data[key].product[itemIndex].expression = [expressionId];
        }
      }
    },
    removeMenuExpression: (state, action) => {
      const { itemId, expressionId } = action.payload;

      const firstKey = Object.keys(state.overallData)[0];

      const itemIndex = state.overallData[firstKey].product.findIndex(
        (item) => item?.product_id === itemId
      );

      if (!itemIndex) {
        return console.log("Item index not found");
      }

      for (let key in state.overallData) {
        state.overallData[key].product[itemIndex].expression =
          state.overallData[key].product[itemIndex].expression?.filter(
            (item) => {
              return item !== expressionId;
            }
          );
      }

      for (let key in state.data) {
        state.data[key].product[itemIndex].expression = state.data[key].product[
          itemIndex
        ].expression?.filter((item) => {
          return item !== expressionId;
        });
      }
    },
    handleAddExpression: (state, action) => {
      const { itemIds, expressionId, expressionType } = action.payload;

      const firstKey = Object.keys(state.overallData)[0];

      for (let i = 0; i < itemIds.length; i++) {
        const itemIndex = state.overallData[firstKey].product.findIndex(
          (item) => item?.product_id === itemIds[i]
        );

        if (!itemIndex) {
          return console.log("Item index not found");
        }

        for (let key in state.overallData) {
          if (state.overallData[key].product[itemIndex]?.[expressionType]) {
            if (
              !state.overallData[key].product[itemIndex]?.[
                expressionType
              ].includes(expressionId)
            ) {
              state.overallData[key].product[itemIndex]?.[expressionType].push(
                expressionId
              );
            }
          } else {
            state.overallData[key].product[itemIndex][expressionType] = [
              expressionId,
            ];
          }
        }
      }
    },
    handleRemoveExpression: (state, action) => {
      const { itemIds, expressionId, expressionType } = action.payload;

      const firstKey = Object.keys(state.overallData)[0];

      for (let i = 0; i < itemIds.length; i++) {
        const itemIndex = state.overallData[firstKey].product.findIndex(
          (item) => item?.product_id === itemIds[i]
        );

        if (!itemIndex) {
          return console.log("Item index not found");
        }

        for (let key in state.overallData) {
          state.overallData[key].product[itemIndex][expressionType] =
            state.overallData[key].product[itemIndex][expressionType]?.filter(
              (item) => {
                return item !== expressionId;
              }
            );
        }
      }
    },
  },
});

export const {
  handleMenuData,
  handleRemoveMenuData,
  handleEmptyMenuData,
  handleChangeMenu,
  handleCatalogChange,
  handlePriceChange,
  handleAddSelectedMenuData,
  handleAddNewItem,
  handleAddNewAddon,
  handleSubcategoryLevelAddons,
  removeSubcategoryLevelAddons,
  handleCategoryLevelAddons,
  removeCategoryLevelAddons,
  handleDeleteItem,
  handleSubcategoryWiseDelete,
  handleCategoryWiseDelete,
  handleEmptyMenu,
  addMenuExpression,
  removeMenuExpression,
  handleAddExpression,
  handleRemoveExpression,
} = menuSlice.actions;
export default menuSlice.reducer;
