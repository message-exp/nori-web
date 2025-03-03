import { login } from "@/api/user/user-service";
import { inputNullCheck } from "@/utils/input-check/input-null-check";
import { inputEmailCheck } from "@/utils/input-check/input-email-check";
import { storage } from "@/utils/storage/user-storage";

interface LoginResult {
  success: boolean;
  errors: string;
}

interface LoginData {
  email: string;
  password: string;
}

export const loginSubmit = async (data: LoginData): Promise<LoginResult> => {
  const { email, password } = data;

  // verify email
  if (inputNullCheck(email) === false) {
    return {
      success: false,
      errors: "Email is null"
    };
  }
  if (inputEmailCheck(email) === false) {
    return {
      success: false,
      errors: "Email form error"
    };
  }

  // verify password
  if (inputNullCheck(password) === false) {
    return {
      success: false,
      errors: "password is null"
    };
  }

  try {
    const response = await login(email, password);
    console.log("get login response: ", response);
    storage.saveToken(response);
    return {
      success: true,
      errors: ""
    };
  } catch (error) {
    console.error("login error: ", error);
    return {
      success: false,
      errors: "try catch error: " + error
    };
  }
};