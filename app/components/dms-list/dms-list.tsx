import { useEffect, useState } from "react";
import {
  useContactCardsWithPlatforms,
  type ContactCardWithPlatforms,
} from "~/hooks/use-contact-cards-with-platforms";
import { DMsItem } from "./dms-list-button";
import { Alert, AlertDescription } from "~/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ToggleGroup, ToggleGroupItem } from "~/components/ui/toggle-group";
import { useDMRooms } from "~/hooks/use-dm-rooms";
import { Loading } from "~/components/ui/loading";
import type { DMRoomInfo } from "~/lib/dm-room-utils";

// 顯示模式類型
export type DisplayMode = "all" | "contacts" | "dms";

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
  // 顯示模式狀態管理與 localStorage 持久化
  const [displayMode, setDisplayMode] = useState<DisplayMode>("all");

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

  // 從 localStorage 讀取顯示模式偏好
  useEffect(() => {
    const savedMode = localStorage.getItem("dms-display-mode") as DisplayMode;
    if (savedMode && ["all", "contacts", "dms"].includes(savedMode)) {
      setDisplayMode(savedMode);
    }
  }, []);

  // 儲存顯示模式到 localStorage
  const handleDisplayModeChange = (value: string) => {
    const newMode = value as DisplayMode;
    setDisplayMode(newMode);
    localStorage.setItem("dms-display-mode", newMode);
  };

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
      return <Loading text="Loading DMs..." className="p-8" />;
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

    // 檢查是否有可顯示的項目
    const hasContactsToShow =
      (displayMode === "all" || displayMode === "contacts") &&
      contactCards.length > 0;
    const hasDMsToShow =
      (displayMode === "all" || displayMode === "dms") && dmRooms.length > 0;

    if (!hasContactsToShow && !hasDMsToShow) {
      const getEmptyMessage = () => {
        switch (displayMode) {
          case "contacts":
            return "No contacts with platform accounts found.";
          case "dms":
            return "No DM rooms found.";
          default:
            return "No contacts with platform accounts or dm rooms found.";
        }
      };

      return (
        <div className="p-4 text-sm text-muted-foreground">
          {getEmptyMessage()}
        </div>
      );
    }

    const items: React.ReactElement[] = [];

    // 根據顯示模式過濾和渲染項目
    if (displayMode === "all" || displayMode === "contacts") {
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
    }

    if (displayMode === "all" || displayMode === "dms") {
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
    }

    return items;
  };

  return (
    <div className="flex flex-col h-screen">
      <div className="p-4 pr-2">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">DMs</h2>
          <ToggleGroup
            type="single"
            value={displayMode}
            onValueChange={handleDisplayModeChange}
            className="h-8"
          >
            <ToggleGroupItem value="all" className="text-xs px-3 min-w-[50px]">
              All
            </ToggleGroupItem>
            <ToggleGroupItem
              value="contacts"
              className="text-xs px-3 min-w-[70px]"
            >
              Contacts
            </ToggleGroupItem>
            <ToggleGroupItem value="dms" className="text-xs px-3 min-w-[45px]">
              DMs
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
      </div>
      <ScrollArea className="flex-1 h-[calc(100vh-60px)]">
        <div className="flex flex-col gap-1 p-2">{renderContent()}</div>
      </ScrollArea>
    </div>
  );
}
