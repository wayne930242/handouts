"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";

import { createClient } from "@/lib/supabase/client";
import { CampaignData } from "@/types/interfaces";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";

const FormSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  passphrase: z.string().max(255).optional(),
});

export default function CampaignForm({
  serverData,
}: {
  serverData: Partial<CampaignData>;
}) {
  const t = useTranslations("CampaignForm");
  const supabase = createClient();
  const router = useRouter();

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: serverData.name,
      description: serverData.description ?? undefined,
      passphrase: serverData.passphrase ?? undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    let errorMessage: string | undefined;
    switch (serverData.id) {
      case "new":
        const { error: createError } = await supabase.from("campaigns").insert([
          {
            gm_id: serverData.gm_id,
            name: data.name,
            description: data.description,
            passphrase: data.passphrase,
            status: "ACTIVE",
          },
        ]);

        if (createError) {
          errorMessage = createError.message;
        }
        break;
      default:
        if (!serverData.id) {
          errorMessage = "Campaign ID is required";
          break;
        }
        const { error: updateError } = await supabase
          .from("campaigns")
          .update({
            id: serverData.id,
            gm_id: serverData.gm_id,
            name: data.name,
            description: data.description,
            passphrase: data.passphrase,
          })
          .eq("id", serverData.id);

        if (updateError) {
          errorMessage = updateError.message;
        }
    }

    if (errorMessage) {
      toast({
        title: t("error"),
        description: errorMessage,
        variant: "destructive",
      });
    } else {
      router.push("/campaigns");
    }
  };

  return (
    <Form {...form}>
      <form
        className="w-full grid gap-y-2"
        onSubmit={form.handleSubmit(onSubmit)}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("campaignName")}</FormLabel>
              <FormControl>
                <Input placeholder={t("campaignNamePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("campaignDescription")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("campaignDescriptionPlaceholder")}
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
            <FormItem className="w-full">
              <FormLabel className="w-full">{t("passphrase")}</FormLabel>
              <FormControl>
                <Input placeholder={t("passphrasePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              form.reset();
              router.push("/campaigns");
            }}
          >
            {t("cancel")}
          </Button>

          <Button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            {serverData.id === "new" ? t("create") : t("save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
