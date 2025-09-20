import { useCallback, useEffect, useState } from "react";
import { useNavigate, useOutletContext } from "react-router";
import { ArrowLeft } from "lucide-react";
import { Button } from "~/components/ui/button";
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

type HomeLayoutContext = {
  isMobile: boolean;
  showMobileList: boolean;
  setShowMobileList: React.Dispatch<React.SetStateAction<boolean>>;
};

type SelectedItem = SelectableItem;

export default function DMsIndex() {
  const { isMobile, setShowMobileList } = useOutletContext<HomeLayoutContext>();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  const handleItemSelect = (item: SelectableItem) => {
    if (item.type === "contact") {
      navigate(`/dms/contact/${item.data.id}`);
    } else {
      navigate(`/dms/room/${item.data.roomId}`);
    }
  };

  const handleBackToList = useCallback(() => {
    setSelectedItem(null);
  }, []);

  // Get selected ID for DMsList
  const getSelectedId = (): SelectableItemId | null => {
    if (!selectedItem) return null;
    if (selectedItem.type === "contact") {
      return { type: "contact", id: selectedItem.data.id };
    }
    return { type: "dmRoom", id: selectedItem.data.roomId };
  };

  // Helper functions to determine item type
  const isContactCard = (
    item: SelectedItem,
  ): item is SelectableItem & { type: "contact" } => {
    return item.type === "contact";
  };

  // Get display name for selected item
  const getDisplayName = (item: SelectedItem): string => {
    if (isContactCard(item)) {
      return item.data.nickname || item.data.contact_name;
    }
    return item.data.roomName;
  };

  // Get subtitle for selected item
  const getSubtitle = (item: SelectedItem): string => {
    if (isContactCard(item)) {
      const count = item.data.platformContacts.length;
      return `${count} platform${count !== 1 ? "s" : ""} connected`;
    }
    return `${item.data.platform} DM`;
  };

  useEffect(() => {
    if (isMobile) {
      setShowMobileList(true); // show sidebar on mobile
    }
  }, [isMobile, setShowMobileList]);

  return (
    <div className="h-screen">
      {isMobile ? (
        <div className="h-full w-full transition-all duration-300">
          {!selectedItem ? (
            <DMsList onSelect={handleItemSelect} selectedId={getSelectedId()} />
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-3 p-4 border-b">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleBackToList}
                  className="shrink-0"
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
                <div className="flex-1">
                  <h2 className="text-xl font-semibold">
                    {getDisplayName(selectedItem)}
                  </h2>
                  <div className="text-sm text-muted-foreground">
                    {getSubtitle(selectedItem)}
                  </div>
                </div>
              </div>
              <div className="flex-1 p-4">
                <div className="text-center text-muted-foreground h-full flex items-center justify-center">
                  <div>
                    <div className="text-lg mb-2">
                      {isContactCard(selectedItem)
                        ? "Merged Chat Coming Soon"
                        : "DM Chat"}
                    </div>
                    <div className="text-sm">
                      {isContactCard(selectedItem)
                        ? `Timeline view for ${getDisplayName(selectedItem)} will be implemented in Phase 2`
                        : `DM conversation with ${getDisplayName(selectedItem)}`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
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
            <div className="flex-1 p-4">
              {selectedItem ? (
                <div className="h-full">
                  <div className="border-b pb-4 mb-4">
                    <h2 className="text-xl font-semibold">
                      {getDisplayName(selectedItem)}
                    </h2>
                    <div className="text-sm text-muted-foreground">
                      {getSubtitle(selectedItem)}
                    </div>
                  </div>

                  <div className="text-center text-muted-foreground">
                    <div className="text-lg mb-2">
                      {isContactCard(selectedItem)
                        ? "Merged Chat Coming Soon"
                        : "DM Chat"}
                    </div>
                    <div className="text-sm">
                      {isContactCard(selectedItem)
                        ? `Timeline view for ${getDisplayName(selectedItem)} will be implemented in Phase 2`
                        : `DM conversation with ${getDisplayName(selectedItem)}`}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full flex items-center justify-center text-muted-foreground">
                  <div className="text-center">
                    <div className="text-lg mb-2">Select a contact</div>
                    <div className="text-sm">
                      Choose a contact from the left to view merged
                      conversations
                    </div>
                  </div>
                </div>
              )}
            </div>
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
