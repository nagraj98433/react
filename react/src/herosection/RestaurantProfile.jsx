import React, { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import CustomButton from "../components/buttons/CustomButton";
import { BASE_URL, themeColor } from "../utilis/constants";
import { FaCircleCheck } from "react-icons/fa6";
import { Toaster } from "react-hot-toast";
import CustomBreadCrumb from "../components/breadcrumb/CustomBreadCrumb";
import CustomTitle from "../components/heading/CustomTitle";
import { MdDelete, MdEdit } from "react-icons/md";
import { useSelector } from "react-redux";
import { useRestaurantListApi } from "../global_apis/useRestaurantListApi";
import { useGlobalApiHandler } from "../utilis/useGlobalApiHandler";
import toast from "react-hot-toast";
import { useDispatch } from "react-redux";
import { handleActiveItem } from "../store/activeItemSlice";
import Spinner from "../components/loaders/Spinner";
import { useBreadcrumbData } from "../utilis/useBreadcrumbData";
import { useAmazonUrl } from "../utilis/useAmazonUrl";
import { useParams } from "react-router-dom";
import { getRestaurantData } from "../store/restoProfileSlice";
import axios from "axios";
import { useSessionChecker } from "../utilis/useSessionChecker";
import { useFetchAmazonBucketUrls } from "../utilis/useFetchAmazonBucketUrls";
import { useUploadImage } from "../utilis/useUploadImage";

function RestaurantInfo() {
  const restoDetails = useSelector((state) => state.restoProfiledata.data);

  const param = useParams();
  const handleBreadcrumb = useBreadcrumbData();
  const globalApiHandler = useGlobalApiHandler();
  const amazonUrlExpiryChecker = useSessionChecker();
  const fetchAmazonBucketUrls = useFetchAmazonBucketUrls();
  const imageUpload = useUploadImage();
  const fetchRestaurantList = useRestaurantListApi();

  const dispatch = useDispatch();
  const getAmazonUrl = useAmazonUrl();

  const [form, setForm] = useState({
    outlet_name: "",
    file: null,
    logo: "",
    currency: "",
    timezone: "",
    description: "",
    address: "",
    contact: "",
    additionalTextFields: [],
    additionalMediaFields: [],
  });

  const [isField, setIsField] = useState(true);

  const [isInvalid, setIsInvalid] = useState({
    outlet_name: false,
    address: false,
    currency: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingAddtionalField, setisLoadingAddtionalField] = useState(false);
  const [isLoadingAddtionalMediaField, setisLoadingAddtionalMediaField] =
    useState(false);
  const [logoUpload, setLogoUpload] = useState(false);
  const [restoDetailsUpdate, setRestoDetailsUpdate] = useState(false);
  const [deletingImageItemIndex, setDeletingImageItemIndex] = useState(null);
  const [deletingTextItemIndex, setDeletingTextItemIndex] = useState(null);
  const [additionalTextField, setAdditionalTextField] = useState({
    name: "",
    value: "",
  });
  const [additionalMediaField, setAdditionalMediaField] = useState({
    name: "",
    file: null,
  });
  const handleFile = (e) => {
    const image = e.target.files[0];
    setForm((prev) => ({
      ...prev,
      file: image,
    }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdditionalFieldChange = (e) => {
    const { name, value } = e.target;
    setAdditionalTextField((prev) => ({ ...prev, [name]: value }));
  };

  const handleAdditionalMediaFieldChange = (e) => {
    const { name, value } = e.target;
    setAdditionalMediaField((prev) => ({ ...prev, [name]: value }));
  };

  const addAdditionalTextField = () => {
    if (!additionalTextField.name || !additionalTextField.value) {
      return toast.error("Fields cannot be empty!");
    }
    setisLoadingAddtionalField(true);
    const newTextField = {
      name: additionalTextField.name,
      value: additionalTextField.value,
    };

    setForm((prevForm) => ({
      ...prevForm,
      additionalTextFields: [...prevForm.additionalTextFields, newTextField],
    }));
    setAdditionalTextField({
      name: "",
      value: "",
    });
    toast.success("Field added successfully");
    setisLoadingAddtionalField(false);
  };

  const removeAdditionalField = (index) => {
    setDeletingTextItemIndex(index);
    setForm((prevForm) => ({
      ...prevForm,
      additionalTextFields: prevForm.additionalTextFields.filter(
        (_, i) => i !== index
      ),
    }));
    toast.success("Deleted Succesfully");
    setDeletingTextItemIndex(null);
  };

  const removeAdditionalMediaField = async (index, deleteData) => {
    setDeletingImageItemIndex(index);
    const data = new FormData();
    data.append("outlet_id", param?.outletId);
    data.append("image_name", deleteData?.image_name);
    const apiData = {
      method: "delete",
      url: BASE_URL + "api/outlets/delete/image/",
      data: data,
    };

    const response = await globalApiHandler(apiData);

    if (response?.success) {
      toast.success(response.message);
      setForm((prevForm) => ({
        ...prevForm,
        additionalMediaFields: prevForm.additionalMediaFields.filter(
          (_, i) => i !== index
        ),
      }));
    } else {
      toast.error(response?.message);
    }
    setDeletingImageItemIndex(null);
  };

  const getProfileData = async () => {
    if (restoDetails.length === 0) {
      let getProfile = null;
      getProfile = getAmazonUrl("profile");
      const isNotExpired = amazonUrlExpiryChecker(getProfile?.expiry);

      if (!isNotExpired) {
        getProfile = await fetchAmazonBucketUrls("profile");
      }
      if (!getProfile) {
        return toast.error("url not found");
      }

      const response = await axios.get(getProfile?.url?.get_url);

      if (response?.data) {
        dispatch(getRestaurantData(response?.data));
      }
    }
  };

  const handleValidation = () => {
    const validations = {
      outlet_name: !form.outlet_name.length,
      currency: !form.currency.length,
      // description: !form.description.length,
      // address: !form.address.length,
      // contact: !form.contact.length,
    };
    setIsInvalid((prev) => ({
      ...prev,
      ...validations,
    }));

    return Object.values(validations).every((isValid) => !isValid);
  };

  const handleOutletUpdate = async () => {
    setIsLoading(true);

    const updatedData = {
      ...restoDetails,
      outlet_name: form.outlet_name,
      description: form.description,
      address: form.address,
      currency: form.currency,
      timezone: form.timezone,
      contact: form.contact,
      logo: form.logo,
      additionalTextField: form.additionalTextFields,
      additionalMediaField: form.additionalMediaFields,
    };

    dispatch(getRestaurantData(updatedData));

    setRestoDetailsUpdate(true);
  };

  const updateDetail = async () => {
    let updateProfile = null;
    updateProfile = getAmazonUrl("profile");
    const isNotExpired = amazonUrlExpiryChecker(updateProfile?.expiry);

    if (!isNotExpired) {
      updateProfile = await fetchAmazonBucketUrls("profile");
    }
    if (!updateProfile) {
      return toast.error("url not found");
    }
    const response = await axios.put(updateProfile?.url?.put_url, restoDetails);

    setIsLoading(false);

    if (response?.status) {
      const fileName = form.file;
      const payload = { ...form, file: fileName };
      dispatch(
        handleActiveItem({ name: "selectedRestaurant", value: payload })
      );

      dispatch(
        handleActiveItem({
          name: "restaurantName",
          value: form.outlet_name,
        })
      );
      toast.success("Restaurant updated successfully");
      fetchRestaurantList();
    }
    setRestoDetailsUpdate(false);
  };

  const handleSubmit = () => {
    let frontendValidation = handleValidation();
    if (frontendValidation) {
      handleOutletUpdate();
    }
  };

  const handleImageUpload = async () => {
    var file = form.file;
    var extension = file.name.split(".").pop().toLowerCase();

    if (extension != "png" && extension != "jpeg") {
      document.getElementById("fileLogo").value = "";
      setForm((prev) => ({
        ...prev,
        file: null,
      }));
      toast.error("Please upload valid image");
      return;
    } else if (!form.file) {
      document.getElementById("fileLogo").value = "";
      setForm((prev) => ({
        ...prev,
        file: null,
      }));
      return toast.error("Please select logo");
    }
    setLogoUpload(true);

    const response = await imageUpload(param?.outletId, form?.file);

    setLogoUpload(false);
    if (response?.success) {
      toast.success(response?.message);
      const logo = response?.data.url;
      setForm((prev) => ({ ...prev, logo: logo }));
      document.getElementById("fileLogo").value = "";
      setForm((prev) => ({
        ...prev,
        file: null,
      }));
    }
    if (!response?.success) {
      toast.error(response?.message);
    }
  };

  const handleAdditionalImageUpload = async () => {
    var file = additionalMediaField.file;
    var extension = file.name.split(".").pop().toLowerCase();

    if (extension != "png" && extension != "jpeg" && extension != "pdf") {
      document.getElementById("fileInput").value = "";
      setAdditionalMediaField((prev) => ({
        ...prev,
        name: "",
        file: null,
      }));
      toast.error("Please upload valid image");
      return;
    } else if (!additionalMediaField?.file) {
      toast.error("please select image");
      document.getElementById("fileInput").value = "";
      setAdditionalMediaField((prev) => ({
        ...prev,
        name: "",
        file: null,
      }));
      return;
    }
    setisLoadingAddtionalMediaField(true);

    const response = await imageUpload(
      param?.outletId,
      additionalMediaField?.file
    );
    setLogoUpload(false);
    if (response?.success) {
      toast.success(response?.message);

      const newMediaField = {
        name: additionalMediaField.name,
        url: response.data.url,
        image_name: response.data.image_name,
      };

      setForm((prevForm) => ({
        ...prevForm,
        additionalMediaFields: [
          ...prevForm.additionalMediaFields,
          newMediaField,
        ],
      }));
      document.getElementById("fileInput").value = "";
      setAdditionalMediaField({
        name: "",
        file: null,
      });
    } else {
      toast.error(response?.message);
      setAdditionalMediaField((prev) => ({
        ...prev,
        name: "",
        file: null,
      }));
    }
    setisLoadingAddtionalMediaField(false);
  };

  useEffect(() => {
    handleBreadcrumb("outletProfile");
    getProfileData();
  }, []);

  useEffect(() => {
    restoDetailsUpdate && updateDetail();
  }, [restoDetailsUpdate]);

  useEffect(() => {
    setForm((prev) => ({
      ...prev,
      outlet_name: restoDetails?.outlet_name ? restoDetails?.outlet_name : "",
      currency: restoDetails?.currency ? restoDetails?.currency : "",
      timezone: restoDetails?.timezone ? restoDetails?.timezone : "",
      address: restoDetails?.address ? restoDetails?.address : "",
      description: restoDetails?.description ? restoDetails?.description : "",
      contact: restoDetails?.contact ? restoDetails?.contact : "",
      logo: restoDetails?.logo ? restoDetails?.logo : "",
      additionalTextFields: restoDetails?.additionalTextField
        ? restoDetails.additionalTextField
        : [],
      additionalMediaFields: restoDetails?.additionalMediaField
        ? restoDetails.additionalMediaField
        : [],
    }));
  }, [restoDetails]);

  return (
    <div className="overflow-auto h-100 customscrollbar">
      <Toaster />
      <CustomBreadCrumb />
      <div className="row mt-4 justify-content-center">
        <div className="col-12 col-lg-6">
          <h4 className="ms-4 mb-2 primary-text">Restaurant Profile</h4>
          <div
            style={{ borderTop: `6px solid ${themeColor.primary}` }}
            className="row mx-4 formBorder rounded p-3 mb-5"
          >
            <div className="px-3 col-12">
              <Form.Group className="mb-2">
                <Form.Label className="primary-text fw-medium formLabelText">
                  Restaurant Name
                </Form.Label>
                <Form.Control
                  className="customInputBoxText"
                  type="text"
                  placeholder="Enter restaurant name"
                  required
                  isInvalid={isInvalid.outlet_name}
                  name="outlet_name"
                  value={form.outlet_name}
                  onChange={handleChange}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter restaurant name.
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="px-3 col-12">
              <Form.Group className="mb-2">
                <Form.Label className="primary-text fw-medium formLabelText">
                  Select Currency
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, currency: e.target.value }))
                  }
                  value={form.currency}
                  className="customInputBoxText"
                  isInvalid={isInvalid.currency}
                >
                  <option value="us">USD</option>
                  <option value="ro">RON</option>
                  <option value="uk">UAH</option>
                  <option value="th">TBH</option>
                  <option value="Vi">VND</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select currency.
                </Form.Control.Feedback>
              </Form.Group>
            </div>

            <div className="px-3 col-12">
              <Form.Group className="mb-2">
                <Form.Label className="primary-text fw-medium formLabelText">
                  Select Time Zone
                </Form.Label>
                <Form.Select
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, timezone: e.target.value }))
                  }
                  value={form.timezone}
                  className="customInputBoxText"
                  isInvalid={isInvalid.timezone}
                >
                  <option value="Asia/Riyadh">
                    Arab Standard Time (UTC + 03:00) - Asia/Riyadh
                  </option>
                  <option value="Asia/Dubai">
                    Arabian Standard Time (UTC + 04:00) - Asia/Dubai
                  </option>
                  <option value="Asia/Yerevan">
                    Caucasus Standard Time (UTC + 04:00) - Asia/Yerevan
                  </option>
                  <option value="Indian/Mauritius">
                    Mauritius Standard Time (UTC + 04:00) - Indian/Mauritius
                  </option>
                  <option value="Europe/Moscow">
                    Russian Standard Time (UTC + 03:00) - Europe/Moscow
                  </option>
                  <option value="Europe/Saratov">
                    Saratov Standard Time (UTC + 03:00) - Europe/Saratov
                  </option>
                  <option value="Europe/Volgograd">
                    Volgograd Standard Time (UTC + 03:00) - Europe/Volgograd
                  </option>
                  <option value="Asia/Tehran">
                    Iran Standard Time (UTC + 03:30) - Asia/Tehran
                  </option>
                  <option value="Asia/Krasnoyarsk">
                    North Asia Standard Time (UTC + 07:00) - Asia/Krasnoyarsk
                  </option>
                  <option value="Asia/Colombo">
                    Sri Lanka Standard Time (UTC + 05:30) - Asia/Colombo
                  </option>
                  <option value="Asia/Kolkata">
                    India Standard Time (UTC + 05:30) - Asia/Kolkata
                  </option>
                  <option value="Asia/Kathmandu">
                    Nepal Standard Time (UTC + 05:45) - Asia/Kathmandu
                  </option>
                  <option value="Asia/Almaty">
                    Central Asia Standard Time (UTC + 06:00) - Asia/Almaty
                  </option>
                  <option value="Asia/Yangon">
                    Myanmar Standard Time (UTC + 06:30) - Asia/Yangon
                  </option>
                  <option value="Asia/Bangkok">
                    SE Asia Standard Time (UTC + 07:00) - Asia/Bangkok
                  </option>
                  <option value="Asia/Novosibirsk">
                    N. Central Asia Standard Time (UTC + 07:00) -
                    Asia/Novosibirsk
                  </option>
                  <option value="Asia/Shanghai">
                    China Standard Time (UTC + 08:00) - Asia/Shanghai
                  </option>
                  <option value="Asia/Irkutsk">
                    North Asia East Standard Time (UTC + 08:00) - Asia/Irkutsk
                  </option>
                  <option value="Asia/Singapore">
                    Singapore Standard Time (UTC + 08:00) - Asia/Singapore
                  </option>
                  <option value="Asia/Taipei">
                    Taipei Standard Time (UTC + 08:00) - Asia/Taipei
                  </option>
                  <option value="Australia/Perth">
                    W. Australia Standard Time (UTC + 08:00) - Australia/Perth
                  </option>
                  <option value="Asia/Seoul">
                    Korea Standard Time (UTC + 09:00) - Asia/Seoul
                  </option>
                  <option value="Asia/Tokyo">
                    Tokyo Standard Time (UTC + 09:00) - Asia/Tokyo
                  </option>
                  <option value="Asia/Yakutsk">
                    Yakutsk Standard Time (UTC + 09:00) - Asia/Yakutsk
                  </option>
                  <option value="Australia/Adelaide">
                    Cen. Australia Standard Time (UTC + 09:30) -
                    Australia/Adelaide
                  </option>
                  <option value="Australia/Darwin">
                    AUS Central Standard Time (UTC + 09:30) - Australia/Darwin
                  </option>
                  <option value="Australia/Brisbane">
                    E. Australia Standard Time (UTC + 10:00) -
                    Australia/Brisbane
                  </option>
                  <option value="Australia/Hobart">
                    Tasmania Standard Time (UTC + 10:00) - Australia/Hobart
                  </option>
                  <option value="Asia/Vladivostok">
                    Vladivostok Standard Time (UTC + 10:00) - Asia/Vladivostok
                  </option>
                  <option value="Pacific/Guadalcanal">
                    Central Pacific Standard Time (UTC + 11:00) -
                    Pacific/Guadalcanal
                  </option>
                  <option value="Asia/Magadan">
                    Magadan Standard Time (UTC + 11:00) - Asia/Magadan
                  </option>
                  <option value="Pacific/Norfolk">
                    Norfolk Standard Time (UTC + 11:00) - Pacific/Norfolk
                  </option>
                  <option value="Asia/Sakhalin">
                    Sakhalin Standard Time (UTC + 11:00) - Asia/Sakhalin
                  </option>
                  <option value="Pacific/Auckland">
                    New Zealand Standard Time (UTC + 12:00) - Pacific/Auckland
                  </option>
                  <option value="Pacific/Fiji">
                    Fiji Standard Time (UTC + 12:00) - Pacific/Fiji
                  </option>
                  <option value="Etc/GMT-12">
                    UTC+12 (UTC + 12:00) - Etc/GMT-12
                  </option>
                  <option value="Pacific/Tongatapu">
                    Tonga Standard Time (UTC + 13:00) - Pacific/Tongatapu
                  </option>
                  <option value="Pacific/Kiritimati">
                    Line Islands Standard Time (UTC + 14:00) -
                    Pacific/Kiritimati
                  </option>
                  <option value="Pacific/Apia">
                    Samoa Standard Time (UTC - 13:00) - Pacific/Apia
                  </option>
                  <option value="Etc/GMT+12">
                    Dateline Standard Time (UTC - 12:00) - Etc/GMT+12
                  </option>
                  <option value="Pacific/Midway">
                    UTC-11 (UTC - 11:00) - Pacific/Midway
                  </option>
                  <option value="Pacific/Honolulu">
                    Hawaiian Standard Time (UTC - 10:00) - Pacific/Honolulu
                  </option>
                  <option value="America/Anchorage">
                    Alaskan Standard Time (UTC - 09:00) - America/Anchorage
                  </option>
                  <option value="America/Los_Angeles">
                    Pacific Standard Time (UTC - 08:00) - America/Los_Angeles
                  </option>
                  <option value="America/Santa_Isabel">
                    Pacific Standard Time (Mexico) (UTC - 08:00) -
                    America/Santa_Isabel
                  </option>
                  <option value="America/Denver">
                    Mountain Standard Time (UTC - 07:00) - America/Denver
                  </option>
                  <option value="America/Phoenix">
                    US Mountain Standard Time (UTC - 07:00) - America/Phoenix
                  </option>
                  <option value="America/Regina">
                    Canada Central Standard Time (UTC - 06:00) - America/Regina
                  </option>
                  <option value="America/Guatemala">
                    Central America Standard Time (UTC - 06:00) -
                    America/Guatemala
                  </option>
                  <option value="America/Chicago">
                    Central Standard Time (UTC - 06:00) - America/Chicago
                  </option>
                  <option value="America/New_York">
                    Eastern Standard Time (UTC - 05:00) - America/New_York
                  </option>
                  <option value="America/Bogota">
                    SA Pacific Standard Time (UTC - 05:00) - America/Bogota
                  </option>
                  <option value="America/Indianapolis">
                    US Eastern Standard Time (UTC - 05:00) -
                    America/Indianapolis
                  </option>
                  <option value="America/Caracas">
                    Venezuela Standard Time (UTC - 04:30) - America/Caracas
                  </option>
                  <option value="America/Halifax">
                    Atlantic Standard Time (UTC - 04:00) - America/Halifax
                  </option>
                  <option value="America/Cuiaba">
                    Central Brazilian Standard Time (UTC - 04:00) -
                    America/Cuiaba
                  </option>
                  <option value="America/Santiago">
                    Pacific SA Standard Time (UTC - 04:00) - America/Santiago
                  </option>
                  <option value="America/Asuncion">
                    Paraguay Standard Time (UTC - 04:00) - America/Asuncion
                  </option>
                  <option value="America/La_Paz">
                    SA Western Standard Time (UTC - 04:00) - America/La_Paz
                  </option>
                  <option value="America/St_Johns">
                    Newfoundland Standard Time (UTC - 03:30) - America/St_Johns
                  </option>
                  <option value="America/Bahia">
                    Bahia Standard Time (UTC - 03:00) - America/Bahia
                  </option>
                  <option value="America/Buenos_Aires">
                    Argentina Standard Time (UTC - 03:00) - America/Buenos_Aires
                  </option>
                  <option value="America/Sao_Paulo">
                    E. South America Standard Time (UTC - 03:00) -
                    America/Sao_Paulo
                  </option>
                  <option value="America/Godthab">
                    Greenland Standard Time (UTC - 03:00) - America/Godthab
                  </option>
                  <option value="America/Montevideo">
                    Montevideo Standard Time (UTC - 03:00) - America/Montevideo
                  </option>
                  <option value="America/Cayenne">
                    SA Eastern Standard Time (UTC - 03:00) - America/Cayenne
                  </option>
                  <option value="America/Noronha">
                    UTC-02 (UTC - 02:00) - America/Noronha
                  </option>
                  <option value="Atlantic/Azores">
                    Azores Standard Time (UTC - 01:00) - Atlantic/Azores
                  </option>
                  <option value="Atlantic/Cape_Verde">
                    Cape Verde Standard Time (UTC - 01:00) - Atlantic/Cape_Verde
                  </option>
                  <option value="Europe/London">
                    GMT Standard Time (UTC) - Europe/London
                  </option>
                  <option value="Atlantic/Reykjavik">
                    Greenwich Standard Time (UTC) - Atlantic/Reykjavik
                  </option>
                  <option value="Africa/Casablanca">
                    Morocco Standard Time (UTC) - Africa/Casablanca
                  </option>
                  <option value="America/Danmarkshavn">
                    UTC (UTC) - America/Danmarkshavn
                  </option>
                  <option value="Europe/Budapest">
                    Central Europe Standard Time (UTC + 01:00) - Europe/Budapest
                  </option>
                  <option value="Europe/Warsaw">
                    Central European Standard Time (UTC + 01:00) - Europe/Warsaw
                  </option>
                  <option value="Africa/Windhoek">
                    Namibia Standard Time (UTC + 01:00) - Africa/Windhoek
                  </option>
                  <option value="Europe/Paris">
                    Romance Standard Time (UTC + 01:00) - Europe/Paris
                  </option>
                  <option value="Africa/Lagos">
                    W. Central Africa Standard Time (UTC + 01:00) - Africa/Lagos
                  </option>
                  <option value="Europe/Berlin">
                    W. Europe Standard Time (UTC + 01:00) - Europe/Berlin
                  </option>
                  <option value="Europe/Sofia">
                    Eastern European Summer Time (UTC + 03:00) - Europe/Sofia
                  </option>
                  <option value="Africa/Cairo">
                    Egypt Standard Time (UTC + 02:00) - Africa/Cairo
                  </option>
                  <option value="Europe/Kiev">
                    FLE Standard Time (UTC + 02:00) - Europe/Kiev
                  </option>
                  <option value="Europe/Bucharest">
                    GTB Standard Time (UTC + 02:00) - Europe/Bucharest
                  </option>
                  <option value="Asia/Jerusalem">
                    Israel Standard Time (UTC + 02:00) - Asia/Jerusalem
                  </option>
                  <option value="Africa/Tripoli">
                    Libya Standard Time (UTC + 02:00) - Africa/Tripoli
                  </option>
                  <option value="Asia/Beirut">
                    Middle East Standard Time (UTC + 02:00) - Asia/Beirut
                  </option>
                  <option value="Africa/Johannesburg">
                    South Africa Standard Time (UTC + 02:00) -
                    Africa/Johannesburg
                  </option>
                  <option value="Asia/Damascus">
                    Syria Standard Time (UTC + 02:00) - Asia/Damascus
                  </option>
                  <option value="Europe/Istanbul">
                    Turkey Standard Time (UTC + 02:00) - Europe/Istanbul
                  </option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Please select Time Zone.
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="px-3 col-12">
              <Form.Group className="mb-2">
                <Form.Label className="primary-text fw-medium formLabelText">
                  Restaurant Description
                </Form.Label>
                <Form.Control
                  style={{ height: "95px", resize: "none" }}
                  className="customInputBoxText customscrollbar"
                  as={"textarea"}
                  type="text"
                  placeholder="Enter restaurant description"
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
            <div className="px-3 col-12">
              <Form.Group className="mb-2">
                <Form.Label className="primary-text fw-medium formLabelText">
                  Restaurant Address
                </Form.Label>
                <Form.Control
                  style={{ resize: "none" }}
                  className="customInputBoxText customscrollbar"
                  as={"textarea"}
                  type="text"
                  placeholder="Enter restaurant address"
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  isInvalid={isInvalid.address}
                />
                <Form.Control.Feedback type="invalid">
                  Please enter address.
                </Form.Control.Feedback>
              </Form.Group>
            </div>
            <div className="px-3 col-12">
              <Form.Group className="mb-2">
                <Form.Label className="primary-text fw-medium formLabelText">
                  Phone Number
                </Form.Label>
                <Form.Control
                  className="customInputBoxText"
                  type="number"
                  placeholder="Enter phone number"
                  name="contact"
                  value={form.contact}
                  onChange={handleChange}
                />
              </Form.Group>
            </div>
            <div className="col-12 d-flex row">
              <div className="col">
                <Form.Group controlId="formFile" className="mb-3">
                  <Form.Label className="formLabelText">Upload logo</Form.Label>
                  <div>
                    <Form.Control
                      className="customInputBoxText"
                      type="file"
                      id="fileLogo"
                      name="file"
                      onChange={handleFile}
                    />
                  </div>
                </Form.Group>
              </div>

              <div className="col d-flex align-items-center gap-2 mt-3">
                <CustomButton
                  name={"Upload"}
                  handleClick={() => {
                    handleImageUpload();
                  }}
                  bgColor={themeColor.accent}
                  color={themeColor.primary}
                  preIcon={logoUpload ? <Spinner /> : <FaCircleCheck />}
                />
              </div>
            </div>

            <div className="px-3 col-12">
              <div className="d-flex gap-2">
                <CustomTitle heading={"Create additional fields"} />
                <div className="d-flex gap-2 fw-medium">
                  <Form.Check
                    style={{ fontSize: "15px" }}
                    type="radio"
                    name="fieldType"
                    label="text"
                    defaultChecked
                    onClick={() => setIsField(true)}
                  />
                  <div style={{ fontSize: "15px" }}>or</div>
                  <Form.Check
                    type="radio"
                    style={{ fontSize: "15px" }}
                    name="fieldType"
                    label="image (.png , .jpeg , .pdf)"
                    onClick={() => setIsField(false)}
                  />
                </div>
              </div>
            </div>
            {isField ? (
              <>
                <div className="ps-3 col-4">
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter field name"
                    className="customInputBoxText"
                    onChange={handleAdditionalFieldChange}
                    value={additionalTextField.name}
                  />
                </div>
                <div className="px-3 col-6">
                  <Form.Control
                    type="text"
                    placeholder="Enter field details"
                    className="customInputBoxText"
                    name="value"
                    onChange={handleAdditionalFieldChange}
                    value={additionalTextField.value}
                  />
                </div>
                <div className="col-2">
                  <CustomButton
                    name={"Add"}
                    handleClick={addAdditionalTextField}
                    bgColor={themeColor.accent}
                    color={themeColor.primary}
                    preIcon={
                      isLoadingAddtionalField ? <Spinner /> : <FaCircleCheck />
                    }
                  />
                </div>
              </>
            ) : (
              <>
                <div className="px-3 col-12"></div>
                <div className="ps-3 col-4">
                  <Form.Control
                    type="text"
                    name="name"
                    placeholder="Enter field name"
                    className="customInputBoxText"
                    onChange={handleAdditionalMediaFieldChange}
                    value={additionalMediaField.name}
                  />
                </div>
                <div className="px-3 col-6">
                  <Form.Control
                    type="file"
                    id="fileInput"
                    placeholder="Upload document"
                    className="customInputBoxText"
                    name="file"
                    onChange={(e) =>
                      setAdditionalMediaField((prev) => ({
                        ...prev,
                        file: e.target.files[0],
                      }))
                    }
                  />
                </div>
                <div className="col-2">
                  <CustomButton
                    name={"Upload"}
                    handleClick={handleAdditionalImageUpload}
                    bgColor={themeColor.accent}
                    color={themeColor.primary}
                    preIcon={
                      isLoadingAddtionalMediaField ? (
                        <Spinner />
                      ) : (
                        <FaCircleCheck />
                      )
                    }
                  />
                </div>
              </>
            )}
            <div className="px-3 mt-2 col-12">
              <Table>
                <tbody>
                  {form.additionalTextFields.map((field, index) => (
                    <tr key={index}>
                      <td className="customTableTd">{field.name}</td>
                      <td className="customTableTd">{field.value}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2 justify-content-end">
                          {/* <MdEdit color={themeColor.primary} onClick={()=> editAdditionalTextField(field,index)}/> */}
                          {deletingTextItemIndex === index ? (
                            <Spinner />
                          ) : (
                            <MdDelete
                              color={themeColor.primary}
                              onClick={() => removeAdditionalField(index)}
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <div className="px-3 mt-2 col-12">
              <Table>
                <tbody>
                  {form.additionalMediaFields.map((field, index) => (
                    <tr key={index}>
                      <td className="customTableTd">{field.name}</td>
                      <td className="customTableTd">{field.image_name}</td>
                      <td>
                        <div className="d-flex align-items-center gap-2 justify-content-end">
                          {deletingImageItemIndex === index ? (
                            <Spinner />
                          ) : (
                            <MdDelete
                              color={themeColor.primary}
                              onClick={() =>
                                removeAdditionalMediaField(index, field)
                              }
                            />
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            {/* submit button */}
            <div className="col-12 p-3">
              <CustomButton
                name={"Save changes"}
                preIcon={isLoading ? <Spinner /> : <FaCircleCheck />}
                bgColor={themeColor.primary}
                handleClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestaurantInfo;
