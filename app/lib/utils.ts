import { clsx, type ClassValue } from "clsx";
import Cookies from "js-cookie";
import type {
  Room,
  LoginResponse,
  RegisterResponse,
  IRefreshTokenResponse,
} from "matrix-js-sdk";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getLatestMessageText(room: Room) {
  if (!room) return null;

  const events = room.getLiveTimeline().getEvents();
  if (!events || events.length === 0) return null;

  // 倒著找最新的文字訊息
  for (let i = events.length - 1; i >= 0; i--) {
    const event = events[i];

    if (event.getType() === "m.room.message") {
      const content = event.getContent();
      if (content.msgtype === "m.text") {
        return content.body;
      }
    }
  }

  return null; // 沒有找到符合條件的訊息
}

export function setAuthCookies(
  authResponse: LoginResponse | RegisterResponse | IRefreshTokenResponse,
  baseUrl: string,
) {
  if (authResponse.access_token) {
    Cookies.set("access_token", authResponse.access_token ?? "", {
      expires: 7,
      sameSite: "strict",
      secure: false,
    });
  }
  Cookies.set("refresh_token", authResponse.refresh_token ?? "", {
    expires: 7,
    sameSite: "strict",
    secure: false,
  });
  if ("device_id" in authResponse && authResponse.device_id) {
    Cookies.set("deviceId", authResponse.device_id, {
      expires: 7,
      sameSite: "strict",
      secure: false,
    });
  }
  if ("user_id" in authResponse && authResponse.user_id) {
    Cookies.set("userId", authResponse.user_id, {
      expires: 7,
      sameSite: "strict",
      secure: false,
    });
  }
  Cookies.set("baseUrl", baseUrl, {
    expires: 7,
    sameSite: "strict",
    secure: false,
  });
}

export function getAuthCookies() {
  const accessToken = Cookies.get("access_token");
  const refreshToken = Cookies.get("refresh_token");
  const deviceId = Cookies.get("deviceId");
  const userId = Cookies.get("userId");
  const baseUrl = Cookies.get("baseUrl");

  return {
    accessToken,
    refreshToken,
    deviceId,
    userId,
    baseUrl,
  };
}

export function removeAuthCookies() {
  // 移除所有認證相關的 cookies
  Cookies.remove("access_token");
  Cookies.remove("refresh_token");
  Cookies.remove("deviceId");
  Cookies.remove("userId");
  Cookies.remove("baseUrl");
}

export function avatarFallback(name: string) {
  return name
    .split(" ")
    .map((word) => word.replace(/[\p{P}\p{S}]/gu, ""))
    .filter((word) => word.length > 0)
    .map((word) => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join("");
}

/**
 * Parse error object and extract user-friendly error message
 * @param error - The error object caught in catch block
 * @param patterns - Array of error patterns to match against
 * @returns User-friendly error message string
 */
export function parseErrorMessage(
  error: unknown,
  patterns: string[] = [],
): string {
  let errorMessage = "Unknown error";

  if (error && typeof error === "object") {
    const errorObj = error as { message?: string };
    const errorStr = errorObj.message ?? JSON.stringify(error);

    // Check each pattern
    let matched = false;
    for (const pattern of patterns) {
      if (errorStr.includes(pattern)) {
        errorMessage = pattern;
        matched = true;
        break;
      }
    }
    if (!matched) {
      errorMessage = errorStr;
    }
  }

  return errorMessage;
}
