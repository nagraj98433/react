import React, { Fragment, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import MenuTextBox from "./MenuTextBox";
import MenuPriceTextBox from "./MenuPriceTextBox";
import AddOnTextBox from "./AddOnTextBox";
import AddonPriceTextBox from "./AddonPriceTextBox";
import { BASE_URL, themeColor } from "../../utilis/constants";
import { MdAdd, MdDelete } from "react-icons/md";
import { handleActiveItem } from "../../store/activeItemSlice";
import { useDispatch } from "react-redux";
import useIdGenerator from "../../utilis/useIdGenerator";
import { useSelector } from "react-redux";
import {
  handleAddOnDeleteItem,
  handleAddOnNewItem,
} from "../../store/addOnCatalogSlice";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import toast from "react-hot-toast";
import axios from "axios";
import AddOnUpdateModal from "../modals/AddOnUpdateModal";
import { useParams } from "react-router-dom";

function AddonItemTable({ data }) {
  const addonOverallDetails = useSelector(
    (state) => state.addOnData.overallData
  );
  const isAddonEdit = useSelector((state) => state.activeItemData.isAddOnEdit);

  const userDetails = useSelector((state) => state.userData.data);
  const outletId = useSelector((state) => state.activeItemData.restaurantId);
  const groupId = data[0]?.addonGroupId;

  const dispatch = useDispatch();
  const [generateId, setGenerateId] = useIdGenerator();
  const params = useParams();

  const [showNewFields, setShowNewFields] = useState(false);
  const [isAddOnUpdate, setAddOnUpdate] = useState(false);
  const [addon, setAddOn] = useState(false);
  const apiHandler = useGlobalApiHandler();

  const [form, setForm] = useState({
    addon_name: "",
    addon_description: "",
    addon_price: "",
  });
  const toggleNewFields = () => {
    setShowNewFields(!showNewFields);
  };
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };
  const handleDispatch = () => {
    if (
      !form.addon_name.length ||
      !form.addon_description.length ||
      !form.addon_price.length
    ) {
      return;
    }
    const payload = {
      type: "add_on",
      value: {
        addon_name_id: groupId + "_" + generateId,
        ...form,
        addon_price: parseInt(form.addon_price, 10),
      },
    };
    dispatch(handleAddOnNewItem(payload));
    setForm({
      addon_name: "",
      addon_description: "",
      addon_price: "",
    });
    toggleNewFields();
  };
  const handleDelete = (data) => {
    setAddOnUpdate(true);
    const payload = {
      type: "add_on",
      value: data,
    };

    dispatch(handleAddOnDeleteItem(payload));
    setAddOn(true);
  };
  const handledeleteupdate = async () => {
    const apiData = {
      method: "get",
      url:
        BASE_URL +
        "api/outlets/addon/" +
        userDetails?.owner_id +
        "/" +
        params?.outletId +
        "/",
    };
    const response = await apiHandler(apiData);
    if (!response?.success) {
      return toast.error(response?.message);
    }
    await axios.put(response?.data?.addon_update, addonOverallDetails);
    setAddOnUpdate(false);
    setAddOn(false);
  };
  useEffect(() => {
    addon && handledeleteupdate();
  }, [addon]);
  return (
    <div>
      <AddOnUpdateModal show={isAddOnUpdate} />

      <div
        onClick={toggleNewFields}
        className="text-end mb-2 fw-medium cursor-pointer"
        style={{ fontSize: "12px", color: themeColor.primary }}
      >
        <MdAdd /> new addon
      </div>
      <Table bordered>
        <thead>
          <tr>
            <th style={{ width: "80px" }} className="customTableTh">
              Language
            </th>
            <th style={{ width: "300px" }} className="customTableTh">
              Item Name
            </th>
            <th className="customTableTh">Item Description</th>
            <th style={{ width: "50px" }} className="customTableTh">
              Item Price
            </th>
            <th style={{ width: "50px" }} className="customTableTh">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {showNewFields && (
            <tr className="animeBottomToTop">
              <td className="menuTdText">{data[0]?.code}</td>
              <td className="menuTdText">
                <input
                  type="text"
                  onFocus={() =>
                    dispatch(
                      handleActiveItem({
                        name: "isAddOnEdit",
                        value: true,
                      })
                    )
                  }
                  className="newmenuItemInputBox w-100"
                  onChange={handleChange}
                  value={form?.addon_name}
                  name="addon_name"
                  onBlur={() => {
                    setGenerateId();
                    handleDispatch();
                  }}
                />
              </td>
              <td className="menuTdText">
                <input
                  type="text"
                  onFocus={() =>
                    dispatch(
                      handleActiveItem({
                        name: "isAddOnEdit",
                        value: true,
                      })
                    )
                  }
                  className="newmenuItemInputBox w-100"
                  onChange={handleChange}
                  value={form?.addon_description}
                  name="addon_description"
                  onBlur={() => {
                    setGenerateId();
                    handleDispatch();
                  }}
                />
              </td>
              <td className="menuTdText">
                <input
                  type="number"
                  onFocus={() =>
                    dispatch(
                      handleActiveItem({
                        name: "isAddOnEdit",
                        value: true,
                      })
                    )
                  }
                  className="newmenuItemInputBox w-100"
                  onChange={handleChange}
                  value={form?.addon_price}
                  name="addon_price"
                  onBlur={() => {
                    setGenerateId();
                    handleDispatch();
                  }}
                />
              </td>
            </tr>
          )}
          {data &&
            data[0]?.data.map((product, index) => (
              <Fragment key={index}>
                {data &&
                  data.map((trans, i) => (
                    <tr key={i}>
                      <td className="menuTdText">{data[i]?.code}</td>
                      <td className="menuTdText">
                        <AddOnTextBox
                          name={trans?.data[index]?.addon_name}
                          code={data[i]?.code}
                          valueKey={"addon_name"}
                          id={product?.addon_name_id}
                        />
                      </td>
                      <td className="menuTdText">
                        <AddOnTextBox
                          name={trans?.data[index]?.addon_description}
                          code={data[i]?.code}
                          valueKey={"addon_description"}
                          id={product?.addon_name_id}
                        />
                      </td>
                      <td className="menuTdText">
                        <AddonPriceTextBox
                          name={
                            data[i]?.code === data[0]?.code &&
                            trans?.data[index]?.addon_price
                          }
                          id={product?.addon_name_id}
                          isDisabled={data[i]?.code !== data[0]?.code && true}
                        />
                      </td>
                      <td className="menuTdText">
                        {data[i]?.code == data[0]?.code && (
                          <MdDelete
                            className="ms-2"
                            color={themeColor.primary}
                            size={"15px"}
                            onClick={() => {
                              handleDelete(product);
                            }}
                          />
                        )}
                      </td>
                    </tr>
                  ))}
              </Fragment>
            ))}
        </tbody>
      </Table>
    </div>
  );
}

export default AddonItemTable;
