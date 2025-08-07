import contactsApi from ".";
import { getAuthCookies } from "../utils";

export function test() {
  console.log("Contacts API Base URL:", contactsApi.defaults.baseURL);
  console.log("Contacts API Timeout:", contactsApi.defaults.timeout);
  console.log("Contacts API Headers:", contactsApi.defaults.headers);
  return contactsApi.get("");
}

export function login(phone: string) {
  return contactsApi.post("/api/bridge/telegram/users/login/code", {
    phone,
  });
}
export function verify(code: string) {
  return contactsApi.post("/api/bridge/telegram/users/login/code/verify", {
    code,
  });
}
export function logout() {
  return contactsApi.post("/api/bridge/telegram/users/logout", {});
}
