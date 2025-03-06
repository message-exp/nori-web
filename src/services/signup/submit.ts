import { inputNullCheck } from "@/utils/input-check/input-null-check";
import { inputEmailCheck } from "@/utils/input-check/input-email-check";
import { storage } from "@/utils/storage/user-storage";
import { signup } from "@/api/user/user-account-service";

interface SignupResult {
  success: boolean;
  errors: string;
}

interface SignupData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export const signupSubmit = async (data: SignupData): Promise<SignupResult> => {
  const { name, email, password, confirmPassword } = data;

  // verify name
  if (inputNullCheck(name) === false) {
    return {
      success: false,
      errors: "Name is null"
    };
  }

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

  // verify confirm password
  if (password !== confirmPassword) {
    return {
      success: false,
      errors: "password is not same as confirm password"
    };
  }

  try {
    const response = await signup(name, email, password);
    console.log("get signup response: ", response);
    storage.saveToken(response);
    return {
      success: true,
      errors: ""
    };
  } catch (error) {
    console.error("signup error: ", error);
    return {
      success: false,
      errors: "try catch error: " + error
    };
  }
};