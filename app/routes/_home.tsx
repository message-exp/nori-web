import clsx from "clsx";
import { House, Inbox } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { RoomProvider } from "~/contexts/room-context";
import { useIsMobile } from "~/hooks/use-mobile";

export default function HomeLayout() {
  const isMobile = useIsMobile();
  const [showMobileList, setShowMobileList] = useState(true);

  return (
    <RoomProvider>
      {isMobile && !showMobileList ? (
        <div className="h-screen w-full overflow-y-auto">
          <Outlet context={{ isMobile, showMobileList, setShowMobileList }} />
        </div>
      ) : (
        <div className="flex flex-row h-screen">
          <div className="flex flex-col justify-between h-full p-2 border-r flex-shrink-0">
            <div className="flex flex-col gap-2">
              <NavLink to="/home">
                {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                {({ isActive, isPending, isTransitioning }) => (
                  <Button
                    variant="outline"
                    size="icon"
                    className={clsx("size-12", isActive && "bg-accent")}
                  >
                    <House className="size-6" />
                  </Button>
                )}
              </NavLink>
            </div>
            <div className="flex flex-col gap-2">
              <NavLink to="/inbox">
                {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                {({ isActive, isPending, isTransitioning }) => (
                  <Button
                    variant="outline"
                    size="icon"
                    className={clsx("size-12", isActive && "bg-accent")}
                  >
                    <Inbox className="size-6" />
                  </Button>
                )}
              </NavLink>
              <NavLink to="/user">
                {/* eslint-disable-next-line @typescript-eslint/no-unused-vars */}
                {({ isActive, isPending, isTransitioning }) => (
                  <Button
                    variant="outline"
                    size="icon"
                    className={clsx("size-12", isActive && "bg-accent")}
                  >
                    {/* <UserRound className="size-6" /> */}
                    <Avatar className="rounded-sm">
                      <AvatarImage src="https://github.com/shadcn.png" />
                      <AvatarFallback className="rounded-sm">CN</AvatarFallback>
                    </Avatar>
                  </Button>
                )}
              </NavLink>
            </div>
          </div>
          <div className="flex flex-col gap-2 w-full h-full overflow-y-auto">
            <Outlet context={{ isMobile, showMobileList, setShowMobileList }} />
          </div>
        </div>
      )}
    </RoomProvider>
  );
}
