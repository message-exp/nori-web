import { Box, Button, Center, DialogActionTrigger, DialogCloseTrigger, Flex, For, Heading, HStack, Icon, Input, Stack } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import {
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


    // const [roomList, setRoomList] = useState([
    //     { roomName: "Travel Buddies", roomId: "travel2023group" },
    //     { roomName: "Gaming Squad", roomId: "gamersunite123" },
    //     { roomName: "Book Club", roomId: "bookworms2023" },
    //     { roomName: "Foodies United", roomId: "foodlovers456" },
    //     { roomName: "Tech Talk", roomId: "techgeeks789" },
    //     { roomName: "Music Lovers", roomId: "musicclub2023" },
    //     { roomName: "Fitness Friends", roomId: "fitfam345" },
    //     { roomName: "Movie Night", roomId: "moviebuffs567" },
    //     { roomName: "Coffee Chat", roomId: "coffeetime123" },
    //     { roomName: "Pet Parents", roomId: "petlovers999" },
    //     { roomName: "Study Group", roomId: "studybuddies777" },
    //     { roomName: "Art Gallery", roomId: "artists2023" },
    //     { roomName: "Sports Fan", roomId: "sportsclub444" },
    //     { roomName: "Photography Club", roomId: "photoclub555" },
    //     { roomName: "Language Exchange", roomId: "langexchange666" },
    //     { roomName: "Cooking Club", roomId: "chefclub888" },
    //     { roomName: "Travel Planning", roomId: "travelplan234" },
    //     { roomName: "Anime Club", roomId: "animelovers111" },
    //     { roomName: "Gardening Group", roomId: "gardeners222" },
    //     { roomName: "DIY Projects", roomId: "diycrafts333" },
    //     { roomName: "Board Games", roomId: "boardgames444" },
    //     { roomName: "Crypto Talk", roomId: "crypto555666" },
    //     { roomName: "Fashion Chat", roomId: "fashionista777" },
    //     { roomName: "Science Club", roomId: "sciencegeek888" },
    //     { roomName: "Meditation Group", roomId: "zentime999" }
    // ]);

    useEffect(() => {
        const userAuth = storage.getUserAuth();
        if (!userAuth?.userId) {
            console.error("User ID is not available");
            return;
        }
        
        const fetchUsername = async () => {
            try {
                const user = await GetUser(userAuth.userId.id);
                setUsername(user.username);
            } catch (error) {
                console.error("Failed to fetch username:", error);
            }
        };

        fetchUsername();

        const fetchRoomList = async () => {
            try {
                const roomlist = await GetUserRoomList(userAuth.userId.id);
                
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

    


    // const [isLoading, setIsloading] = useState(false);


    const addRoomClick = () => {
        console.log("clicked");
    };

    // const roomListTooAdd = [
    //     { roomName: "Below is add room", roomId: "addroom" },
    //     { roomName: "1. one", roomId: "gamersunite123" },
    //     { roomName: "2. two", roomId: "bookworms2023" },
    //     { roomName: "3. three", roomId: "foodlovers456" },
    //     { roomName: "4. four", roomId: "techgeeks789" },
    //     { roomName: "5. five", roomId: "musicclub2023" },
    //     { roomName: "6. six", roomId: "fitfam345" }
    // ];

    // const calculateScrollPercentage = (
    //     scrollTop: number,
    //     scrollHeight: number,
    //     clientHeight: number
    // ): number => {
    //     const maxScroll = scrollHeight - clientHeight;
    //     if (maxScroll <= 0) return 0;

    //     const percentage = scrollTop / maxScroll;
    //     return Math.max(0, Math.min(1, percentage));
    // };

    // const loadMoreRoomlist = async () => {
    //     console.log("start loading");
    //     setIsloading(true);
    //     const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
    //     await delay(3000);
    //     setRoomList([...roomList, ...roomListTooAdd]);
    //     setIsloading(false);
    //     console.log("finished loading");
    // }

    // const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    //     const target = e.target as HTMLDivElement;
    //     const presentage = calculateScrollPercentage(target.scrollTop, target.scrollHeight, target.clientHeight)
    //     console.log("---");
    //     console.log("Scroll position top:", target.scrollTop);
    //     console.log("scroll position height: ", target.scrollHeight);
    //     console.log("scroll position client height: ", target.clientHeight);
    //     console.log("scroll precentage: ", presentage)
    //     console.log("---");
    //     if (!isLoading) {
    //         if (presentage > 0.9) {
    //             // loadMoreRoomlist();
    //         }
    //     }
    // };

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

    // const LoadingCard = () => {
    //     return (
    //         <Box height="100px" width={"100%"}>
    //             <Center height={"100%"}>
    //                 <HStack>
    //                     <Spinner></Spinner>
    //                     <Text fontSize={"lg"}>loading</Text>
    //                 </HStack>
    //             </Center>
                
    //         </Box>
    //     )
        
    // }

    // const containerRef = useRef<HTMLDivElement>(null);

    // useEffect(() => {
    //     if (containerRef.current) {
    //         containerRef.current.scrollTop = containerRef.current.scrollHeight;
    //     }
    // }, []); // 只在組件掛載時執行一次

    


    const AddRoomButton = () => {
        return (
            <Button onClick={addRoomClick} variant={"surface"}>
                <Center inline gap={"2"}>
                    <Icon size={"xl"}>
                        <IoMdAddCircleOutline />
                    </Icon>
                    <Heading size={"2xl"}>ADD ROOM</Heading>

                </Center>
            </Button>
        );
    };

    const AddRoomDialog = () => {
        const [addRoomName, setAddRoomName] = useState("");

        const addRoom = async () => {
            const userAuth = storage.getUserAuth();
            if (!userAuth?.userId) {
                throw new Error("User ID is not available");
            }
            const newRoomId = await CreateRoom(addRoomName, userAuth?.userId.id, []);
            console.log("new room id: ", newRoomId);
        }; 
        return (
            <DialogRoot>
                <DialogTrigger>
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
