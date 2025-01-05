import { AbsoluteCenter, Box, Button, Center, Flex, Heading, Icon } from "@chakra-ui/react";
import { useState } from "react";
import { IoMdAddCircleOutline } from "react-icons/io";

const RoomList = () => {
    const [username, setUsername] = useState('test username');

    const roomListStyle = {
        borderRadius: 'lg',
        padding: '20px',
        borderWidth: '2px',
        borderColor: "border.disabled",
        color: "fg.disabled"
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

    return (
        <Box height="100vh" padding={'10px'}>
            <Flex direction={'column'} gap={2} height={'100%'} >
                <Box height={"100px"} {...roomListStyle}>
                    <Flex align={'center'} height={'100%'} width={'100%'} justify={'space-between'}>
                        <Heading size={'3xl'}>{username}</Heading>
                        <Button onClick={addRoomClick} variant={"surface"}>
                            <Center inline gap={'2'}>
                                <Icon size={'xl'}>
                                    <IoMdAddCircleOutline />
                                </Icon>
                                <Heading size={'2xl'}>ADD ROOM</Heading>

                            </Center>
                        </Button>
                    </Flex>
                </Box>
                <Box height={"100px"} {...roomListStyle} position="relative">
                    <AbsoluteCenter axis={'vertical'}>
                        <Button onClick={addRoomClick} variant={"surface"}>
                            <Center inline gap={'2'}>
                                <Icon size={'xl'}>
                                    <IoMdAddCircleOutline />
                                </Icon>
                                <Heading size={'2xl'}>ADD ROOM</Heading>
                            
                            </Center>
                        </Button>
                    </AbsoluteCenter>
                </Box>
                <Box bg={'green'} flex={'1'} {...roomListStyle}>
                    test
                </Box>
            </Flex>
        </Box>
    );
};

export default RoomList;
