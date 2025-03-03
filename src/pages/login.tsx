import { useState } from "react";
import { Button, Text, VStack, Center, Heading, Image } from "@chakra-ui/react";
import { useNavigate } from "react-router";
import { LoginProvider } from "@/contexts/login";
import { InputEmail, InputPassword } from "@/components/login";
import { useLoginContext } from "@/hooks/use-login-context";
import { loginService } from "@/services/login";

const LoginPage = () => {
  const [flag, setFlag] = useState(1);
  if (flag) {
    return (
      <Welcome setFlag={setFlag} />
    );
  } else {
    return (
      <LoginProvider>
        <LoginForm />
      </LoginProvider>
      
    );
  }
};
const Welcome = ({ setFlag }: { setFlag: (value: number) => void }) => {
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
          onClick={() => setFlag(0)}
        >
                    Log in
        </Button>
      </VStack>
    </Center>

  );

};
const LoginForm = () => {
  const navigate = useNavigate();

  // const [account, setAccount] = useState("");
  // const [password, setPassword] = useState("");

  // const [isEmailError, setIsEmailError] = useState(false);
  // const [emailErrorMessage, setEmailErrorMessage] = useState("");

  // const [isPasswordError, setIsPasswordError] = useState(false);
  // const [passwordErrorMessage, setPasswordErrorMessage] = useState("");

  const [isLoginLoading, setIsLoginLoading] = useState(false);
  const [textErrorMessage, setTextErrorMessage] = useState("");

  

  // function isEmpty(str: string | null | undefined): boolean {
  //   return !str || str.trim() === "";
  // }
  const {
    email,
    password,
    checkTrigger,
    setCheckTrigger
  } = useLoginContext();

  const handleLogin = async () => {
    setCheckTrigger(!checkTrigger);
    setIsLoginLoading(true);
    // let isInputEmpty = false;
    // if (isEmpty(account)) {
    //   setEmailErrorMessage("account empty");
    //   setIsEmailError(true);
    //   isInputEmpty = true;
    // }
    // else {
    //   setEmailErrorMessage("");
    //   setIsEmailError(false);
    // }

    // if (isEmpty(password)) {
    //   setPasswordErrorMessage("password empty");
    //   setIsPasswordError(true);
    //   isInputEmpty = true;
    // }
    // else {
    //   setPasswordErrorMessage("");
    //   setIsPasswordError(false);
    // }

    // if (isInputEmpty) {
    //   setTextErrorMessage("");
    //   setIsLoginLoading(false);
    //   return;
    // }

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

    // try {
    //   const tokenPair = await login(account, password);
    //   console.log("get token pair: ", tokenPair);
    //   storage.saveToken(tokenPair);

    //   setTextErrorMessage("");
    //   setIsLoginLoading(false);

    //   navigate("/roomlist");
    // } catch (error) {
    //   console.log("get error: ", error);
    //   setTextErrorMessage("email or password error");
    //   setIsLoginLoading(false);
    // }
        
  };



  return (
    <Center height="100vh" bg="#1e1e1e" color="white">
      <VStack width="300px">
        <Heading as="h1" size="lg">Login</Heading>
        {/* <Field.Root invalid={isEmailError}>
          <Field.Label>Email</Field.Label>
          <Input
            placeholder="Email"
            value={account}
            onChange={(e) => setAccount(e.target.value)}
            bg="gray.700"
            color="white"
          />
          <Field.ErrorText>{ emailErrorMessage }</Field.ErrorText>
        </Field.Root> */}
        <InputEmail/>

        {/* <Field.Root invalid={isPasswordError}>
          <Field.Label>Password</Field.Label>
          <PasswordInput
            placeholder="Password"
            // type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            bg="gray.700"
            color="white"
          />
          <Field.ErrorText>{passwordErrorMessage}</Field.ErrorText>
        </Field.Root> */}
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
