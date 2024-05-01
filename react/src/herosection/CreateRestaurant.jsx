import React, { useEffect, useState } from "react";
import { Form } from "react-bootstrap";
import CustomButton from "../components/buttons/CustomButton";
import { BASE_URL, themeColor } from "../utilis/constants";
import { FaCircleCheck } from "react-icons/fa6";
import toast, { Toaster } from "react-hot-toast";
import { useSelector } from "react-redux";
import CustomBreadCrumb from "../components/breadcrumb/CustomBreadCrumb";
import Spinner from "../components/loaders/Spinner";
import { useRestaurantListApi } from "../global_apis/useRestaurantListApi";
import { useGlobalApiHandler } from "../utilis/useGlobalApiHandler";
import { useNavigate } from "react-router-dom";
import { useBreadcrumbData } from "../utilis/useBreadcrumbData";
import AdministratorCredentialsModal from "../components/modals/AdministratorCredentialsModal";

function CreateRestaurant() {
  const navigate = useNavigate();
  const userDetails = useSelector((state) => state.userData.data);

  const breadcrumb = useBreadcrumbData();
  const globalApiHandler = useGlobalApiHandler();
  const fetchRestaurantList = useRestaurantListApi();

  const [form, setForm] = useState({
    outlet_name: "",
    description: "",
    address: "",
    currency: "us",
    timezone: "",
    contact: "",
  });
  const [isInvalid, setIsInvalid] = useState({
    outlet_name: false,
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const toggleModal = () => setShowModal(!showModal);

  const handleForm = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleValidation = () => {
    const validations = {
      outlet_name: !form.outlet_name.length,
    };
    setIsInvalid((prev) => ({
      ...prev,
      ...validations,
    }));

    return Object.values(validations).every((isValid) => !isValid);
  };

  const handleSubmit = async () => {
    let frontendValidation = handleValidation();
    if (frontendValidation) {
      toggleModal();
    }
  };

  useEffect(() => {
    breadcrumb("newoutlet");
  }, []);

  return (
    <div className="overflow-auto customscrollbar h-100">
      <AdministratorCredentialsModal
        handleToggle={toggleModal}
        show={showModal}
        outletForm={form}
        setOutletForm={setForm}
      />
      <CustomBreadCrumb />
      {/* Basic Details */}
      <Toaster />
      <div className="row justify-content-center">
        <div className="col-12 col-lg-6">
          <h4 className="ms-4 mb-2 primary-text">Create Restaurant</h4>
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
                  onChange={handleForm}
                  value={form.outlet_name}
                  type="text"
                  placeholder="Enter restaurant name"
                  required
                  isInvalid={isInvalid.outlet_name}
                  name="outlet_name"
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
                  className="customInputBoxText"
                  onChange={(e) =>
                    setForm((prev) => ({ ...prev, currency: e.target.value }))
                  }
                  value={form.currency}
                  isInvalid={false}
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
                  style={{ resize: "none" }}
                  className="customInputBoxText"
                  value={form.description}
                  onChange={handleForm}
                  as={"textarea"}
                  type="text"
                  placeholder="Enter restaurant description"
                  name="description"
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
                  className="customInputBoxText"
                  as={"textarea"}
                  type="text"
                  placeholder="Enter restaurant address"
                  name="address"
                  value={form.address}
                  onChange={handleForm}
                  isInvalid={false}
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
                  onChange={handleForm}
                />
              </Form.Group>
            </div>

            {/* submit button */}
            <div className="col-12 p-3">
              <CustomButton
                name={"Save"}
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

export default CreateRestaurant;
