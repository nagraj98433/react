import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import store from "./store/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { persistStore } from "redux-persist";
import Layout from "./layout/Layout";
import Dashboard from "./herosection/Dashboard";
import Restaurants from "./herosection/Restaurants";
import CreateRestaurant from "./herosection/CreateRestaurant";
import RestaurantProfile from "./herosection/RestaurantProfile";
import TaxAndAdditionalCharges from "./herosection/TaxAndAdditionalCharges";
import Users from "./herosection/Staffs";
import Tables from "./herosection/Tables";
import Menu from "./herosection/Menu";
import Payment from "./herosection/Payment";
import Nagraj from "./herosection/Nagraj";
import Notifications from "./herosection/Notifications";
import Receipt from "./herosection/Receipt";
import Offers from "./herosection/Offers";
import RestaurantFeatures from "./herosection/RestaurantFeatures";
import PageNotFound from "./pages/PageNotFound";
import Report from "./herosection/Report";
import Registration from "./pages/Registration";
import RegisterForm from "./components/form/RegisterForm";
import LoginForm from "./components/form/LoginForm";
import OTPForm from "./components/form/OTPForm";
import BusinessEntityForm from "./components/form/BusinessEntityForm";
import UserProfile from "./herosection/UserProfile";
import ForgetPasswordForm from "./components/form/ForgetPasswordForm";
import Actions from "./herosection/Actions";
import CustomizeQr from "./herosection/CustomizeQr";
import ChangePassword from "./components/form/ChangePassword";
import MenuPreviewTest from "./herosection/MenuPreviewTest";
import AddonPreviewTest from "./herosection/AddonPreviewTest";
import Qrcode from "./herosection/QrCode";
import ManageQr from "./herosection/ManageQr";
import Operations from "./herosection/Operations";
import Variables from "./herosection/Variables";
import Expressions from "./herosection/Expressions";
import ManageMenu from "./herosection/ManageMenu";
import ManageAddon from "./herosection/ManageAddon";
import ItemGroup from "./herosection/ItemGroup";
import TaxOnItem from "./herosection/TaxOnItem";
import TaxOnBill from "./herosection/TaxOnBill";
import OfferOnItem from "./herosection/OfferOnItem";
import OfferOnBill from "./herosection/OfferOnBill";

let persist = persistStore(store);

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <LandingPage />,
      errorElement: <PageNotFound />,
    },

    {
      path: "/registration",
      element: <Registration />,
      children: [
        {
          path: "new",
          element: <RegisterForm />,
        },
        {
          path: "login",
          element: <LoginForm />,
        },
        {
          path: "forgetpassword",
          element: <ForgetPasswordForm />,
        },
        {
          path: "forgetpassword/changepassword",
          element: <ChangePassword />,
        },
        {
          path: "verify",
          element: <OTPForm />,
        },
        {
          path: "newbusiness",
          element: <BusinessEntityForm />,
        },
      ],
    },
    {
      path: "/main",
      element: <Layout />,
      children: [
        {
          path: "dashboard",
          element: <Dashboard />,
        },
        {
          path: "userprofile",
          element: <UserProfile />,
        },
        {
          path: "outlet/list",
          element: <Restaurants />,
        },
        {
          path: "outlet/new",
          element: <CreateRestaurant />,
        },
        {
          path: "outlet/:restoId",
          element: <RestaurantFeatures />,
        },
        {
          path: "outlet/:outletId/profile",
          element: <RestaurantProfile />,
        },
        {
          path: "outlet/:outletId/charges",
          element: <TaxAndAdditionalCharges />,
          children: [
            {
              path: "onitem",
              element: <TaxOnItem />,
            },
            {
              path: "onbill",
              element: <TaxOnBill />,
            },
          ],
        },
        {
          path: "outlet/:outletId/payment",
          element: <Payment />,
        },
        {
          path: "outlet/:outletId/nagraj",
          element: <Nagraj />,
        },
        {
          path: "outlet/:outletId/notifications",
          element: <Notifications />,
        },
        {
          path: "outlet/:outletId/receipt",
          element: <Receipt />,
        },
        {
          path: "outlet/:outletId/offers",
          element: <Offers />,
          children: [
            {
              path: "onitem",
              element: <OfferOnItem />,
            },
            {
              path: "onbill",
              element: <OfferOnBill />,
            },
          ],
        },
        {
          path: "outlet/:outletId/users",
          element: <Users />,
        },
        {
          path: "outlet/:outletId/qrcode",
          element: <Qrcode />,
        },
        {
          path: "outlet/:outletId/operations",
          element: <Operations />,
          children: [
            {
              path: "variables",
              element: <Variables />,
            },
            {
              path: "expressions",
              element: <Expressions />,
            },
          ],
        },
        {
          path: "outlet/:outletId/tables",
          element: <Tables />,
        },
        {
          path: "outlet/:outletId/manageqr",
          element: <ManageQr />,
        },
        {
          path: "outlet/:outletId/customizeqr",
          element: <CustomizeQr />,
        },
        {
          path: "outlet/:outletId",
          element: <Menu />,
          children: [
            {
              path: "menu",
              element: <ManageMenu />,
            },
            {
              path: "addon",
              element: <ManageAddon />,
            },
            {
              path: "itemgroup",
              element: <ItemGroup />,
            },
          ],
        },
        {
          path: "outlet/:outletId/menupreviewtest/:menuId/",
          element: <MenuPreviewTest />,
        },
        {
          path: "outlet/:outletId/addonpreviewtest",
          element: <AddonPreviewTest />,
        },
        {
          path: "outlet/:outletId/report",
          element: <Report />,
        },
        {
          path: "outlet/:outletId/actions",
          element: <Actions />,
        },
      ],
    },
  ]);
  return (
    <Provider store={store}>
      <PersistGate persistor={persist}>
        <RouterProvider router={router} />
      </PersistGate>
    </Provider>
  );
}

export default App;
