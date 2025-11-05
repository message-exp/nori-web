import { Bell, BellOff } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Label } from "~/components/ui/label";
import { useNotification } from "~/hooks/use-notification";
import { toast } from "sonner";

export function NotificationSettings() {
  const { permission, isSupported, requestPermission, isGranted } =
    useNotification();

  const handleRequestPermission = async () => {
    if (!isSupported) {
      toast.error("您的瀏覽器不支援通知功能");
      return;
    }

    if (permission === "granted") {
      toast.info("已經啟用通知功能");
      return;
    }

    const result = await requestPermission();

    if (result === "granted") {
      toast.success("通知功能已啟用！");
    } else if (result === "denied") {
      toast.error("通知權限被拒絕。您可以在瀏覽器設定中重新啟用。");
    } else {
      toast.info("請在瀏覽器提示中允許通知權限");
    }
  };

  if (!isSupported) {
    return (
      <div className="flex items-center justify-between">
        <div className="space-y-0.5">
          <Label className="text-base">瀏覽器通知</Label>
          <p className="text-sm text-muted-foreground">
            您的瀏覽器不支援通知功能
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-between">
      <div className="space-y-0.5">
        <Label className="text-base">瀏覽器通知</Label>
        <p className="text-sm text-muted-foreground">
          {isGranted ? "收到新訊息時顯示通知" : "啟用通知以接收新訊息提醒"}
        </p>
      </div>
      <Button
        variant={isGranted ? "outline" : "default"}
        size="sm"
        onClick={handleRequestPermission}
        disabled={isGranted}
      >
        {isGranted ? (
          <>
            <Bell className="h-4 w-4 mr-2" />
            已啟用
          </>
        ) : (
          <>
            <BellOff className="h-4 w-4 mr-2" />
            啟用通知
          </>
        )}
      </Button>
    </div>
  );
}
