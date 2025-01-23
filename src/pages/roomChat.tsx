import { Avatar } from "@/components/ui/avatar";
import { Box, Center, Flex, Heading } from "@chakra-ui/react";
import { useState } from "react";

const RoomChat = () => {
    const [roomName, setRoomName] = useState('taki');
    const [roomAvatarSrc, setRoomAvatarSrc] = useState('https://i.imgur.com/LtR2mmT.png');

    const ChatHeader = () => {
        return (
            <Box
                height={'100px'}
                backgroundColor={'gray.900'}
                borderRadius={'lg'}
                margin={'20px'}
                padding={'20px'}
            >
                <Flex direction={'column'} justify={'center'} height={'100%'}>
                    <Flex justify={'flex-start'} gap={'4'}>
                        <Avatar name={roomName} src={roomAvatarSrc} size={'lg'}></Avatar>
                        <Center>
                            <Heading>{roomName}</Heading>
                        </Center>
                    </Flex>
                </Flex>
            </Box>
            
        );
    };



    return (
        <ChatHeader/>
    )
}
export default RoomChat