import React, { useEffect, useState } from "react";
import { Form, Table } from "react-bootstrap";
import { MdDelete, MdEdit, MdRemoveRedEye } from "react-icons/md";
import { themeColor } from "../../utilis/constants";
import { useSelector } from "react-redux";
import { useNavigate, useParams } from "react-router-dom";
import MenuItemModal from "../modals/MenuItemModal";
import CustomButton from "../buttons/CustomButton";

function MenuItemsTable() {
  const menuItems = useSelector((state) => state.selectedMenuItemsData.data);
  const menuDefaultLanguage = useSelector(
    (state) => state.activeItemData.menuDefaultLanguage
  );
  const menuLanguageCode = useSelector(
    (state) => state.activeItemData.menuLanguage
  );

  const navigate = useNavigate();
  const params = useParams();

  const [showModal, setShowModal] = useState(false);
  const [isItemCreate, setIsItemCreate] = useState(false);
  const [isDefaultLanguage, setIsDefaultLanguage] = useState(true);

  const handleToggleModal = () => setShowModal(!showModal);
  const handleToggleCreateItem = () => setIsItemCreate(!isItemCreate);

  useEffect(() => {
    if (menuDefaultLanguage === menuLanguageCode) {
      setIsDefaultLanguage(true);
    } else {
      setIsDefaultLanguage(false);
    }
  }, [menuLanguageCode]);

  return (
    <>
      {isDefaultLanguage && (
        <div className="d-flex">
          <CustomButton
            name={isItemCreate ? "Cancel" : "Add item"}
            bgColor={themeColor.primary}
            handleClick={handleToggleCreateItem}
          />
        </div>
      )}
      <Table responsive>
        <thead>
          <tr>
            <th className="menuHeading">Name</th>
            <th className="menuHeading">Description</th>
            <th style={{ width: "150px" }} className="menuHeading">
              Price
            </th>
            <th className="menuHeading">Actions</th>
          </tr>
        </thead>
        {isItemCreate && (
          <tbody className="animeBottomToTop">
            <tr>
              <td>
                <Form.Control
                  placeholder="Enter item name"
                  type="text"
                  className="customInputBoxText"
                />
              </td>
              <td>
                <Form.Control
                  placeholder="Enter description"
                  type="text"
                  className="customInputBoxText"
                />
              </td>
              <td>
                <Form.Control
                  placeholder="Enter price"
                  type="number"
                  className="customInputBoxText"
                />
              </td>
              <td>
                <div className="mt-1">
                  <CustomButton name={"Save"} bgColor={themeColor.primary} />
                </div>
              </td>
            </tr>
          </tbody>
        )}
        <tbody>
          {menuItems?.length ? (
            <>
              {menuItems.map((item) => {
                return (
                  <tr key={item?.tag}>
                    <td className="menuRow">{item?.item_name}</td>
                    <td className="menuRow">{item?.description}</td>
                    <td className="menuRow">{item?.price}</td>
                    <td className="menuRow">
                      <div className="d-flex align-items-center gap-2">
                        <MdRemoveRedEye
                          onClick={() =>
                            navigate(
                              `/main/outlet/${params?.outletId}/menupreview/${params.menuId}/preview/${item?.tag}`
                            )
                          }
                          size={"18px"}
                          color={themeColor.primary}
                        />
                        <MdEdit
                          onClick={handleToggleModal}
                          size={"18px"}
                          color={themeColor.primary}
                        />
                        {isDefaultLanguage && (
                          <MdDelete size={"18px"} color={themeColor.primary} />
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </>
          ) : (
            <tr>
              <td colSpan={4} className="text-danger text-center">
                No items found
              </td>
            </tr>
          )}
        </tbody>
      </Table>
      <MenuItemModal handleToggle={handleToggleModal} show={showModal} />
    </>
  );
}

export default MenuItemsTable;
