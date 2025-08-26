import contactsApi from "..";

// API Request Types (input)
export interface LoginRequest {
  phone: string;
}

export interface CodeRequest {
  code: string;
}

// API Response Types (output) - matching OpenAPI schema exactly
export interface MessageResponse {
  message: string;
}

export interface TelegramInfo {
  id: number;
  username: string | null;
  first_name: string | null;
  last_name: string | null;
  phone: string;
  is_bot: boolean;
}

export interface UserInfoResponse {
  telegram: TelegramInfo | null;
  mxid: string;
  permissions: string;
}

export interface SendVerifyCodeResponse {
  state: string;
  username: string | null;
  phone: string;
}

// API Functions
export async function getUserInfo(): Promise<UserInfoResponse> {
  const response = await contactsApi.get("/api/bridge/telegram/users/info");
  console.log("getUserInfo(): ", response);
  return response.data;
}

export async function requestLoginCode(
  request: LoginRequest,
): Promise<MessageResponse> {
  const response = await contactsApi.post(
    "/api/bridge/telegram/users/login/code",
    request,
  );
  return response.data;
}

export async function verifyLoginCode(
  request: CodeRequest,
): Promise<SendVerifyCodeResponse> {
  const response = await contactsApi.post(
    "/api/bridge/telegram/users/login/code/verify",
    request,
  );
  return response.data;
}

export async function logout(): Promise<MessageResponse> {
  const response = await contactsApi.post(
    "/api/bridge/telegram/users/logout",
    {},
  );
  return response.data;
}
