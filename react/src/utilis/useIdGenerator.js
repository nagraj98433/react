import { useState } from "react";

function useIdGenerator() {
  const [id, setId] = useState(generateID());

  function generateID() {
    const characters =
      "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const length = 8;
    let result = "";
    for (let i = 0; i < length; i++) {
      result += characters.charAt(
        Math.floor(Math.random() * characters.length)
      );
    }
    return result;
  }

  function regenerateID() {
    setId(generateID());
  }

  return [id, regenerateID];
}

export default useIdGenerator;
