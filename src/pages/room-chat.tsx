import { Box, Flex } from "@chakra-ui/react";
import { useEffect, useState } from "react";

import ChatHeader from "@/components/room-chat/ChatHeader";
import ChatFooter from "@/components/room-chat/ChatFooter";
import ChatBody from "@/components/room-chat/ChatBody";
import { RoomMembersProvider } from "@/contexts/room-chat/RoomMembersProvider";
import { storage } from "@/utils/storage/user-storage";
import { Message, MessageSchema } from "@/proto-generated/nori/v0/message/message_pb";
import { GetLatestMessage, SendMessage } from "@/api/message/message-service";
import { useParams } from "react-router";
import { create } from "@bufbuild/protobuf";
import { UserIdSchema } from "@/proto-generated/nori/v0/user/user_id_pb";

const RoomChat = () => {
  const [roomName, setRoomName] = useState("taki");
  const [roomAvatarSrc, setRoomAvatarSrc] = useState(
    "https://i.imgur.com/LtR2mmT.png"
  );
  const currentRoomId = BigInt(useParams().roomId ?? "");
  const currentUserId = storage.getUserId() ?? BigInt(0);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  const [isSending, setIsSending] = useState<boolean>(false);
  const [inputMessage, setInputMessage] = useState<string>("");

  useEffect(() => {
    (async () => {
      try {
        const messageIterator = GetLatestMessage(currentRoomId, currentUserId);
        for await (const msg of messageIterator) {
          console.log("Received message:", msg);
          setChatMessages((prev) => [...prev, msg]);
        }
      } catch (err: any) {
        console.error("Error during manual test:", err);
      }
    })();
  }, []);
  const sendMessage = async () => {
    if (!inputMessage) {
      throw Error("no message");
    }
    try{
      setIsSending(true);
      await SendMessage(
        currentRoomId,
        currentUserId,
        inputMessage
      );
      setChatMessages((prev)=>([...prev, create(MessageSchema, {
        author: create(UserIdSchema, {
          id: currentUserId ?? BigInt(0),
        }),
        text: inputMessage,
      })]));
    }finally{
      setIsSending(false);
    } 
  };

  return (
    <RoomMembersProvider>
      <Flex direction={"column"} height={"100vh"}>
        <ChatHeader roomName={roomName} roomAvatarSrc={roomAvatarSrc} />
        <Box flex={"1"} overflowY={"auto"}>
          <ChatBody chatMessages={chatMessages}></ChatBody>
        </Box>
        <ChatFooter
          sendMessage={sendMessage}
          setInputMessage={setInputMessage}
          isSending={isSending}
          inputMessage={inputMessage}
        />
      </Flex>
    </RoomMembersProvider>
  );
};
export default RoomChat;

// const handleLoadMessage = useCallback(async () => {
//   if (!currentRoom?.roomId?.id) {
//     throw new Error("roomid undefined");
//   }
//   const messages = GetMessage(currentRoom.roomId.id);

//   // 使用函數式更新來避免依賴 chatMessages
//   for await (const message of messages) {
//     setChatMessages((prevMessages) => {
//       const isDuplicate = prevMessages.some(
//         (existingMsg) => existingMsg.messageId === message.messageId
//       );
//       // 如果不是重複的，才加入新消息
//       return isDuplicate ? prevMessages : [...prevMessages, message];
//     });
//   }
// }, [currentRoom?.roomId?.id]);
