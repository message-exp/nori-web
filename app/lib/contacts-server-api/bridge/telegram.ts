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
