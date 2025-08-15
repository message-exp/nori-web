import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTelegram } from "@fortawesome/free-brands-svg-icons";
import { MessageCircle } from "lucide-react";

import type { Room } from "matrix-js-sdk";
import { detectPlatform } from "~/lib/matrix-api/utils";
import type { PlatformEnum } from "~/lib/contacts-server-api/types";

interface BridgeIconProps {
  room: Room;
}

interface PlatformIconProps {
  platform: PlatformEnum;
  className?: string;
}

const PlatformIcon = ({
  platform,
  className = "size-4 text-white",
}: PlatformIconProps) => {
  switch (platform) {
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
      return <MessageCircle className={className} aria-label="Matrix" />;
    default:
      return null;
  }
};

const BridgeIcon = ({ room }: BridgeIconProps) => {
  const platform = detectPlatform(room) as PlatformEnum;

  if (platform === "Matrix") {
    return null;
  }

  return (
    <span className="absolute bottom-0 right-0 flex items-center justify-center w-5 h-5 bg-gray-800 rounded-full ring-2 ring-gray-900 translate-x-1/4 translate-y-1/4">
      <PlatformIcon platform={platform} className="h-3.5 w-3.5 text-white" />
    </span>
  );
};
export { BridgeIcon, PlatformIcon };
