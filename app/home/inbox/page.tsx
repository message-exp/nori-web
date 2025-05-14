"use client";

// import { useOutletContext } from "react-router";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import React from "react";

// type HomeLayoutContext = {
//   isMobile: boolean;
//   showMobileList: boolean;
//   setShowMobileList: React.Dispatch<React.SetStateAction<boolean>>;
// };

export default function Inbox() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const { isMobile, showMobileList, setShowMobileList } =
  //   useOutletContext<HomeLayoutContext>();
  const isMobile = false;
  const [showMobileList, setShowMobileList] = React.useState(true);

  return (
    <div className="h-screen">
      {isMobile ? ( // Mobile Layout - Use non-resizable divs for full width control
        <>
          {showMobileList ? (
            <div className="h-full w-full transition-all duration-300">
              inbox
            </div>
          ) : (
            <div className="h-full w-full transition-all duration-300">
              content
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
            inbox
          </ResizablePanel>
          <ResizableHandle />
          <ResizablePanel defaultSize={75}>content</ResizablePanel>
        </ResizablePanelGroup>
      )}
    </div>
  );
}
