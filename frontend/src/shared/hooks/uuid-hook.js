import { useEffect, useState } from "react";
import { v4 as uuid } from "uuid";

function useUuid(num) {
  const [keys, setKeys] = useState([]);
  useEffect(() => {
    for (let i=0; i < num; i++) {
        setKeys((prevKeys) => [...prevKeys, uuid()]);
    }
  }, [num]);
  return keys;
}

export default useUuid;
