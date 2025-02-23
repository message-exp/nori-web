import { Button, Heading, HStack } from "@chakra-ui/react";

interface roomListDataProps {
    name: string;
    id: bigint;
    handleIntoRoom: (id: bigint) => void;
}

export const RoomListCard: React.FC<roomListDataProps> = ({ name, id , handleIntoRoom}) => {
  return (
    <Button radioGroup="xl" height={"100px"} width={"100%"} variant={"ghost"} onClick={() => handleIntoRoom(id)} >
      <HStack direction={"row"}>
        <Heading size={"2xl"}>{name}</Heading>
        <Heading size={"md"}>({id.toString()})</Heading>
      </HStack>
    </Button>
  );
};