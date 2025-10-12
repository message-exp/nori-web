import { PlatformEnum } from "~/lib/contacts-server-api/types";

export interface PlatformStyle {
  bgColor: string; // Tailwind class
  textColor: string; // Tailwind class
  hexColor: string; // Hex value
  displayName: string; // Display name
}

export const PLATFORM_STYLES: Record<PlatformEnum, PlatformStyle> = {
  [PlatformEnum.TELEGRAM]: {
    bgColor: "bg-[#0088cc]",
    textColor: "text-white",
    hexColor: "#0088cc",
    displayName: "Telegram",
  },
  [PlatformEnum.DISCORD]: {
    bgColor: "bg-[#5865F2]",
    textColor: "text-white",
    hexColor: "#5865F2",
    displayName: "Discord",
  },
  [PlatformEnum.MATRIX]: {
    bgColor: "bg-gray-900",
    textColor: "text-white",
    hexColor: "#1a1a1a",
    displayName: "Matrix",
  },
};

// Helper functions
export function getPlatformBgColor(platform: PlatformEnum): string {
  return PLATFORM_STYLES[platform].bgColor;
}

export function getPlatformTextColor(platform: PlatformEnum): string {
  return PLATFORM_STYLES[platform].textColor;
}

export function getPlatformHexColor(platform: PlatformEnum): string {
  return PLATFORM_STYLES[platform].hexColor;
}

export function getPlatformDisplayName(platform: PlatformEnum): string {
  return PLATFORM_STYLES[platform].displayName;
}
