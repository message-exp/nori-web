import { Avatar } from "@/components/ui/avatar";
import { Box, Center, Flex, For, Heading, Text } from "@chakra-ui/react";
import { useState } from "react";

const RoomChat = () => {
    const [roomName, setRoomName] = useState('taki');
    const [roomAvatarSrc, setRoomAvatarSrc] = useState('https://i.imgur.com/LtR2mmT.png');

    const roomChatDesignStyle = {
        backgroundColor: 'gray.900',
        borderRadius: 'lg',
        // margin: '20px',
        padding: '20px'
    }

    const ChatHeader = () => {
        return (
            <Box
                height={'100px'}
                {...roomChatDesignStyle}
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

    const test_chat_content = [
        "this is a test message ",
        "",
        "it can text here ",
        "hi!there!"
    ]

    const MessageUnit = () => {
        return (
            <Box
                padding={'10px'}
            >
                <Flex gap={'4'}> 
                    <Avatar></Avatar>
                    <Flex direction={'column'} gap={'2'}>
                        <Flex gap={'2'} alignItems={'baseline'}>
                            <Text textStyle={'2xl'}>username</Text>

                            <Text textStyle={'xs'}>time</Text>
                        </Flex>
                        <Box>
                            <For each={test_chat_content}>
                                {(item, index) => <Text>{item}</Text>}
                            </For>
                        </Box>
                        

                    </Flex>
                </Flex>
            </Box>
        )
    }



    return (
        <Flex direction={'column'}>
            <ChatHeader />
            <Box borderWidth={'1px'}>
                <Text>message unit test </Text>
                <MessageUnit />
                <MessageUnit />
                <MessageUnit />
            </Box>
        </Flex>
        
    )
}
export default RoomChat