import { useEffect, useState } from "react";

export default function useKeyboardStatus() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const initialHeight = window.innerHeight;

    const checkKeyboardStatus = () => {
      let height = initialHeight - window.innerHeight;
      setKeyboardHeight(height);
    };

    window.addEventListener("resize", checkKeyboardStatus);

    return () => {
      window.removeEventListener("resize", checkKeyboardStatus);
    };
  }, []);

  return keyboardHeight;
}
