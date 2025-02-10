import { Avatar } from "@/components/ui/avatar";
import { Box, Button, Center, DialogActionTrigger, Flex, For, Heading, Icon, IconButton, Input, Text, Textarea } from "@chakra-ui/react";
import React, { useState } from "react";
import { RiArrowLeftLine, RiFunctionAddFill, RiMenuFill, RiSendPlane2Fill, RiUserAddFill } from "react-icons/ri";

import {
    DialogBody,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";

import { Field } from "@/components/ui/field";

const RoomChat = () => {
    const [roomName, setRoomName] = useState("taki");
    const [roomAvatarSrc, setRoomAvatarSrc] = useState("https://i.imgur.com/LtR2mmT.png");

    const mockChatData = [
        {
            username: "Alice Chen",
            userAvatar: "https://i.imgur.com/qnKbkZn.png",
            time: "2024-01-15 09:15:23",
            messageContent: ["早安啊！今天天氣真不錯 ☀️"],
        },
        {
            username: "Bob Wang",
            userAvatar: "https://i.imgur.com/fkaFmHl.png",
            time: "2024-01-15 09:15:45",
            messageContent: ["早安～", "準備去上班了嗎？"],
        },
        {
            username: "Carol Lin",
            time: "2024-01-15 09:16:30",
            messageContent: ["各位早安！", "今天公司有團隊會議，別忘記了！"],
        },
        {
            username: "David Lee",
            userAvatar: "https://i.imgur.com/sG9qKLW.png",
            time: "2024-01-15 09:17:15",
            messageContent: ["謝謝提醒！", "差點忘記要開會了 😅"],
        },
        {
            username: "Eva Wu",
            userAvatar: "https://i.imgur.com/k3Lsk5c.png",
            time: "2024-01-15 09:18:00",
            messageContent: ["我已經在公司了", "順便幫大家買了早餐"],
        },
        {
            username: "Frank Chang",
            time: "2024-01-15 09:19:25",
            messageContent: ["Eva 你最好了！", "我等等到了請你喝咖啡 ☕"],
        },
        {
            username: "Grace Liu",
            userAvatar: "https://i.imgur.com/ozYTQkY.png",
            time: "2024-01-15 09:20:10",
            messageContent: ["我可能會晚到一點", "路上塞車了..."],
        },
        {
            username: "Henry Kao",
            userAvatar: "https://i.pravatar.cc/150?img=6",
            time: "2024-01-15 09:21:00",
            messageContent: ["我也遇到塞車", "建議大家改搭捷運"],
        },
        {
            username: "Iris Chen",
            time: "2024-01-15 09:22:15",
            messageContent: ["會議資料我已經準備好了", "等等直接在會議室見吧！"],
        },
        {
            username: "Jack Wu",
            userAvatar: "https://i.pravatar.cc/150?img=7",
            time: "2024-01-15 09:23:30",
            messageContent: [
                "等等會議要討論新專案",
                "我已經把提案文件整理好了",
                "大家可以先預覽一下"
            ],
        },
        {
            username: "Kelly Wang",
            userAvatar: "https://i.pravatar.cc/150?img=8",
            time: "2024-01-15 09:24:45",
            messageContent: ["收到！", "我已經看完文件了，待會討論 👍"],
        },
    ];

    const InviteButton = () => {
        return (
            <Button variant={"surface"}>
                <Center inline gap={"2"}>
                    <Icon size={"xl"}>
                        <RiUserAddFill />
                    </Icon>
                    <Heading size={"2xl"}>Invite</Heading>
    
                </Center>
            </Button>
        );
    };

    const InviteDialog = () => {
        return (
            <DialogRoot>
                <DialogTrigger>
                    <InviteButton></InviteButton>
                </DialogTrigger>
    
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle >
                            <Heading size={"2xl"}>Invite User</Heading>
                        </DialogTitle>
                                
                    </DialogHeader>
                    <DialogBody>
                        <Field label="User name">
                            <Input placeholder="username" />
                        </Field>
                    </DialogBody>
                    <DialogFooter>
                        <DialogActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogActionTrigger>
                        <Button>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </DialogRoot>
        );
    };

    const ChatHeader = () => {
        return (
            <Box
                height={"70px"}
                backgroundColor={"gray.900"}
                padding={"15px"}
            >
                <Flex direction={"column"} justify={"center"} height={"100%"}>
                    <Flex justify={"space-between"} direction={"row"}>
                        <Flex justify={"flex-start"} gap={"4"}>
                            <Center>
                                <IconButton rounded={"full"} variant={"subtle"} size={"xl"}>
                                    <RiArrowLeftLine />
                                </IconButton>
                            </Center>

                            <Avatar name={roomName} src={roomAvatarSrc} size={"lg"}></Avatar>
                            <Center>
                                <Heading>{roomName}</Heading>
                            </Center>
                        </Flex>
                        <InviteDialog></InviteDialog>
                    </Flex>
                </Flex>
            </Box>
            
        );
    };

    interface MessageUnitProps {
        userAvatar?: string;
        username: string;
        time: string;
        messageContent: string[]; 
    }

    const colorPaletteForRandom = ["red", "blue", "green", "yellow", "purple", "orange"];
    const pickPalette = (name: string) => {
        const index = name.charCodeAt(0) % colorPaletteForRandom.length;
        return colorPaletteForRandom[index];
    };

    const MessageUnit: React.FC<MessageUnitProps> = (
        { userAvatar, username, time, messageContent }) =>
    {
        return (
            <Box
                padding={"10px"}
            >
                <Flex gap={"4"}> 
                    <Avatar
                        src={userAvatar}
                        name={username}
                        colorPalette={pickPalette(username)}
                    />
                    <Flex direction={"column"} gap={"2"}>
                        <Flex gap={"2"} alignItems={"baseline"}>
                            <Text textStyle={"2xl"}>{username}</Text>

                            <Text textStyle={"xs"}>{time}</Text>
                        </Flex>
                        <Box>
                            <For each={messageContent}>
                                {(item, _) => <Text>{item}</Text>}
                            </For>
                        </Box>
                        

                    </Flex>
                </Flex>
            </Box>
        );
    };

    const ChatBody = () => {
        return (
            <Box height={"100%"} >
                <Flex direction={"column"} maxHeight={"100%"}>
                    <For each={mockChatData}>
                        {(item, _) =>
                            <MessageUnit
                                userAvatar={item.userAvatar}
                                username={item.username}
                                time={item.time}
                                messageContent={item.messageContent}
                            />
                        }
                    </For>
                </Flex>
                
            </Box> 
        );
    };

    const ChatFooter = () => {
        return (
            <Box background={"gray.900"} height={"80px"} padding={"20px"}>
                <Flex direction={"column"} height={"100%"} justifyContent={"center"}>
                    <Flex>
                        <Textarea
                            placeholder="Comment..."
                            variant={"outline"}
                            resize={"none"}

                        />
                        <IconButton rounded={"full"} variant={"subtle"}>
                            <RiFunctionAddFill />
                        </IconButton>
                        <IconButton rounded={"full"} variant={"subtle"}>
                            <RiMenuFill />
                        </IconButton>
                        <IconButton rounded={"full"} variant={"subtle"}>
                            <RiSendPlane2Fill />
                        </IconButton>
                    </Flex>
                    
                </Flex>
            </Box>
        );
    };



    return (
        <Flex direction={"column"} height={"100vh"}>
            <ChatHeader />
            <Box flex={"1"} overflowY={"auto"} >
                <ChatBody></ChatBody>
            </Box>
            <ChatFooter/>
        </Flex>
        
    );
};
export default RoomChat;