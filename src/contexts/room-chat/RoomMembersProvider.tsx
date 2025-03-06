import { User } from "@/proto-generated/nori/v0/user/account/user_pb";
import { createContext, useContext, useMemo, useState } from "react";

interface RoomMembers {
  [userId: string]: User;
}

const RoomMembersContext = createContext<{
  members: RoomMembers;
  setMembers: React.Dispatch<React.SetStateAction<RoomMembers>>;
} | null>(null);

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

export function useRoomMembers() {
  const context = useContext(RoomMembersContext);
  if (!context) {
    throw new Error("context not found");
  }
  return context;
}
