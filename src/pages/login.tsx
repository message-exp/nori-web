import { useState } from 'react';
import { Box, Button, Input, Text, VStack, Center, Heading, Field } from '@chakra-ui/react';
import { PasswordInput } from '@/components/ui/password-input';

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
                <Box
                    width="96px"
                    height="96px"
                    bg="gray.600"
                    borderRadius="full"
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
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');

    const [isEmailError, setIsEmailError] = useState(false);
    const [emailErrorMessage, setEmailErrorMessage] = useState('');

    const [isPasswordError, setIsPasswordError] = useState(false);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState('');

    function isEmpty(str: string | null | undefined): boolean {
        return !str || str.trim() === "";
    }

    const loginFunc = () => {
        console.log('account: ' + account);
        console.log('password: ' + password);
        /* 串接API */
        // below just for testing
        if (isEmpty(account))
        {
            setEmailErrorMessage("account empty")
            setIsEmailError(true);
        }
        else
        {
            setEmailErrorMessage("")
            setIsEmailError(false);
        }

        if (isEmpty(password)) {
            setPasswordErrorMessage("password empty")
            setIsPasswordError(true);
        }
        else {
            setPasswordErrorMessage("")
            setIsPasswordError(false);
        }
        
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
                
                
                <Button colorScheme="blue" width="full" onClick={loginFunc}>
                    Login
                </Button>
                <Text>
                    <a href="/signup">Signup if you don't have an account</a>
                </Text>
            </VStack>
        </Center>
    )
}

export default LoginPage;
