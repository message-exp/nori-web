import { useState } from "react";
import { Button, Text, VStack, Center, Heading } from "@chakra-ui/react";
import TextInput from "@/components/auth/TextInput";
import { useNavigate } from "react-router";


const SignupPage = () => {

    const navigate = useNavigate();

    const [name, setName] = useState('');
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');
    
    const [confirmPassword, setconfirmPassword] = useState('');
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");

    const [isSignupLoading, setIsSignupLoading] = useState(false);
    const [textErrorMessage, setTextErrorMessage] = useState("");

    const handlePasswordConfirm = (inputConfirm: string) => {
        if (password !== inputConfirm) {
            console.log("not same");
            console.log("password: ", password);
            console.log("confirm: ", inputConfirm);
            setIsConfirmPasswordValid(false);
            setConfirmPasswordErrorMessage("it's not same as password");

        }
        else
        {
            console.log("is same");
            setIsConfirmPasswordValid(true);
            setConfirmPasswordErrorMessage("");
        }
    }

    const signupFunc = async () => {

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


        setIsSignupLoading(true);
        setTextErrorMessage("");
        console.log('name: ' + name);
        console.log('account: ' + account);
        console.log('password: ' + password);
        console.log('confirm password: ' + confirmPassword);
        /* 串接API */

        // below just for testing
        await delay(3000);
        setTextErrorMessage("have error");

        

        setIsSignupLoading(false);
    };

    return (
        <Center height="100vh" bg="#1e1e1e" color="white">
            <VStack width="320px">
                <Heading as="h1" size="lg">Signup</Heading>
                <TextInput
                    title="Name"
                    placeholder="Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />
                <TextInput
                    title="Email"
                    placeholder="Email"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                />
                <TextInput
                    title="Password"
                    placeholder="Password"
                    password
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <TextInput
                    placeholder="Confirm Password"
                    invalid={!isConfirmPasswordValid}
                    password
                    value={confirmPassword}
                    onChange={(e) => {
                        setconfirmPassword(e.target.value);
                        handlePasswordConfirm(e.target.value);
                    }}
                    errorMessage={confirmPasswordErrorMessage}
                />
                <Button
                    colorScheme="blue"
                    width="full"
                    onClick={signupFunc}
                    loading={isSignupLoading}
                >
                    Sign Up
                </Button>

                <Text color={'red.400'}>{textErrorMessage}</Text>

                <Button onClick={() => navigate('/login')} textDecor={'underline'} variant={'plain'}>
                    Login if you have an account
                </Button>
            </VStack>
        </Center>
    );
};

export default SignupPage;
