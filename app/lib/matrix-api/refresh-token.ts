import * as sdk from "matrix-js-sdk";
import { client } from "./client";
import { getAuthCookies, setAuthCookies } from "~/lib/utils";

export async function refreshToken(): Promise<string> {
  const authCookies = getAuthCookies();
  if (
    authCookies.refreshToken &&
    authCookies.baseUrl &&
    authCookies.userId &&
    authCookies.deviceId &&
    authCookies.accessToken
  ) {
    try {
      const tempClient = sdk.createClient({ baseUrl: authCookies.baseUrl });
      const response = await tempClient.refreshToken(authCookies.refreshToken);
      await client.newClient({
        baseUrl: authCookies.baseUrl,
        deviceId: authCookies.deviceId,
        accessToken: response.access_token,
        refreshToken: response.refresh_token,
        userId: authCookies.userId,
      });

      setAuthCookies(response, authCookies.baseUrl ?? "");
      console.log("Refresh token success:", response);
      return "REFRESH_SUCCESS";
    } catch (error) {
      console.error("Failed to refresh token:", error);
      return "REFRESH_FAILED";
    }
  } else {
    return "REFRESH_FAILED";
  }
}

export async function checkClientState(): Promise<boolean> {
  const clientCookiesState = await client.restoreClient(false);
  if (!clientCookiesState) {
    return false;
  }

  try {
    let whoamiResponse;
    try {
      whoamiResponse = await client.client.whoami();
    } catch (whoamiError) {
      console.error("error during whoami call, refresh token:", whoamiError);
      const refreshTokenResponse = await refreshToken();
      console.log("refreshed finished, result: ", refreshTokenResponse);
      if (refreshTokenResponse === "REFRESH_SUCCESS") {
        // 如果刷新成功，再次嘗試獲取用戶ID
        try {
          whoamiResponse = await client.client.whoami();
          console.log("second whoami response: ", whoamiResponse?.user_id);
        } catch (secondWhoamiError) {
          console.error("Error during second whoami call:", secondWhoamiError);
          return false;
        }
      }
    }

    // 如果最終還是無法獲取用戶ID，返回false
    if (!whoamiResponse?.user_id) {
      console.warn("can't get user id after refresh, return false");
      return false;
    }

    console.log("client state check passed, return true");
    await client.sync();
    return true;
  } catch (error) {
    console.error("Error checking client state:", error);
    return false;
  }
}
