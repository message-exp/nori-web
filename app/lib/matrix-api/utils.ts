/**
 * Get base URL from user ID
 * @param userId user id. format: `@user:domain`
 * @returns base URL | "IGNORE" | "FAIL_PROMPT" | "FAIL_ERROR"
 */
export async function getBaseUrl(
  userId: string,
): Promise<string | "IGNORE" | "FAIL_PROMPT" | "FAIL_ERROR"> {
  // reference: https://spec.matrix.org/v1.14/client-server-api/#well-known-uri

  // 1: Extract the server name from the user’s Matrix ID by splitting the Matrix ID at the first colon.
  const serverName = userId.slice(userId.indexOf(":") + 1);

  // TODO: 2: Extract the hostname from the server name as described by the [grammar](https://spec.matrix.org/v1.14/appendices/#server-name).
  const hostName = serverName;

  // 3: Make a GET request to https://hostname/.well-known/matrix/client
  let response;
  try {
    response = await fetch(`https://${hostName}/.well-known/matrix/client`);

    // 3-1: If the returned status code is 404, then IGNORE
    if (response.status === 404) {
      return "IGNORE";
    }

    // 3-2: If the returned status code is not 200, or the response body is empty, then FAIL_PROMPT
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
  } catch (error) {
    return "FAIL_PROMPT";
  }

  // 3-3: Parse the response body as a JSON object
  // 3-3-1: If the content cannot be parsed, then FAIL_PROMPT.
  let data;
  try {
    data = await response.json();
  } catch (error) {
    return "FAIL_PROMPT";
  }

  // 3-4: Extract the base_url value from the m.homeserver property. This value is to be used as the base URL of the homeserver.
  // 3-4-1: If this value is not provided, then FAIL_PROMPT.
  if (!data?.["m.homeserver"]?.base_url) {
    return "FAIL_PROMPT";
  }
  const baseUrl = data["m.homeserver"].base_url;

  // 3-5: Validate the homeserver base URL:
  // 3-5-1: Parse it as a URL. If it is not a URL, then FAIL_ERROR.
  try {
    new URL(baseUrl);
  } catch (error) {
    return "FAIL_ERROR";
  }

  // 3-5-2: validate that the URL points to a valid homeserver by connecting to the /_matrix/client/versions endpoint,
  // TODO: ensuring that it does not return an error, and parsing and validating that the data conforms with the expected response format.
  // If any step in the validation fails, then FAIL_ERROR.
  // 3-5-3: the base_url value might include a trailing /
  try {
    response = await fetch(
      baseUrl.replace(/\/+$/, "") + "/_matrix/client/versions",
    );
    if (!response.ok) {
      throw new Error(`${response.status}`);
    }
  } catch (error) {
    return "FAIL_ERROR";
  }

  // step 3-6: If the m.identity_server property is present, extract the base_url value for use as the base URL of the identity server.
  // Validation for this URL is done as in the step above, but using /_matrix/identity/v2 as the endpoint to connect to.
  // If the m.identity_server property is present, but does not have a base_url value, then FAIL_PROMPT.
  if (data?.["m.identity_server"]?.base_url) {
    const identityBaseUrl = data["m.identity_server"].base_url;

    // validate the identity server base URL
    // Parse it as a URL. If it is not a URL, then FAIL_ERROR.
    try {
      new URL(identityBaseUrl);
    } catch (error) {
      return "FAIL_ERROR";
    }

    try {
      response = await fetch(
        identityBaseUrl.replace(/\/+$/, "") + "/_matrix/identity/v2",
      );
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
    } catch (error) {
      return "FAIL_ERROR";
    }

    // success; use identity server base url
    return identityBaseUrl;
  }

  // success; use homeserver base url
  return baseUrl;
}
