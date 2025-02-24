import { signup } from "@/api/user/user-service";
import { inputEmailCheck } from "@/utils/input-check/input-email-check";
import { inputNullCheck } from "@/utils/input-check/input-null-check";
import { storage } from "@/utils/storage/user-storage";


interface SignupResult {
  success: boolean;
  errors: string;
}

export const useSignupAuth = async (
  inputName: string,
  inputEmail: string,
  inputPassword: string,
  inputConfirmPassword: string
): Promise<SignupResult> => {

  console.log("name: " + inputName);
  console.log("email: " + inputEmail);
  console.log("password: " + inputPassword);
  console.log("confirm password: " + inputConfirmPassword);

  // verify
  // name
  if (inputNullCheck(inputName) === false) {
    return {
      success: false,
      errors: "Name is null"
    };
  }

  // email
  if (inputNullCheck(inputEmail) === false) {
    return {
      success: false,
      errors: "Email is null"
    };
  }
  if (inputEmailCheck(inputEmail) === false) {
    return {
      success: false,
      errors: "Email form error"
    };
  }

  // password
  if (inputNullCheck(inputPassword) === false) {
    return {
      success: false,
      errors: "password is null"
    };
  }

  // confirm password
  if (inputPassword !== inputConfirmPassword) {
    return {
      success: false,
      errors: "password is not same as confirm password"
    };
  }
  
  try {
    const response = await signup(inputName, inputEmail, inputPassword);
    console.log("get signup reponse: ", response);
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