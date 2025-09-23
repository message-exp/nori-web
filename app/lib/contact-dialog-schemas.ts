import { z } from "zod";

export const contactFormSchema = z.object({
  contact_name: z
    .string()
    .min(1, "Display name is required")
    .max(100, "Display name must be less than 100 characters"),
  nickname: z
    .string()
    .max(100, "Nickname must be less than 100 characters")
    .optional(),
  contact_avatar_url: z.string().optional(),
});

export const platformFormSchema = z.object({
  platform: z.enum(["Discord", "Telegram", "Matrix"]),
  platform_user_id: z.string().min(1, "Platform user ID is required"),
  dm_room_id: z.string().min(1, "DM room ID is required"),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;
export type PlatformFormData = z.infer<typeof platformFormSchema>;
