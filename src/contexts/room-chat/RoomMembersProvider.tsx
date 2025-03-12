import { useMemo, useState } from "react";
import { RoomMembersContext } from "@/contexts/room-chat/useRoomMembers";

export interface RoomMembers {
  [userId: string]: string;
}


export function RoomMembersProvider({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [members, setMembers] = useState<RoomMembers>({});
  const value = useMemo(() => ({ members, setMembers }), [members, setMembers]);
  
  return (
    <RoomMembersContext.Provider value={value}>
      {children}
    </RoomMembersContext.Provider>
  );
}


