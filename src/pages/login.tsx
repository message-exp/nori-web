import { useState } from "react";
import { Button, Text, VStack, Center, Heading, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { LoginProvider } from "@/contexts/login";
import { InputEmail, InputPassword } from "@/components/login";
import { useLoginContext } from "@/hooks/use-login-context";
import { loginService } from "@/services/login";

const LoginPage = () => {
  const [isShowWelcome, setIsShowWelcome] = useState(true);
  if (isShowWelcome) {
    return (
      <Welcome setState={setIsShowWelcome} />
    );
  } else {
    return (
      <LoginProvider>
        <LoginForm />
      </LoginProvider>
      
    );
  }
};
const Welcome = ({ setState }: { setState: (value: boolean) => void }) => {
  return (
    <Center height="100vh" bg="#1e1e1e" color="white">
      <VStack>
        <Image
          src="main.jpg"
          boxSize="96px"
          borderRadius="full"
          fit="cover"
          alt="main"
        />
        <Heading as="h1" size="lg">
                    Welcome to Nori
        </Heading>
        <Button
          colorScheme="gray"
          onClick={() => setState(false)}
        >
                    Log in
        </Button>
      </VStack>
    </Center>

  );

};
const LoginForm = () => {
  const navigate = useNavigate();

  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [textErrorMessage, setTextErrorMessage] = useState("");

  const {
    email,
    password,
    checkTrigger,
    setCheckTrigger
  } = useLoginContext();

  const handleLogin = async () => {
    setCheckTrigger(!checkTrigger);
    setIsLoginLoading(true);

    const loginResponse = await loginService.submit({
      email,
      password
    });

    if (loginResponse.success) {
      setTextErrorMessage("");
      navigate("/roomlist");
    } else {
      setTextErrorMessage(loginResponse.errors);
    }

    setIsLoginLoading(false);
  
  };



  return (
    <Center height="100vh" bg="#1e1e1e" color="white">
      <VStack width="300px">
        <Heading as="h1" size="lg">Login</Heading>

        <InputEmail />
        
        <InputPassword/>
                
                
        <Button
          width="full"
          onClick={handleLogin}
          loading={isLoginLoading}
        >
                    Login
        </Button>

        <Text color={"red.400"}>{ textErrorMessage }</Text>


        <Button onClick={() => navigate("/signup")} textDecor={"underline"} variant={"plain"}>
                    Signup if you don't have an account
        </Button>
      </VStack>
    </Center>
  );
};

export default LoginPage;
