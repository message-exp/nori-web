import { createContext, useContext } from "react";
import { RoomMembers } from "@/contexts/room-chat/RoomMembersProvider";

export const RoomMembersContext = createContext<{
    members: RoomMembers;
    setMembers: React.Dispatch<React.SetStateAction<RoomMembers>>;
} | null>(null);

export function useRoomMembers() {
  const context = useContext(RoomMembersContext);
  if (!context) {
    throw new Error("context not found");
  }
  return context;
}