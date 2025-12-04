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
/**
 * Get the Tailwind background color class for a platform.
 * @param platform The platform enum value.
 * @returns The Tailwind CSS class for the platform's background color.
 */
export function getPlatformBgColor(platform: PlatformEnum): string {
  const style = PLATFORM_STYLES[platform];
  if (!style) {
    console.warn(`Unknown platform: ${platform}`);
    return "bg-gray-500";
  }
  return style.bgColor;
}

/**
 * Get the Tailwind text color class for a platform.
 * @param platform The platform enum value.
 * @returns The Tailwind CSS class for the platform's text color.
 */
export function getPlatformTextColor(platform: PlatformEnum): string {
  const style = PLATFORM_STYLES[platform];
  if (!style) {
    console.warn(`Unknown platform: ${platform}`);
    return "text-white";
  }
  return style.textColor;
}

/**
 * Get the hex color value for a platform.
 * @param platform The platform enum value.
 * @returns The hex color string for the platform.
 */
export function getPlatformHexColor(platform: PlatformEnum): string {
  const style = PLATFORM_STYLES[platform];
  if (!style) {
    console.warn(`Unknown platform: ${platform}`);
    return "#888888";
  }
  return style.hexColor;
}

/**
 * Get the display name for a platform.
 * @param platform The platform enum value.
 * @returns The display name string for the platform.
 */
export function getPlatformDisplayName(platform: PlatformEnum): string {
  const style = PLATFORM_STYLES[platform];
  if (!style) {
    console.warn(`Unknown platform: ${platform}`);
    return "Unknown";
  }
  return style.displayName;
}
