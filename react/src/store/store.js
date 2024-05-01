import { configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
import {
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import { combineReducers } from "@reduxjs/toolkit";
import languageSlice from "./languageSlice";
import activeItemSlice from "./activeItemSlice";
import userSlice from "./userSlice";
import receiptContentSlice from "./receiptContentSlice";
import userCredentialsSlice from "./userCredentialsSlice";
import restoSlice from "./restoSlice";
import userAccessSlice from "./userAccessSlice";
import staffSlice from "./staffSlice";
import useCategorySlice from "../utilis/useCategorySlice";
import breadcrumbSlice from "./breadcrumbSlice";
import notificationContentSlice from "./notificationContentSlice";
import menuSlice from "./menuSlice";
import amazonBucketUrlSlice from "./amazonBucketUrlSlice";
import activeOutletSlice from "./activeOutletSlice";
import menuCatalogSlice from "./menuCatalogSlice";
import addOnList from "./addOnCatalogSlice";
import groupSlice from "./groupSlice";
import restoProfileSlice from "./restoProfileSlice";
import orderFlowSlice from "./orderFlowSlice";
import qrThemeSlice from "./qrThemeSlice";
import taxSlice from "./taxSlice";
import offerSlice from "./offerSlice";
import itemGroupSlice from "./itemGroupSlice";
import operationSlice from "./operationSlice";
import paymentSlice from "./paymentSlice";

// import logger from "redux-logger";
const persistConfig = {
  key: "root",
  storage,
};
const reducer = combineReducers({
  languageData: languageSlice,
  activeItemData: activeItemSlice,
  userData: userSlice,
  receiptContentData: receiptContentSlice,
  userCredentialData: userCredentialsSlice,
  restoListData: restoSlice,
  restoProfiledata: restoProfileSlice,
  accessData: userAccessSlice,
  staffData: staffSlice,
  groupData: groupSlice,
  categoryData: useCategorySlice,
  breadcrumbData: breadcrumbSlice,
  notificationContentData: notificationContentSlice,
  menuData: menuSlice,
  addOnData: addOnList,
  amazonBucketUrlData: amazonBucketUrlSlice,
  activeOutletData: activeOutletSlice,
  catlogData: menuCatalogSlice,
  orderFlowData: orderFlowSlice,
  qrThemeData: qrThemeSlice,
  taxData: taxSlice,
  offerData: offerSlice,
  itemGroupData: itemGroupSlice,
  operationData: operationSlice,
  paymentModeData: paymentSlice,
});

const persistedReducer = persistReducer(persistConfig, reducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
  // .concat(logger),
});

export default store;
