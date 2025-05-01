import * as sdk from "matrix-js-sdk";
import { client } from "./client";
import { getAuthCookies, setAuthCookies } from "~/lib/utils";

export async function refreshToken(): Promise<string> {
  const authCookies = getAuthCookies();
  if (authCookies.refreshToken) {
    const response = await client.client.refreshToken(authCookies.refreshToken);
    setAuthCookies(
      {
        refresh_token: response.refresh_token,
        access_token: response.access_token,
      } as sdk.LoginResponse,
      authCookies.baseUrl ?? "",
    );
    return "REFRESH_SUCCESS";
  } else {
    return "REFRESH_FAIL";
  }
}
