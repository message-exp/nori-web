import { createClient } from "@connectrpc/connect";
import { create } from "@bufbuild/protobuf";
// import { Empty } from "@bufbuild/protobuf/wkt";
import { RoomList } from "@/proto-generated/nori/v0/room/room_list_pb";
import { TokenPair, TokenPairSchema } from "@/proto-generated/nori/v0/user/token_pair_pb";
import { User } from "@/proto-generated/nori/v0/user/user_pb";
import { UserIdSchema } from "@/proto-generated/nori/v0/user/user_id_pb";
import { UserEmailPasswordLoginSchema } from "@/proto-generated/nori/v0/user/user_login_pb";
import { UserService } from "@/proto-generated/nori/v0/user/user_service_pb";
import config from "@/utils/config";
import { AccessTokenSchema } from "@/proto-generated/nori/v0/user/access_token_pb";
import { RefreshTokenSchema } from "@/proto-generated/nori/v0/user/refresh_token_pb";
import { SignUpRequestSchema } from "@/proto-generated/nori/v0/user/signup_request_pb";

import { transport } from "@/api/client";
import { storage } from "@/utils/storage/user-storage";

const client = createClient(UserService, transport);
const api_mode = config.api_mode;

const mockTokenPair = create(TokenPairSchema, {
  accessToken: create(AccessTokenSchema, {
    accessToken: "mock_access_token"
  }),
  refreshToken: create(RefreshTokenSchema, {
    refreshToken: "mock_refresh_token"
  }),
});

export const GetUser = async (userId: bigint | null | undefined): Promise<User> => {

  if (!userId) {
    throw new Error("userId is null or undefined");
  }

  const request = create(UserIdSchema, { id: userId });
  
  try {
    const response = await client.getUser(request);
    console.log("User retrieved successfully", response);
    return response;
  } catch (error) {
    console.error("Failed to retrieve user", error);
    throw error;
  }
};

export const GetUserRoomList = async (userId: bigint | null | undefined): Promise<RoomList> => {
  if (!userId) {
    throw new Error("userId is null or undefined");
  }
  const request = create(UserIdSchema, { id: userId });
  try {
    const response = await client.getUserRoomList(request);
    console.log("Room list retrieved successfully", response);
    return response;
  } catch (error) {
    console.error("Failed to retrieve room list", error);
    throw error;
  }
};


export const login = async (input_email: string, input_password: string): Promise<TokenPair> => {
  console.info("get login info");
  console.info("email: ", input_email);
  console.info("password: ", input_password);

  if (api_mode === "MOCK") {
    console.debug("MOCK mode");
    if (input_email === "test" && input_password === "test123") {
      console.debug("登入成功", mockTokenPair);
      return mockTokenPair;
    }
    else {
      console.error("登入失敗: Email or Password not right");
      throw new Error("Email or Password not right");
    }
  }

  // 準備登入請求
  const loginRequest = create(UserEmailPasswordLoginSchema, {
    email: input_email,
    password: input_password
  });

  // 執行登入請求
  try {
    const response = await client.login(loginRequest);
    console.log("登入成功", response);
    return response;
  } catch (error) {
    console.error("登入失敗", error);
    throw error;
  }
};

export const signup = async (input_name: string, input_email: string, input_password: string): Promise<TokenPair> => {
  console.log("get signup info");
  console.info("name: ", input_name);
  console.info("email: ", input_email);
  console.info("password: ", input_password);

  // verify is input valid
  // name
  if (!input_name || input_name.trim() === "") {
    throw new Error("name is empty");
  }

  //email
  if (!input_email) {
    throw new Error("Email is empty");
  }
  else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input_email)) {
    throw new Error("Invalid email address");
  }

  //password
  if (!input_password || input_password.trim() === "") {
    throw new Error("password is empty");
  }


  if (api_mode === "MOCK") {
    console.debug("MOCK mode");
    if (Math.random() < 0.5) {
      console.debug("signup successful", mockTokenPair);
      return mockTokenPair;
    }
    else {
      console.error("signup fail: just not good luck");
      throw new Error("just not good luck");
    }
  }

  const signupRequest = create(SignUpRequestSchema, {
    username: input_name,
    email: input_email,
    displayName: input_name
  });

  try {
    const response = await client.signup(signupRequest);
    storage.saveToken(response);
    console.log("signup successful: ", response);
    return response;
  } catch (error) {
    console.error("signup error: ", error);
    throw error;
  }
  
};


