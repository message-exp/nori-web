import { Box, Button, Center, DialogCloseTrigger, Flex, For, Heading, HStack, Icon, Input, Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import {
  DialogActionTrigger,
  DialogBody,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogRoot,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Field } from "@/components/ui/field";
import { GetUser, GetUserRoomList } from "@/api/user/user-service";
import { storage } from "@/utils/storage/user-storage";
import { RoomBasicInfoResponse } from "@/proto-generated/nori/v0/room/room_basic_info_response_pb";
import { CreateRoom } from "@/api/room/room-service";
import { useNavigate } from "react-router";

const AddRoomButton = React.forwardRef<
    HTMLButtonElement,
    React.ComponentPropsWithoutRef<typeof Button>
>((props, ref) => (
  <Button ref={ref} variant={"surface"} {...props}>
    <Center inline gap={"2"}>
      <Icon size={"xl"}>
        <IoMdAddCircleOutline />
      </Icon>
      <Heading size={"2xl"}>ADD ROOM</Heading>
    </Center>
  </Button>
));

const AddRoomDialog = () => {
  const [addRoomName, setAddRoomName] = useState("");

  const addRoom = async () => {
    const userAuth = storage.getUserAuth();
    if (!userAuth?.userId) {
      throw new Error("User ID is not available");
    }
    const newRoomId = await CreateRoom(addRoomName, userAuth?.userId, []);
    console.log("new room id: ", newRoomId);
  };

    
  return (
    <DialogRoot>
      <DialogTrigger asChild>
        <AddRoomButton></AddRoomButton>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle >
            <Heading size={"2xl"}>Add Room</Heading>
          </DialogTitle>

        </DialogHeader>
        <DialogBody>
          <Field label="Room name">
            <Input
              placeholder="room name"
              value={addRoomName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                console.log("change");
                setAddRoomName(e.target.value);
              }}
            />
          </Field>
        </DialogBody>
        <DialogFooter>
          <DialogActionTrigger asChild>
            <Button
              variant="outline" onClick={() => {
                console.log("cancel");
                setAddRoomName("");
              }}
            >Cancel</Button>
          </DialogActionTrigger>
          <DialogActionTrigger asChild>
            <Button onClick={() => addRoom()}>Save</Button>
          </DialogActionTrigger>
        </DialogFooter>
        <DialogCloseTrigger />
      </DialogContent>
    </DialogRoot>
  );
};

const RoomList = () => {
  const [username, setUsername] = useState("");

  const roomListStyle = {
    borderRadius: "lg",
    padding: "20px",
    borderWidth: "2px",
    borderColor: "border.disabled",
    color: "fg.disabled"
  };

  const scroolStyle = {
    "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(255, 255, 255, 0.5)",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "rgba(255, 255, 255, 0.85)",
    }
  };
  const [roomListArray, setRoomListArray] = useState<RoomBasicInfoResponse[]>();

  const navigate = useNavigate();

  useEffect(() => {
    const userAuth = storage.getUserAuth();
    if (!userAuth?.userId) {
      console.error("User ID is not available");
      return;
    }
        
    const fetchUsername = async () => {
      try {
        const user = await GetUser(userAuth.userId.valueOf());
        setUsername(user.username);
      } catch (error) {
        console.error("Failed to fetch username:", error);
      }
    };

    fetchUsername();

    const fetchRoomList = async () => {
      try {
        const roomlist = await GetUserRoomList(userAuth.userId.valueOf());
                
        setRoomListArray(roomlist.rooms);
      } catch (error) {
        console.error("Failed to fetch room list:", error);
      }
    };

    fetchRoomList();
  }, []);

  const getRoomName = (room: RoomBasicInfoResponse): string => {
    return room.name.case === "sharedName" ? room.name.value :
      room.name.case === "customName" ? room.name.value : "";
  };

  const getRoomId = (room: RoomBasicInfoResponse): bigint => {
    if (!room.roomId) {
      throw new Error("Room ID is undefined");
    }
    return room.roomId.id;
  };

    interface roomListDataProps {
        name: string;
        id: bigint;
    }

    const handleIntoRoom = (id: bigint) => {
      navigate("/roomchat", {
        state: {
          roomid: id
        }
      });
    };

    const RoomListCard: React.FC<roomListDataProps> = ({ name, id }) => {
      return (
        <Button radioGroup="xl" height={"100px"} width={"100%"} variant={"ghost"} onClick={() => handleIntoRoom(id)} >
          <HStack direction={"row"}>
            <Heading size={"2xl"}>{name}</Heading>
            <Heading size={"md"}>({id.toString()})</Heading>
          </HStack>
        </Button>
      );
    };

    

    return (
      <Box height="100vh" padding={"10px"}>
        <Flex direction={"column"} gap={2} height={"100%"} >
          <Box height={"100px"} {...roomListStyle}>
            <Flex align={"center"} height={"100%"} width={"100%"} justify={"space-between"}>
              <Heading size={"3xl"}>{username}</Heading>
              <AddRoomDialog></AddRoomDialog>
            </Flex>
          </Box>
          <Box flex={"1"} {...roomListStyle} overflow={"hidden"}>
            <Stack
              // ref={containerRef}
              gap={"2"}
              height={"100%"}
              overflowY={"auto"}
              // onScroll={handleScroll}
              {...scroolStyle}
            >
              <For
                each={roomListArray}
              >
                {(roomBasicInfo, ) => (
                  <RoomListCard name={getRoomName(roomBasicInfo)} id={getRoomId(roomBasicInfo)} />
                )}
              </For>
              {/* {isLoading && <LoadingCard/>} */}

            </Stack>
                    
          </Box>
        </Flex>
      </Box>
    );
};

export default RoomList;
