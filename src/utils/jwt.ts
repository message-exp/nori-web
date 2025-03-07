import { AccessToken } from "@/proto-generated/nori/v0/user/access/access_token_pb";
import { UserId, UserIdSchema } from "@/proto-generated/nori/v0/user/user_id_pb";
import { create } from "@bufbuild/protobuf";
import { jwtDecode } from "jwt-decode";

interface JWTPayload {
    sub: string,
    exp: number,
    jti: string
}

export const getUserIdFromAccessToken = (token?: AccessToken): UserId => {
  if (!token?.accessToken) {
    throw new Error("Access token is missing or invalid");
  }

  try {
    const tokenString = token.accessToken;
    const decoded = jwtDecode<JWTPayload>(tokenString);
    console.log(decoded);
    const userIdString = decoded.sub;
    const userId = create(UserIdSchema, { id: BigInt(userIdString) });
    return userId;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    throw error;
  }
};