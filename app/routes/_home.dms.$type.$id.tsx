import { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
import { RoomChat } from "~/components/room-chat/room-chat";
import {
  DMsList,
  type SelectableItem,
  type SelectableItemId,
} from "~/components/dms-list/dms-list";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { useContactCardsWithPlatforms } from "~/hooks/use-contact-cards-with-platforms";
import { useDMRooms } from "~/hooks/use-dm-rooms";
import { useRoomContext } from "~/contexts/room-context";
import { Loading } from "~/components/ui/loading";

type HomeLayoutContext = {
  isMobile: boolean;
  showMobileList: boolean;
  setShowMobileList: React.Dispatch<React.SetStateAction<boolean>>;
};

type ValidType = "contact" | "room";

export default function DMsTypePage() {
  const { isMobile, setShowMobileList } = useOutletContext<HomeLayoutContext>();
  const navigate = useNavigate();
  const { type, id } = useParams();
  const { setSelectedRoomId } = useRoomContext();

  // Data loading hooks
  const {
    contactCards,
    loading: contactsLoading,
    error: contactsError,
  } = useContactCardsWithPlatforms();

  const {
    dmRooms,
    loading: dmRoomsLoading,
    error: dmRoomsError,
  } = useDMRooms();

  // State for current item
  const [currentItem, setCurrentItem] = useState<SelectableItem | null>(null);

  // Validate type parameter
  const isValidType = (type: string | undefined): type is ValidType => {
    return type === "contact" || type === "room";
  };

  // Navigate back to DMs index
  const navigateBackToDMs = useCallback(() => {
    navigate("/dms");
  }, [navigate]);

  // Get selected ID for DMsList
  const getSelectedId = (): SelectableItemId | null => {
    if (!type || !id || !isValidType(type)) return null;
    return { type: type === "contact" ? "contact" : "dmRoom", id };
  };

  // Load current item based on type and id
  useEffect(() => {
    if (!type || !id || !isValidType(type)) {
      setCurrentItem(null);
      return;
    }

    // Wait for data to load
    if (contactsLoading || dmRoomsLoading) {
      return;
    }

    if (type === "contact") {
      const contact = contactCards.find((c) => c.id === id);
      setCurrentItem(contact ? { type: "contact", data: contact } : null);
    } else if (type === "room") {
      const dmRoom = dmRooms.find((r) => r.roomId === id);
      if (dmRoom) {
        setCurrentItem({ type: "dmRoom", data: dmRoom });
        setSelectedRoomId(id); // Set selected room for RoomChat
      } else {
        setCurrentItem(null);
      }
    }
  }, [
    type,
    id,
    contactCards,
    dmRooms,
    contactsLoading,
    dmRoomsLoading,
    setSelectedRoomId,
  ]);

  // Handle item selection from DMsList
  const handleItemSelect = (item: SelectableItem) => {
    if (item.type === "contact") {
      navigate(`/dms/contact/${item.data.id}`);
    } else {
      navigate(`/dms/room/${item.data.roomId}`);
    }
  };

  // Set mobile list visibility
  useEffect(() => {
    if (isMobile) {
      setShowMobileList(false); // Hide sidebar on mobile when viewing specific item
    }
  }, [isMobile, setShowMobileList]);

  // Loading state - use unified loading pattern like _index.tsx
  if (contactsLoading || dmRoomsLoading) {
    return <Loading text="Loading DMs..." />;
  }

  // Error state
  if (contactsError || dmRoomsError) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-muted-foreground">
          <div className="text-lg mb-2">Error</div>
          <div className="text-sm mb-4">{contactsError || dmRoomsError}</div>
          <Button onClick={navigateBackToDMs} variant="outline">
            Back to DMs
          </Button>
        </div>
      </div>
    );
  }

  // Invalid parameters or item not found
  if (!type || !id || !isValidType(type) || !currentItem) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-muted-foreground">
          <div className="text-lg mb-2">Item not found</div>
          <div className="text-sm mb-4">
            The requested {type} was not found.
          </div>
          <Button onClick={navigateBackToDMs} variant="outline">
            Back to DMs
          </Button>
        </div>
      </div>
    );
  }

  // Helper functions for display
  const getDisplayName = (item: SelectableItem): string => {
    if (item.type === "contact") {
      return item.data.nickname || item.data.contact_name;
    }
    return item.data.roomName;
  };

  const getSubtitle = (item: SelectableItem): string => {
    if (item.type === "contact") {
      const count = item.data.platformContacts.length;
      return `${count} platform${count !== 1 ? "s" : ""} connected`;
    }
    return `${item.data.platform} DM`;
  };

  return (
    <div className="h-screen">
      {isMobile ? (
        <div className="h-full w-full transition-all duration-300">
          <div className="flex flex-col h-full">
            {/* Mobile header */}
            <div className="flex items-center gap-3 p-4 border-b">
              <Button
                variant="ghost"
                size="icon"
                onClick={navigateBackToDMs}
                className="shrink-0"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div className="flex-1">
                <h2 className="text-xl font-semibold">
                  {getDisplayName(currentItem)}
                </h2>
                <div className="text-sm text-muted-foreground">
                  {getSubtitle(currentItem)}
                </div>
              </div>
            </div>

            {/* Mobile content */}
            <div className="flex-1">
              {currentItem.type === "contact" ? (
                // Contact placeholder
                <div className="h-full flex items-center justify-center p-4">
                  <div className="text-center text-muted-foreground">
                    <div className="text-lg mb-2">Merged Chat Coming Soon</div>
                    <div className="text-sm">
                      Timeline view for {getDisplayName(currentItem)} will be
                      implemented in the next branch
                    </div>
                  </div>
                </div>
              ) : (
                // Room chat
                <RoomChat onBackClick={navigateBackToDMs} />
              )}
            </div>
          </div>
        </div>
      ) : (
        // Desktop layout
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel
            defaultSize={25}
            maxSize={40}
            minSize={20}
            className="flex flex-col"
          >
            <DMsList onSelect={handleItemSelect} selectedId={getSelectedId()} />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <div className="h-full">
              {currentItem.type === "contact" ? (
                // Contact placeholder
                <div className="h-full flex items-center justify-center p-4">
                  <div className="text-center text-muted-foreground">
                    <div className="border-b pb-4 mb-4">
                      <h2 className="text-xl font-semibold">
                        {getDisplayName(currentItem)}
                      </h2>
                      <div className="text-sm text-muted-foreground">
                        {getSubtitle(currentItem)}
                      </div>
                    </div>
                    <div className="text-lg mb-2">Merged Chat Coming Soon</div>
                    <div className="text-sm">
                      Timeline view for {getDisplayName(currentItem)} will be
                      implemented in the next branch
                    </div>
                  </div>
                </div>
              ) : (
                // Room chat
                <RoomChat />
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
