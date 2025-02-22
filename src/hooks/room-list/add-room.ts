import { storage } from "@/utils/storage/user-storage";
import { CreateRoom } from "@/api/room/room-service";

export const addRoom = async (addRoomName : string) => {
        const userAuth = storage.getUserAuth();
        if (!userAuth?.userId) {
          throw new Error("User ID is not available");
        }
        const newRoomId = await CreateRoom(addRoomName, userAuth.userId.valueOf(), []);
        console.log("new room id: ", newRoomId);
      }; 