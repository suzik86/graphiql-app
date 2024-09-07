export function encodeBase64(str: string): string {
  if (typeof window !== "undefined") {
    // Client-side environment
    return btoa(unescape(encodeURIComponent(str)));
  } else {
    // Server-side environment
    return Buffer.from(str, "utf-8").toString("base64");
  }
}

// Function to decode a string from base64// Function to decode a string from Base64
export function decodeBase64(str: string): string {
  if (typeof window !== "undefined") {
    // Ensure string is valid Base64
    try {
      // Decode URL-encoded string first
      const decodedStr = decodeURIComponent(str);

      // Adding padding if missing and decoding Base64
      const paddedStr = decodedStr.padEnd(
        decodedStr.length + ((4 - (decodedStr.length % 4)) % 4),
        "=",
      );
      return decodeURIComponent(escape(atob(paddedStr)));
    } catch (e) {
      console.error("Base64 decoding failed:", e);
      return "";
    }
  } else {
    // Server-side environment
    try {
      const decodedStr = decodeURIComponent(str); // Handle URL encoding
      return Buffer.from(decodedStr, "base64").toString("utf-8");
    } catch (e) {
      console.error("Base64 decoding failed on server:", e);
      return "";
    }
  }
}
