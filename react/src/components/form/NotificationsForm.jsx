import React, { useEffect, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { BASE_URL, themeColor } from "../../utilis/constants";
import { useDispatch, useSelector } from "react-redux";
import CustomTitle from "../heading/CustomTitle";
import { useGlobalApiHandler } from "../../utilis/useGlobalApiHandler";
import OrderPlacedMsgPreview from "../preview/OrderPlacedMsgPreview";
import OrderConfirmedMsgPreview from "../preview/OrderConfirmedMsgPreview";
import CustomButton from "../buttons/CustomButton";
import { useParams } from "react-router-dom";

function NotificationsForm() {
  const draggableOrderPlacedContent = useSelector(
    (state) => state.notificationContentData.orderPlacedContentList
  );

  const draggableOrderConfirmedContent = useSelector(
    (state) => state.notificationContentData.orderConfirmedContentList
  );

  const dispatch = useDispatch();
  const apiHandler = useGlobalApiHandler();
  const params = useParams();

  const [orderPlacedForm, setOrderPlacedForm] = useState({
    name: "",
    value: "",
  });
  const [isPlacedInvalid, setIsPlacedInvalid] = useState({
    name: false,
    value: false,
  });
  const [orderPlaced, setOrderPlaced] = useState({
    orderNo: "",
    resName: "",
    userName: "",
    createdAt: "",
  });
  const [data, setData] = useState("");
  const [orderConfirmed, setOrderConfirmed] = useState({
    orderNoConfirmed: "",
    resNameConfirmed: "",
    userNameConfirmed: "",
  });

  const handleValidation = () => {
    const validations = {
      name: !orderPlacedForm.name.length,
      value: !orderPlacedForm.value.length,
    };
    setIsPlacedInvalid((prev) => ({
      ...prev,
      ...validations,
    }));

    return Object.values(validations).every((isValid) => !isValid);
  };

  const createOrderPlacedContent = async () => {
    const data = {
      outlet_uuid: params?.outletId,
      orderPlaced: [
        {
          name: orderPlacedForm.name,
          value: orderPlacedForm.value,
        },
      ],
    };

    const apiData = {
      method: "post",
      url: BASE_URL + "api/receipt/orderplaced/create/",
      data: data,
    };

    const response = await apiHandler(apiData);

    console.log(response);
  };

  const handleHeaderSubmit = () => {
    const frontendValidation = handleValidation();
    frontendValidation && createOrderPlacedContent();
  };
  const handleUpdateMsg = (e) => {
    const previouslySelectedButton = document.querySelector(".border");
    if (previouslySelectedButton) {
      previouslySelectedButton.classList.remove(
        "border",
        "border-primary",
        "border-2",
        "border-solid"
      );
    }
    if (data !== "") {
      const selection = window.getSelection();
      const range = selection.getRangeAt(0);
      const textNode = document.createElement("span");
      textNode.setAttribute("class", "fw-bolder");

      textNode.appendChild(document.createTextNode(data));
      // If there's no selection or the range is collapsed (cursor position)
      if (!selection || range.collapsed) {
        // Insert text at cursor position
        range.insertNode(textNode);
      } else {
        // Replace selected text with the button's value
        range.deleteContents();
        range.insertNode(textNode);
      }

      setData("");
    }
  };

  const handleDynamicData = (e) => {
    e.preventDefault(); // Prevent the default behavior of the button

    // Remove border class from previously selected button
    const previouslySelectedButton = document.querySelector(".border");
    if (previouslySelectedButton) {
      previouslySelectedButton.classList.remove(
        "border",
        "border-primary",
        "border-2",
        "border-solid"
      );
    }

    // Add border class to the clicked button
    e.target.classList.add(
      "border",
      "border-primary",
      "border-2",
      "border-solid"
    );

    draggableOrderPlacedContent.forEach((element) => {
      if (e.target.id === element.id) {
        setData(element.value);
        setOrderPlaced((prev) => ({ ...prev, [element.name]: element.value }));
      }
    });
    draggableOrderConfirmedContent.forEach((element) => {
      if (e.target.id === element.id) {
        setData(element.value);
        setOrderConfirmed((prev) => ({
          ...prev,
          [element.name]: element.value,
        }));
      }
    });
  };

  return (
    <>
      <DragDropContext>
        <div className="row g-0">
          {/* Drop areas */}
          <div className="col-12 ">
            <div className="row mx-3 pb-5">
              <div className="col-12 col-lg-6 col-md-6 mb-2">
                <CustomTitle heading={"Customise Order Placed Notification"} />
                <div className="rounded border p-2 h-100 dragAndDropContainer d-flex flex-column">
                  <li className="fw-medium primary-text ps-1 formLabelText mt-1">
                    Add content
                  </li>
                  <div className="d-flex gap-2 justify-content-start align-items-center flex-wrap py-2">
                    {draggableOrderPlacedContent &&
                      draggableOrderPlacedContent.map((content, index) => {
                        return (
                          <div
                            id={content.id}
                            key={content.id}
                            className="py-1 d-flex align-items-center justify-content-center gap-2 fw-medium px-2 rounded cursor-pointer"
                            style={{
                              backgroundColor: themeColor.accent,
                              color: themeColor.primary,
                              fontSize: "14px",
                            }}
                            onClick={(e) => handleDynamicData(e)}
                          >
                            {content.name}
                          </div>
                        );
                      })}
                  </div>
                  <OrderPlacedMsgPreview
                    handleUpdateMsg={handleUpdateMsg}
                    orderPlaced={orderPlaced}
                  />
                </div>
              </div>
              <div className="col-12 col-lg-6 col-md-6 mb-2">
                <CustomTitle
                  heading={"Customise Order Confirmed Notification"}
                />
                <div className="rounded border d-flex flex-column p-2 h-100 dragAndDropContainer">
                  <li className="fw-medium primary-text ps-1 formLabelText mt-1">
                    Add content
                  </li>
                  <div className="d-flex gap-2 justify-content-start align-items-center flex-wrap py-2">
                    {draggableOrderConfirmedContent &&
                      draggableOrderConfirmedContent.map((content, index) => {
                        return (
                          <div
                            id={content.id}
                            key={content.id}
                            className="py-1 d-flex align-items-center justify-content-center gap-2 fw-medium px-2 rounded cursor-pointer"
                            style={{
                              backgroundColor: themeColor.accent,
                              color: themeColor.primary,
                              fontSize: "14px",
                            }}
                            onClick={(e) => handleDynamicData(e)}
                          >
                            {content.name}
                          </div>
                        );
                      })}
                  </div>
                  <OrderConfirmedMsgPreview
                    handleUpdateMsg={handleUpdateMsg}
                    orderConfirmed={orderConfirmed}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </DragDropContext>
    </>
  );
}

export default NotificationsForm;
