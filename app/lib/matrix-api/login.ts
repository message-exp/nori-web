import * as sdk from "matrix-js-sdk";
import { getBaseUrl } from "./utils";
import { client } from "./client";

export async function login(
  userId: string,
  password: string,
): Promise<{ loginResponse: sdk.LoginResponse; baseUrl: string }> {
  // get base URL from host name
  const baseUrl = await getBaseUrl(userId);
  console.log("baseUrl", baseUrl);
  if (
    baseUrl === "IGNORE" ||
    baseUrl === "FAIL_PROMPT" ||
    baseUrl === "FAIL_ERROR"
  ) {
    throw new Error(`base URL ${baseUrl}`);
  }

  const tempClient = sdk.createClient({ baseUrl });

  // log in to the home server, get tokens
  const response = await tempClient.loginRequest({
    type: "m.login.password",
    identifier: {
      type: "m.id.user",
      user: userId,
    },
    password: password,
  });

  // re-create a client
  await client.newClient({
    baseUrl: baseUrl,
    deviceId: response.device_id,
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    userId: response.user_id,
  });

  return { loginResponse: response, baseUrl };
}
