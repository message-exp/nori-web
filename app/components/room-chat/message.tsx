import * as sdk from "matrix-js-sdk";
import { getHttpUriForMxc } from "matrix-js-sdk/src/content-repo";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";
import { getUser, getUserAvatar } from "~/lib/matrix-api/user";
import { client } from "~/lib/matrix-api/client";
import { getImageHttpUrl, splitUserId } from "~/lib/matrix-api/utils";
import { useEffect, useState } from "react";
interface MessageItemProps {
  message: sdk.MatrixEvent;
}

export function MessageItem({ message }: MessageItemProps) {
  const content = message.getContent();
  const sender = message.getSender();
  const timestamp = message.getDate();

  const user = getUser(sender || "");
  const senderUsername =
    user?.displayName || splitUserId(sender || "").username;

  const msgType = content.msgtype;

  let messageBody: React.ReactNode = null;

  if (msgType === "m.image") {
    console.log(content);
    const imageUrl = getImageHttpUrl(content);
    console.log("image url: ", imageUrl);
    messageBody = (
      <img
        src={imageUrl}
        alt={content.body || "image"}
        className="max-w-xs rounded-lg"
      />
    );
  } else {
    messageBody = <div className="text-sm">{content.body}</div>;
  }

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
          <div className="bg-card p-3 rounded-lg w-fit">{messageBody}</div>
        </div>
      </div>
    </div>
  );
}
