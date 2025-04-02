import * as sdk from "matrix-js-sdk";
import { getBaseUrl } from "./utils";
import { client } from "./client";


export async function login(userId: string, password: string): Promise<sdk.LoginResponse | string> {
  // get base URL from host name
  const baseUrl = await getBaseUrl(userId)
  console.log("baseUrl", baseUrl)
  if (baseUrl === "IGNORE" || baseUrl === "FAIL_PROMPT" || baseUrl === "FAIL_ERROR") {
    return baseUrl
  }

  // create a new client to connect to the home server of the user
  await client.newClient({
    baseUrl: baseUrl,
  });

  // log in to the home server, get tokens
  const response = await client.client.loginRequest({
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

  return response
}
