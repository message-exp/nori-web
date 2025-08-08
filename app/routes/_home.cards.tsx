import { useEffect, useState } from "react";

import CardList from "~/components/card-list/card-list";
import type {
  ContactCard as ContactCardType,
  PlatformContact,
  PlatformEnum,
} from "~/lib/contacts-server-api/types";

const mockContactCards: ContactCardType[] = Array.from(
  { length: 12 },
  (_, i) => ({
    id: `contact-${i + 1}`,
    contact_name: `Contact ${i + 1}`,
    nickname: i % 3 === 0 ? `Nick${i + 1}` : undefined,
    contact_avatar_url:
      i % 3 === 1 ? "https://img.senen.dev/IMG_20240704_135615.jpg" : undefined,
  }),
);

const mockPlatformContacts: Record<string, PlatformContact[]> = {
  "contact-1": [
    {
      id: "pc-1",
      contact_card_id: "contact-1",
      platform: "Discord" as PlatformEnum,
      platform_user_id: "user123",
      dm_room_id: "room123",
    },
    {
      id: "pc-2",
      contact_card_id: "contact-1",
      platform: "Telegram" as PlatformEnum,
      platform_user_id: "tg_user123",
      dm_room_id: "tg_room123",
    },
    {
      id: "pc-2-1",
      contact_card_id: "contact-1",
      platform: "Telegram" as PlatformEnum,
      platform_user_id: "tg_user123",
      dm_room_id: "tg_room123",
    },
    {
      id: "pc-2-2",
      contact_card_id: "contact-1",
      platform: "Telegram" as PlatformEnum,
      platform_user_id: "tg_user123",
      dm_room_id: "tg_room123",
    },
  ],
  "contact-2": [
    {
      id: "pc-3",
      contact_card_id: "contact-2",
      platform: "Matrix" as PlatformEnum,
      platform_user_id: "@user:matrix.org",
      dm_room_id: "!room:matrix.org",
    },
  ],
};

export default function CardsPage() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 模擬 3 秒載入時間
    const timer = setTimeout(() => {
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleAddCard = () => {
    // TODO: 實作新增卡片功能
    console.log("新增卡片");
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">載入中...</div>
    );
  }

  return (
    <CardList
      contactCards={mockContactCards}
      platformContacts={mockPlatformContacts}
      onAddCard={handleAddCard}
    />
  );
}
