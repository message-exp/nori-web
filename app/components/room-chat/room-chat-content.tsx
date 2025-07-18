import type { TimelineItem } from "~/lib/matrix-api/timeline-item";
import { MessageItem } from "./message";

interface RoomChatContentProps {
  readonly roomLoading: boolean;
  readonly messages: readonly TimelineItem[];
}

export default function RoomChatContent({
  roomLoading,
  messages,
}: RoomChatContentProps) {
  const renderContent = () => {
    if (roomLoading) {
      return (
        <div className="flex justify-center text-muted-foreground">
          <p>Loading...</p>
        </div>
      );
    }

    if (messages.length > 0) {
      console.log("top message id: ", messages[0].event?.getId());
      return (
        <div className="message-list-wrapper space-y-2">
          {/* TODO: disable if no newer message */}
          <p className="text-center text-muted-foreground">loading</p>
          {messages.map((message) => {
            const id = message.event?.getId();
            return (
              <div key={id} data-msg-id={id}>
                <MessageItem message={message} />
              </div>
            );
          })}
        </div>
      );
    }

    return <p className="text-center text-muted-foreground">No messages yet</p>;
  };

  return <div className="space-y-4 p-4">{renderContent()}</div>;
}
