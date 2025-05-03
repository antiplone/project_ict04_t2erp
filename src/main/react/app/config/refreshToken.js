// by daeyeol
import axios from "axios";
import { getAuthToken, getCustomerID, setAuthToken } from "./AxiosToken";

const RefreshToken = axios.create({
  baseURL: "http://localhost:8081/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json;charset=utf-8",
  },
});

let isRefreshing = false;
let refreshSubscribers = [];

const onRefreshed = (newAccessToken) => {
  refreshSubscribers.forEach((callback) => callback(newAccessToken));
  refreshSubscribers = [];
};

const addRefreshSubscriber = (callback) => {
  refreshSubscribers.push(callback);
};

// ✅ Authorization 헤더 설정 (refresh-token 요청은 예외)
RefreshToken.interceptors.request.use((config) => {
  const token = getAuthToken();
  const isRefreshEndpoint = config.url?.includes("/refresh-token");

  if (token && !isRefreshEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  } else if (isRefreshEndpoint) {
    delete config.headers.Authorization; // ✅ 강제로 Authorization 헤더 제거!
  }

  return config;
});

// ✅ 401 응답 처리: Access Token 만료 시 토큰 재발급 및 재요청
RefreshToken.interceptors.response.use(
  (response) => response,
  async (error) => {
    const { config: originalRequest, response } = error;

    const isUnauthorized = response?.status === 401;
    const isFirstRetry = !originalRequest._retry;

    if (!isUnauthorized || !isFirstRetry) {
      return Promise.reject(error);
    }

    const customerId = getCustomerID();
    if (!customerId) return Promise.reject(error);

    if (isRefreshing) {
      return new Promise((resolve) => {
        addRefreshSubscriber((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(RefreshToken(originalRequest));
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      console.log("🚨 refresh-token 요청 customerId:", customerId);
      const { data } = await RefreshToken.post("/refresh-token");
      const newAccessToken = data.accessToken || data;

      setAuthToken(newAccessToken);
      onRefreshed(newAccessToken);

      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return RefreshToken(originalRequest);
    } catch (refreshError) {
      console.error("❌ 토큰 재발급 실패", refreshError);
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default RefreshToken;
