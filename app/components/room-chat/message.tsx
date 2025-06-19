import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getUser, getUserAvatar } from "~/lib/matrix-api/user";
import { splitUserId } from "~/lib/matrix-api/utils";
import TextMessage from "~/components/message/text-message";
import type { TimelineItem } from "~/lib/matrix-api/timeline-item";

interface MessageItemProps {
  message: TimelineItem;
}

export function MessageItem({ message }: MessageItemProps) {
  const content =
    message.event!.getContent()["m.new_content"] || message.event!.getContent();
  const sender = message.event!.getSender();

  const user = getUser(sender || "");
  const senderUsername =
    user?.displayName || splitUserId(sender || "").username;

  // Get original (and edited) timestamps
  const originalTs = message.originalTs;

  return (
    <div className="">
      <div className="flex flex-row gap-2">
        <div className="flex items-start space-x-2">
          <Avatar>
            <AvatarImage src={getUserAvatar(user)} />
            <AvatarFallback>{senderUsername}</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex flex-col gap-2">
          <div className="flex flex-row gap-2">
            <div className="font-medium text-xs">{senderUsername}</div>
            <div className="text-xs text-muted-foreground">
              {originalTs
                ? new Date(originalTs).toLocaleString()
                : "Invalid time"}
            </div>
            {message.isEdited() && (
              <span className="text-xs text-muted-foreground italic">
                edited&nbsp;
                {/* <span title={new Date(editedTs).toLocaleString()}>
                  ({new Date(editedTs).toLocaleTimeString()})
                </span> */}
              </span>
            )}
          </div>
          <div className="bg-card p-3 rounded-lg w-fit">
            {/* reference: https://spec.matrix.org/v1.14/client-server-api/#mroommessage-msgtypes */}
            {content.msgtype === "m.text" ? (
              <TextMessage content={content} />
            ) : content.msgtype === "m.emote" ? (
              // TODO: Emote message type
              <TextMessage content={content} />
            ) : content.msgtype === "m.notice" ? (
              // TODO: Notice message type
              <TextMessage content={content} />
            ) : content.msgtype === "m.image" ? (
              // TODO: Image message type
              <TextMessage content={content} />
            ) : content.msgtype === "m.file" ? (
              // TODO: File message type
              <TextMessage content={content} />
            ) : content.msgtype === "m.audio" ? (
              // TODO: Audio message type
              <TextMessage content={content} />
            ) : content.msgtype === "m.video" ? (
              // TODO: Video message type
              <TextMessage content={content} />
            ) : content.msgtype === "m.location" ? (
              // TODO: Location message type
              <TextMessage content={content} />
            ) : (
              <TextMessage content={content} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
