import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { useParams } from "react-router";
import { create } from "@bufbuild/protobuf";
import ChatHeader from "@/components/room-chat/ChatHeader";
import ChatFooter from "@/components/room-chat/ChatFooter";
import ChatBody, { RoomMembers } from "@/components/room-chat/ChatBody";
import { storage } from "@/utils/storage/user-storage";
import {
  GetHistoryMessage,
  GetLatestMessage,
  SendMessage,
} from "@/api/message/message-service";
import {
  Message,
  MessageSchema,
} from "@/proto-generated/nori/v0/message/message_pb";
import { UserIdSchema } from "@/proto-generated/nori/v0/user/user_id_pb";
import { GetRoomMembers } from "@/api/room/room-member-service"



const RoomChat = () => {
  const roomName = "taki";
  const roomAvatarSrc = "https://i.imgur.com/LtR2mmT.png";
  const currentRoomId = BigInt(useParams().roomId ?? "");
  const currentUserId = storage.getUserId() ?? BigInt(0);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>("");
  const [roomMembers, setRoomMembers] = useState<RoomMembers>({});
  useEffect(() => {
    (async () =>{
      const roomMembers = await GetRoomMembers(currentRoomId,currentUserId)
      setRoomMembers(roomMembers.members.reduce<Record<string, string>>((roomMemberList, member) => {
        if (member.userId) {
          roomMemberList[member.userId.id.toString()] = member.roomNickname;
        }
        return roomMemberList;
      }, {}))
    })();
    (async () => {
      const historyMessage = await GetHistoryMessage(currentRoomId);
      console.log(historyMessage);
      setChatMessages(historyMessage.messages);
    })();
    (async () => {
      const messageIterator = GetLatestMessage(currentRoomId, currentUserId);
      for await (const msg of messageIterator) {
        console.log("Received message:", msg);
        setChatMessages((prev) => [...prev, msg]);
      }
    })();
  }, [currentRoomId, currentUserId]);
  const sendMessage = async () => {
    if (!inputMessage) {
      throw Error("no message");
    }
    try {
      setIsSending(true);
      await SendMessage(currentRoomId, currentUserId, inputMessage);
      setInputMessage("");
      setChatMessages((prev) => [
        ...prev,
        create(MessageSchema, {
          author: create(UserIdSchema, {
            id: currentUserId ?? BigInt(0),
          }),
          text: inputMessage,
        }),
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Flex direction={"column"} height={"100vh"}>
      <ChatHeader roomName={roomName} roomAvatarSrc={roomAvatarSrc} />
      <Box flex={"1"} overflowY={"auto"}>
        <ChatBody chatMessages={chatMessages} roomMembers={roomMembers}></ChatBody>
      </Box>
      <ChatFooter
        sendMessage={sendMessage}
        setInputMessage={setInputMessage}
        isSending={isSending}
        inputMessage={inputMessage}
      />
    </Flex>
  );
};
export default RoomChat;
