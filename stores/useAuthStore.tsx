import { create } from "zustand";

// Function to decode JWT token
const decodeJWT = (token: string) => {
  try {
    const base64Url = token.split(".")[1]; // Extract payload part
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Invalid token", error);
    return null;
  }
};

// Zustand store for authentication
interface AuthState {
  token: string | null;
  userId: string | null;
  userEmail: string | null;
  username: string | null;
  setAuth: (token: string, email: string, username: string) => void;
  logout: () => void;
}

// Load initial user data from localStorage safely
const loadUserData = () => {
  if (typeof window !== "undefined") {
    try {
      return JSON.parse(localStorage.getItem("user-data") || "{}");
    } catch (error) {
      console.error("Error parsing localStorage user-data", error);
      return {};
    }
  }
  return {};
};

export const useAuthStore = create<AuthState>((set) => {
  const userData = loadUserData();

  return {
    token: userData?.token || null,
    userId: userData?.userId || null,
    userEmail: userData?.userEmail || null,
    username: userData?.username || null,

    setAuth: (token: string, email: string, username: string) => {
      const decoded = decodeJWT(token);
      const userId = decoded?.data?.user?.id || null; // Ensure correct ID

      console.log("Decoded User ID:", userId);

      set(() => {
        // Update Zustand state
        const newState = { token, userId, userEmail: email, username };

        // Store updated state in localStorage
        localStorage.setItem("user-data", JSON.stringify(newState));

        return newState;
      });
    },

    logout: () => {
      set(() => {
        localStorage.removeItem("user-data");
        return { token: null, userId: null, userEmail: null, username: null };
      });
    },
  };
});
