import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDiscord, faTelegram } from "@fortawesome/free-brands-svg-icons";

import { EventTimeline, type Room } from "matrix-js-sdk";

interface BridgeIconProps {
  room: Room;
}

const BridgeIcon = ({ room }: BridgeIconProps) => {
  const state = room.getLiveTimeline().getState(EventTimeline.FORWARDS);
  const bridgeStateEvents = state?.getStateEvents("m.bridge");

  if (!bridgeStateEvents || bridgeStateEvents.length === 0) {
    return null;
  }

  const content = bridgeStateEvents[0].getContent();
  const protocol = content?.protocol?.id;

  let iconToShow = null;
  console.log(content?.protocol?.id);
  switch (protocol) {
    case "discordgo":
    case "discord":
      iconToShow = (
        <FontAwesomeIcon
          icon={faDiscord}
          className="h-3.5 w-3.5 text-white"
          aria-label="Discord"
        />
      );
      break;
    case "telegram":
      iconToShow = (
        <FontAwesomeIcon
          icon={faTelegram}
          className="h-3.5 w-3.5 text-white"
          aria-label="Telegram"
        />
      );
      break;
    default:
      break;
  }

  return (
    <span className="absolute bottom-0 right-0 flex items-center justify-center w-5 h-5 bg-gray-800 rounded-full ring-2 ring-gray-900 translate-x-1/4 translate-y-1/4">
      {iconToShow}
    </span>
  );
};
export { BridgeIcon };
