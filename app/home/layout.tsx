"use client";

import { House, Inbox } from "lucide-react";
import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import Link from "next/link";

export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const isMobile = useIsMobile();
  const [showMobileList, setShowMobileList] = useState(true);

  if (isMobile && !showMobileList) {
    return <div className="h-screen w-screen">{children}</div>;
  }

  return (
    <div className="flex flex-row h-screen">
      <div className="flex flex-col justify-between h-full p-2 border-r">
        <div className="flex flex-col gap-2">
          <Link href="/home">
            <Button variant="outline" size="icon" className="size-12">
              <House className="size-6" />
            </Button>
          </Link>
        </div>
        <div className="flex flex-col gap-2">
          <Link href="/inbox">
            <Button variant="outline" size="icon" className="size-12">
              <Inbox className="size-6" />
            </Button>
          </Link>
          <Link href="/user">
            <Button variant="outline" size="icon" className="size-12">
              {/* <UserRound className="size-6" /> */}
              <Avatar className="rounded-sm">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback className="rounded-sm">CN</AvatarFallback>
              </Avatar>
            </Button>
          </Link>
        </div>
      </div>
      <div className="flex flex-col gap-2 w-full">{children}</div>
    </div>
  );
}
