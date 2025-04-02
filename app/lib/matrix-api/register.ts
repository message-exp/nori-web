import * as sdk from "matrix-js-sdk";
import { getBaseUrl } from "./utils";
import { client } from "./client";


export async function register(homeserver: string, username: string, password: string): Promise<sdk.RegisterResponse | string> {
  // get base URL from host name
  const baseUrl = await getBaseUrl(`@${username}:${homeserver}`);
  console.log("baseUrl", baseUrl);
  if (baseUrl === "IGNORE" || baseUrl === "FAIL_PROMPT" || baseUrl === "FAIL_ERROR") {
    return baseUrl
  }

  // create a new client to connect to the home server of the user
  await client.newClient({
    baseUrl: baseUrl,
  });

  // register to the home server, get tokens
  console.log("registering to homeserver", baseUrl);
  const response = await client.client.register(username, password, null, { type: "m.login.password", password: password });
  console.log("register response", response);

  // re-create a client
  await client.newClient({
    baseUrl: baseUrl,
    deviceId: response.device_id,
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    userId: response.user_id,
  });

  return response
}
