import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getUser, getUserAvatar } from "~/lib/matrix-api/user";
import { splitUserId } from "~/lib/matrix-api/utils";
import TextMessage from "~/components/message/text-message";
import type { TimelineItem } from "~/lib/matrix-api/timeline-item";
import ImageMessage from "~/components/message/image-message";
import { useUserAvatar } from "~/hooks/use-user-avatar";
import { avatarFallback } from "~/lib/utils";

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

  const avatarUrl = useUserAvatar(user);

  return (
    <div className="">
      <div className="flex flex-row gap-2">
        <div className="flex items-start space-x-2">
          <Avatar>
            <AvatarImage src={avatarUrl} />
            <AvatarFallback>{avatarFallback(senderUsername)}</AvatarFallback>
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
            {/* 加上 Message ID 顯示 - 只在開發環境顯示 */}
            {process.env.NODE_ENV === "development" && (
              <div className="text-xs text-gray-400 font-mono">
                ID: {message.event?.getId() || "unknown"}{" "}
                {/* 只顯示最後8個字符 */}
              </div>
            )}
            {message.isEdited() && (
              <span className="text-xs text-muted-foreground italic">
                edited&nbsp;
                {/* <span title={new Date(editedTs).toLocaleString()}>
                  ({new Date(editedTs).toLocaleTimeString()})
                </span> */}
              </span>
            )}
          </div>
          <div className="bg-card p-3 rounded-lg w-fit max-w-2xs md:max-w-md">
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
              <ImageMessage message={message} />
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
