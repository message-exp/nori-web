import { useOutletContext } from "react-router";
import type { HomeLayoutContext } from "./_home";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "~/components/ui/resizable";
import { InviteList } from "~/components/invite-list";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Inbox as InboxIcon } from "lucide-react";

const InboxContent = () => (
  <div className="flex flex-col h-screen">
    <div className="p-4 pr-2">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Inbox</h2>
      </div>
    </div>
    <ScrollArea className="flex-1 h-[calc(100vh-60px)]">
      <div className="flex flex-col">
        <InviteList />
        <div className="flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
          <InboxIcon className="h-12 w-12 mb-4 opacity-50" />
          <p className="text-sm">Your inbox is empty</p>
          <p className="text-xs mt-1">Invitations will appear here</p>
        </div>
      </div>
    </ScrollArea>
  </div>
);

const ContentPanel = () => (
  <div className="flex items-center justify-center h-full text-muted-foreground">
    <div className="text-center">
      <p className="text-sm">Select an invitation to view details</p>
    </div>
  </div>
);

export default function Inbox() {
  const { isMobile, showMobileList } = useOutletContext<HomeLayoutContext>();

  return (
    <div className="h-screen">
      {isMobile ? ( // Mobile Layout - Use non-resizable divs for full width control
        <>
          {showMobileList ? (
            <div className="h-full w-full transition-all duration-300">
              <InboxContent />
            </div>
          ) : (
            <div className="h-full w-full transition-all duration-300">
              <ContentPanel />
            </div>
          )}
        </>
      ) : (
        <ResizablePanelGroup direction="horizontal" className="h-full">
          <ResizablePanel
            defaultSize={25}
            maxSize={40}
            className="flex flex-col"
          >
            <InboxContent />
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>
            <ContentPanel />
          </ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
