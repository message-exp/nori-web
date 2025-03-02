import { Button, Text, VStack, Center, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { useState } from "react";
import { useSignupContext } from "@/hooks/use-signup-context";
import { signupService } from "@/services/signup";
import { SignupProvider } from "@/contexts/signup";
import { InputConfirmPassword, InputEmail, InputName, InputPassword } from "@/components/signup";


const SignupForm = () => {

  const navigate = useNavigate();

  const [isSignupLoading, setIsSignupLoading] = useState(false);
  const [textErrorMessage, setTextErrorMessage] = useState("");

  // 假設 useSignupContext 提供的資料仍然需要
  const {
    name,
    email,
    password,
    confirmPassword,
    checkTrigger,
    setCheckTrigger
  } = useSignupContext();

  const handleSignup = async () => {
    setCheckTrigger(!checkTrigger);
    setIsSignupLoading(true);

    const signupResponse = await signupService.submit({
      name,
      email,
      password,
      confirmPassword
    });

    if (signupResponse.success) {
      setTextErrorMessage("");
      navigate("/roomlist");
    } else {
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

        <InputPassword />

        <InputConfirmPassword />

        <Button
          colorScheme="blue"
          width="full"
          onClick={handleSignup}
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
