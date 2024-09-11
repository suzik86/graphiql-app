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

   
      let result = decodeURIComponent(escape(atob(paddedStr)));
 
      result = result.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

      return result;
    } catch (e) {
      console.error("Base64 decoding failed:", e);
      return "";
    }
  } else {
    try {
      const decodedStr = decodeURIComponent(str);  
      let result = Buffer.from(decodedStr, "base64").toString("utf-8");
 
      result = result.replace(/[\x00-\x1F\x7F-\x9F]/g, "");

      return result;
    } catch (e) {
      console.error("Base64 decoding failed on server:", e);
      return "";
    }
  }
}

 