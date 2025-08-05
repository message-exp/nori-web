import clsx from "clsx";
import { House, Inbox } from "lucide-react";
import { useState, useEffect } from "react";
import { NavLink, Outlet } from "react-router";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { RoomProvider, useRoomContext } from "~/contexts/room-context";
import { useIsMobile } from "~/hooks/use-mobile";
import { getCurrentUser, getUserAvatar } from "~/lib/matrix-api/user";

function HomeLayoutContent() {
  const isMobile = useIsMobile();
  const [showMobileList, setShowMobileList] = useState(true);
  const [userAvatarUrl, setUserAvatarUrl] = useState<string | undefined>();
  const [userAvatarFallback, setUserAvatarFallback] = useState<
    string | undefined
  >();
  const { loading } = useRoomContext();

  useEffect(() => {
    if (loading) return;

    const fetchUserAvatar = async () => {
      try {
        const user = await getCurrentUser();
        const avatarUrl = await getUserAvatar(user);
        setUserAvatarUrl(avatarUrl);
        setUserAvatarFallback(
          user?.displayName
            ?.split(" ")
            .map((n) => n[0])
            .join(""),
        );
      } catch (error) {
        console.error("Failed to fetch user avatar:", error);
      }
    };

    fetchUserAvatar();
  }, [loading]);

  return (
    <>
      {isMobile && !showMobileList ? (
        <div className="h-full w-full overflow-y-auto">
          <Outlet context={{ isMobile, showMobileList, setShowMobileList }} />
        </div>
      ) : (
        <div className="flex flex-row h-full overflow-hidden">
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
                      <AvatarImage
                        src={userAvatarUrl || "https://github.com/shadcn.png"}
                      />
                      <AvatarFallback className="rounded-sm">
                        {userAvatarFallback}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                )}
              </NavLink>
            </div>
          </div>
          <div className="w-full h-full overflow-y-hidden">
            <Outlet context={{ isMobile, showMobileList, setShowMobileList }} />
          </div>
        </div>
      )}
    </>
  );
}

export default function HomeLayout() {
  return (
    <RoomProvider>
      <HomeLayoutContent />
    </RoomProvider>
  );
}
