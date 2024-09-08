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
} from "../ui/form";
import { Input } from "../ui/input";
import { updatePassphrase } from "@/lib/passphraseCli";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";
import { PassphraseDialogKey } from "@/types/interfaces";

const FormSchema = z.object({
  id: z.string().min(1),
  passphrase: z.string().max(255).optional(),
});

export default function PassphraseForm({
  afterSubmit,
  afterCancel,
  defaultId,
  tableKey,
}: Props) {
  const rounder = useRouter();
  const searchParams = useSearchParams();

  const t = useTranslations("PhraseForm");

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: { id: defaultId ?? undefined, passphrase: undefined },
  });

  useEffect(() => {
    if (tableKey === "campaigns" && searchParams.get("campaign_id")) {
      form.setValue(
        "id",
        (searchParams.get("campaign_id") as string) ?? undefined
      );
    }
    if (tableKey === "docs" && searchParams.get("doc_id")) {
      form.setValue("id", (searchParams.get("doc_id") as string) ?? undefined);
    }
    if (searchParams.get("passphrase")) {
      form.setValue(
        "passphrase",
        (searchParams.get("passphrase") as string) ?? undefined
      );
    }
  }, [searchParams, tableKey]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    await updatePassphrase(data.id, data.passphrase, tableKey);
    afterSubmit?.();
    rounder.push("/" + tableKey + "/" + data.id);
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
                <FormLabel>
                  {tableKey === "campaigns" ? t("campaignId") : t("docId")}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={
                      tableKey === "campaigns"
                        ? t("pleaseEnterCampaignId")
                        : t("pleaseEnterDocId")
                    }
                    {...field}
                  />
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
                <FormLabel>{t("passphrase")} </FormLabel>
                <FormControl>
                  <Input placeholder={t("pleaseEnterPassphrase")} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={() => {
                form.reset();
                afterCancel?.();
              }}
            >
              {t("cancel")}
            </Button>
            <Button type="submit">{t("submit")}</Button>
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
  tableKey: PassphraseDialogKey;
}
