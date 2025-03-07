import { Box, Flex } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";

import ChatHeader from "@/components/room-chat/ChatHeader";
import ChatFooter from "@/components/room-chat/ChatFooter";
import ChatBody from "@/components/room-chat/ChatBody";
import { RoomMembersProvider } from "@/contexts/room-chat/RoomMembersProvider";
import { storage } from "@/utils/storage/user-storage";
import { Room } from "@/proto-generated/nori/v0/room/room_pb";
import { Message } from "@/proto-generated/nori/v0/message/message_pb";
// import { GetMessage } from "@/api/message/message-service
// import { GetUser } from "@/api/user/user-service";
import { User } from "@/proto-generated/nori/v0/user/account/user_pb";

const RoomChat = () => {
  const [roomName, setRoomName] = useState("taki");
  const [roomAvatarSrc, setRoomAvatarSrc] = useState(
    "https://i.imgur.com/LtR2mmT.png"
  );
  // const [currentUser, setCurrentUser] = useState<User>();
  // const [currentRoom, setCurrentRoom] = useState<Room>();
  const [chatMessages, setChatMessages] = useState<Message[]>([]);
  // const [roomMembers, setRoomMembers] = useState<RoomMembers>({});

  return (
    <RoomMembersProvider>
      <Flex direction={"column"} height={"100vh"}>
        <ChatHeader roomName={roomName} roomAvatarSrc={roomAvatarSrc} />
        <Box flex={"1"} overflowY={"auto"}>
          <ChatBody chatMessages={chatMessages}></ChatBody>
        </Box>
        <ChatFooter/>
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
