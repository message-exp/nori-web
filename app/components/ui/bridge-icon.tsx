import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { MessageCircle } from "lucide-react";

import { detectPlatform } from "~/lib/matrix-api/utils";
import type { PlatformEnum } from "~/lib/contacts-server-api/types";
import { type Room } from "matrix-js-sdk";

interface BridgeIconProps {
  room?: Room;
  platform?: PlatformEnum;
  className?: string;
  showMatrix?: boolean;
}

const BridgeIcon = ({
  room,
  platform,
  className = "h-4 w-4 text-white",
  showMatrix = false,
}: BridgeIconProps) => {
  // 決定使用哪個 platform
  const targetPlatform = platform || (room ? detectPlatform(room) : null);

  if (!targetPlatform) {
    return null;
  }

  // 產生平台圖示
  switch (targetPlatform) {
    case "Discord":
      return (
        <FontAwesomeIcon
          icon={faDiscord}
          className={className}
          aria-label="Discord"
        />
      );
    case "Telegram":
      return (
        <FontAwesomeIcon
          icon={faTelegram}
          className={className}
          aria-label="Telegram"
        />
      );
    case "Matrix":
      return showMatrix ? (
        <MessageCircle className={className} aria-label="Matrix" />
      ) : null;
    default:
      return null;
  }
};

export { BridgeIcon };
