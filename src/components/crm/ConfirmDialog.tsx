import { AlertTriangle } from "lucide-react";
import { Modal } from "./Modal";

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmLabel?: string;
  destructive?: boolean;
}

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Подтвердить",
  destructive = false,
}: ConfirmDialogProps) {
  return (
    <Modal
      open={open}
      onClose={onClose}
      title={title}
      footer={
        <>
          <button
            onClick={onClose}
            className="h-9 px-4 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors"
          >
            Отмена
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className={`h-9 px-4 rounded-xl text-xs font-medium active:scale-95 transition-colors ${
              destructive
                ? "bg-destructive text-destructive-foreground hover:bg-destructive/90"
                : "bg-foreground text-primary-foreground hover:bg-foreground/90"
            }`}
          >
            {confirmLabel}
          </button>
        </>
      }
    >
      <div className="flex items-start gap-4">
        {destructive && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-destructive/10">
            <AlertTriangle className="h-5 w-5 text-destructive" />
          </div>
        )}
        <p className="text-sm text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </Modal>
  );
}
