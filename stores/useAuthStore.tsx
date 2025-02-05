import { create } from "zustand";
import { decodeJWT } from "@/lib/decodeJWT";

// Define the shape of user data stored in localStorage
interface UserData {
  token: string | null;
  userId: string | null;
  userEmail: string | null;
  username: string | null;
  newUserId?: string;
  type: string;
}

// Enhanced AuthState interface
interface AuthState extends UserData {
  setAuth: (
    token: string,
    email: string,
    username: string,
    userId: string,
    type: string
  ) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

// Enhanced localStorage handling
const loadUserData = (): UserData => {
  if (typeof window === "undefined") {
    return {
      token: null,
      userId: null,
      userEmail: null,
      username: null,
      type: "",
    };
  }

  try {
    const userData = JSON.parse(localStorage.getItem("user-data") || "{}");
    return {
      token: userData.token || null,
      userId: userData.userId || null,
      userEmail: userData.userEmail || null,
      username: userData.username || null,
      type: userData.type || "",
    };
  } catch (error) {
    console.error("Error loading user data from localStorage:", error);
    return {
      token: null,
      userId: null,
      userEmail: null,
      username: null,
      type: "",
    };
  }
};

// Enhanced auth store with better error handling
export const useAuthStore = create<AuthState>((set) => {
  const userData = loadUserData();

  return {
    ...userData,
    isAuthenticated: !!userData.token,
    setAuth: (
      token: string,
      email: string,
      username: string,
      userId?: string,
      type?: string
    ) => {
      try {
        if (!token) {
          throw new Error("Token is required");
        }

        // Use provided userId if available, otherwise try to decode from JWT
        let finalUserId = userId;
        if (!finalUserId) {
          try {
            const decoded = decodeJWT(token);
            finalUserId = decoded?.data?.user?.id;
          } catch (error) {
            console.log("zustand login failed", error);

            console.warn("Failed to decode JWT, using provided userId");
          }
        }

        const newState = {
          token,
          userId: finalUserId || null,
          userEmail: email,
          username,
          type,
          isAuthenticated: true,
        };

        // Update localStorage
        if (typeof window !== "undefined") {
          localStorage.setItem("user-data", JSON.stringify(newState));
        }

        // Update Zustand state
        set(newState);

        console.log("Authentication successful", {
          email,
          username,
          userId: finalUserId,
        });
      } catch (error) {
        console.error("Error setting authentication:", error);
        set({
          token: null,
          userId: null,
          userEmail: null,
          username: null,
          type: "",
          isAuthenticated: false,
        });
      }
    },
    logout: () => {
      // Clear localStorage
      if (typeof window !== "undefined") {
        localStorage.removeItem("user-data");
      }

      // Reset Zustand state
      set({
        token: null,
        userId: null,
        userEmail: null,
        username: null,
        type: "",
        isAuthenticated: false,
      });
    },
  };
});

// Helper function to get user ID (can be used in WooCommerce operations)
export const getUserId = () => {
  const { userId } = useAuthStore.getState();
  return userId;
};
