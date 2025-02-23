import { Box, Flex, For, Heading, Stack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { storage } from "@/utils/storage/user-storage";
import { RoomBasicInfoResponse } from "@/proto-generated/nori/v0/room/room_basic_info_response_pb";
import { useNavigate } from "react-router";
import { getRoomId, getRoomName, fetchRoomList, fetchUsername } from "@/hooks/room-list";
import { AddRoomDialog, RoomListCard } from "@/components/room-list";

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
  const [roomListArray, setRoomListArray] = useState<RoomBasicInfoResponse[]>([]);
  useEffect(() => {
    const userAuth = storage.getUserAuth();
    if (!userAuth?.userId) {
      console.error("User ID is not available");
      return;
    }
    fetchUsername(userAuth.userId.valueOf()).then(username => {
      if (username) {
        setUsername(username);
      }
    });
    fetchRoomList(userAuth.userId.valueOf()).then(rooms => {
      if (rooms) {
        setRoomListArray(rooms);
      }
    });
  
  }, []);

  const navigate = useNavigate();
  const handleIntoRoom = (id: bigint) => {
    navigate(`/roomchat/${id}`);
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
              {(roomBasicInfo,) => (
                <RoomListCard name={getRoomName(roomBasicInfo)} id={getRoomId(roomBasicInfo)} handleIntoRoom={handleIntoRoom} />
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
