import { Button, Text, VStack, Center, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { InputName } from "@/components/signup/InputName";
import { SignupProvider, useSignup } from "@/contexts/SignupContext";
import { InputEmail } from "@/components/signup/InputEmail";
import { InputPassword } from "@/components/signup/InputPassword";
import { InputConfirmPassword } from "@/components/signup/InputComfirmPassword";
import { useSignupFunc } from "@/hooks/useSignup";
import { useState } from "react";


const SignupForm = () => {

  const navigate = useNavigate();
  const signupFunc = useSignupFunc;

  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [textErrorMessage, setTextErrorMessage] = useState("");

  const {
    name,
    email,
    password,
    confirmPassword,
    checkTrigger,
    setCheckTrigger
  } = useSignup();

  const signupButtonClick = async () => {
    setCheckTrigger(!checkTrigger);
    setIsSignupLoading(true);
    console.log("name: ", name);
    console.log("email: ", email);
    console.log("password: ", password);
    console.log("comfirm password", confirmPassword);

    const signupResponse = await signupFunc(name, email, password, confirmPassword);
    if (signupResponse.success === true) {
      setTextErrorMessage("");
      navigate("/roomlist");
    }
    else {
      setTextErrorMessage(signupResponse.errors);
    }
    setIsSignupLoading(false);

  };

  return (
    <Center height="100vh" bg="#1e1e1e" color="white">
      <VStack width="320px">
        <Heading as="h1" size="lg">Signup</Heading>

        <InputName />
        
        <InputEmail />
        
        <InputPassword/>

        <InputConfirmPassword/>

        <Button
          colorScheme="blue"
          width="full"
          onClick={signupButtonClick}
          loading={isSignupLoading}
        >
                    Sign Up
        </Button>

        <Text color={"red.400"}>{textErrorMessage}</Text>

        <Button onClick={() => navigate("/login")} textDecor={"underline"} variant={"plain"}>
                    Login if you have an account
        </Button>
      </VStack>
    </Center>
  );
};

const SignupPage = () => {
  return (
    <SignupProvider>
      <SignupForm />
    </SignupProvider>
  );
};

export default SignupPage;
