import { create } from "zustand";
import * as sdk from "matrix-js-sdk";
import { client } from "./matrix-api/client";
import { getAuthCookies, setAuthCookies, removeAuthCookies } from "./utils";

interface AuthState {
  isLoggedIn: boolean;
  accessToken: string | null;
  refreshToken: string | null;
  baseUrl: string | null;
  userId: string | null;
  deviceId: string | null;

  // 操作狀態
  isLoading: boolean;
  error: string | null;

  // 操作方法
  login: (credentials: {
    baseUrl: string;
    accessToken: string;
    refreshToken: string;
    userId: string;
    deviceId: string;
  }) => void;
  logout: () => void;
  refreshAccessToken: () => Promise<"REFRESH_SUCCESS" | "REFRESH_FAILED">;
  clearError: () => void;
  initializeFromCookies: () => void;
}

// 初始化從 cookies 獲取初始狀態
const getCookieState = () => {
  const { accessToken, refreshToken, baseUrl, userId, deviceId } =
    getAuthCookies();
  return {
    isLoggedIn: !!accessToken && !!userId,
    accessToken: accessToken || null,
    refreshToken: refreshToken || null,
    baseUrl: baseUrl || null,
    userId: userId || null,
    deviceId: deviceId || null,
  };
};
export const useAuthStore = create<AuthState>()((set, get) => ({
  ...getCookieState(),
  isLoading: false,
  error: null,

  login: (credentials) => {
    // 將認證資訊存入 cookies
    setAuthCookies(
      {
        access_token: credentials.accessToken,
        refresh_token: credentials.refreshToken,
        user_id: credentials.userId,
        device_id: credentials.deviceId,
      },
      credentials.baseUrl,
    );

    set({
      isLoggedIn: true,
      accessToken: credentials.accessToken,
      refreshToken: credentials.refreshToken,
      baseUrl: credentials.baseUrl,
      userId: credentials.userId,
      deviceId: credentials.deviceId,
      error: null,
    });
  },

  logout: () => {
    // 移除 cookies
    removeAuthCookies();

    set({
      isLoggedIn: false,
      accessToken: null,
      refreshToken: null,
      baseUrl: null,
      userId: null,
      deviceId: null,
    });
  },

  refreshAccessToken: async () => {
    const state = get();

    if (
      !state.refreshToken ||
      !state.baseUrl ||
      !state.userId ||
      !state.deviceId
    ) {
      set({ error: "缺少刷新 token 所需資訊" });
      return "REFRESH_FAILED";
    }

    set({ isLoading: true });

    try {
      const tempClient = sdk.createClient({ baseUrl: state.baseUrl });
      const response = await tempClient.refreshToken(state.refreshToken);

      await client.newClient({
        baseUrl: state.baseUrl,
        deviceId: state.deviceId,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        userId: state.userId,
      });

      // 更新 cookies 中的 token
      setAuthCookies(response, state.baseUrl);

      set({
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        isLoading: false,
        error: null,
      });

      console.log("Refresh token success:", response);
      return "REFRESH_SUCCESS";
    } catch (error) {
      console.error("Failed to refresh token:", error);

      // 刷新失敗時清除 cookies
      removeAuthCookies();

      set({
        isLoading: false,
        error: error instanceof Error ? error.message : "刷新 token 失敗",
        isLoggedIn: false, // 刷新失敗時登出使用者
      });
      return "REFRESH_FAILED";
    }
  },

  clearError: () => set({ error: null }),

  // 從 cookies 初始化狀態的方法
  initializeFromCookies: () => {
    const cookieState = getCookieState();
    set(cookieState);
  },
}));
