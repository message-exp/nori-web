import { Trash2 } from "lucide-react";
import { Button } from "~/components/ui/button";

interface DeleteConfirmationProps {
  readonly showConfirm: boolean;
  readonly isDeleting: boolean;
  readonly onShowConfirm: () => void;
  readonly onConfirmDelete: () => void;
  readonly onCancel: () => void;
  readonly buttonText?: string;
  readonly confirmText?: string;
  readonly buttonVariant?: "destructive" | "ghost" | "outline" | "secondary";
  readonly buttonSize?: "default" | "sm" | "lg" | "icon";
  readonly className?: string;
  readonly showIcon?: boolean;
}

export function DeleteConfirmation({
  showConfirm,
  isDeleting,
  onShowConfirm,
  onConfirmDelete,
  onCancel,
  buttonText = "Delete",
  confirmText = "Confirm Delete",
  buttonVariant = "destructive",
  buttonSize = "default",
  className = "",
  showIcon = true,
}: DeleteConfirmationProps) {
  if (!showConfirm) {
    return (
      <Button
        variant={buttonVariant}
        size={buttonSize}
        onClick={onShowConfirm}
        className={className}
      >
        {showIcon && <Trash2 className="size-4 mr-2" />}
        {buttonText}
      </Button>
    );
  }

  return (
    <div className={`flex gap-2 ${className}`}>
      <Button
        variant="destructive"
        size={buttonSize}
        onClick={onConfirmDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : confirmText}
      </Button>
      <Button variant="outline" size={buttonSize} onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}
