import { useState } from 'react';
import { Box, Button, Input, Text, VStack, Center, Heading } from '@chakra-ui/react';

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

  const loginFunc = () => {
    console.log('account: ' + account);
    console.log('password: ' + password);
    /* 串接API */
  };
  return (
    <Center height="100vh" bg="#1e1e1e" color="white">
      <VStack width="300px">
        <Heading as="h1" size="lg">Login</Heading>
        <Input
          placeholder="Email"
          value={account}
          onChange={(e) => setAccount(e.target.value)}
          bg="gray.700"
          color="white"
        />
        <Input
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          bg="gray.700"
          color="white"
        />
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
