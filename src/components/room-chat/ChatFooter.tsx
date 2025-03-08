import { Box, Flex, IconButton, Spinner, Textarea } from "@chakra-ui/react";
import {
  RiFunctionAddFill,
  RiMenuFill,
  RiSendPlane2Fill,
} from "react-icons/ri";

interface ChatFooterProps {
  inputMessage: string;
  isSending: boolean;
  setInputMessage: React.Dispatch<React.SetStateAction<string>>;
  sendMessage: () => void;
}

function ChatFooter({
  inputMessage,
  isSending,
  setInputMessage,
  sendMessage,
}: Readonly<ChatFooterProps>) {
  return (
    <Box background={"gray.900"} height={"80px"} padding={"20px"}>
      <Flex direction={"column"} height={"100%"} justifyContent={"center"}>
        <Flex gap={"4"} align={"center"}>
          <Textarea
            placeholder="Comment..."
            variant={"outline"}
            resize={"none"}
            flexGrow={1}
            color={"white"}
            scrollbar={"hidden"}
            value={inputMessage}
            onChange={(e) => {
              setInputMessage(e.target.value);
            }}
          />
          <IconButton rounded={"full"} variant={"subtle"}>
            <RiFunctionAddFill />
          </IconButton>
          <IconButton rounded={"full"} variant={"subtle"}>
            <RiMenuFill />
          </IconButton>
          <IconButton
            rounded={"full"}
            variant={"subtle"}
            onClick={sendMessage}
            disabled={isSending}
          >
            {!isSending ? <RiSendPlane2Fill /> : <Spinner></Spinner>}
          </IconButton>
        </Flex>
      </Flex>
    </Box>
  );
}
export default ChatFooter;
