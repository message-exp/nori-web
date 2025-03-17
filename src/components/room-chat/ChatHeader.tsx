import {
  Avatar,
  Box,
  Center,
  Flex,
  Heading,
  IconButton,
} from "@chakra-ui/react";
import { RiArrowLeftLine } from "react-icons/ri";
import { InviteUserDialog } from "./InviteUserDialog";
import { useNavigate } from "react-router";
interface RoomHeaderProps {
  roomName: string;
  roomAvatarSrc: string;
}

const ChatHeader = (props: Readonly<RoomHeaderProps>) => {
  const { roomName, roomAvatarSrc } = props;
  const navigate = useNavigate();

  return (
    <Box height={"70px"} backgroundColor={"gray.900"} padding={"15px"}>
      <Flex direction={"column"} justify={"center"} height={"100%"}>
        <Flex justify={"flex-start"} gap={"4"}>
          <Center>
            <IconButton
              rounded={"full"}
              variant={"subtle"}
              size={"xl"}
              onClick={() => {navigate("/roomlist");}}
            >
              <RiArrowLeftLine />
            </IconButton>
          </Center>
          <Center>
            <Avatar.Root>
              <Avatar.Fallback name={roomName} />
              <Avatar.Image sizes={"lg"} src={roomAvatarSrc} />
            </Avatar.Root>
          </Center>
          <Center>
            <Heading>{roomName}</Heading>
          </Center>
          <Box ml="auto">
            <InviteUserDialog />
          </Box>
        </Flex>
      </Flex>
    </Box>
  );
};

export default ChatHeader;
