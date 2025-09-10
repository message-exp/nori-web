import contactsApi from ".";
import type {
  ContactCardResponse,
  ContactCardCreate,
  ContactCardUpdate,
} from "./types";

export async function getAllContactCards(): Promise<ContactCardResponse[]> {
  const response = await contactsApi.get("/api/contact-cards/");
  return response.data;
}
export async function createContactCards(
  data: ContactCardCreate,
): Promise<ContactCardResponse> {
  const response = await contactsApi.post("/api/contact-cards/", data);
  return response.data;
}

export async function updateContactCard(
  contact_card_id: string,
  data: ContactCardUpdate,
): Promise<ContactCardResponse> {
  const response = await contactsApi.put(
    `/api/contact-cards/${contact_card_id}`,
    data,
  );
  return response.data;
}

export async function deleteContactCard(
  contact_card_id: string,
): Promise<{ message: string }> {
  const response = await contactsApi.delete(
    `/api/contact-cards/${contact_card_id}`,
  );
  return response.data;
}
