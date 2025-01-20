import { Box, Button, Center, DialogActionTrigger, Flex, For, Heading, HStack, Icon, Input, Stack } from "@chakra-ui/react";
import React, { useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";
import {
    DialogBody,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogRoot,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Field } from "@/components/ui/field"

const RoomList = () => {
    const [username, setUsername] = useState('test username');

    const roomListStyle = {
        borderRadius: 'lg',
        padding: '20px',
        borderWidth: '2px',
        borderColor: "border.disabled",
        color: "fg.disabled"
    }

    const scroolStyle = {
        '&::-webkit-scrollbar': {
            width: '8px',
        },
        '&::-webkit-scrollbar-thumb': {
            backgroundColor: 'rgba(255, 255, 255, 0.5)',
            borderRadius: '4px',
        },
        '&::-webkit-scrollbar-thumb:hover': {
            backgroundColor: 'rgba(255, 255, 255, 0.85)',
        }
    }

    const roomList = [
        { roomName: "Travel Buddies", roomId: "travel2023group" },
        { roomName: "Gaming Squad", roomId: "gamersunite123" },
        { roomName: "Book Club", roomId: "bookworms2023" },
        { roomName: "Foodies United", roomId: "foodlovers456" },
        { roomName: "Tech Talk", roomId: "techgeeks789" },
        { roomName: "Music Lovers", roomId: "musicclub2023" },
        { roomName: "Fitness Friends", roomId: "fitfam345" },
        { roomName: "Movie Night", roomId: "moviebuffs567" },
        { roomName: "Coffee Chat", roomId: "coffeetime123" },
        { roomName: "Pet Parents", roomId: "petlovers999" },
        { roomName: "Study Group", roomId: "studybuddies777" },
        { roomName: "Art Gallery", roomId: "artists2023" },
        { roomName: "Sports Fan", roomId: "sportsclub444" },
        { roomName: "Photography Club", roomId: "photoclub555" },
        { roomName: "Language Exchange", roomId: "langexchange666" },
        { roomName: "Cooking Club", roomId: "chefclub888" },
        { roomName: "Travel Planning", roomId: "travelplan234" },
        { roomName: "Anime Club", roomId: "animelovers111" },
        { roomName: "Gardening Group", roomId: "gardeners222" },
        { roomName: "DIY Projects", roomId: "diycrafts333" },
        { roomName: "Board Games", roomId: "boardgames444" },
        { roomName: "Crypto Talk", roomId: "crypto555666" },
        { roomName: "Fashion Chat", roomId: "fashionista777" },
        { roomName: "Science Club", roomId: "sciencegeek888" },
        { roomName: "Meditation Group", roomId: "zentime999" }
    ];


    const addRoomClick = () => {
        console.log("clicked")
    }

    interface roomListDataProps {
        name: string;
        id: string;
    }

    const RoomListCard: React.FC<roomListDataProps> = ({ name, id }) => {
        return (
            <Button radioGroup="xl" height={'100px'} width={'100%'} variant={'ghost'} >
                <HStack direction={'row'}>
                    <Heading size={'2xl'}>{name}</Heading>
                    <Heading size={'md'}>({id})</Heading>
                </HStack>
            </Button>
        );
    };

    const AddRoomButton = () => {
        return (
            <Button onClick={addRoomClick} variant={"surface"}>
                <Center inline gap={'2'}>
                    <Icon size={'xl'}>
                        <IoMdAddCircleOutline />
                    </Icon>
                    <Heading size={'2xl'}>ADD ROOM</Heading>

                </Center>
            </Button>
        );
    };

    const AddRoomDialog = () => {
        return (
            <DialogRoot>
                <DialogTrigger>
                    <AddRoomButton></AddRoomButton>
                </DialogTrigger>

                <DialogContent>
                    <DialogHeader>
                        <DialogTitle >
                            <Heading size={'2xl'}>Add Room</Heading>
                        </DialogTitle>
                            
                    </DialogHeader>
                    <DialogBody>
                        <Field label="Room name">
                            <Input placeholder="room name" />
                        </Field>
                    </DialogBody>
                    <DialogFooter>
                        <DialogActionTrigger asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogActionTrigger>
                        <Button>Save</Button>
                    </DialogFooter>
                </DialogContent>
            </DialogRoot>
        );
    };

    return (
        <Box height="100vh" padding={'10px'}>
            <Flex direction={'column'} gap={2} height={'100%'} >
                <Box height={"100px"} {...roomListStyle}>
                    <Flex align={'center'} height={'100%'} width={'100%'} justify={'space-between'}>
                        <Heading size={'3xl'}>{username}</Heading>
                        <AddRoomDialog></AddRoomDialog>
                    </Flex>
                </Box>
                <Box flex={'1'} {...roomListStyle} overflow={'hidden'}>
                    <Stack gap={'2'} height={'100%'} overflowY={'auto'} {...scroolStyle}>
                        <For
                            each={roomList}
                        >
                            {(item, ) => (
                                <RoomListCard name={item.roomName} id={item.roomId} />
                            )}
                        </For>
                    </Stack>
                    
                </Box>
            </Flex>
        </Box>
    );
};

export default RoomList;
