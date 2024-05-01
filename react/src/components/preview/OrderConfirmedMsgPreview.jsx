import React from "react";
import { themeColor } from "../../utilis/constants";
import CustomButton from "../buttons/CustomButton";
import { Droppable } from "react-beautiful-dnd";

const OrderConfirmedMsgPreview = ({ orderConfirmed, handleUpdateMsg }) => {
  return (
    <>
      <div className="formLabelText mt-auto text-center py-3">
        After clicking above button, click below anywhere to add here
      </div>
      <Droppable droppableId="orderConfirmedContent">
        {(provided) => (
          <div
            style={{ border: `1px dashed ${themeColor.primary}` }}
            className="rounded mt-auto"
            ref={provided.innerRef}
            {...provided.droppableProps}
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
                id="orderConfirmedContent"
                onClick={handleUpdateMsg}
              >
                Hi{" "}
                <span style={{ fontWeight: "bolder" }}>
                  {orderConfirmed.userNameConfirmed === ""
                    ? "(User Name)"
                    : orderConfirmed.userNameConfirmed}
                </span>
                <br />
                Thank you for ordering from{" "}
                <span style={{ fontWeight: "bolder" }}>
                  {orderConfirmed.resNameConfirmed === ""
                    ? "(Restaurant Name)"
                    : orderConfirmed.resNameConfirmed}
                </span>
                . Your order #
                <span style={{ fontWeight: "bolder" }}>
                  {orderConfirmed.orderNoConfirmed === ""
                    ? "(Order No)"
                    : orderConfirmed.orderNoConfirmed}{" "}
                </span>
                has been shipped. If you have any questions, please visit{" "}
                <span style={{ fontWeight: "bolder" }}>
                  {orderConfirmed.resNameConfirmed === ""
                    ? "(Restaurant Name)"
                    : orderConfirmed.resNameConfirmed}
                </span>
                ! Please come again. <br />
                Team, qr4order.com.
              </div>
              {provided.placeholder}
            </div>
          </div>
        )}
      </Droppable>
      <div className="my-3  d-flex justify-content-start align-items-center">
        <CustomButton name={"Save"} bgColor={themeColor.primary} />
      </div>
    </>
  );
};

export default OrderConfirmedMsgPreview;
