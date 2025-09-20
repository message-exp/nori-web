import { useState, useEffect } from "react";
import { getRoomList } from "~/lib/matrix-api/room-list";
import { getDMRooms, type DMRoomInfo } from "~/lib/dm-room-utils";

export function useDMRooms() {
  const [dmRooms, setDMRooms] = useState<DMRoomInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDMRooms = async () => {
    try {
      setLoading(true);
      setError(null);

      const allRooms = await getRoomList();
      const dmRoomsInfo = getDMRooms(allRooms);

      setDMRooms(dmRoomsInfo);
    } catch (error) {
      console.error("Failed to fetch DM rooms:", error);
      setError("Failed to load DM rooms");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDMRooms();
  }, []);

  return {
    dmRooms,
    loading,
    error,
    refetch: fetchDMRooms,
  };
}
