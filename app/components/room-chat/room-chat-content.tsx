import type { TimelineItem } from "~/lib/matrix-api/timeline-item";
import { MessageItem } from "./message";

const LoadingDots = () => (
  <div className="flex items-center justify-center space-x-1">
    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.3s]"></div>
    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground [animation-delay:-0.15s]"></div>
    <div className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground"></div>
  </div>
);

interface RoomChatContentProps {
  readonly roomLoading: boolean;
  readonly messages: readonly TimelineItem[];
  readonly hasMore: boolean;
  readonly hasNewer: boolean;
  readonly loading: boolean;
}

export default function RoomChatContent({
  roomLoading,
  messages,
  hasMore,
  hasNewer,
  loading,
}: RoomChatContentProps) {
  const renderContent = () => {
    if (roomLoading) {
      return (
        <div className="flex justify-center py-8">
          <LoadingDots />
        </div>
      );
    }

    if (messages.length > 0) {
      return (
        <div className="message-list-wrapper space-y-2">
          {hasMore && loading && (
            <div className="py-4">
              <LoadingDots />
            </div>
          )}

          {messages.map((message) => {
            const id = message.event?.getId();
            return (
              <div key={id} data-msg-id={id}>
                <MessageItem message={message} />
              </div>
            );
          })}

          {hasNewer && loading && (
            <div className="py-4">
              <LoadingDots />
            </div>
          )}
        </div>
      );
    }

    return <p className="text-center text-muted-foreground">No messages yet</p>;
  };

  return <div className="space-y-4 p-4">{renderContent()}</div>;
}
