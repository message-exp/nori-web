import * as sdk from "matrix-js-sdk";
import { client } from "~/lib/matrix-api/client";
import { checkBaseUrl } from "~/lib/matrix-api/utils";
import { setAuthCookies } from "~/lib/utils";

export async function login(
  baseUrl: string,
  userId: string,
  password: string,
): Promise<{ loginResponse: sdk.LoginResponse; baseUrl: string }> {
  // check if the base URL is valid
  const checkBaseUrlRes = await checkBaseUrl(baseUrl);

  console.log("checkBaseUrlRes", checkBaseUrlRes);
  if (
    checkBaseUrlRes === "IGNORE" ||
    checkBaseUrlRes === "FAIL_PROMPT" ||
    checkBaseUrlRes === "FAIL_ERROR"
  ) {
    throw new Error(`base URL ${checkBaseUrlRes}`);
  }

  // use the validated and possibly rewrote base URL (including protocol)
  const resolvedBaseUrl = checkBaseUrlRes;
  const tempClient = sdk.createClient({ baseUrl: resolvedBaseUrl });

  // log in to the home server, get tokens
  const response = await tempClient.loginRequest({
    type: "m.login.password",
    identifier: {
      type: "m.id.user",
      user: userId,
    },
    password: password,
    refresh_token: true,
  });

  setAuthCookies(response, resolvedBaseUrl);

  // re-create a client
  await client.newClient({
    baseUrl: resolvedBaseUrl,
    deviceId: response.device_id,
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    userId: response.user_id,
  });

  return { loginResponse: response, baseUrl: resolvedBaseUrl };
}
