import { createClient } from "@connectrpc/connect";
import { create } from "@bufbuild/protobuf";
import { UserTokenPair, UserRefreshTokenSchema } from "@/proto-generated/nori/v0/user/access/token_pairs_pb";
import { AccessToken } from "@/proto-generated/nori/v0/user/access/access_token_pb";
import { UserEmailPasswordLoginSchema } from "@/proto-generated/nori/v0/user/access/user_login_pb";
import { UserResetPasswordRequestSchema } from "@/proto-generated/nori/v0/user/access/user_reset_password_request_pb";
import { UserAccessService } from "@/proto-generated/nori/v0/user/access/user_access_service_pb";
import { transport } from "@/api/client";
import { UserIdSchema } from "@/proto-generated/nori/v0/user/user_id_pb";
import { RefreshTokenSchema } from "@/proto-generated/nori/v0/user/access/refresh_token_pb";

const client = createClient(UserAccessService, transport);

export const login = async (input_email: string, input_password: string): Promise<UserTokenPair> => {
  console.info("Login attempt with email:", input_email);

  const loginRequest = create(UserEmailPasswordLoginSchema, {
    email: input_email,
    password: input_password
  });

  try {
    const response = await client.login(loginRequest);
    console.log("Login successful", response);
    return response;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const logout = async (tokenPair: UserTokenPair): Promise<void> => {
  try {
    await client.logout(tokenPair);
    console.log("Logout successful");
  } catch (error) {
    console.error("Logout failed", error);
    throw error;
  }
};

export const refreshUserToken = async (userId: bigint, refreshToken: string): Promise<AccessToken> => {
  const validatedUserId = create(UserIdSchema, { id: userId });
  const validatedRefreshToken = create(RefreshTokenSchema, { refreshToken: refreshToken });
  const request = create(UserRefreshTokenSchema, {
    userId: validatedUserId,
    refreshToken: validatedRefreshToken
  });

  try {
    const response = await client.refreshUserToken(request);
    console.log("Token refresh successful");
    return response;
  } catch (error) {
    console.error("Token refresh failed", error);
    throw error;
  }
};

export const resetUserPassword = async (
  userId: bigint,
  originalPassword: string,
  newPassword: string
): Promise<void> => {
  // Basic password validation
  if (!newPassword || newPassword.trim() === "") {
    throw new Error("New password cannot be empty");
  }

  const validatedUserId = create(UserIdSchema, { id: userId });
  const request = create(UserResetPasswordRequestSchema, {
    userId: validatedUserId,
    originalPassword: originalPassword,
    newPassword: newPassword
  });

  try {
    await client.resetUserPassword(request);
    console.log("Password reset successful");
  } catch (error) {
    console.error("Password reset failed", error);
    throw error;
  }
};