import * as sdk from "matrix-js-sdk";
import { getBaseUrl } from "./utils";
import { client } from "./client";


export async function login(userId: string, password: string): Promise<sdk.LoginResponse | undefined> {
  // get base URL from host name
  const baseUrl = await getBaseUrl(userId)
  console.log("baseUrl", baseUrl)
  if (baseUrl === "IGNORE" || baseUrl === "FAIL_PROMPT" || baseUrl === "FAIL_ERROR") {
    return
  }

  let response = await client.client.loginRequest({
    type: "m.login.password",
    identifier: {
      type: "m.id.user",
      user: userId
    },
    password: password
  })

  // re-create a client
  await client.newClient({
    baseUrl: baseUrl,
    accessToken: response.access_token,
    userId: response.user_id,
  });
  await client.sync()

  return response
}
