import clsx from "clsx";
import { House, Inbox } from "lucide-react";
import { useState } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { useIsMobile } from "~/hooks/use-mobile";

export default function HomeLayout() {
  const isMobile = useIsMobile();
  const [showMobileList, setShowMobileList] = useState(true);

  const navigate = useNavigate();

  if (isMobile && !showMobileList) {
    return <Outlet />;
  }

  return (
    <div className="flex flex-row h-screen">
      <div className="flex flex-col justify-between h-full p-2 border-r">
        <div className="flex flex-col gap-2">
          <NavLink to="/home">
            {({ isActive, isPending, isTransitioning }) => (
              <Button
                variant="outline"
                size="icon"
                className={clsx("size-12", isActive && "bg-accent")}
                onClick={() =>
                  navigate("/home", {
                    state: { showMobileList, setShowMobileList },
                  })
                }
              >
                <House className="size-6" />
              </Button>
            )}
          </NavLink>
        </div>
        <div className="flex flex-col gap-2">
          <NavLink to="/inbox">
            {({ isActive, isPending, isTransitioning }) => (
              <Button
                variant="outline"
                size="icon"
                className={clsx("size-12", isActive && "bg-accent")}
                onClick={() =>
                  navigate("/inbox", {
                    state: { showMobileList, setShowMobileList },
                  })
                }
              >
                <Inbox className="size-6" />
              </Button>
            )}
          </NavLink>
          <NavLink to="/user">
            {({ isActive, isPending, isTransitioning }) => (
              <Button
                variant="outline"
                size="icon"
                className={clsx("size-12", isActive && "bg-accent")}
                onClick={() =>
                  navigate("/user", {
                    state: { showMobileList, setShowMobileList },
                  })
                }
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
      <div className="flex flex-col gap-2 w-full">
        <Outlet />
      </div>
    </div>
  );
}
