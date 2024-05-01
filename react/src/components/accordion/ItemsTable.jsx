import React, { Fragment, useEffect, useState } from "react";
import { Table } from "react-bootstrap";
import MenuTextBox from "./MenuTextBox";
import MenuPriceTextBox from "./MenuPriceTextBox";
import { themeColor } from "../../utilis/constants";
import { useDispatch } from "react-redux";
import { handleAddNewItem, handleDeleteItem } from "../../store/menuSlice";
import useIdGenerator from "../../utilis/useIdGenerator";
import { MdAdd, MdAddCircle, MdDelete, MdRemoveRedEye } from "react-icons/md";
import { handleActiveItem } from "../../store/activeItemSlice";
import toast from "react-hot-toast";
import { HiMinusSm } from "react-icons/hi";
import { useSelector } from "react-redux";
import { useUpdateMenu } from "../../utilis/useUpdateMenu";
import { useParams } from "react-router-dom";
import ItemLevelAddonSelectionDropdown from "../dropdowns/ItemLevelAddonSelectionDropdown";
import { useGetAddonGroupName } from "../../utilis/useGetAddonGroupName";

function ItemsTable({ data, subCategoryId }) {
  const menuOverallDetails = useSelector((state) => state.menuData.overallData);

  const [showNewFields, setShowNewFields] = useState(false);
  const [form, setForm] = useState({
    product_name: "",
    product_description: "",
    product_price: "",
  });
  const [showAddonSelection, setShowAddonSelection] = useState(null);
  const [generateId, setGenerateId] = useIdGenerator();
  const [isMenuChange, setIsMenuChange] = useState(false);

  const dispatch = useDispatch();
  const updateMenu = useUpdateMenu();
  const param = useParams();
  const getAddonName = useGetAddonGroupName();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // toggles
  const toggleNewFields = () => setShowNewFields(!showNewFields);

  const handleDispatch = () => {
    if (
      !form.product_name.trim().length ||
      !form.product_description.trim().length ||
      !form.product_price.trim().length
    ) {
      return toast.error("Fields cannot be empty");
    }
    const payload = {
      type: "product",
      value: {
        product_id: subCategoryId + "_" + generateId,
        ...form,
      },
    };
    dispatch(handleAddNewItem(payload));
    setForm({
      product_name: "",
      product_description: "",
      product_price: "",
    });
    toggleNewFields();
  };

  const handleDeleteProduct = (id) => {
    dispatch(handleDeleteItem(id));
    setIsMenuChange(true);
  };

  const handleUpdateMenu = async () => {
    const payload = {
      catalogId: param.menuId,
      isCatalogChange: false,
    };
    await updateMenu(payload);
    setIsMenuChange(false);
  };

  useEffect(() => {
    isMenuChange && handleUpdateMenu();
  }, [isMenuChange]);

  return (
    <div>
      <div
        onClick={toggleNewFields}
        className="text-end mb-2 fw-medium cursor-pointer"
        style={{ fontSize: "12px", color: themeColor.primary }}
      >
        {showNewFields ? <HiMinusSm /> : <MdAdd />} new item
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
            <th style={{ width: "60px" }} className="customTableTh">
              Addons
            </th>
            <th style={{ width: "60px" }} className="customTableTh">
              Actions
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
                        name: "isMenuEdit",
                        value: true,
                      })
                    )
                  }
                  className="newmenuItemInputBox w-100"
                  onChange={handleChange}
                  value={form.product_name}
                  name="product_name"
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
                        name: "isMenuEdit",
                        value: true,
                      })
                    )
                  }
                  className="newmenuItemInputBox w-100"
                  onChange={handleChange}
                  value={form.product_description}
                  name="product_description"
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
                        name: "isMenuEdit",
                        value: true,
                      })
                    )
                  }
                  className="newmenuItemInputBox w-100"
                  onChange={handleChange}
                  value={form.product_price}
                  name="product_price"
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
                        <MenuTextBox
                          name={trans?.data[index]?.product_name}
                          code={data[i]?.code}
                          valueKey={"product_name"}
                          id={product?.product_id}
                        />
                      </td>
                      <td className="menuTdText">
                        <MenuTextBox
                          name={trans?.data[index]?.product_description}
                          code={data[i]?.code}
                          valueKey={"product_description"}
                          id={product?.product_id}
                        />
                      </td>
                      <td className="menuTdText">
                        <MenuPriceTextBox
                          name={
                            data[i]?.code === data[0]?.code &&
                            trans?.data[index]?.product_price
                          }
                          id={product?.product_id}
                          isDisabled={data[i]?.code !== data[0]?.code && true}
                        />
                      </td>
                      <td className="menuTdText text-center d-flex gap-2 position-relative">
                        {data[i]?.code === data[0]?.code && (
                          <MdAddCircle
                            size={"18px"}
                            color={themeColor.primary}
                            onClick={() =>
                              setShowAddonSelection(
                                `${product?.product_id}${data[i]?.code}`
                              )
                            }
                          />
                        )}
                        {product?.addonsGroup
                          ? product?.addonsGroup.map((addon, addonIndex) => {
                              return (
                                <div key={addon} className="d-flex gap-1">
                                  <div className="text-nowrap">
                                    {
                                      getAddonName(addon, data[i]?.code)
                                        ?.addon_group
                                    }
                                  </div>
                                  {addonIndex + 1 !==
                                    product?.addonsGroup?.length && (
                                    <div>,</div>
                                  )}
                                </div>
                              );
                            })
                          : ""}
                        {showAddonSelection ===
                          `${product?.product_id}${data[i]?.code}` && (
                          <ItemLevelAddonSelectionDropdown
                            handleClose={setShowAddonSelection}
                            itemId={product?.product_id}
                            itemAddons={
                              product?.addonsGroup ? product?.addonsGroup : []
                            }
                          />
                        )}
                      </td>
                      <td className="menuTdText">
                        {data[i]?.code === data[0]?.code && (
                          <MdDelete
                            size={"18px"}
                            color={themeColor.primary}
                            onClick={() =>
                              handleDeleteProduct(product?.product_id)
                            }
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

export default ItemsTable;
