import contactsApi from ".";
import { getAuthCookies } from "../utils";

interface contactCard {
  id: string;
  contact_name: string;
  nickname: string;
  contact_avatar_url: string;
}

export function getAllContactCards(): Promise<contactCard[]> {
  return contactsApi
    .get("/api/contact-cards")
    .then((response) => response.data);
}
export function createContactCards(
  contact_name: string,
  nickname: string,
  contact_avatar_url: string,
): Promise<contactCard> {
  return contactsApi
    .post("/api/contact-cards", {
      contact_name,
      nickname,
      contact_avatar_url,
    })
    .then((response) => response.data);
}

export function updateContactCard(
  contact_card_id: string,
  contact_name: string,
  nickname: string,
  contact_avatar_url: string,
): Promise<contactCard> {
  return contactsApi
    .put(`/api/contact-cards/${contact_card_id}`, {
      contact_name,
      nickname,
      contact_avatar_url,
    })
    .then((response) => response.data);
}

export function deleteContactCard(
  contact_card_id: string,
): Promise<{ message: string }> {
  return contactsApi
    .delete(`/api/contact-cards/${contact_card_id}`)
    .then((response) => response.data);
}
