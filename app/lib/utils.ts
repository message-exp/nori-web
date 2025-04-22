import { clsx, type ClassValue } from "clsx";
import Cookies from "js-cookie";
import { twMerge } from "tailwind-merge";
import type { LoginResponse } from "matrix-js-sdk";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
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
