import { createClient } from "@connectrpc/connect";
import { create } from "@bufbuild/protobuf";
import { User } from "@/proto-generated/nori/v0/user/account/user_pb";
import { UserIdSchema } from "@/proto-generated/nori/v0/user/user_id_pb";
import { UserAccountService } from "@/proto-generated/nori/v0/user/account/user_account_service_pb";
import { SignUpRequestSchema } from "@/proto-generated/nori/v0/user/account/signup_request_pb";
import { UserProfileUpdateRequestSchema } from "@/proto-generated/nori/v0/user/account/user_profile_update_request_pb";
import { UserTokenPair } from "@/proto-generated/nori/v0/user/access/token_pairs_pb";
import { transport } from "@/api/client";
import { storage } from "@/utils/storage/user-storage";

const client = createClient(UserAccountService, transport);

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

export const signup = async (input_name: string, input_email: string, input_password: string): Promise<UserTokenPair> => {
  // Input validation
  if (!input_name || input_name.trim() === "") {
    throw new Error("name is empty");
  }
  if (!input_email) {
    throw new Error("Email is empty");
  }
  if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(input_email)) {
    throw new Error("Invalid email address");
  }
  if (!input_password || input_password.trim() === "") {
    throw new Error("password is empty");
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

export const DeleteUser = async (userId: bigint): Promise<void> => {
  const request = create(UserIdSchema, { id: userId });
  try {
    await client.deleteUser(request);
    console.log("User deleted successfully");
  } catch (error) {
    console.error("Failed to delete user", error);
    throw error;
  }
};

export const UpdateUserProfile = async (userId: bigint, profileData: {
  displayName?: string;
  bio?: string;
  // Add other profile fields as needed
}): Promise<void> => {
  const validatedUserId  = create(UserIdSchema, {id: userId})
  const request = create(UserProfileUpdateRequestSchema, {
    userId: validatedUserId,
    ...profileData
  });

  try {
    await client.updateUserProfile(request);
    console.log("User profile updated successfully");
  } catch (error) {
    console.error("Failed to update user profile", error);
    throw error;
  }
};