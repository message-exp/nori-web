export enum PlatformEnum {
  TELEGRAM = "Telegram",
  DISCORD = "Discord",
  MATRIX = "Matrix",
}

export interface ContactCard {
  id: string; // UUID
  contact_name: string;
  nickname: string | null;
  contact_avatar_url: string | null;
}

export interface PlatformContact {
  id: string; // UUID
  contact_card_id: string; // Foreign key to ContactCard
  platform: PlatformEnum;
  platform_user_id: string;
  dm_room_id: string;
}

// API Data Structures
export type ContactCardResponse = ContactCard;
export type ContactCardCreate = Omit<ContactCard, "id">;
export type ContactCardUpdate = Omit<ContactCard, "id">;

export type PlatformContactResponse = PlatformContact;
export type PlatformContactCreate = Omit<PlatformContact, "id">;
export type PlatformContactUpdate = Pick<
  PlatformContact,
  "platform_user_id" | "dm_room_id"
>;
