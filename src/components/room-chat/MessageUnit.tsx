import { UserId } from "@/proto-generated/nori/v0/user/user_id_pb";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { useRoomMembers } from "@/contexts/room-chat/useRoomMembers";
interface MessageUnitProps {
  author?: UserId;
  time: string;
  messageContent: string;
}

enum ColorPalette {
  Red = "red",
  Blue = "blue",
  Green = "green",
  Yellow = "yellow",
  Purple = "purple",
  Orange = "orange",
}

const pickPalette = (name: string): ColorPalette => {
  const colorValues = Object.values(ColorPalette);
  const index = name.charCodeAt(0) % colorValues.length;
  return colorValues[index];
};

export function MessageUnit({
  author,
  time,
  messageContent,
}: Readonly<MessageUnitProps>) {
  const roomMembers = useRoomMembers();
  //const userAvatar = "";roomMembers.members[author?.id.toString() ?? ""].avatarUrl ?? ""
  const username = roomMembers.members[author?.id.toString() ?? ""];

  return (
    <Box padding={"10px"}>
      <Flex gap={"4"}>
        <Avatar
          name={username}
          colorPalette={pickPalette(username ?? "")}
        />
        <Flex direction={"column"} gap={"2"}>
          <Flex gap={"2"} alignItems={"baseline"}>
            <Text textStyle={"2xl"}>{author?.id.toString()}</Text>
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
