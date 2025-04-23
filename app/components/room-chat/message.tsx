import * as sdk from "matrix-js-sdk";

interface MessageItemProps {
  message: sdk.MatrixEvent;
}

export function MessageItem({ message }: MessageItemProps) {
  const content = message.getContent();
  const sender = message.getSender();
  const timestamp = message.getDate();

  return (
    <div className="bg-card p-3 rounded-lg">
      <div className="font-medium">{sender}</div>
      <div className="text-sm">{content.body}</div>
      <div className="text-xs text-muted-foreground">
        {new Date(timestamp || "").toLocaleString()}
      </div>
    </div>
  );
}
