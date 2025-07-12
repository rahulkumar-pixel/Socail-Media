import axios from "axios";
import {
  getItem,
  KEY_ACCESS_TOKEN,
  removeItem,
  setItem,
} from "./localStorageManager.jsx";
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
import Store from "../Component/Redux/Store.jsx";
import {
  setLoading,
  showToast,
} from "../Component/Redux/Slices/appConfigSlice.jsx";
import { TOAST_FAILURE } from "../App.jsx";

export const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

axiosClient.interceptors.request.use((request) => {
  const accessToken = getItem(KEY_ACCESS_TOKEN);
  if (accessToken) {
    request.headers.Authorization = `Bearer ${accessToken}`;
    Store.dispatch(setLoading(true));
  }
  return request;
});

axiosClient.interceptors.response.use(async (response) => {
  Store.dispatch(setLoading(false));
  const data = response.data;
  if (data.status === "ok") {
    return data;
  }

  const originalRequest = response.config;
  const statusCode = data.statusCode;
  const error = data.message;

  Store.dispatch(
    showToast({
      type: TOAST_FAILURE,
      message: error,
    })
  );

  // Check if error is due to 401 and not already retried
  if (statusCode === 402) {
    // Attempt to refresh token
    const responseResult = await axios
      .create({ withCredentials: true })
      .post(`${API_BASE_URL}/auth/refresh`);

    if (responseResult.data.result?.accessToken) {
      setItem(KEY_ACCESS_TOKEN, responseResult.data.result.accessToken);
      request.headers.Authorization = `Bearer ${responseResult.data.result.accessToken}`;
      // try to retry original
      return axiosClient(originalRequest);
    }
    if (responseResult.data.statusCode === 401) {
      // refresh fails to access
      removeItem(KEY_ACCESS_TOKEN);
      window.location.replace("/login", "_self");
      return Promise.reject(error);
    }
  }
  async (error) => {
    Store.dispatch(setLoading(false));
    Store.dispatch(
      showToast({
        type: TOAST_FAILURE,
        message: error.message,
      })
    );
    return Promise.reject(error);
  };
});

// import axios from "axios";
// import {
//   getItem,
//   KEY_ACCESS_TOKEN,
//   removeItem,
//   setItem,
// } from "./localStorageManager.jsx";
// const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// export const axiosClient = axios.create({
//   baseURL: API_BASE_URL,
//   withCredentials: true,
// });

// axiosClient.interceptors.request.use((request) => {
//   const accessToken = getItem(KEY_ACCESS_TOKEN);
//   request.headers["Authorization"] = `Bearer ${accessToken}`;
//   return request;
// });
// axiosClient.interceptors.response.use(async (respone) => {
//   const data = respone.data;
//   if (data.status === "ok") {
//     return data;
//   }

//   const orginalRequest = respone.config;
//   const statusCode = data.statusCode;
//   const error = data.error;

//   if (
//     // When refreshToken expire, send user to login page
//     statusCode === 401 &&
//     orginalRequest.url ===
//       `${API_BASE_URL}/auth/refresh`
//   ) {
//     removeItem(KEY_ACCESS_TOKEN);
//     window.location.replace("/login", "_self");
//     return Promise.reject(error);
//   }

//  if (statusCode === 401 ) {
//     const response = await axiosClient.get(`${API_BASE_URL}/auth/refresh`);
//     console.log(response);

//      if(response.status === 'ok'){
//     setItem(KEY_ACCESS_TOKEN, response.result.accessToken )
//     orginalRequest.headers["Authorization"] = `Bearer ${response.result.accessToken}`;
//     return axios(orginalRequest);
//  }
// }

//   return Promise.reject(error);
// });
