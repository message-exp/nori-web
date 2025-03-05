import { Avatar } from "@/components/ui/avatar";
import {
  Box,
  Flex,
  For,
  Text,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";

import ChatHeader from "@/components/room-chat/ChatHeader";
import ChatFooter from "@/components/room-chat/ChatFooter";
import { storage } from "@/utils/storage/user-storage";
import { Room } from "@/proto-generated/nori/v0/room/room_pb";
import { Message } from "@/proto-generated/nori/v0/message/message_pb";
import { GetMessage, SendMessage } from "@/api/message/message-service";
import { UserId } from "@/proto-generated/nori/v0/user/user_id_pb";
import { GetUser } from "@/api/user/user-service";
import { User } from "@/proto-generated/nori/v0/user/user_pb";

const RoomChat = () => {
  const [roomName, setRoomName] = useState("taki");
  const [roomAvatarSrc, setRoomAvatarSrc] = useState(
    "https://i.imgur.com/LtR2mmT.png"
  );

  const [currentUser, setCurrentUser] = useState<User>();

  const [currentRoom, setCurrentRoom] = useState<Room>();

  const [chatMessages, setChatMessages] = useState<Message[]>([]);


  const handleLoadMessage = useCallback(async () => {
    if (!currentRoom?.roomId?.id) {
      throw new Error("roomid undefined");
    }
    const messages = GetMessage(currentRoom.roomId.id);

    // 使用函數式更新來避免依賴 chatMessages
    for await (const message of messages) {
      setChatMessages((prevMessages) => {
        const isDuplicate = prevMessages.some(
          (existingMsg) => existingMsg.messageId === message.messageId
        );
        // 如果不是重複的，才加入新消息
        return isDuplicate ? prevMessages : [...prevMessages, message];
      });
    }
  }, [currentRoom?.roomId?.id]);

  useEffect(() => {
    const handleLoadUser = async () => {
      const userAuth = storage.getUserAuth();
      if (!userAuth?.userId) {
        console.error("User ID is not available");
        return;
      }
      const user = await GetUser(userAuth.userId.valueOf());
      setCurrentUser(user);
    };

    handleLoadUser();
  }, [ currentUser?.userId, handleLoadMessage]);

  interface MessageUnitProps {
    author?: UserId;
    time?: string;
    messageContent: string;
  }

  const colorPaletteForRandom = [
    "red",
    "blue",
    "green",
    "yellow",
    "purple",
    "orange",
  ];
  const pickPalette = (name: string) => {
    const index = name.charCodeAt(0) % colorPaletteForRandom.length;
    return colorPaletteForRandom[index];
  };

  const MessageUnit: React.FC<MessageUnitProps> = ({
    author,
    time,
    messageContent,
  }) => {
    const [userAvatar, setUserAvatar] = useState<string>("");
    const [username, setUsername] = useState<string>("");

    useEffect(() => {
      const loadAuthor = async () => {
        if (!author) {
          throw new Error("author undefined");
        }
        const authorUser = await GetUser(author.id);
        setUserAvatar(authorUser.avatarUrl);
        setUsername(authorUser.username);
      };
      loadAuthor();
    }, [author]);

    return (
      <Box padding={"10px"}>
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
              <Text>{messageContent}</Text>
            </Box>
          </Flex>
        </Flex>
      </Box>
    );
  };

  const ChatBody = () => {
    return (
      <Box height={"100%"}>
        <Flex direction={"column"} maxHeight={"100%"}>
          <For each={chatMessages}>
            {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
            {(message, _) => (
              <MessageUnit
                // userAvatar={message.}
                author={message.author}
                time={
                  message.createdAt?.seconds
                    ? new Date(
                      Number(message.createdAt.seconds) * 1000
                    ).toISOString()
                    : new Date().toISOString()
                }
                messageContent={message.text}
              />
            )}
          </For>
        </Flex>
      </Box>
    );
  };

  return (
    <Flex direction={"column"} height={"100vh"}>
      <ChatHeader roomName={roomName} roomAvatarSrc={roomAvatarSrc} />
      <Box flex={"1"} overflowY={"auto"}>
        <ChatBody></ChatBody>
      </Box>
      <ChatFooter />
    </Flex>
  );
};
export default RoomChat;
