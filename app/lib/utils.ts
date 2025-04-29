import { clsx, type ClassValue } from "clsx";
import Cookies from "js-cookie";
import type { Room, LoginResponse } from "matrix-js-sdk";
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

export function setLoginState(loginResponse: LoginResponse, baseUrl: string) {
  Cookies.set("access_token", loginResponse.access_token, {
    expires: 7,
    sameSite: "Lax",
    secure: true,
  });
  Cookies.set("refresh_token", loginResponse.refresh_token ?? "", {
    expires: 7,
    sameSite: "Lax",
    secure: true,
  });
  Cookies.set("deviceId", loginResponse.device_id, {
    expires: 7,
    sameSite: "Lax",
    secure: true,
  });
  Cookies.set("userId", loginResponse.user_id, {
    expires: 7,
    sameSite: "Lax",
    secure: true,
  });
  Cookies.set("baseUrl", baseUrl, {
    expires: 7,
    sameSite: "Lax",
    secure: true,
  });
}
