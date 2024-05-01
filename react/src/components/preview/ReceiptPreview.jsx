import React, { Fragment } from "react";
import CustomTitle from "../heading/CustomTitle";
import { Table } from "react-bootstrap";
import { useSelector } from "react-redux";

function ReceiptPreview() {
  const headerContent = useSelector(
    (state) => state.receiptContentData.headerContent
  );
  const footerContent = useSelector(
    (state) => state.receiptContentData.footerContent
  );
  const bodyContent = useSelector(
    (state) => state.receiptContentData.bodyContent
  );

  return (
    <>
      <CustomTitle heading={"Receipt Preview"} />
      <div className="d-flex  justify-content-center">
        <div className="previewContainer primary-text border rounded p-2">
          <div className="headerSection text-center">
            <div style={{ fontSize: "13px" }} className="fw-medium">
              Hotel Romania
            </div>
            <div style={{ fontSize: "11px" }}>
              Stakhurskogo, bld. 60, appt. 81, Vinnitskaya oblast, oberio road ,
              Ukraine-4298
            </div>
            {headerContent &&
              headerContent.map((content) => {
                return (
                  <Fragment key={content.id}>
                    {content.type === "header" ? (
                      <div key={content.id} style={{ fontSize: "11px" }}>
                        {content.name} {":"} {content.value}
                      </div>
                    ) : (
                      <div key={content.id} style={{ fontSize: "12px" }}>
                        {content.value}
                      </div>
                    )}
                  </Fragment>
                );
              })}
          </div>
          <div className="heroSection border-top my-2">
            <div className="col-lg-12 col-12">
              <div className="row mt-2 fw-medium" style={{ fontSize: "11px" }}>
                {bodyContent &&
                  bodyContent.map((content) => {
                    return (
                      <Fragment key={content.id}>
                        {content.type === "body" ? (
                          <div
                            className="col-lg-6"
                            key={content.id}
                            style={{ fontSize: "11px" }}
                          >
                            {content.name} {":"} {content.value}
                          </div>
                        ) : (
                          <div
                            className="col-lg-6"
                            key={content.id}
                            style={{ fontSize: "12px" }}
                          >
                            {content.value}
                          </div>
                        )}
                      </Fragment>
                    );
                  })}
              </div>
            </div>
            <div className="border-top mt-1"></div>
            <Table borderless>
              <thead className="border-bottom">
                <tr>
                  <th className="customTh">Item</th>
                  <th className="customTh text-end">Qty</th>
                  <th className="customTh text-end">Rate</th>
                  <th className="customTh text-end">Total</th>
                </tr>
              </thead>
              <tbody className="border-bottom">
                <tr>
                  <td className="customTd">Chicken Cheezumi</td>
                  <td className="customTd text-end">1</td>
                  <td className="customTd text-end">255</td>
                  <td className="customTd text-end">255</td>
                </tr>
                <tr>
                  <td className="customTd">Shrimp Cheezumi</td>
                  <td className="customTd text-end">2</td>
                  <td className="customTd text-end">200</td>
                  <td className="customTd text-end">400</td>
                </tr>
                <tr>
                  <td className="customTd">Chicken Fried</td>
                  <td className="customTd text-end">2</td>
                  <td className="customTd text-end">150</td>
                  <td className="customTd text-end">300</td>
                </tr>
              </tbody>
              <tbody className="border-bottom">
                <tr>
                  <td className="customTd fw-medium" colSpan={"3"}>
                    Sub Total
                  </td>
                  <td className="customTd text-end">955</td>
                </tr>
              </tbody>
              <tbody className="border-bottom">
                <tr>
                  <td className="customTd fw-medium" colSpan={"3"}>
                    Discount : 10.0%
                  </td>
                  <td className="customTd text-end">30</td>
                </tr>
                <tr>
                  <td className="customTd fw-medium" colSpan={"3"}>
                    Service Fees : 2%
                  </td>
                  <td className="customTd text-end">10</td>
                </tr>
                <tr>
                  <td className="customTd fw-medium" colSpan={"3"}>
                    Tip
                  </td>
                  <td className="customTd text-end">50</td>
                </tr>
              </tbody>
              <tbody className="border-bottom">
                <tr>
                  <td className="customTd fw-medium" colSpan={"3"}>
                    Grand Total
                  </td>
                  <td className="customTd text-end fw-medium">985</td>
                </tr>
              </tbody>
              <tbody className="border-bottom">
                <tr>
                  <td className="customTd fw-medium" colSpan={"3"}>
                    Amount Paid
                  </td>
                  <td className="customTd text-end fw-medium">985</td>
                </tr>
              </tbody>
            </Table>
          </div>
          <div className="footerSection text-center fw-medium">
            {footerContent &&
              footerContent.map((content) => {
                return (
                  <Fragment key={content.id}>
                    {content.type === "header" ? (
                      <div key={content.id} style={{ fontSize: "11px" }}>
                        {content.name} {":"} {content.value}
                      </div>
                    ) : (
                      <div key={content.id} style={{ fontSize: "12px" }}>
                        {content.value}
                      </div>
                    )}
                  </Fragment>
                );
              })}
            <div className="fw-bold" style={{ fontSize: "12px" }}>
              Powered by www.qr4order.com
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ReceiptPreview;
