import {
  useContactCardsWithPlatforms,
  type ContactCardWithPlatforms,
} from "~/hooks/use-contact-cards-with-platforms";
import { DMsItem } from "./dms-list-button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { useDMRooms } from "~/hooks/use-dm-rooms";
import type { DMRoomInfo } from "~/lib/dm-room-utils";

// 統一的選擇項目類型
export type SelectableItem =
  | { type: "contact"; data: ContactCardWithPlatforms }
  | { type: "dmRoom"; data: DMRoomInfo };

// 統一的 ID 類型
export type SelectableItemId =
  | { type: "contact"; id: string }
  | { type: "dmRoom"; id: string };

interface DMsListProps {
  onSelect: (item: SelectableItem) => void;
  selectedId?: SelectableItemId | null;
}

export function DMsList({ onSelect, selectedId }: Readonly<DMsListProps>) {
  const {
    contactCards,
    loading: contactsLoading,
    error: contactsError,
    refetch: refetchContacts,
  } = useContactCardsWithPlatforms();

  const {
    dmRooms,
    loading: dmRoomsLoading,
    error: dmRoomsError,
    refetch: refetchDMRooms,
  } = useDMRooms();

  // 判斷項目是否被選中
  const isItemSelected = (
    itemType: "contact" | "dmRoom",
    itemId: string,
  ): boolean => {
    if (!selectedId) return false;
    return selectedId.type === itemType && selectedId.id === itemId;
  };

  const renderContent = () => {
    if (contactsLoading || dmRoomsLoading) {
      return (
        <div className="flex items-center justify-center p-8">
          <div className="flex flex-col items-center gap-3 text-muted-foreground">
            <div className="animate-spin rounded-full h-6 w-6 border-2 border-primary border-r-transparent" />
            <p className="text-sm">Loading contacts...</p>
          </div>
        </div>
      );
    }

    if (contactsError || dmRoomsError) {
      return (
        <div className="p-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{contactsError || dmRoomsError}</AlertDescription>
          </Alert>
          <button
            onClick={() => {
              refetchContacts();
              refetchDMRooms();
            }}
            className="mt-2 text-sm text-primary hover:underline"
          >
            Retry
          </button>
        </div>
      );
    }

    if (contactCards.length === 0 && dmRooms.length === 0) {
      return (
        <div className="p-4 text-sm text-muted-foreground">
          No contacts with platform accounts or dm rooms found.
        </div>
      );
    }

    const items: React.ReactElement[] = [];

    // 渲染聯絡人卡片
    contactCards.forEach((contact) => {
      items.push(
        <DMsItem
          key={`contact-${contact.id}`}
          itemType="contact"
          contact={contact}
          isSelected={isItemSelected("contact", contact.id)}
          onSelect={() => onSelect({ type: "contact", data: contact })}
        />,
      );
    });

    // 渲染 DM rooms
    dmRooms.forEach((dmRoom) => {
      items.push(
        <DMsItem
          key={`dmRoom-${dmRoom.roomId}`}
          itemType="dmRoom"
          dmRoom={dmRoom}
          isSelected={isItemSelected("dmRoom", dmRoom.roomId)}
          onSelect={() => onSelect({ type: "dmRoom", data: dmRoom })}
        />,
      );
    });

    return items;
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 pr-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">DMs</h2>
        </div>
      </div>
      <ScrollArea className="flex-1 h-[calc(100vh-60px)]">
        <div className="flex flex-col gap-1 p-2">{renderContent()}</div>
      </ScrollArea>
    </div>
  );
}
