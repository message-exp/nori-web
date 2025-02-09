import { useState } from "react";
import { Button, Text, VStack, Center, Heading } from "@chakra-ui/react";
import TextInput from "@/components/auth/TextInput";
import { useNavigate } from "react-router";
import { signup } from "@/api/user/user-service";


const SignupPage = () => {

    const navigate = useNavigate();

    const [name, setName] = useState("");
    const [isNameValid, setNameValid] = useState(true);
    const [nameErrorMessage, setNameErrorMessage] = useState("");


    const [email, setEmail] = useState("");
    const [isEmailValid, setEmailValid] = useState(true);
    const [emailErrorMessage, setEmailErrorMessage] = useState("");


    const [password, setPassword] = useState("");
    const [isPasswordValid, setPasswordValid] = useState(true);
    const [passwordErrorMessage, setPasswordErrorMessage] = useState("");
    
    const [confirmPassword, setconfirmPassword] = useState("");
    const [isConfirmPasswordValid, setIsConfirmPasswordValid] = useState(true);
    const [confirmPasswordErrorMessage, setConfirmPasswordErrorMessage] = useState("");

    const [isSignupLoading, setIsSignupLoading] = useState(false);
    const [textErrorMessage, setTextErrorMessage] = useState("");

    const handlePasswordConfirm = (inputConfirm: string) => {
        if (password !== inputConfirm) {
            console.log("not same----");
            console.log("password: ", password);
            console.log("confirm: ", inputConfirm);
            console.log("----")
            setIsConfirmPasswordValid(false);
            setConfirmPasswordErrorMessage("it's not same as password");
            return false;
        }
        else
        {
            console.log("is same");
            setIsConfirmPasswordValid(true);
            setConfirmPasswordErrorMessage("");
            return true;
        }
    }

    const signupFunc = async () => {

        setIsSignupLoading(true);

        // init
        setTextErrorMessage("");
        setNameValid(true);
        setNameErrorMessage("");
        setEmailValid(true);
        setEmailErrorMessage("");
        setPasswordValid(true);
        setPasswordErrorMessage("");



        console.log('name: ' + name);
        console.log('email: ' + email);
        console.log('password: ' + password);
        console.log('confirm password: ' + confirmPassword);

        let verify_checked = true;


        // verify
        // name
        if (!name || name.trim() === "") {
            setNameValid(false);
            setNameErrorMessage("name empty");
            verify_checked = false;
        }

        // email
        if (!email || !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(email)) {
            setEmailValid(false);
            setEmailErrorMessage("email not valid");
            verify_checked = false;
        }

        // password
        if (!password || password.trim() === '') {
            setPasswordValid(false);
            setPasswordErrorMessage("email not valid");
            verify_checked = false;
        }

        // confirm password
        if (!handlePasswordConfirm(confirmPassword)) {
            verify_checked = false;   
        }

        if (verify_checked === false) {
            console.log("verify not checked");
        }
        else {
            try {
                const response = await signup(name, email, password);
                console.log("response: ", response);
                navigate('/roomlist');
            } catch (error) {
                console.log("error: ", error)
                setTextErrorMessage("have error");
            }
        }

        setIsSignupLoading(false);
    };

    return (
        <Center height="100vh" bg="#1e1e1e" color="white">
            <VStack width="320px">
                <Heading as="h1" size="lg">Signup</Heading>
                <TextInput
                    title="Name"
                    placeholder="Name"
                    invalid={!isNameValid}
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    errorMessage={nameErrorMessage}
                    
                />
                <TextInput
                    title="Email"
                    placeholder="Email"
                    invalid={!isEmailValid}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    errorMessage={emailErrorMessage}
                    
                />
                <TextInput
                    title="Password"
                    placeholder="Password"
                    invalid={!isPasswordValid}
                    password
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    errorMessage={passwordErrorMessage}
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
