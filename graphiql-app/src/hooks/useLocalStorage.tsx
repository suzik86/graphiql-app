import { useEffect, useState } from "react";

export default function useLocalStorage(key: string) {
  const [value, setValue] = useState(() =>
    typeof window !== "undefined" ? window?.localStorage.getItem(key) : null,
  );

  useEffect(() => {
    try {
      window?.localStorage.setItem(key, value ?? "");
    } catch (error) {
    }
    return () => {
      window?.localStorage.setItem(key, value ?? "");
    };
  }, [key, value]);

  return [value, setValue];
}
