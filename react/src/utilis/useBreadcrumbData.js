import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import { handleBreadcrumbData } from "../store/breadcrumbSlice";
import { useParams } from "react-router-dom";

export const useBreadcrumbData = () => {
  const outletName = useSelector(
    (state) => state.activeItemData.restaurantName
  );

  const dispatch = useDispatch();
  const params = useParams();

  const commonData = [
    {
      name: "Settings",
      id: "$#restaurantfeatures",
      navigate: `/main/outlet/${params?.outletId}`,
      active: false,
    },
  ];

  const data = {
    userprofile: {
      backNavigation: "/main/dashboard",
      tabs: [
        {
          name: "Dashboard",
          id: "$#home",
          navigate: "/main/dashboard",
          active: false,
        },
        {
          name: "Profile Info",
          id: "$#profileinfo",
          active: true,
        },
      ],
    },
    newoutlet: {
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
          id: "$#newoutlet",
          active: true,
        },
      ],
    },
    features: {
      outletName: outletName,
      tabs: [
        {
          name: "Settings",
          id: "$#restaurantfeatures",
          active: true,
        },
      ],
    },
    outletProfile: {
      backNavigation: `/main/outlet/${params?.outletId}`,
      outletName: outletName,
      tabs: [
        ...commonData,
        {
          name: "Outlet Profile",
          id: "$#restaurantprofile",
          active: true,
        },
      ],
    },
    staff: {
      backNavigation: `/main/outlet/${params?.outletId}`,
      outletName: outletName,
      tabs: [
        ...commonData,
        {
          name: "Staff",
          id: "$#staff",
          active: true,
        },
      ],
    },
    qrcode: {
      backNavigation: `/main/outlet/${params?.outletId}`,
      outletName: outletName,
      tabs: [
        ...commonData,
        {
          name: "QR Code",
          id: "$#qrcode",
          active: true,
        },
      ],
    },
    menu: {
      backNavigation: `/main/outlet/${params?.outletId}`,
      outletName: outletName,
      tabs: [
        ...commonData,
        {
          name: "Menu",
          id: "$#menu",
          active: true,
        },
      ],
    },
    menupreview: {
      backNavigation: `/main/outlet/${params?.outletId}/menu`,
      outletName: outletName,
      tabs: [
        ...commonData,
        {
          name: "Menu",
          id: "$#menu",
          navigate: `/main/outlet/${params?.outletId}/menu`,
          active: false,
        },
        {
          name: "Menu Preview",
          id: "$#menupreview",
          active: true,
        },
      ],
    },
    addonpreview: {
      backNavigation: `/main/outlet/${params?.outletId}`,
      outletName: outletName,
      tabs: [
        ...commonData,
        {
          name: "Menu",
          id: "$#menu",
          navigate: `/main/outlet/${params?.outletId}/menu`,
          active: false,
        },

        {
          name: "Addon Preview",
          id: "$#addonpreview",
          active: true,
        },
      ],
    },
    qr: {
      backNavigation: `/main/outlet/${params?.outletId}`,
      outletName: outletName,
      tabs: [
        ...commonData,
        {
          name: "QR",
          id: "$#qr",
          active: true,
        },
      ],
    },
    customqr: {
      backNavigation: `/main/outlet/${params?.outletId}/qrcode`,
      outletName: outletName,
      tabs: [
        ...commonData,
        {
          name: "QR Code",
          id: "$#qrcode",
          navigate: `/main/outlet/${params?.outletId}/qrcode`,
          active: false,
        },
        {
          name: "Customize QR",
          id: "$#customeqr",
          active: true,
        },
      ],
    },
    taxAndOther: {
      backNavigation: `/main/outlet/${params?.outletId}`,
      outletName: outletName,
      tabs: [
        ...commonData,
        {
          name: "Charges",
          id: "$#charges",
          active: true,
        },
      ],
    },
    operations: {
      backNavigation: `/main/outlet/${params?.outletId}`,
      outletName: outletName,
      tabs: [
        ...commonData,
        {
          name: "Operations",
          id: "$#operation",
          active: true,
        },
      ],
    },
    payment: {
      backNavigation: `/main/outlet/${params?.outletId}`,
      outletName: outletName,
      tabs: [
        ...commonData,
        {
          name: "Payment",
          id: "$#payment",
          active: true,
        },
      ],
    },
    offer: {
      backNavigation: `/main/outlet/${params?.outletId}`,
      outletName: outletName,
      tabs: [
        ...commonData,
        {
          name: "Offer",
          id: "$#offer",
          active: true,
        },
      ],
    },
    notification: {
      backNavigation: `/main/outlet/${params?.outletId}`,
      outletName: outletName,
      tabs: [
        ...commonData,
        {
          name: "Notification",
          id: "$#notification",
          active: true,
        },
      ],
    },
    receipt: {
      backNavigation: `/main/outlet/${params?.outletId}`,
      outletName: outletName,
      tabs: [
        ...commonData,
        {
          name: "Receipt",
          id: "$#receipt",
          active: true,
        },
      ],
    },
    report: {
      backNavigation: `/main/outlet/${params?.outletId}`,
      outletName: outletName,
      tabs: [
        ...commonData,
        {
          name: "Report",
          id: "$#report",
          active: true,
        },
      ],
    },
    action: {
      backNavigation: `/main/outlet/${params?.outletId}`,
      outletName: outletName,
      tabs: [
        ...commonData,
        {
          name: "User Activity",
          id: "$#action",
          active: true,
        },
      ],
    },
  };

  return function (pageName) {
    dispatch(handleBreadcrumbData(data[pageName]));
  };
};
