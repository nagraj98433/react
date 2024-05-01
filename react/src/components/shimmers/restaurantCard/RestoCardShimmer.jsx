import React from "react";
import "./RestoCardShimmer.css";

function RestoCardShimmer() {
  return (
    <div className="col-12 px-2">
      <div className="restoShimmerCard position-relative rounded mt-2 p-2">
        <div className="position-absolute d-flex gap-1 align-items-center end-0 top-0 p-2">
          <div className="rounded-1 shimmerBG restoIconShimmer"></div>
          <div className="rounded-1 shimmerBG restoIconShimmer"></div>
        </div>
        <div className="row align-items-center h-100">
          <div className="col-2">
            <div className="restaurantImgShimmer rounded shimmerBG"></div>
          </div>
          <div className="col-10">
            <div className="restoTitleShimmer shimmerBG rounded-1 ms-2"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default RestoCardShimmer;
