import { useMemo } from "react";
import { useRoomContext } from "~/contexts/room-context";
import { getDMRooms, type DMRoomInfo } from "~/lib/dm-room-utils";

export function useDMRooms() {
  const { rooms, loading } = useRoomContext();

  const dmRooms = useMemo<DMRoomInfo[]>(() => {
    if (loading) return [];
    return getDMRooms(rooms);
  }, [rooms, loading]);

  return {
    dmRooms,
    loading,
    error: null, // 錯誤處理由 room-context 管理
    refetch: () => {
      // room-context 會自動重新獲取資料，這裡不需要額外實作
      console.log("DM rooms will be refetched through room context");
    },
  };
}
