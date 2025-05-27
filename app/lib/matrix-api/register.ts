import * as sdk from "matrix-js-sdk";
import { getBaseUrl } from "./utils";
import { client } from "./client";
import { setAuthCookies } from "../utils";

export async function register(
  homeserver: string,
  username: string,
  password: string,
): Promise<{ registerResponse: sdk.RegisterResponse; baseUrl: string }> {
  // get base URL from host name
  const baseUrl = await getBaseUrl(`@${username}:${homeserver}`);
  console.log("baseUrl", baseUrl);
  if (
    baseUrl === "IGNORE" ||
    baseUrl === "FAIL_PROMPT" ||
    baseUrl === "FAIL_ERROR"
  ) {
    throw new Error(`base URL ${baseUrl}`);
  }

  // create a temporary client to connect to the home server of the user
  const tempClient = sdk.createClient({ baseUrl });

  // register the user
  const response = await tempClient.register(
    username,
    password,
    null, // No session ID initially
    {
      type: "m.login.dummy", // Auth type - use dummy for initial request
    },
    undefined, // bindThreepids (optional)
    undefined, // guestAccessToken (optional)
    false, // inhibitLogin - false to allow automatic login
  );

  setAuthCookies(response, baseUrl);

  // re-create a client
  await client.newClient({
    baseUrl: baseUrl,
    deviceId: response.device_id,
    accessToken: response.access_token,
    refreshToken: response.refresh_token,
    userId: response.user_id,
  });

  return { registerResponse: response, baseUrl };
}
