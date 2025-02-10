import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import Cookies from "js-cookie";
import { decodeJWT } from "@/lib/decodeJWT";
// Define the shape of user data
interface UserData {
  userId: string | null;
  userEmail: string | null;
  username: string | null;
  type: string;
}

// Enhanced AuthState interface
interface AuthState extends UserData {
  setAuth: (
    token: string | null,
    email: string | null,
    username: string | null,
    userId: string | null,
    type: string
  ) => void;
  logout: () => void;
  isAuthenticated: boolean; // Remove optional flag
}

// Define initial state with all required properties
const initialState: Omit<AuthState, "setAuth" | "logout"> = {
  userId: null,
  userEmail: null,
  username: null,
  type: "",
  isAuthenticated: false,
};

// Add a function to check auth status
const checkAuthStatus = () => {
  if (typeof window === "undefined") return false; // Prevent access on server

  const token = Cookies.get("auth-token");
  if (!token) {
    localStorage.removeItem("user-data"); // Only runs in the browser
    return false;
  }
  return true;
};

// Modified loadInitialState to check cookie
const loadInitialState = (): typeof initialState => {
  if (typeof window === "undefined") {
    return initialState;
  }

  try {
    if (!checkAuthStatus()) {
      return initialState;
    }

    const userData = JSON.parse(localStorage.getItem("user-data") || "{}");
    return {
      userId: userData.state?.userId ?? null,
      userEmail: userData.state?.userEmail ?? null,
      username: userData.state?.username ?? null,
      type: userData.state?.type ?? "",
      isAuthenticated: true,
    };
  } catch (error) {
    console.error("Error loading initial state:", error);
    return initialState;
  }
};

// Custom storage implementation using HTTP-only cookies for tokens
const customStorage = {
  getItem: (): string => {
    if (typeof window === "undefined") return "{}"; // Prevent SSR error
    return localStorage.getItem("user-data") || "{}";
  },
  setItem: (_: string, newValue: string): void => {
    if (typeof window === "undefined") return; // Prevent SSR error

    const parsedValue = JSON.parse(newValue);
    if (parsedValue.state?.token) {
      Cookies.set("auth-token", parsedValue.state.token, {
        secure: true,
        sameSite: "strict",
        expires: 1,
      });

      const { ...rest } = parsedValue.state;
      localStorage.setItem("user-data", JSON.stringify({ state: rest }));
    } else {
      localStorage.setItem("user-data", newValue);
    }
  },
  removeItem: (): void => {
    if (typeof window === "undefined") return;
    Cookies.remove("auth-token");
    localStorage.removeItem("user-data");
  },
};

// Enhanced auth store with expiration handling
export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      ...loadInitialState(),
      setAuth: (
        token: string | null,
        email: string | null,
        username: string | null,
        userId: string | null,
        type: string
      ) => {
        try {
          if (!token) {
            throw new Error("Token is required");
          }

          let finalUserId = userId;
          if (!finalUserId) {
            try {
              const decoded = decodeJWT(token);
              finalUserId = decoded?.data?.user?.id;
            } catch (error) {
              console.warn(
                "Failed to decode JWT, using provided userId",
                error
              );
            }
          }

          const newState = {
            userId: finalUserId || null,
            userEmail: email,
            username,
            type,
            isAuthenticated: true,
          };

          Cookies.set("auth-token", token, {
            secure: true,
            sameSite: "strict",
            expires: 1,
          });

          set(newState);
        } catch (error) {
          console.error("Error setting authentication:", error);
          set({
            ...initialState,
            isAuthenticated: false,
          });
        }
      },
      logout: () => {
        const { isAuthenticated } = useAuthStore.getState();
        if (isAuthenticated) {
          Cookies.remove("auth-token");
          localStorage.removeItem("user-data");
          set({ ...initialState });
        }
      },
    }),
    {
      name: "user-data",
      storage: createJSONStorage(() => customStorage),
      partialize: (state) => ({
        userId: state.userId,
        userEmail: state.userEmail,
        username: state.username,
        type: state.type,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);

// Add a subscription to check auth status periodically
if (typeof window !== "undefined") {
  let prevAuthStatus = checkAuthStatus();

  setInterval(() => {
    const isValid = checkAuthStatus();
    if (!isValid && prevAuthStatus) {
      useAuthStore.getState().logout();
    }
    prevAuthStatus = isValid;
  }, 60000); // 1-minute interval
}

// Modified helper function to check expiration
export const getAuthToken = (): string | undefined => {
  if (!checkAuthStatus()) {
    useAuthStore.getState().logout();
    return undefined;
  }
  return Cookies.get("auth-token");
};

export const getUserId = (): string | null => {
  if (!checkAuthStatus()) {
    useAuthStore.getState().logout();
    return null;
  }
  const { userId } = useAuthStore.getState();
  return userId;
};
