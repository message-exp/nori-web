import { Box, Flex, For } from "@chakra-ui/react";
import { Message } from "@/proto-generated/nori/v0/message/message_pb";
import { MessageUnit } from "@/components/room-chat/MessageUnit";

interface ChatBodyProps {
  chatMessages: Message[];
  roomMembers: RoomMembers;
}

export interface RoomMembers {
  [userId: string]: string;
}

function ChatBody(props: Readonly<ChatBodyProps>) {
  const { chatMessages, roomMembers } = props;

  return (
    <Box height={"100%"}>
      <Flex direction={"column"} maxHeight={"100%"}>
        <For each={chatMessages}>
          {(message, index) => (
            <MessageUnit
              author={roomMembers[message.author?.id.toString() ?? ""]}
              time={
                message.createdAt?.seconds
                  ? new Date(
                    Number(message.createdAt.seconds) * 1000
                  ).toISOString()
                  : new Date().toISOString()
              }
              messageContent={message.text}
              key={index}
            />
          )}
        </For>
      </Flex>
    </Box>
  );
};
export default ChatBody;

