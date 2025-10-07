import { useEffect } from "react";
import { useNavigate, useOutletContext } from "react-router";
import type { HomeLayoutContext } from "./_home";
import { DMsList, type SelectableItem } from "~/components/dms-list/dms-list";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { useDMsContext } from "~/contexts/dms-context";
import { Loading } from "~/components/ui/loading";

export default function DMsIndex() {
  const context = useOutletContext<HomeLayoutContext>();
  const { loading } = useDMsContext();
  const navigate = useNavigate();

  const handleItemSelect = (item: SelectableItem) => {
    const path =
      item.type === "contact"
        ? `/dms/contact/${item.data.id}`
        : `/dms/room/${item.data.roomId}`;
    navigate(path);
  };

  useEffect(() => {
    if (context?.isMobile) {
      context.setShowMobileList(true);
    }
  }, [context]);

  // Handle case where context is not ready yet
  if (!context) {
    return <Loading text="Loading application..." />;
  }

  const { isMobile } = context;

  if (loading) {
    return <Loading text="Loading direct messages..." />;
  }

  if (isMobile) {
    return (
      <div className="h-screen">
        <DMsList onSelect={handleItemSelect} selectedId={null} />
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
          <DMsList onSelect={handleItemSelect} selectedId={null} />
        </ResizablePanel>
        <ResizableHandle />
        <ResizablePanel defaultSize={75}>
          <div className="h-full flex items-center justify-center text-muted-foreground">
            <div className="text-center">
              <div className="text-lg mb-2">Select a contact</div>
              <div className="text-sm">
                Choose a contact from the left to view merged conversations
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
