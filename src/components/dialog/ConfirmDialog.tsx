import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";

interface Props<T extends any = any> {
  open?: boolean;
  setOpen?: (open: boolean) => void;
  title: string;
  description: string;
  onConfirm: (data: T) => Promise<void>;
  data: T;
  onCancel?: (data: T) => Promise<void>;
}

export default function ConfirmDialog<T extends any = any>({
  open,
  setOpen,
  title,
  description,
  data,
  onConfirm,
  onCancel,
}: Props<T>) {
  const t = useTranslations("ConfirmDialog");

  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen?.(open);
      }}
    >
      <DialogContent className="flex flex-col gap-2 w-full max-w-md p-4">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
        </DialogHeader>
        <DialogDescription>{description}</DialogDescription>
        <DialogFooter>
          <Button
            variant="secondary"
            onClick={() => {
              onCancel?.(data);
              setOpen?.(false);
            }}
            type="button"
          >
            {t("cancel")}
          </Button>
          <Button
            variant="destructive"
            onClick={() => {
              onConfirm(data);
              setOpen?.(false);
            }}
            type="button"
          >
            {t("confirm")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
