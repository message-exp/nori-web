import { Box, Flex, IconButton, Textarea } from "@chakra-ui/react";
import { RiFunctionAddFill, RiMenuFill, RiSendPlane2Fill } from "react-icons/ri";

export const ChatFooter= () => {
  return (
    <Box background={"gray.900"} height={"80px"} padding={"20px"}>
      <Flex direction={"column"} height={"100%"} justifyContent={"center"}>
        <Flex gap={"4"} align={"center"} >
          <Textarea
            placeholder="Comment..."
            variant={"outline"}
            resize={"none"}
            flexGrow={1}
            color={"white"}
            scrollbar={"hidden"}
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
          >
            <RiSendPlane2Fill />
          </IconButton>
        </Flex>
      </Flex>
    </Box>
  );
}

