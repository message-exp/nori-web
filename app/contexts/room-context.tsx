import type { Room } from "matrix-js-sdk";
import { ClientEvent } from "matrix-js-sdk";
import React, { createContext, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { client } from "~/lib/matrix-api/client";
import { initClient } from "~/lib/matrix-api/init-client";
import { getRoomList } from "~/lib/matrix-api/room-list";

type RoomContextType = {
  rooms: Room[];
  selectedRoomId: string | null;
  setSelectedRoomId: (roomId: string | null) => void;
  loading: boolean;
};

const RoomContext = createContext<RoomContextType | undefined>(undefined);

export function RoomProvider({ children }: { children: React.ReactNode }) {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoomId, setSelectedRoomId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRooms = async () => {
      try {
        const refreshStatus = await initClient();
        if (refreshStatus === "REFRESH_FAILED") {
          navigate("/login");
          return;
        }

        setRooms(await getRoomList());

        const handleRoomEvent = async () => {
          setRooms(await getRoomList());
        };

        const handleSyncEvent = async () => {
          setRooms(await getRoomList());
        };

        client.client.on(ClientEvent.Room, handleRoomEvent);
        client.client.on(ClientEvent.Sync, handleSyncEvent);

        setLoading(false);

        return () => {
          client.client.removeListener(ClientEvent.Room, handleRoomEvent);
          client.client.removeListener(ClientEvent.Sync, handleSyncEvent);
        };
      } catch (error) {
        console.error("Error initializing client:", error);
        setLoading(false);
      }
    };

    fetchRooms();
  }, [navigate]);

  return (
    <RoomContext.Provider
      value={{ rooms, selectedRoomId, setSelectedRoomId, loading }}
    >
      {children}
    </RoomContext.Provider>
  );
}

export function useRoomContext() {
  const context = useContext(RoomContext);
  if (context === undefined) {
    throw new Error("useRoomContext must be used within a RoomProvider");
  }
  return context;
}
