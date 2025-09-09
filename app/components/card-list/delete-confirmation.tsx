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
}

export function DeleteConfirmation({
  showConfirm,
  isDeleting,
  onShowConfirm,
  onConfirmDelete,
  onCancel,
  buttonText = "Delete Card",
  confirmText = "Confirm Delete",
}: DeleteConfirmationProps) {
  if (!showConfirm) {
    return (
      <Button
        variant="destructive"
        onClick={onShowConfirm}
        className="sm:mr-auto"
      >
        <Trash2 className="size-4 mr-2" />
        {buttonText}
      </Button>
    );
  }

  return (
    <div className="flex gap-2 sm:mr-auto">
      <Button
        variant="destructive"
        onClick={onConfirmDelete}
        disabled={isDeleting}
      >
        {isDeleting ? "Deleting..." : confirmText}
      </Button>
      <Button variant="outline" onClick={onCancel}>
        Cancel
      </Button>
    </div>
  );
}
