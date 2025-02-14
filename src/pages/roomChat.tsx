import { Avatar } from "@/components/ui/avatar";
import { Box, Button, Center, DialogActionTrigger, Flex, For, Heading, Icon, IconButton, Input, Text, Textarea } from "@chakra-ui/react";
import React, { useEffect, useRef, useState } from "react";
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
import { useLocation } from "react-router";
import { storage } from "@/utils/storage/user-storage";
import { GetRoom } from "@/api/room/room-service";
import { Room } from "@/proto-generated/nori/v0/room/room_pb";
import { Message } from "@/proto-generated/nori/v0/message/message_pb";
import { GetMessage, SendMessage } from "@/api/message/message-service";
import { UserId } from "@/proto-generated/nori/v0/user/user_id_pb";
import { GetUser } from "@/api/user/user-service";
import { User } from "@/proto-generated/nori/v0/user/user_pb";

interface LocationState {
    roomid: bigint;
}

const RoomChat = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [roomName, setRoomName] = useState("taki");
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [roomAvatarSrc, setRoomAvatarSrc] = useState("https://i.imgur.com/LtR2mmT.png");

    const [currentUser, setCurrentUser] = useState<User>();

    const [currentRoom, setCurrentRoom] = useState<Room>();

    const [chatMessages, setChatMessages] = useState<Message[]>([]);

    const location = useLocation();
    const state = location.state as LocationState;

    const handleLoadMessage = async () => {

        // TODO: find how to solve it
        if (!currentRoom?.roomId?.id) {
            throw new Error("roomid undifined");
        }
        const messages = GetMessage(currentRoom?.roomId?.id);
        for await (const message of messages) {
            const isDuplicate = chatMessages.some(existingMsg => existingMsg.messageId === message.messageId);

            // 如果不是重複的，才加入到 chatMessages
            if (!isDuplicate) {
                setChatMessages([...chatMessages, message]);
            }
        }
    }

    useEffect(() => {
        const handleLoadUser = async () => {
            const userid = storage.getUserAuth()?.userId;
            if (!userid) {
                throw new Error("userid undifinded");
            }
            const user = await GetUser(userid.id);
            setCurrentUser(user);
        }

        handleLoadUser();

        const handleLoadRoom = async () => {
            if (state?.roomid) {
                // 在這裡使用 roomid 做你想要的操作
                console.log('Room ID:', state.roomid);

                if (!currentUser?.userId) {
                    throw new Error("currentUser undifinded");
                }
                
                const room = await GetRoom(state.roomid, currentUser?.userId.id);
                setCurrentRoom(room);

                setRoomName(room.customName || room.sharedName);

                setRoomAvatarSrc(room.customAvatarUrl || room.sharedAvatarUrl);
                

                // 例如：
                // fetchRoomData(state.roomid);
                // connectToRoom(state.roomid);
            }
        }
        handleLoadRoom();

        handleLoadMessage();

        
        
    }, [state?.roomid]);


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
        author?: UserId;
        time?: string;
        messageContent: string; 
    }

    const colorPaletteForRandom = ["red", "blue", "green", "yellow", "purple", "orange"];
    const pickPalette = (name: string) => {
        const index = name.charCodeAt(0) % colorPaletteForRandom.length;
        return colorPaletteForRandom[index];
    };

    const MessageUnit: React.FC<MessageUnitProps> = (
        { author, time, messageContent }) =>
    {
        let userAvatar;
        let username;
        useEffect(() => {
            const loadAuthor = async () => {
                if (!author) {
                    throw new Error("author undifinded");
                }
                const authorUser = await GetUser(author.id);
                userAvatar = authorUser.avatarUrl;
                username = authorUser.username;
            };
            loadAuthor();

        }, []);
        


        return (
            <Box
                padding={"10px"}
            >
                <Flex gap={"4"}> 
                    <Avatar
                        src={userAvatar}
                        name={username}
                        colorPalette={pickPalette(username ?? "")}
                    />
                    <Flex direction={"column"} gap={"2"}>
                        <Flex gap={"2"} alignItems={"baseline"}>
                            <Text textStyle={"2xl"}>{username}</Text>

                            <Text textStyle={"xs"}>{time}</Text>
                        </Flex>
                        <Box>
                            <Text>{ messageContent }</Text>
                        
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
                    <For each={chatMessages}>
                        {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                        {(message, _) =>
                            <MessageUnit
                                // userAvatar={message.}
                                author={message.author}
                                time={message.createdAt?.seconds
                                    ? new Date(Number(message.createdAt.seconds) * 1000).toISOString()
                                    : new Date().toISOString()}
                                messageContent={message.text}
                            />
                        }
                    </For>
                </Flex>
                
            </Box> 
        );
    };

    const [inputMessage, setInputMessage] = useState("");

    const handleSendMessage = async () => {
        try {
            if (!currentRoom?.roomId) {
                throw new Error("current room id undifinded");
            }
            if (!currentUser?.userId) {
                throw new Error("current user id undifinded");
            }
            await SendMessage(currentRoom?.roomId.id, currentUser.userId.id, inputMessage);
        } catch (error) {
            console.error(error);
        }
    }

    const ChatFooter = () => {
        return (
            <Box background={"gray.900"} height={"80px"} padding={"20px"}>
                <Flex direction={"column"} height={"100%"} justifyContent={"center"}>
                    <Flex>
                        <Textarea
                            placeholder="Comment..."
                            variant={"outline"}
                            resize={"none"}
                            value={inputMessage}
                            onChange={(e) => {setInputMessage(e.target.value)}}
                        />
                        <IconButton rounded={"full"} variant={"subtle"}>
                            <RiFunctionAddFill />
                        </IconButton>
                        <IconButton rounded={"full"} variant={"subtle"}>
                            <RiMenuFill />
                        </IconButton>
                        <IconButton rounded={"full"} variant={"subtle"} onClick={() => { handleSendMessage() }}>
                            <RiSendPlane2Fill />
                        </IconButton>
                    </Flex>
                    
                </Flex>
            </Box>
        );
    };

    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    }, []); // 只在組件掛載時執行一次



    return (
        <Flex direction={"column"} height={"100vh"}>
            <ChatHeader />
            <Box flex={"1"} overflowY={"auto"} ref={containerRef} >
                <ChatBody></ChatBody>
            </Box>
            <ChatFooter/>
        </Flex>
        
    );
};
export default RoomChat;