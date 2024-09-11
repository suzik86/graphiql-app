export function encodeBase64(str: string): string {
  if (typeof window !== "undefined") {
    // Client-side environment
    return btoa(unescape(encodeURIComponent(str)));
  } else {
    // Server-side environment
    return Buffer.from(str, "utf-8").toString("base64");
  }
}
export function decodeBase64(str: string): string {

  const invalidCharsRegex = /[\x19\x10\x0F\x1D\x02]/;

  if (typeof window !== "undefined") {

    try {

      const decodedStr = decodeURIComponent(str);

      const paddedStr = decodedStr.padEnd(
        decodedStr.length + ((4 - (decodedStr.length % 4)) % 4),
        "=",
      );

      const result = decodeURIComponent(escape(atob(paddedStr)));

      if (invalidCharsRegex.test(result)) {
        return "";
      }
      return result;

    } catch (e) {
      return "";
    }

  } else {

    try {

      const decodedStr = decodeURIComponent(str);
      const result = Buffer.from(decodedStr, "base64").toString("utf-8");

      if (invalidCharsRegex.test(result)) {
        return "";
      }

      return result;

    } catch (e) {
      return "";
    }
  }

}
 