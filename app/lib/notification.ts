/**
 * 瀏覽器通知服務
 * 處理瀏覽器通知權限和通知顯示
 */

export type NotificationPermissionStatus = "granted" | "denied" | "default";

/**
 * 檢查瀏覽器是否支援通知 API
 */
export function isNotificationSupported(): boolean {
  return "Notification" in window;
}

/**
 * 取得目前的通知權限狀態
 */
export function getNotificationPermission(): NotificationPermissionStatus {
  if (!isNotificationSupported()) {
    return "denied";
  }
  return Notification.permission as NotificationPermissionStatus;
}

/**
 * 請求通知權限
 */
export async function requestNotificationPermission(): Promise<NotificationPermissionStatus> {
  if (!isNotificationSupported()) {
    console.warn("此瀏覽器不支援通知功能");
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  try {
    const permission = await Notification.requestPermission();
    return permission as NotificationPermissionStatus;
  } catch (error) {
    console.error("請求通知權限失敗:", error);
    return "denied";
  }
}

export interface NotificationOptions {
  title: string;
  body?: string;
  icon?: string;
  badge?: string;
  tag?: string;
  data?: unknown;
  requireInteraction?: boolean;
  silent?: boolean;
}

/**
 * 顯示瀏覽器通知
 */
export function showNotification(
  options: NotificationOptions,
): Notification | null {
  if (!isNotificationSupported()) {
    console.warn("此瀏覽器不支援通知功能");
    return null;
  }

  if (Notification.permission !== "granted") {
    console.warn("沒有通知權限");
    return null;
  }

  try {
    const notification = new Notification(options.title, {
      body: options.body,
      icon: options.icon,
      badge: options.badge,
      tag: options.tag,
      data: options.data,
      requireInteraction: options.requireInteraction,
      silent: options.silent,
    });

    return notification;
  } catch (error) {
    console.error("顯示通知失敗:", error);
    return null;
  }
}

/**
 * 檢查頁面是否處於非活躍狀態
 * 如果頁面不在前景，返回 true
 */
export function isPageInactive(): boolean {
  return document.hidden || !document.hasFocus();
}
