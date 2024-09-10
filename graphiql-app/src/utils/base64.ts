export function encodeBase64(str: string): string {
  if (typeof window !== "undefined") {
    return btoa(unescape(encodeURIComponent(str)));
  } else {
    return Buffer.from(str, "utf-8").toString("base64");
  }
}

export function decodeBase64(str: string): string {
  if (typeof window !== "undefined") {
    try {
      const decodedStr = decodeURIComponent(str);
      const paddedStr = decodedStr.padEnd(
        decodedStr.length + ((4 - (decodedStr.length % 4)) % 4),
        "="
      );
      return decodeURIComponent(escape(atob(paddedStr)));
    } catch (e) {
      console.error("Base64 decoding failed:", e);
      return "";
    }
  } else {
    try {
      const decodedStr = decodeURIComponent(str);
      return Buffer.from(decodedStr, "base64").toString("utf-8");
    } catch (e) {
      console.error("Base64 decoding failed on server:", e);
      return "";
    }
  }
}
