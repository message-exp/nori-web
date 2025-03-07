import { Button, Heading, HStack } from "@chakra-ui/react";

interface RoomListDataProps {
    name: string;
    id: bigint;
    handleIntoRoom: (id: bigint) => void;
}

export const RoomListCard: React.FC<RoomListDataProps> = ({ name, id, handleIntoRoom }) => {
  return (
    <Button radioGroup="xl" height={"100px"} width={"100%"} variant={"ghost"} onClick={() => handleIntoRoom(id)} >
      <HStack direction={"row"}>
        <Heading size={"2xl"}>{name}</Heading>
        <Heading size={"md"}>({id.toString()})</Heading>
      </HStack>
    </Button>
  );
};