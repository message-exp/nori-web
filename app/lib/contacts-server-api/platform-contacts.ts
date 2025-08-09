import contactsApi from ".";

interface platformContact {
  id: string;
  contact_card_id: string;
  platform: string;
  dm_room_id: string;
  platform_user_id: string;
}
export function getPlatformContacts(
  contact_card_id: string,
): Promise<platformContact[]> {
  return contactsApi
    .get(`/api/platform-contacts/${contact_card_id}`)
    .then((response) => response.data);
}

export function createPlatformContact(
  contact_card_id: string,
  platform: string,
  dm_room_id: string,
  platform_user_id: string,
): Promise<platformContact> {
  return contactsApi
    .post(`/api/platform-contacts/`, {
      contact_card_id,
      platform,
      dm_room_id,
      platform_user_id,
    })
    .then((response) => response.data);
}

export function updatePlatformContact(
  platform_contact_id: string,
  dm_room_id: string,
  platform_user_id: string,
): Promise<platformContact> {
  return contactsApi
    .put(`/api/platform-contacts/${platform_contact_id}`, {
      dm_room_id,
      platform_user_id,
    })
    .then((response) => response.data);
}
export function deletePlatformContact(
  platform_contact_id: string,
): Promise<{ message: string }> {
  return contactsApi
    .delete(`/api/platform-contacts/${platform_contact_id}`)
    .then((response) => response.data);
}
