import { Box, Flex, For, Spinner } from "@chakra-ui/react";
import { Message } from "@/proto-generated/nori/v0/message/message_pb";
import { useInView } from "react-intersection-observer";
import MessageUnit from "@/components/room-chat/MessageUnit";
import { useEffect } from "react";

interface ChatBodyProps {
  chatMessages: Message[];
  onLoadOlder: () => void;
  onLoadNewer: () => void;
  isLoadingOlder: boolean;
  isLoadingNewer: boolean;
}
function ChatBody(props: Readonly<ChatBodyProps>) {
  const { chatMessages, onLoadOlder, onLoadNewer, isLoadingOlder, isLoadingNewer } = props;
  const { ref: topRef, inView: topInView } = useInView();
  const { ref: bottomRef, inView: bottomInView } = useInView();

  useEffect(() => {
    if (topInView) {
      onLoadOlder();
    }
  }, [topInView, onLoadOlder]);
  
  useEffect(()=>{
    if (bottomInView){
      onLoadNewer();
    }
  },[]);

  return (
    <Box height={"100%"}>
      <Flex direction={"column"} maxHeight={"100%"}>
        <Box ref={topRef}/>
        {isLoadingOlder && <Spinner size="sm" alignSelf="center" />}
        <For each={chatMessages}>
          {(message) => (
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
            />
          )}
        </For>
        {isLoadingNewer && <Spinner size="sm" alignSelf="center" />}
        <Box ref={bottomRef}/>
      </Flex>
    </Box>
  );
}
export default ChatBody;
