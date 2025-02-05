export const decodeJWT = (token: string) => {
  try {
    // First verify the token exists and is a string
    if (!token || typeof token !== "string") {
      throw new Error("Token is required and must be a string");
    }

    // Split the token into parts
    const parts = token.split(".");
    if (parts.length !== 3) {
      throw new Error("Invalid JWT format");
    }

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const paddedBase64 = base64 + "=".repeat((4 - (base64.length % 4)) % 4);

    // Use Buffer in Node.js environment or atob in browser
    const jsonPayload =
      typeof window === "undefined"
        ? Buffer.from(paddedBase64, "base64").toString()
        : atob(paddedBase64);

    const payload = JSON.parse(jsonPayload);

    // Extract user ID from WordPress JWT structure
    const userId = payload?.data?.user?.id;

    return {
      ...payload,
      userId: userId, // Make user ID easily accessible
    };
  } catch (error) {
    console.error("JWT Decoding Error:", error);
    return null;
  }
};
