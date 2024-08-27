"use client";

import { useRouter } from "@/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { updatePassphrase } from "@/lib/passphraseCli";

const FormSchema = z.object({
  id: z.string().min(1),
  passphrase: z.string().optional(),
});

export default function PassphraseForm({
  afterSubmit,
  afterCancel,
  defaultId,
}: Props) {
  const rounder = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { id: defaultId ?? "", passphrase: "" },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    await updatePassphrase(data.id, data.passphrase);
    afterSubmit?.();
    rounder.push("/campaigns/" + data.id);
  };

  return (
    <div className="max-w-sm w-full">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="flex flex-col gap-2 mb-4"
        >
          <FormField
            control={form.control}
            name="id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>戰役 ID</FormLabel>
                <FormControl>
                  <Input placeholder="請輸入戰役 ID" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="passphrase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>通關密語</FormLabel>
                <FormControl>
                  <Input placeholder="請輸入通關密語" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter>
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                form.reset();
                afterCancel?.();
              }}
            >
              取消
            </Button>
            <Button type="submit">確定</Button>
          </DialogFooter>
        </form>
      </Form>
    </div>
  );
}

interface Props {
  defaultId?: string;
  afterSubmit?: () => void;
  afterCancel?: () => void;
}
