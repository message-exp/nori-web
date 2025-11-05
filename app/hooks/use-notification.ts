import { useEffect, useState } from "react";
import {
  getNotificationPermission,
  requestNotificationPermission,
  type NotificationPermissionStatus,
} from "~/lib/notification";

/**
 * Hook for managing browser notification permissions and state
 */
export function useNotification() {
  const [permission, setPermission] =
    useState<NotificationPermissionStatus>("default");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // 檢查瀏覽器是否支援通知
    const supported = "Notification" in window;
    setIsSupported(supported);

    if (supported) {
      setPermission(getNotificationPermission());
    }
  }, []);

  const requestPermission = async () => {
    const result = await requestNotificationPermission();
    setPermission(result);
    return result;
  };

  return {
    permission,
    isSupported,
    requestPermission,
    isGranted: permission === "granted",
  };
}
