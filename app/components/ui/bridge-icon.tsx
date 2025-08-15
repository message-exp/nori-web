import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTelegram } from "@fortawesome/free-brands-svg-icons";

import type { Room } from "matrix-js-sdk";
import { detectPlatform } from "~/lib/matrix-api/utils";

interface BridgeIconProps {
  room: Room;
}

const BridgeIcon = ({ room }: BridgeIconProps) => {
  const platform = detectPlatform(room);

  if (platform === "Matrix") {
    return null;
  }

  let iconToShow = null;
  switch (platform) {
    case "Discord":
      iconToShow = (
        <FontAwesomeIcon
          icon={faDiscord}
          className="h-3.5 w-3.5 text-white"
          aria-label="Discord"
        />
      );
      break;
    case "Telegram":
      iconToShow = (
        <FontAwesomeIcon
          icon={faTelegram}
          className="h-3.5 w-3.5 text-white"
          aria-label="Telegram"
        />
      );
      break;
    default:
      iconToShow = null;
      break;
  }

  return (
    <span className="absolute bottom-0 right-0 flex items-center justify-center w-5 h-5 bg-gray-800 rounded-full ring-2 ring-gray-900 translate-x-1/4 translate-y-1/4">
      {iconToShow}
    </span>
  );
};
export { BridgeIcon };
