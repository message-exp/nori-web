import { Box, Flex, For } from "@chakra-ui/react";
import { Message } from "@/proto-generated/nori/v0/message/message_pb";
import { MessageUnit } from "@/components/room-chat/MessageUnit";

interface ChatBodyProps {
  chatMessages: Message[];
}

function ChatBody(props: Readonly<ChatBodyProps>) {
  const { chatMessages } = props;
  
  return (
    <Box height={"100%"}>
      <Flex direction={"column"} maxHeight={"100%"}>
        <For each={chatMessages}>
          {(message, index) => (
            <MessageUnit
              author={message.author}
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

