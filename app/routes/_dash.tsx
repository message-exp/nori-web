import { useState } from "react";
import { Outlet } from "react-router";
import { useIsMobile } from "~/hooks/use-mobile";

export default function DashLayout() {
  const isMobile = useIsMobile();
  const [showMobileList, setShowMobileList] = useState(true);

  return (
    <div className="h-screen w-full overflow-y-auto">
      <Outlet context={{ isMobile, showMobileList, setShowMobileList }} />
    </div>
  );
}
