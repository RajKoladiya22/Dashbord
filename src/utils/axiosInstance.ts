// src/axiosInstance.ts
import axios, {
  InternalAxiosRequestConfig,
  AxiosResponse,
  AxiosError,
} from "axios";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { logout } from "../redux/slice/auth/loginSlice";

interface DecodedToken {
  exp: number;
  [key: string]: any;
}

const STATIC_API_KEY = "Q0@gZ@dY7[jGQ/GRc@D9KSCX#U2Yz";

const axiosInstance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // Ensures cookies are sent with requests if needed.
  headers: {
    "Content-Type": "application/json",
    "x-api-key": STATIC_API_KEY,
  },
});

/**
 * Request Interceptor
 * Retrieves the token from cookies, checks if it's valid and not expired,
 * sets the Authorization header if valid. Otherwise, dispatches logout,
 * clears the token from cookies, and redirects to /auth/signin.
 */
axiosInstance.interceptors.request.use(
  async (
    config: InternalAxiosRequestConfig
  ): Promise<InternalAxiosRequestConfig> => {
    const token = Cookies.get("xRo%pAkEjfmJ");
    // const token1 = Cookies.get("rJmkUxzNakU");
    console.log("Token",token1);
    
    // If no token is present (and endpoint is not sign-in/sign-up)
    if (
      !token &&
      config.url &&
      !config.url.includes("/auth/signin") &&
      !config.url.includes("/auth/signup")
    ) {
      const { store } = await import("../redux/store");
      store.dispatch(logout());
      // window.location.href = '/auth/signin';
      return Promise.reject(new Error("No token found"));
    }

    // If token is present, check its validity.
    if (token) {
      try {
        const decoded: DecodedToken = jwtDecode(token);
        // console.log("decoded--->", decoded);

        const currentTime = Date.now();
        // decoded.exp is in seconds; convert to milliseconds
        if (currentTime >= decoded.exp * 1000) {
          // If token has expired, remove from cookies and logout.
          Cookies.remove("xRo%pAkEjfmJ");
          Cookies.remove("rJmkUxzNakU");
          const { store } = await import("../redux/store");
          store.dispatch(logout());
          // window.location.href = '/auth/signin';
          return Promise.reject(new Error("Token expired"));
        }
        // Attach the valid token to the Authorization header.
        config.headers = config.headers || {};
        config.headers["Authorization"] = `Bearer ${token}`;
      } catch (error) {
        // On token decoding error, clear token and logout.
        Cookies.remove("xRo%pAkEjfmJ");
        Cookies.remove("rJmkUxzNakU");
        const { store } = await import("../redux/store");
        store.dispatch(logout());
        // window.location.href = '/auth/signin';
        return Promise.reject(new Error("Invalid token"));
      }
    }
    return config;
  },
  (error: any) => Promise.reject(error)
);

/**
 * Response Interceptor
 * Listens for 401 Unauthorized responses and handles them by clearing the token,
 * dispatching a logout, and redirecting to the sign-in page.
 */
axiosInstance.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => response,
  async (error: AxiosError): Promise<any> => {
    if (
      error.response?.status === 401 &&
      error.config &&
      error.config.url &&
      !error.config.url.includes("/auth/signin")
    ) {
      const { store } = await import("../redux/store");
      store.dispatch(logout());
      Cookies.remove("rJmkUxzNakU");
      Cookies.remove("xRo%pAkEjfmJ");
      // window.location.href = '/auth/signin';
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
