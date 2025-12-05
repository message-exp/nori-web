import { useCallback, useEffect, useMemo } from "react";
import { useNavigate, useOutletContext, useParams } from "react-router";
import type { HomeLayoutContext } from "./_home";
import { Button } from "~/components/ui/button";
import { RoomChat } from "~/components/room-chat/room-chat";
import { MergedRoomChat } from "~/components/room-chat/merged-room-chat";
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
import { useDMsContext } from "~/contexts/dms-context";
import { useRoomContext } from "~/contexts/room-context";
import { Loading } from "~/components/ui/loading";

type ValidType = "contact" | "room";

export default function DMsTypePage() {
  const context = useOutletContext<HomeLayoutContext>();
  const navigate = useNavigate();
  const { type, id } = useParams();
  const { setSelectedRoomId } = useRoomContext();

  // 從 DMsContext 取得資料
  const { contactCards, dmRooms, loading, error } = useDMsContext();

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

  // Load current item based on type and id using useMemo
  const currentItem = useMemo<SelectableItem | null>(() => {
    if (!type || !id || !isValidType(type)) {
      return null;
    }

    if (type === "contact") {
      const contact = contactCards.find((c) => c.id === id);
      return contact ? { type: "contact", data: contact } : null;
    } else if (type === "room") {
      const dmRoom = dmRooms.find((r) => r.roomId === id);
      return dmRoom ? { type: "dmRoom", data: dmRoom } : null;
    }

    return null;
  }, [type, id, contactCards, dmRooms]);

  // Set selected room ID when current item changes
  useEffect(() => {
    if (currentItem?.type === "dmRoom") {
      setSelectedRoomId(currentItem.data.roomId);
    }
  }, [currentItem, setSelectedRoomId]);

  // Handle item selection from DMsList
  const handleItemSelect = (item: SelectableItem) => {
    if (item.type === "contact") {
      navigate(`/dms/contact/${item.data.id}`);
    } else {
      navigate(`/dms/room/${item.data.roomId}`);
    }
  };

  // Prepare room configs
  const roomConfigs = useMemo(() => {
    if (currentItem?.type !== "contact") return [];
    return currentItem.data.platformContacts.map((pc) => ({
      roomId: pc.dm_room_id,
      platform: pc.platform,
      platformContactId: pc.id,
    }));
  }, [currentItem]);

  // Set mobile list visibility
  const isMobile = context?.isMobile;
  const setShowMobileList = context?.setShowMobileList;

  useEffect(() => {
    if (isMobile && setShowMobileList) {
      setShowMobileList(false); // Hide sidebar on mobile when viewing specific item
    }
  }, [isMobile, setShowMobileList]);

  // Handle case where context is not ready yet
  if (!context || loading) {
    return <Loading text="Loading direct messages..." />;
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center text-muted-foreground">
          <div className="text-lg mb-2">Error</div>
          <div className="text-sm mb-4">{error}</div>
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

  return (
    <div className="h-screen">
      {isMobile ? (
        <div className="h-full w-full transition-all duration-300">
          {currentItem.type === "contact" ? (
            // Merged room chat for contact
            <MergedRoomChat
              roomConfigs={roomConfigs}
              contactName={
                currentItem.data.nickname || currentItem.data.contact_name
              }
              onBackClick={navigateBackToDMs}
              defaultPlatformContactId={
                currentItem.data.default_platform_contact_id
              }
            />
          ) : (
            // Single room chat
            <RoomChat onBackClick={navigateBackToDMs} />
          )}
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
                // Merged room chat for contact
                <MergedRoomChat
                  roomConfigs={roomConfigs}
                  contactName={
                    currentItem.data.nickname || currentItem.data.contact_name
                  }
                  defaultPlatformContactId={
                    currentItem.data.default_platform_contact_id
                  }
                />
              ) : (
                // Single room chat
                <RoomChat />
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
