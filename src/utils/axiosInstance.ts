// import axios, {
//     AxiosRequestConfig,
//     AxiosResponse,
//     AxiosError,
//   } from "axios";
//   import { logoutUser } from "../redux/actions/auth/authActions";
//   import { toast } from "react-toastify";
//   import jwtDecode from "jwt-decode";
  
//   // Define the shape of your decoded token (at minimum, we need the "exp" property)
//   interface DecodedToken {
//     exp: number;
//     [key: string]: any;
//   }
  
//   const axiosInstance = axios.create({
//     baseURL: "http://localhost:8051/api",
//     // baseURL: "https://cpm-seven.vercel.app/api",
//   });
  
//   // Request Interceptor: Check token expiry before sending requests
//   axiosInstance.interceptors.request.use(
//     async (config: AxiosRequestConfig): Promise<AxiosRequestConfig> => {
//       const token = localStorage.getItem("userToken");
  
//       // If there's no token and we're not on login/register endpoints, force logout.
//       if (
//         !token &&
//         config.url &&
//         !config.url.includes("/auth/login") &&
//         !config.url.includes("/auth/register")
//       ) {
//         const reduxStoreModule = await import("../redux/store");
//         const store = reduxStoreModule.default;
//         store.dispatch(logoutUser());
//         return Promise.reject(new Error("No token found"));
//       }
  
//       if (token) {
//         try {
//           const decoded = jwtDecode<DecodedToken>(token);
//           const isExpired = decoded.exp < Date.now() / 1000;
  
//           if (isExpired) {
//             // Token expired: clear storage and dispatch logout
//             localStorage.removeItem("userToken");
//             localStorage.removeItem("userData");
//             if (axiosInstance.defaults.headers.common) {
//               delete axiosInstance.defaults.headers.common["Authorization"];
//             }
  
//             const reduxStoreModule = await import("../redux/store");
//             const store = reduxStoreModule.default;
//             store.dispatch(logoutUser());
  
//             return Promise.reject(new Error("Token expired"));
//           }
  
//           // Ensure headers exist before adding the Authorization header
//           if (!config.headers) {
//             config.headers = {};
//           }
//           config.headers.Authorization = `Bearer ${token}`;
//         } catch (error) {
//           localStorage.removeItem("userToken");
//           return Promise.reject(error);
//         }
//       }
//       return config;
//     },
//     (error: any) => Promise.reject(error)
//   );
  
//   axiosInstance.interceptors.response.use(
//     (response: AxiosResponse) => response,
//     async (error: AxiosError): Promise<any> => {
//       // Handle 401 Unauthorized errors
//       if (error.response?.status === 401) {
//         if (
//           error.config &&
//           error.config.url &&
//           !error.config.url.includes("/auth/login")
//         ) {
//           const reduxStoreModule = await import("../redux/store");
//           const store = reduxStoreModule.default;
  
//           if (store?.dispatch) {
//             console.log("Dispatching logout from response interceptor");
//             store.dispatch(logoutUser());
//           }
//           localStorage.removeItem("userToken");
//           localStorage.removeItem("userData");
//           if (axiosInstance.defaults.headers.common) {
//             delete axiosInstance.defaults.headers.common["Authorization"];
//           }
  
//           // Optionally show a toast notification
//           // toast.error("Session expired. Please log in again.");
//           return Promise.reject(error);
//         }
//       }
//       return Promise.reject(error);
//     }
//   );
  
//   export default axiosInstance;
  