import contactsApi from "..";
interface discordConnection {
  last_heartbeat_ack: number;
  last_heartbeat_sent: number;
}

interface discordInfo {
  logged_in: boolean;
  connected: boolean;
  conn: discordConnection;
}

interface discordGetUserInfoResponse {
  Discord: discordInfo;
  mxid: string;
  management_room: string;
}
interface discordLogoutResponse {
  success: boolean;
  status: string;
}
interface discordLoginWithQrcodeResponse {
  success: boolean;
  error: string;
  errcode: string;
  code: string;
  timeout: number;
}

interface discordLoginWithTokenResponse {
  success: boolean;
  id: string;
  username: string;
  discriminator: string;
  error: string;
  errcode: string;
}

export function getDiscordUserInfo(): Promise<discordGetUserInfoResponse> {
  return contactsApi
    .get("/api/bridge/discord/users/info")
    .then((response) => response.data);
}
export function logout(): Promise<discordLogoutResponse> {
  return contactsApi
    .post("/api/bridge/discord/users/logout")
    .then((response) => response.data);
}
export function loginWithQr(): Promise<discordLoginWithQrcodeResponse> {
  return contactsApi
    .get("/api/bridge/discord/users/login/qrcode")
    .then((response) => response.data);
}
export function loginWithToken(
  token: string,
  token_type: string,
): Promise<discordLoginWithTokenResponse> {
  return contactsApi
    .post("/api/bridge/discord/users/login/token", {
      token: token,
      token_type: token_type,
    })
    .then((response) => response.data);
}
