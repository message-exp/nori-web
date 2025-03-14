import { Box, Flex, Text } from "@chakra-ui/react";
import { Avatar } from "@/components/ui/avatar";;
interface MessageUnitProps {
  author : string;
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
  return (
    <Box padding={"10px"}>
      <Flex gap={"4"}>
        <Avatar
          name={author}
          colorPalette={pickPalette("123")}
        />
        <Flex direction={"column"} gap={"2"}>
          <Flex gap={"2"} alignItems={"baseline"}>
            <Text textStyle={"2xl"}>{author}</Text>
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
