import { UserId } from "@/proto-generated/nori/v0/user/user_id_pb";
import { Box, Flex, Text } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";
import { useState } from "react";

interface MessageUnitProps {
  author?: UserId;
  time?: string;
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

export const MessageUnit= ({
  time,
  messageContent,
}: Readonly<MessageUnitProps>)=> {
  const [userAvatar] = useState<string>("");
  const [username] = useState<string>("");

  return (
    <Box padding={"10px"}>
      <Flex gap={"4"}>
        <Avatar
          src={userAvatar}
          name={username}
          colorPalette={pickPalette(username ?? "")}
        />
        <Flex direction={"column"} gap={"2"}>
          <Flex gap={"2"} alignItems={"baseline"}>
            <Text textStyle={"2xl"}>{username}</Text>

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
