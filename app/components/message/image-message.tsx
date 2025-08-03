import { useEffect, useState } from "react";
import type { TimelineItem } from "~/lib/matrix-api/timeline-item";
import { getMessageImageBlob } from "~/lib/matrix-api/utils";
interface MessageItemProps {
  message: TimelineItem;
}

// reference: https://spec.matrix.org/v1.14/client-server-api/#mroommessage-msgtypes

export default function ImageMessage({ message }: MessageItemProps) {
  const content = message.event!.getContent();
  const [imageUrl, setImageUrl] = useState<string | undefined>();

  useEffect(() => {
    let newImageUrl: string | undefined;
    getMessageImageBlob(message.event!).then((blob) => {
      if (blob) {
        newImageUrl = URL.createObjectURL(blob);
        setImageUrl(newImageUrl);
      }
    });

    return () => {
      if (newImageUrl) {
        URL.revokeObjectURL(newImageUrl);
      }
    };
  }, [content, message]);

  return imageUrl ? (
    <img
      src={imageUrl}
      alt={content.body || "image"}
      className="max-w-xs rounded-lg"
    />
  ) : (
    <div className="text-sm">Loading image...</div>
  );
}
