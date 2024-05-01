import React from "react";
import { themeColor } from "../../utilis/constants";
import CustomButton from "../buttons/CustomButton";
import { Droppable } from "react-beautiful-dnd";

const OrderPlacedMsgPreview = ({ orderPlaced, handleUpdateMsg }) => {
  return (
    <>
      <div className="formLabelText mt-auto text-center py-3">
        After clicking above button, click below anywhere to add here
      </div>

      <div
        style={{ border: `1px dashed ${themeColor.primary}` }}
        className="rounded mt-auto"
      >
        <div className="d-grid">
          <div
            className={`customInputBoxText border-0 customscrollbar `}
            contentEditable="true"
            style={{
              color: "#6e6e6e",
              height: "130px",
              margin: "0.5rem",
              outline: "0px solid transparent",
              fontWeight: "400",
              overflowY: "auto",
            }}
            id="orderPlacedContent"
            onClick={handleUpdateMsg}
          >
            Confirmation Number:{" "}
            <span style={{ fontWeight: "bolder" }}>
              {orderPlaced.orderNo === "" ? "(Order No)" : orderPlaced.orderNo}
            </span>{" "}
            <br />
            Hello{" "}
            <span style={{ fontWeight: "bolder" }}>
              {orderPlaced.userName === ""
                ? "(User Name)"
                : orderPlaced.userName}
            </span>
            , We’re happy to let you know that we’ve received your order on{" "}
            <span style={{ fontWeight: "bolder" }}>
              {orderPlaced.createdAt === ""
                ? "(Created At)"
                : orderPlaced.createdAt}
            </span>{" "}
            and will be delivered in next 20 mins. Once your package ships, we
            will send you an confirmation email with order number, If you have
            any questions, please visit{" "}
            <span style={{ fontWeight: "bolder" }}>
              {orderPlaced.resName === ""
                ? "(Restaurant Name)"
                : orderPlaced.resName}
            </span>{" "}
            ! We are here to help. <br />
            Team, qr4order.com.
          </div>
        </div>
      </div>

      <div className="my-3  d-flex justify-content-start align-items-center">
        <CustomButton name={"Save"} bgColor={themeColor.primary} />
      </div>
    </>
  );
};

export default OrderPlacedMsgPreview;
