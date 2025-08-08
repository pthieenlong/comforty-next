"use client";

import {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import {
  authService,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
} from "@/services/authService";

interface AuthState {
  user: LoginResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  error: string | null;
}

type AuthAction =
  | { type: "LOGIN_START" }
  | { type: "LOGIN_SUCCESS"; payload: LoginResponse }
  | { type: "LOGIN_FAILURE"; payload: string }
  | { type: "REGISTER_START" }
  | { type: "REGISTER_SUCCESS" }
  | { type: "REGISTER_FAILURE"; payload: string }
  | { type: "VERIFY_EMAIL_START" }
  | { type: "VERIFY_EMAIL_SUCCESS" }
  | { type: "VERIFY_EMAIL_FAILURE"; payload: string }
  | { type: "RESEND_VERIFICATION_START" }
  | { type: "RESEND_VERIFICATION_SUCCESS" }
  | { type: "RESEND_VERIFICATION_FAILURE"; payload: string }
  | { type: "LOGOUT" }
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "CLEAR_ERROR" };

const initialState: AuthState = {
  user: null,
  isLoading: false,
  isAuthenticated: false,
  error: null,
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case "LOGIN_START":
    case "REGISTER_START":
    case "VERIFY_EMAIL_START":
    case "RESEND_VERIFICATION_START":
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case "LOGIN_SUCCESS":
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case "REGISTER_SUCCESS":
    case "VERIFY_EMAIL_SUCCESS":
    case "RESEND_VERIFICATION_SUCCESS":
      return {
        ...state,
        isLoading: false,
        error: null,
      };
    case "LOGIN_FAILURE":
    case "REGISTER_FAILURE":
    case "VERIFY_EMAIL_FAILURE":
    case "RESEND_VERIFICATION_FAILURE":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case "LOGOUT":
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        error: null,
      };
    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "CLEAR_ERROR":
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<void>;
  register: (userData: RegisterRequest) => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
  resendVerification: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  clearError: () => void;
  hasRole: (role: string) => boolean;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Kiểm tra auth status khi app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      dispatch({ type: "SET_LOADING", payload: true });

      try {
        const userData = localStorage.getItem("user");
        if (userData) {
          const user = JSON.parse(userData);
          dispatch({ type: "LOGIN_SUCCESS", payload: user });
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        localStorage.removeItem("user");
      } finally {
        dispatch({ type: "SET_LOADING", payload: false });
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (credentials: LoginRequest) => {
    dispatch({ type: "LOGIN_START" });

    try {
      const response = await authService.login(credentials);

      if (response.success && response.data) {
        const userData = response.data;
        localStorage.setItem("user", JSON.stringify(userData));
        dispatch({ type: "LOGIN_SUCCESS", payload: userData });
      } else {
        throw new Error(response.message || "Đăng nhập thất bại");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Đăng nhập thất bại";
      dispatch({ type: "LOGIN_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const register = async (userData: RegisterRequest) => {
    dispatch({ type: "REGISTER_START" });

    try {
      const response = await authService.register(userData);

      if (response.success) {
        dispatch({ type: "REGISTER_SUCCESS" });
      } else {
        throw new Error(response.message || "Đăng ký thất bại");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message || error.message || "Đăng ký thất bại";
      dispatch({ type: "REGISTER_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const verifyEmail = async (token: string) => {
    dispatch({ type: "VERIFY_EMAIL_START" });

    try {
      const response = await authService.verifyEmail({ token });

      if (response.success) {
        dispatch({ type: "VERIFY_EMAIL_SUCCESS" });
      } else {
        throw new Error(response.message || "Xác thực email thất bại");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Xác thực email thất bại";
      dispatch({ type: "VERIFY_EMAIL_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const resendVerification = async (email: string) => {
    dispatch({ type: "RESEND_VERIFICATION_START" });

    try {
      const response = await authService.resendVerification({ email });

      if (response.success) {
        dispatch({ type: "RESEND_VERIFICATION_SUCCESS" });
      } else {
        throw new Error(response.message || "Gửi lại email thất bại");
      }
    } catch (error: any) {
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Gửi lại email thất bại";
      dispatch({ type: "RESEND_VERIFICATION_FAILURE", payload: errorMessage });
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("user");
      dispatch({ type: "LOGOUT" });
    }
  };

  const clearError = () => {
    dispatch({ type: "CLEAR_ERROR" });
  };

  const hasRole = (role: string): boolean => {
    return state.user?.roles?.includes(role) || false;
  };

  const isAdmin = (): boolean => {
    return hasRole("ADMIN");
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    verifyEmail,
    resendVerification,
    logout,
    clearError,
    hasRole,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
