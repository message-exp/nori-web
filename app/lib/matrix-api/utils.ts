import { getHttpUriForMxc } from "matrix-js-sdk/src/content-repo";
import * as sdk from "matrix-js-sdk";
import { client } from "./client";

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

  return checkBaseUrl(hostName);
}

/**
 * Check if the base URL is valid
 * @param url base url. e.g. `matrix.org`
 * @returns base URL | "IGNORE" | "FAIL_PROMPT" | "FAIL_ERROR"
 */
export async function checkBaseUrl(
  url: string,
): Promise<string | "IGNORE" | "FAIL_PROMPT" | "FAIL_ERROR"> {
  // reference: https://spec.matrix.org/v1.14/client-server-api/#well-known-uri

  // continue from step 2 above (function `getBaseUrl`)
  const hostName = url;

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
  } catch {
    return "FAIL_PROMPT";
  }

  // 3-3: Parse the response body as a JSON object
  // 3-3-1: If the content cannot be parsed, then FAIL_PROMPT.
  let data;
  try {
    data = await response.json();
  } catch {
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
  } catch {
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
  } catch {
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
    } catch {
      return "FAIL_ERROR";
    }

    try {
      response = await fetch(
        identityBaseUrl.replace(/\/+$/, "") + "/_matrix/identity/v2",
      );
      if (!response.ok) {
        throw new Error(`${response.status}`);
      }
    } catch {
      return "FAIL_ERROR";
    }

    // success; use identity server base url
    return identityBaseUrl;
  }

  // success; use homeserver base url
  return baseUrl;
}

export function splitUserId(userId: string) {
  // @username:domain => { username: "username", domain: "domain" }
  const parts = userId.split(":");
  if (parts.length !== 2) {
    throw new Error("Invalid username format");
  }
  return {
    username: parts[0].startsWith("@") ? parts[0].substring(1) : parts[0],
    domain: parts[1],
  };
}

// export function getRoomAvatar(room: Room, baseUrl: string): string | undefined {
//   const state = room.getLiveTimeline().getState(EventTimeline.FORWARDS);
//   if (!state) return undefined;
//   const avatarEvent = state.getStateEvents("m.room.avatar", "");
//   const mxcUrl = avatarEvent?.getContent()?.url;
//   return mxcUrl
//     ? getHttpUriForMxc(baseUrl, mxcUrl, 40, 40, "scale")
//     : undefined;
// }

const imageCache = new Map<string, Promise<Blob | undefined>>();

/**
 * Custom error class for image blob operations
 */
export class ImageBlobError extends Error {
  public readonly type:
    | "INVALID_URL"
    | "NETWORK_ERROR"
    | "CLIENT_ERROR"
    | "INVALID_RESPONSE"
    | "UNKNOWN_ERROR";
  public readonly statusCode?: number;

  constructor(
    type:
      | "INVALID_URL"
      | "NETWORK_ERROR"
      | "CLIENT_ERROR"
      | "INVALID_RESPONSE"
      | "UNKNOWN_ERROR",
    message: string,
    statusCode?: number,
  ) {
    super(message);
    this.name = "ImageBlobError";
    this.type = type;
    this.statusCode = statusCode;
  }
}

/**
 * Generic helper that converts an MXC (or plain HTTP/HTTPS) URL to a `Blob`.
 * Results are cached so subsequent requests for the same `mxcUrl` share the same network call.
 *
 * @param mxcUrl  The Matrix Content URI or direct HTTP(S) URL to the image.
 * @returns       A `Promise` resolving to a `Blob`, or `undefined` if the fetch failed.
 * @throws        An `ImageBlobError` with specific error details.
 */
export async function getImageBlob(mxcUrl: string): Promise<Blob | undefined> {
  // 1. Validate param
  if (!mxcUrl) {
    throw new ImageBlobError("INVALID_URL", "Image URL is required");
  }

  if (
    !mxcUrl.startsWith("mxc://") &&
    !mxcUrl.startsWith("http://") &&
    !mxcUrl.startsWith("https://")
  ) {
    throw new ImageBlobError(
      "INVALID_URL",
      `Invalid URL format: ${mxcUrl}. Must be MXC URI or HTTP(S) URL`,
    );
  }

  // 2. Check cache first
  if (imageCache.has(mxcUrl)) {
    return imageCache.get(mxcUrl)!;
  }

  // 3. Build a new promise, store it immediately so parallel callers coalesce
  const promise = (async (): Promise<Blob | undefined> => {
    // A. Direct HTTP(S) URL – just fetch it.
    if (mxcUrl.startsWith("http://") || mxcUrl.startsWith("https://")) {
      try {
        const response = await fetch(mxcUrl);
        if (!response.ok) {
          const errorText = await response.text().catch(() => "Unknown error");
          imageCache.delete(mxcUrl);
          throw new ImageBlobError(
            "NETWORK_ERROR",
            `HTTP ${response.status}: ${response.statusText}. ${errorText}`,
            response.status,
          );
        }

        const contentType = response.headers.get("content-type");
        if (contentType && !contentType.startsWith("image/")) {
          imageCache.delete(mxcUrl);
          throw new ImageBlobError(
            "INVALID_RESPONSE",
            `Expected image content, got: ${contentType}`,
          );
        }

        return await response.blob();
      } catch (error) {
        imageCache.delete(mxcUrl);
        if (error instanceof ImageBlobError) {
          throw error; // Re-throw our custom error
        }
        throw new ImageBlobError(
          "NETWORK_ERROR",
          `Network request failed: ${error instanceof Error ? error.message : String(error)}`,
        );
      }
    }

    // B. MXC URI – build an authenticated HTTP URL and fetch via the Matrix client.
    try {
      if (!client.client) {
        throw new ImageBlobError(
          "CLIENT_ERROR",
          "Matrix client is not initialized",
        );
      }

      const baseUrl = client.client.baseUrl;
      if (!baseUrl) {
        throw new ImageBlobError(
          "CLIENT_ERROR",
          "Matrix client base URL is not available",
        );
      }

      const httpUri = getHttpUriForMxc(
        baseUrl,
        mxcUrl,
        undefined,
        undefined,
        undefined,
        false,
        true,
        true,
      );

      if (!httpUri) {
        throw new ImageBlobError(
          "INVALID_URL",
          `Failed to convert MXC URL to HTTP URL: ${mxcUrl}`,
        );
      }

      const response = await client.authedFetch(httpUri);
      if (!response.ok) {
        const errorText = await response.text().catch(() => "Unknown error");
        imageCache.delete(mxcUrl);
        throw new ImageBlobError(
          "NETWORK_ERROR",
          `HTTP ${response.status}: ${response.statusText}. ${errorText}`,
          response.status,
        );
      }

      const contentType = response.headers.get("content-type");
      if (contentType && !contentType.startsWith("image/")) {
        imageCache.delete(mxcUrl);
        throw new ImageBlobError(
          "INVALID_RESPONSE",
          `Expected image content, got: ${contentType}`,
        );
      }

      return await response.blob();
    } catch (error) {
      imageCache.delete(mxcUrl);
      if (error instanceof ImageBlobError) {
        throw error; // Re-throw our custom error
      }
      throw new ImageBlobError(
        "CLIENT_ERROR",
        `Matrix client request failed: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
  })();

  imageCache.set(mxcUrl, promise);
  return promise;
}

/**
 * Convenience wrapper around `getImageBlob` that extracts the URL from a Matrix event.
 *
 * @param message  The Matrix event that contains a `url` field in its content.
 * @returns        A `Promise` resolving to a `Blob`, or `undefined` if no URL or the fetch failed.
 */
export function getMessageImageBlob(
  message: sdk.MatrixEvent,
): Promise<Blob | undefined> {
  const mxcUrl = message?.getContent()?.url;
  if (!mxcUrl) return Promise.resolve(undefined);
  return getImageBlob(mxcUrl);
}

/**
 * Convenience helper that converts an MXC (or HTTP) URL directly into a browser object URL.
 * *Remember* to call `URL.revokeObjectURL` once the image element or preview is unmounted to avoid memory leaks.
 *
 * @param mxcUrl  The Matrix Content URI or direct HTTP(S) URL to the image.
 * @returns       A `Promise` resolving to an object URL string, or `undefined` if the fetch failed.
 */
export async function getImageObjectUrl(
  mxcUrl: string,
): Promise<string | undefined> {
  const blob = await getImageBlob(mxcUrl);
  if (!blob) return undefined;
  return URL.createObjectURL(blob);
}
