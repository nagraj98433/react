import SidebarLogoDark from "../assets/logo/qr4order-dark.png";
import SidebarLogoLight from "../assets/logo/qr4order-light.png";
import Sidebarminilogo from "../assets/logo/logo-mini.png";

export const BASE_URL = process.env.REACT_APP_BASE_URL;
export const sidebarLogoDark = SidebarLogoDark;
export const sidebarLogoLight = SidebarLogoLight;
export const sidebarLogoMini = Sidebarminilogo;
export const regexPatternForPassword =
  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>]).{8,}$/;

export const regexPatternForEmail = /^[\w.%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const regexPatternForVerificationCode = /^[0-9]{6}$/;
export const regexAlphabatesChecker = /[a-zA-Z]/;

// theme colors
export const themeColor = {
  primary: "#6d213c",
  secondary: "#262730",
  accent: "#ffe7ef",
  textPrimary: "#262730",
  textSecondary: "#a1a1a1",
};

// tabs data
export const menuTabs = [
  {
    id: "$#manageMenu",
    name: "Menu",
    icon: "bi bi-1-circle-fill",
    navigate: "/menu",
  },
  {
    id: "$#manageAddon",
    name: "Addon",
    icon: "bi bi-2-circle-fill",
    navigate: "/addon",
  },
  {
    id: "$#manageItemGroup",
    name: "Item Group",
    icon: "bi bi-3-circle-fill",
    navigate: "/itemgroup",
  },
];

export const manageStaffTabs = [
  {
    name: "Register Staff",
    id: "$#registerstaff",
    icon: "bi bi-person-fill-add",
    navigate: "/main/outlet/1/staffs/new",
  },
  {
    name: "Staff List",
    id: "$#stafflist",
    icon: "bi bi-people-fill",
    navigate: "/main/outlet/1/staffs",
  },
];

export const operationsTabs = [
  {
    id: "$#createvariables",
    name: "Create variables",
    navigate: "/operations/variables",
  },
  {
    id: "$#createexpressions",
    name: "Create expressions",
    navigate: "/operations/expressions",
  },
];

export const taxTabs = [
  {
    id: "$#onItemPrice",
    name: "On item price",
    navigate: "/charges/onitem",
  },
  {
    id: "$#onBillTotal",
    name: "On bill total",
    navigate: "/charges/onbill",
  },
];

export const offerTabs = [
  {
    id: "$#onItemPrice",
    name: "On item price",
    navigate: "/offers/onitem",
  },
  {
    id: "$#onBillTotal",
    name: "On bill total",
    navigate: "/offers/onbill",
  },
];

// breadcrumb data
export const restaurantListBreadCrumb = {
  backNavigation: "/main/outlet/new",
  restoName: "Hotel Romania",
  tabs: [
    {
      name: "Dashboard",
      id: "$#home",
      navigate: "/main/dashboard",
      active: false,
    },
    {
      name: "Create Outlet",
      id: "$#createrestaurant",
      navigate: "/main/outlet/new",
      active: false,
    },
    {
      name: "Restaurants",
      id: "$#restaurant",
      active: true,
    },
  ],
};

export const createRestaurantBreadCrumb = {
  backNavigation: "/main/dashboard",
  tabs: [
    {
      name: "Dashboard",
      id: "$#home",
      navigate: "/main/dashboard",
      active: false,
    },
    {
      name: "Create Outlet",
      id: "$#createrestaurant",
      active: true,
    },
  ],
};

export const restaurantProfileBreadCrumb = {
  backNavigation: "/main/outlet",
  restoName: "Hotel Romania",
  tabs: [
    {
      name: "Dashboard",
      id: "$#home",
      navigate: "/main/dashboard",
      active: false,
    },
    {
      name: "Settings",
      id: "$#restaurantfeatures",
      navigate: "/main/outlet",
      active: false,
    },
    {
      name: "Outlet Profile",
      id: "$#restaurantprofile",
      active: true,
    },
  ],
};

export const manageStaffBreadCrumb = {
  backNavigation: "/main/outlet",
  restoName: "Hotel Romania",
  tabs: [
    {
      name: "Dashboard",
      id: "$#home",
      navigate: "/main/dashboard",
      active: false,
    },
    {
      name: "Settings",
      id: "$#restaurantfeatures",
      navigate: "/main/outlet",
      active: false,
    },
    {
      name: "Staff",
      id: "$#managestaffs",
      active: true,
    },
  ],
};

export const manageChargesBreadCrumb = {
  backNavigation: "/main/outlet",
  restoName: "Hotel Romania",
  tabs: [
    {
      name: "Dashboard",
      id: "$#home",
      navigate: "/main/dashboard",
      active: false,
    },
    {
      name: "Settings",
      id: "$#restaurantfeatures",
      navigate: "/main/outlet",
      active: false,
    },
    {
      name: "Charges",
      id: "$#managecharges",
      active: true,
    },
  ],
};

export const managePaymentBreadCrumb = {
  backNavigation: "/main/outlet",
  restoName: "Hotel Romania",
  tabs: [
    {
      name: "Dashboard",
      id: "$#home",
      navigate: "/main/dashboard",
      active: false,
    },
    {
      name: "Settings",
      id: "$#restaurantfeatures",
      navigate: "/main/outlet",
      active: false,
    },
    {
      name: "Payment",
      id: "$#managepayment",
      active: true,
    },
  ],
};

export const offersBreadCrumb = {
  backNavigation: "/main/outlet",
  restoName: "Hotel Romania",
  tabs: [
    {
      name: "Dashboard",
      id: "$#home",
      navigate: "/main/dashboard",
      active: false,
    },
    {
      name: "Settings",
      id: "$#restaurantfeatures",
      navigate: "/main/outlet",
      active: false,
    },
    {
      name: "Offers",
      id: "$#manageoffers",
      active: true,
    },
  ],
};

export const QRCodeBreadCrumb = {
  backNavigation: "/main/outlet",
  restoName: "Hotel Romania",
  tabs: [
    {
      name: "Dashboard",
      id: "$#home",
      navigate: "/main/dashboard",
      active: false,
    },
    {
      name: "Settings",
      id: "$#restaurantfeatures",
      navigate: "/main/outlet",
      active: false,
    },
    {
      name: "QR Code",
      id: "$#manageqrcode",
      active: true,
    },
  ],
};

export const CustomizeQRBreadCrumb = {
  backNavigation: "/main/outlet",
  restoName: "Hotel Romania",
  tabs: [
    {
      name: "Dashboard",
      id: "$#home",
      navigate: "/main/dashboard",
      active: false,
    },
    {
      name: "Settings",
      id: "$#restaurantfeatures",
      navigate: "/main/outlet",
      active: false,
    },
    {
      name: "QR Code",
      id: "$#manageqrcode",
      navigate: "/main/outlet",
      active: false,
    },
    {
      name: "Customize QR",
      id: "$#customizeqrcode",
      active: true,
    },
  ],
};

export const notificationsBreadCrumb = {
  backNavigation: "/main/outlet",
  restoName: "Hotel Romania",
  tabs: [
    {
      name: "Dashboard",
      id: "$#home",
      navigate: "/main/dashboard",
      active: false,
    },
    {
      name: "Settings",
      id: "$#restaurantfeatures",
      navigate: "/main/outlet",
      active: false,
    },
    {
      name: "Notifications",
      id: "$#notifications",
      active: true,
    },
  ],
};

export const manageMenuBreadCrumb = {
  backNavigation: "/main/outlet",
  restoName: "Hotel Romania",
  tabs: [
    {
      name: "Dashboard",
      id: "$#home",
      navigate: "/main/dashboard",
      active: false,
    },
    {
      name: "Settings",
      id: "$#restaurantfeatures",
      navigate: "/main/outlet",
      active: false,
    },
    {
      name: "Menu",
      id: "$#Menu",
      active: true,
    },
  ],
};

export const receiptContentBreadCrumb = {
  backNavigation: "/main/outlet",
  restoName: "Hotel Romania",
  tabs: [
    {
      name: "Dashboard",
      id: "$#home",
      navigate: "/main/dashboard",
      active: false,
    },
    {
      name: "Settings",
      id: "$#restaurantfeatures",
      navigate: "/main/outlet",
      active: false,
    },
    {
      name: "Receipt",
      id: "$#receipt",
      active: true,
    },
  ],
};

export const restaurantFeaturesBreadCrumb = {
  backNavigation: "/main/dashboard",
  restoName: "Hotel Romania",
  tabs: [
    {
      name: "Dashboard",
      id: "$#home",
      navigate: "/main/dashboard",
      active: false,
    },
    {
      name: "Settings",
      id: "$#restaurantfeatures",
      active: true,
    },
  ],
};
export const actionsBreadCrumb = {
  backNavigation: "/main/dashboard",
  restoName: "Hotel Romania",
  tabs: [
    {
      name: "Dashboard",
      id: "$#home",
      navigate: "/main/dashboard",
      active: false,
    },
    {
      name: "Settings",
      id: "$#restaurantfeatures",
      navigate: "/main/outlet",
      active: false,
    },
    {
      name: "Actions",
      id: "$#actions",
      active: true,
    },
  ],
};
export const userProfileBreadCrumb = {
  backNavigation: "/main/dashboard",

  tabs: [
    {
      name: "Dashboard",
      id: "$#home",
      navigate: "/main/dashboard",
      active: false,
    },
    {
      name: "Profile",
      id: "$#profile",
      active: true,
    },
  ],
};
export const manageReportBreadCrumb = {
  backNavigation: "/main/outlet",
  restoName: "Hotel Romania",
  tabs: [
    {
      name: "Dashboard",
      id: "$#home",
      navigate: "/main/dashboard",
      active: false,
    },
    {
      name: "Settings",
      id: "$#restaurantfeatures",
      navigate: "/main/outlet",
      active: false,
    },
    {
      name: "Report",
      id: "$#report",
      active: true,
    },
  ],
};

export const restaurantFeacturesArray = [
  {
    id: "6ff6da0f-449a-4c5d-9482-6575c31869e4",
    name: "Profile",
    icon: "feature-icon profileIcon",
    navigate: "/profile",
    isDisabled: false,
  },
  {
    id: "56d07d91-41b3-4ee4-b4a8-a3ce83b4ba9c",
    name: "Menu",
    icon: "feature-icon menuIcon",
    navigate: "/menu",
    isDisabled: false,
  },
  {
    id: "65d84286-ac23-42c9-85df-880be9871b21",
    name: "Users",
    icon: "feature-icon staffIcon",
    navigate: "/users",
    isDisabled: false,
  },
  {
    id: "e3207dd8-e6cf-471c-aaef-uijghj",
    name: "Order Flow",
    icon: "feature-icon qrIcon",
    navigate: "/qrcode",
    isDisabled: false,
  },
  {
    id: "e3207dd8-e6cf-471c-aaef-4ada4bb8de0b",
    name: "Variables",
    icon: "feature-icon operationsIcon",
    navigate: "/operations/variables",
    isDisabled: false,
  },

  // {
  //   id: "e3207dd8-e6cf-471c-aaef-4ada4bb8de0b",
  //   name: "QR Generation & Linking",
  //   icon: "feature-icon qrIcon",
  //   navigate: "/tables",
  //   isDisabled: false,
  // },
  {
    id: "8a859cbf-95a6-4aef-9150-fa2ac209f114",
    name: "Tax & Other Charges",
    icon: "feature-icon taxIcon",
    navigate: "/charges/onitem",
    isDisabled: false,
  },
  {
    id: "0376f07a-89b4-4a41-adbd-1648ce5087dc",
    name: "Offers",
    icon: "feature-icon offersIcon",
    navigate: "/offers/onitem",
    isDisabled: false,
  },
  {
    id: "ff0aa564-322b-442d-8d3a-f920d5bfd60a",
    name: "Payments",
    icon: "feature-icon paymentIcon",
    navigate: "/payment",
    isDisabled: false,
  },

  {
    id: "2ff3e69a-9118-48ce-8bbd-f122f3072482",
    name: "Notifications",
    icon: "feature-icon notificationIcon",
    navigate: "/notifications",
    isDisabled: true,
  },
  {
    id: "935f2436-0617-401f-9542-089ff5c9a4db",
    name: "Receipt",
    icon: "feature-icon receiptIcon",
    navigate: "/receipt",
    isDisabled: true,
  },
  {
    id: "8359face-4392-4af2-bc50-87adb8767cff",
    name: "Report",
    icon: "feature-icon reportIcon",
    navigate: "/report",
    isDisabled: true,
  },
  {
    id: "T3207dd8-e6cf-471c-aaef-4ada4bb8de0b",
    name: "Template",
    // icon: "feature-icon profileIcon",
    icon: "bi bi-code-square",
    navigate: "/nagraj",
    isDisabled: false,
  },
];

export const Role1Access = [
  { value: "Manage Menu", label: "Manage Menu" },
  { value: "Manage Staff", label: "Manage Staff" },
  { value: "Manage OR Code", label: "Manage OR Code" },
  { value: "Tax & Charges", label: "Tax & Charges" },
  { value: "Offers", label: "Offers" },
  { value: "Notifications", label: "Notifications" },
  { value: "Payment", label: "Payment" },
  { value: "Receipt", label: "Receipt" },
  { value: "Report", label: "Report" },
];

export const Role2Access = [
  { value: "Manage Menu", label: "Manage Menu" },
  { value: "Tax & Charges", label: "Tax & Charges" },
  { value: "Offers", label: "Offers" },
  { value: "Notifications", label: "Notifications" },
  { value: "Payment", label: "Payment" },
  { value: "Receipt", label: "Receipt" },
  { value: "Report", label: "Report" },
];

export const Role3Access = [{ value: "Offers", label: "Offers" }];

export const Role4Access = [
  { value: "Transactional (Kitchen)", label: "Transactional (Kitchen)" },
  {
    value: "Non Transactional (Kitchen)",
    label: "Non Transactional (Kitchen)",
  },
];

export const RegistrationStepperData = [
  { id: "$#registration", name: "Registration", active: "/registration/new" },
  {
    id: "$#verification",
    name: "Verification",
    active: "/registration/verify",
  },
  { id: "$#login", name: "Login", active: "/registration/login" },
  { id: "$#business", name: "Business", active: "/registration/newbusiness" },
];

export const draggableHeaderButtonsArray = [
  {
    id: "phoneNo",
    type: "header",
    name: "Phone No.",
    value: "+380(0432)46-24-75",
  },
  {
    id: "managerNo",
    type: "header",
    name: "Manager No.",
    value: "+380(048)68-88-44",
  },
  {
    id: "licenseNo",
    type: "header",
    name: "License No.",
    value: "FSSI898765213111",
  },
];

export const draggableFooterButtonsArray = [
  {
    id: "footer1",
    type: "footer",
    name: "Thank you! Please visit again.",
    value: "Thank you! Please visit again.",
  },
  {
    id: "footer2",
    type: "footer",
    name: "Bon Appetit",
    value: "Bon Appetit",
  },
  {
    id: "footer3",
    type: "footer",
    name: "With gratitude | Come back soon",
    value: "With gratitude | Come back soon",
  },
  {
    id: "footer4",
    type: "footer",
    name: "With gratitude | Awaiting your return",
    value: "With gratitude | Awaiting your return",
  },
];
export const draggableBodyButtonsArray = [
  {
    id: "body1",
    type: "body",
    name: "Bill No.",
    value: "55.",
  },
  {
    id: "body2",
    type: "body",
    name: "Payment Mode:",
    value: "Cash",
  },
  {
    id: "body3",
    type: "body",
    name: "Date",
    value: "2023-10-25 10:25AM",
  },
  {
    id: "body4",
    type: "body",
    name: "Operator",
    value: "Bravo",
  },
];
window.orderPlaced = function () {
  let date = new Date().toLocaleString();
  let draggableOrderPlacedButtonsArray;
  return (draggableOrderPlacedButtonsArray = [
    {
      id: "orderNo",
      type: "orderPlaced",
      name: "orderNo",
      value: "1223243",
    },
    {
      id: "userName",
      type: "orderPlaced",
      name: "userName",
      value: "Rakesh",
    },
    {
      id: "resName",
      type: "orderPlaced",
      name: "resName",
      value: "The foodie",
    },
    {
      id: "createdAt",
      type: "orderPlaced",
      name: "createdAt",
      value: date,
    },
  ]);
};

export const draggableOrderConfirmedButtonsArray = [
  {
    id: "orderNoConfirmed",
    type: "orderConfirmed",
    name: "orderNoConfirmed",
    value: "125466",
  },
  {
    id: "userNameConfirmed",
    type: "orderConfirmed",
    name: "userNameConfirmed",
    value: "Rakesh Pal",
  },
  {
    id: "resNameConfirmed",
    type: "orderConfirmed",
    name: "resNameConfirmed",
    value: "The Foodie",
  },
];
export const grade2Access = [
  "Transactional_Kitchen",
  "NonTransactional_Kitchen",
  "Take_QR_Order",
  "Online_Order",
  "Takeout_Order",
  "Settle_Order",
];

export const languageArray = [
  {
    name: "English",
    code: "en",
    icon: "eng-icon",
  },
  {
    name: "Ukrainian",
    code: "uk",
    icon: "uk-icon",
  },
  {
    name: "Romanian",
    code: "ro",
    icon: "ro-icon",
  },
  {
    name: "Thai",
    code: "th",
    icon: "th-icon",
  },
  {
    name: "Vietnamese",
    code: "vi",
    icon: "vi-icon",
  },
];

export const languagelist = {
  en: { lang: "English", code: "en" },
  ro: { lang: "Romania", code: "ro" },
  uk: { lang: "Ukraine", code: "uk" },
  th: { lang: "Thai", code: "th" },
  vi: { lang: "Vietnamese", code: "vi" },
};

export const defaultVariables = [
  "item_price",
  "CURRENT_DATE",
  "CURRENT_TIME",
  "CURRENT_DAY",
  "CURRENT_MONTH",
  "CURRENT_YEAR",
  "CURRENT_WEEKDAY",
  "CURRENT_TIME_IN_MINUTES",
  "tax",
  "offer",
];

export const operators = [
  "+",
  "-",
  "*",
  "/",
  "<",
  ">",
  "=",
  "==",
  ",",
  "!=",
  "<=",
  ">=",
  "if",
  "elif",
  "else",
  "and",
  "or",
  "not",
  "in",
];
