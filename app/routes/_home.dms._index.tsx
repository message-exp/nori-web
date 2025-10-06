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
import { useDMsContext } from "~/contexts/dms-context";
import { Loading } from "~/components/ui/loading";

type HomeLayoutContext = {
  isMobile: boolean;
  showMobileList: boolean;
  setShowMobileList: React.Dispatch<React.SetStateAction<boolean>>;
};

type SelectedItem = SelectableItem;

// Helper functions
const isContactCard = (
  item: SelectedItem,
): item is SelectableItem & { type: "contact" } => {
  return item.type === "contact";
};

const getDisplayName = (item: SelectedItem): string => {
  if (isContactCard(item)) {
    return item.data.nickname || item.data.contact_name;
  }
  return item.data.roomName;
};

const getSubtitle = (item: SelectedItem): string => {
  if (isContactCard(item)) {
    const count = item.data.platformContacts.length;
    return `${count} platform${count !== 1 ? "s" : ""} connected`;
  }
  return `${item.data.platform} DM`;
};

// Mobile header component
function MobileHeader({
  item,
  onBack,
}: Readonly<{ item: SelectedItem; onBack: () => void }>) {
  return (
    <div className="flex items-center gap-3 p-4 border-b">
      <Button variant="ghost" size="icon" onClick={onBack} className="shrink-0">
        <ArrowLeft className="h-4 w-4" />
      </Button>
      <div className="flex-1">
        <h2 className="text-xl font-semibold">{getDisplayName(item)}</h2>
        <div className="text-sm text-muted-foreground">{getSubtitle(item)}</div>
      </div>
    </div>
  );
}

// Content placeholder component
function ContentPlaceholder({ item }: Readonly<{ item: SelectedItem }>) {
  const isContact = isContactCard(item);
  return (
    <div className="text-center text-muted-foreground h-full flex items-center justify-center">
      <div>
        <div className="text-lg mb-2">
          {isContact ? "Merged Chat Coming Soon" : "DM Chat"}
        </div>
        <div className="text-sm">
          {isContact
            ? `Timeline view for ${getDisplayName(item)} will be implemented in Phase 2`
            : `DM conversation with ${getDisplayName(item)}`}
        </div>
      </div>
    </div>
  );
}

// Desktop content component
function DesktopContent({ item }: Readonly<{ item: SelectedItem | null }>) {
  if (!item) {
    return (
      <div className="h-full flex items-center justify-center text-muted-foreground">
        <div className="text-center">
          <div className="text-lg mb-2">Select a contact</div>
          <div className="text-sm">
            Choose a contact from the left to view merged conversations
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full">
      <div className="border-b pb-4 mb-4">
        <h2 className="text-xl font-semibold">{getDisplayName(item)}</h2>
        <div className="text-sm text-muted-foreground">{getSubtitle(item)}</div>
      </div>
      <ContentPlaceholder item={item} />
    </div>
  );
}

export default function DMsIndex() {
  const context = useOutletContext<HomeLayoutContext>();
  const { loading } = useDMsContext();
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState<SelectedItem | null>(null);

  const handleItemSelect = (item: SelectableItem) => {
    const path =
      item.type === "contact"
        ? `/dms/contact/${item.data.id}`
        : `/dms/room/${item.data.roomId}`;
    navigate(path);
  };

  const handleBackToList = useCallback(() => {
    setSelectedItem(null);
  }, []);

  const getSelectedId = (): SelectableItemId | null => {
    if (!selectedItem) return null;
    return selectedItem.type === "contact"
      ? { type: "contact", id: selectedItem.data.id }
      : { type: "dmRoom", id: selectedItem.data.roomId };
  };

  useEffect(() => {
    if (context?.isMobile) {
      context.setShowMobileList(true);
    }
  }, [context]);

  // Handle case where context is not ready yet
  if (!context) {
    return <Loading text="Loading..." />;
  }

  const { isMobile } = context;

  if (loading) {
    return <Loading text="Loading DMs..." />;
  }

  if (isMobile) {
    return (
      <div className="h-screen">
        <div className="h-full w-full transition-all duration-300">
          {!selectedItem ? (
            <DMsList onSelect={handleItemSelect} selectedId={getSelectedId()} />
          ) : (
            <div className="flex flex-col h-full">
              <MobileHeader item={selectedItem} onBack={handleBackToList} />
              <div className="flex-1 p-4">
                <ContentPlaceholder item={selectedItem} />
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen">
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
            <DesktopContent item={selectedItem} />
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
