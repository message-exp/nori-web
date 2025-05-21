import * as sdk from "matrix-js-sdk";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getUser, getUserAvatar } from "~/lib/matrix-api/user";
import { splitUserId } from "~/lib/matrix-api/utils";
import TextMessage from "~/components/message/message-text";

interface MessageItemProps {
  message: sdk.MatrixEvent;
}

export function MessageItem({ message }: MessageItemProps) {
  console.log("MessageItem", message);

  const content = message.getContent();
  const sender = message.getSender();
  const timestamp = message.getDate();

  const user = getUser(sender || "");
  const senderUsername =
    user?.displayName || splitUserId(sender || "").username;

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
              {timestamp
                ? new Date(timestamp).toLocaleString()
                : "Invalid time"}
            </div>
          </div>
          <div className="bg-card p-3 rounded-lg w-fit">
            {/* reference: https://spec.matrix.org/v1.14/client-server-api/#mroommessage-msgtypes */}
            {content.msgtype === "m.text" ? (
              <TextMessage content={content} />
            ) : content.msgtype === "m.emote" ? (
              <></>
            ) : content.msgtype === "m.notice" ? (
              <></>
            ) : content.msgtype === "m.image" ? (
              <></>
            ) : content.msgtype === "m.file" ? (
              <></>
            ) : content.msgtype === "m.audio" ? (
              <></>
            ) : content.msgtype === "m.video" ? (
              <></>
            ) : content.msgtype === "m.location" ? (
              <></>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
