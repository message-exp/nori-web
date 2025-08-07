import contactsApi from "..";
interface telegramLoginRequestCodeResponse {
  message: string;
}

interface telegramLoginVerifyCodeResponse {
  state: string;
  username: string;
  phone: string;
}
interface telegramLogoutRequestCodeResponse {
  message: string;
}

interface telegramUserInfo {
  id: string;
  username: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_bot: boolean;
}
interface telegramGetUserInfoResponse {
  telegram: telegramUserInfo;
  mxid: string;
  permissions: string;
}
export function getTelegramUserInfo(): Promise<telegramGetUserInfoResponse> {
  return contactsApi
    .get("/api/bridge/telegram/users/info")
    .then((response) => response.data);
}

export function telegramLoginRequestCode(
  phone: string,
): Promise<telegramLoginRequestCodeResponse> {
  return contactsApi
    .post("/api/bridge/telegram/users/login/code", {
      phone,
    })
    .then((response) => response.data);
}
export function telegramLoginVerifyCode(
  code: string,
): Promise<telegramLoginVerifyCodeResponse> {
  return contactsApi
    .post("/api/bridge/telegram/users/login/code/verify", {
      code,
    })
    .then((response) => response.data);
}
export function telegramLogout(): Promise<telegramLogoutRequestCodeResponse> {
  return contactsApi
    .post("/api/bridge/telegram/users/logout", {})
    .then((response) => response.data);
}
