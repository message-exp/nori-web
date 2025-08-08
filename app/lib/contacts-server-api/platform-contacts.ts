import contactsApi from ".";
import type {
  PlatformContactResponse,
  PlatformContactCreate,
  PlatformContactUpdate,
} from "./types";
export async function getPlatformContacts(
  contact_card_id: string,
): Promise<PlatformContactResponse[]> {
  const response = await contactsApi.get(
    `/api/platform-contacts/${contact_card_id}`,
  );
  return response.data;
}

export async function createPlatformContact(
  data: PlatformContactCreate,
): Promise<PlatformContactResponse> {
  const response = await contactsApi.post(`/api/platform-contacts/`, data);
  return response.data;
}

export async function updatePlatformContact(
  platform_contact_id: string,
  data: PlatformContactUpdate,
): Promise<PlatformContactResponse> {
  const response = await contactsApi.put(
    `/api/platform-contacts/${platform_contact_id}`,
    data,
  );
  return response.data;
}
export async function deletePlatformContact(
  platform_contact_id: string,
): Promise<{ message: string }> {
  const response = await contactsApi.delete(
    `/api/platform-contacts/${platform_contact_id}`,
  );
  return response.data;
}
