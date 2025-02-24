import { Button, Text, VStack, Center, Heading } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { InputName } from "@/components/signup/InputName";
import { SignupProvider } from "@/contexts/SignupContext";
import { InputEmail } from "@/components/signup/InputEmail";
import { InputPassword } from "@/components/signup/InputPassword";
import { InputConfirmPassword } from "@/components/signup/InputComfirmPassword";
import { useSignupSubmit } from "@/hooks/use-signup-submit";


const SignupForm = () => {

  const navigate = useNavigate();
  
  const {
    isSignupLoading,
    textErrorMessage,
    handleSignup,
  } = useSignupSubmit();

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
