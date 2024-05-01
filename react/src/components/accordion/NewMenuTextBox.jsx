import React, { useState } from "react";

function NewMenuTextBox() {
  const [text, setText] = useState("");

  return (
    <input
      type="text"
      value={text}
      onChange={(e) => setText(e.target.value)}
      className="newmenuItemInputBox w-100"
    />
  );
}

export default NewMenuTextBox;
