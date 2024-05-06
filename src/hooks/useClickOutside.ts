import { useEffect, useRef } from "react";

export default function useClickOutside(callbackFn: () => void): React.MutableRefObject<HTMLDivElement | null> {
  const domNodeRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    let handler = (event: any) => {
      if (!domNodeRef.current?.contains(event.target)) {
        callbackFn()
      }
    }
    document.addEventListener("mousedown", handler)
    return () => {
      document.removeEventListener("mousedown", handler)
    }
  }, []);

  return domNodeRef;
}