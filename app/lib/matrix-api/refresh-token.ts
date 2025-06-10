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
      client.client.setAccessToken(response.access_token);

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
  const clientCookiesState = await client.restoreClient(true);
  if (!clientCookiesState) {
    return false;
  }
  try {
    const whoamiResponse = await client.client.whoami();
    return !!whoamiResponse?.user_id;
  } catch {
    return false;
  }
}
