import * as sdk from "matrix-js-sdk";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getUser, getUserAvatar } from "~/lib/matrix-api/user";
import { splitUserId } from "~/lib/matrix-api/utils";
import TextMessage from "~/components/message/text-message";

interface MessageItemProps {
  message: sdk.MatrixEvent;
}

interface MatrixEventWithOriginalTs extends sdk.MatrixEvent {
  _originalTs?: number;
}

export function MessageItem({ message }: MessageItemProps) {
  const content = message.getContent();
  const sender = message.getSender();
  // const timestamp = message.getDate();

  const user = getUser(sender || "");
  const senderUsername =
    user?.displayName || splitUserId(sender || "").username;

  // Get original and edited timestamps
  const originalTs =
    (message as MatrixEventWithOriginalTs)._originalTs ||
    (content["m.relates_to"] && content["m.relates_to"].event_id
      ? undefined
      : message.getTs());
  const editedTs = (message as MatrixEventWithOriginalTs)._originalTs
    ? message.getTs()
    : undefined;

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
            {editedTs && (
              <span className="text-xs text-muted-foreground italic">
                edited&nbsp;
                <span title={new Date(editedTs).toLocaleString()}>
                  ({new Date(editedTs).toLocaleTimeString()})
                </span>
              </span>
            )}
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
