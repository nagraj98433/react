import React from "react";

const ImageDisplay = () => {
  return function (event, id) {
    var image = document.getElementById(id);
    return (image.src = URL.createObjectURL(event.target.files[0]));
  };
};

export default ImageDisplay;
