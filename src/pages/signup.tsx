import { useState } from "react";
import { Button, Input, Text, VStack, Center, Heading } from "@chakra-ui/react";
import TextInput from "@/components/auth/TextInput";


const SignupPage = () => {
    const [name, setName] = useState('');
    const [account, setAccount] = useState('');
    const [password, setPassword] = useState('');

    const signupFunc = () => {
        console.log('name ' + name);
        console.log('account ' + account);
        console.log('password ' + password);
        /* 串接API */
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
                    // type="password"
                    password
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button colorScheme="blue" width="full" onClick={signupFunc}>
                    Sign Up
                </Button>
                <Text>
                    <a href="/login" style={{ color: 'white' }}>Login if you have an account</a>
                </Text>
            </VStack>
        </Center>
    );
};

export default SignupPage;
