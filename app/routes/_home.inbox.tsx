import { useState } from "react";
import { InviteList } from "~/components/invite-list";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Loading } from "~/components/ui/loading";
import { Inbox as InboxIcon } from "lucide-react";
import { useRoomContext } from "~/contexts/room-context";

export default function Inbox() {
  const [hasInvites, setHasInvites] = useState(false);
  const { loading } = useRoomContext();

  const handleInviteCountChange = (count: number) => {
    setHasInvites(count > 0);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loading text="Loading inbox..." className="p-8" />
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <div className="p-6">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Inbox</h2>
        </div>
      </div>
      <ScrollArea className="flex-1 px-6">
        <div className="flex flex-col pb-6">
          <InviteList onInviteCountChange={handleInviteCountChange} />
          {!hasInvites && (
            <div className="flex flex-col items-center justify-center p-12 text-center text-muted-foreground">
              <InboxIcon className="h-16 w-16 mb-6 opacity-40" />
              <p className="text-base font-medium">Your inbox is empty</p>
              <p className="text-sm mt-2 opacity-70">
                Room invitations will appear here
              </p>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
