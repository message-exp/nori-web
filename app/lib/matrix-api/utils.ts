import { getHttpUriForMxc } from "matrix-js-sdk/src/content-repo";
import type { Room } from "matrix-js-sdk";
import { EventTimeline } from "matrix-js-sdk/src/models/event-timeline";
import type { SlidingSyncSdk } from "matrix-js-sdk/lib/sliding-sync-sdk";
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

export function getRoomAvatar(room: Room, baseUrl: string): string | undefined {
  const state = room.getLiveTimeline().getState(EventTimeline.FORWARDS);
  if (!state) return undefined;
  const avatarEvent = state.getStateEvents("m.room.avatar", "");
  const mxcUrl = avatarEvent?.getContent()?.url;
  return mxcUrl
    ? getHttpUriForMxc(baseUrl, mxcUrl, 40, 40, "scale")
    : undefined;
}

export function getImageHttpUrl(
  messageContent: sdk.IContent,
): string | undefined {
  const mxcUrl = messageContent.url;
  console.log("image mxcurl: ", mxcUrl);
  console.log("width: ", messageContent.info.w);
  console.log("height: ", messageContent.info.h);
  const { downloadUrl, thumbnailUrl } = mxcToHttp(
    mxcUrl,
    messageContent.info.w,
    messageContent.info.h,
    "scale",
  );
  return downloadUrl ?? undefined;
}

// 可選的縮圖方法
type ResizeMethod = "scale" | "crop";

// 回傳值的型別
interface MxcToHttpResult {
  downloadUrl: string;
  thumbnailUrl: string;
}

/**
 * 將 MXC URL 轉成 HTTP 下載與縮圖 URL
 * @param mxcUrl ── 像 mxc://matrix.org/abc123
 * @param width  ── 縮圖寬度 (px)，省略則不加到 query
 * @param height ── 縮圖高度 (px)，省略則不加到 query
 * @param method ── 縮圖方法 (scale 或 crop)，預設 scale
 * @returns  { downloadUrl, thumbnailUrl }
 */
function mxcToHttp(
  mxcUrl: string,
  width?: number,
  height?: number,
  method: ResizeMethod = "scale",
): MxcToHttpResult {
  // 先用 RegExp.exec() 拆出 serverName、mediaId
  const MxcRegex = /^mxc:\/\/([^/]+)\/(.+)$/;
  const execResult = MxcRegex.exec(mxcUrl);
  if (!execResult) {
    throw new Error(`Invalid MXC URL: ${mxcUrl}`);
  }
  const [, serverName, mediaId] = execResult;

  const base = `https://${serverName}/_matrix/client/v1/media`;
  const downloadUrl = `${base}/download/${serverName}/${mediaId}`;
  const thumbnailUrl =
    width && height
      ? `${base}/thumbnail/${serverName}/${mediaId}?width=${width}&height=${height}&method=${method}`
      : `${base}/thumbnail/${serverName}/${mediaId}`;

  return { downloadUrl, thumbnailUrl };
}
