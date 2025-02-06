import { useState } from 'react';
import { Box, Button, Input, Text, VStack, Center, Heading, Field, Image } from '@chakra-ui/react';
import { PasswordInput } from '@/components/ui/password-input';
import { useNavigate } from 'react-router';
import { login } from '@/api/user/user-service';

const LoginPage = () => {
    const [flag, setFlag] = useState(1);
    if (flag) {
        return (
            <Welcome setFlag={setFlag} />
        );
    } else {
        return (
            <Login/>
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

    )

}
const Login = () => {
    const navigate = useNavigate();

    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');

    const [isEmailError, setIsEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');

    const [isPasswordError, setIsPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    const [textErrorMessage, setTextErrorMessage] = useState('');

    const [isLoginLoading, setIsLoginLoading] = useState(false);

    function isEmpty(str: string | null | undefined): boolean {
        return !str || str.trim() === "";
    }

    const loginFunc = async() => {
        console.log('account: ' + account);
        console.log('password: ' + password);
        /* 串接API */
        setTextErrorMessage("");
        setIsLoginLoading(true);
        let isInputEmpty = false;
        if (isEmpty(account))
        {
            setEmailErrorMessage("account empty");
            setIsEmailError(true);
            isInputEmpty = true;
        }
        else
        {
            setEmailErrorMessage("")
            setIsEmailError(false);
        }

        if (isEmpty(password)) {
            setPasswordErrorMessage("password empty")
            setIsPasswordError(true);
            isInputEmpty = true;
        }
        else {
            setPasswordErrorMessage("")
            setIsPasswordError(false);
        }

        if (isInputEmpty) {
            return;
        }

        try {
            const response = await login(account, password);
            setTextErrorMessage("");
            setIsLoginLoading(false);
            navigate("/roomlist");
        } catch (error) {
            console.log("get error: ", error);
            setTextErrorMessage("email or password error");
            setIsLoginLoading(false);
        }
        

        //below just for demo
        // if (account == "test" && password == "test")
        // {
        //     setTextErrorMessage("");
        //     navigate("/roomlist");
        // }
        // else
        // {
        //     setTextErrorMessage("email or password error");
        // }
        
    };



    return (
        <Center height="100vh" bg="#1e1e1e" color="white">
            <VStack width="300px">
                <Heading as="h1" size="lg">Login</Heading>
                <Field.Root invalid={isEmailError}>
                    <Field.Label>Email</Field.Label>
                    <Input
                        placeholder="Email"
                        value={account}
                        onChange={(e) => setAccount(e.target.value)}
                        bg="gray.700"
                        color="white"
                    />
                    <Field.ErrorText>{ emailErrorMessage }</Field.ErrorText>
                </Field.Root>

                <Field.Root invalid={isPasswordError}>
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
                </Field.Root>
                
                
                <Button
                    width="full"
                    onClick={loginFunc}
                    loading={isLoginLoading}
                >
                    Login
                </Button>

                <Text color={'red.400'}>{ textErrorMessage }</Text>


                <Button onClick={() => navigate('/signup')} textDecor={'underline'} variant={'plain'}>
                    Signup if you don't have an account
                </Button>
            </VStack>
        </Center>
    )
}

export default LoginPage;
