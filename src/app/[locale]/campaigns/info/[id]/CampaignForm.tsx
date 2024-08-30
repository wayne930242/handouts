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
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getCampaignInfo } from "@/lib/supabase/query/campaignQuery";

const FormSchema = z.object({
  name: z.string().min(1).max(255),
  description: z.string().optional(),
  passphrase: z.string().max(255).optional(),
});

export default function CampaignForm({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const t = useTranslations("CampaignForm");
  const supabase = createClient();
  const router = useRouter();
  const { data: campaignInfo } = useQuery(
    getCampaignInfo(supabase, id, userId),
    {
      enabled: id !== "new",
    }
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: campaignInfo ? campaignInfo.name : undefined,
      description: campaignInfo
        ? campaignInfo.description ?? undefined
        : undefined,
      passphrase: campaignInfo
        ? campaignInfo.passphrase ?? undefined
        : undefined,
    },
  });

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    let errorMessage: string | undefined;
    switch (id) {
      case "new":
        const { error: createError } = await supabase.from("campaigns").insert([
          {
            gm_id: userId,
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
        if (!id) {
          errorMessage = "Campaign ID is required";
          break;
        }
        const { error: updateError } = await supabase
          .from("campaigns")
          .update({
            id,
            gm_id: userId,
            name: data.name,
            description: data.description,
            passphrase: data.passphrase,
          })
          .eq("id", id);

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
            {id === "new" ? t("create") : t("save")}
          </Button>
        </div>
      </form>
    </Form>
  );
}
