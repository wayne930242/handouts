"use client";

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";
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

import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useRouter } from "@/navigation";
import {
  useInsertMutation,
  useQuery,
  useUpsertMutation,
} from "@supabase-cache-helpers/postgrest-react-query";
import { getCampaignInfo } from "@/lib/supabase/query/campaignsQuery";
import { useEffect, useRef, useState } from "react";
import ImageManager from "@/lib/s3/ImageManager";
import ImageUploadFormItem from "@/components/form/ImageUploadFormItem";
import OverlayLoading from "@/components/layout/OverlayLoading";
import { useClient } from "@/lib/supabase/client";

const FormSchema = z.object({
  name: z.string().min(1).max(255),
  banner_url: z.string().optional(),
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
  const supabase = useClient();
  const t = useTranslations("CampaignForm");

  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const imageManager = new ImageManager();

  const router = useRouter();
  const { data: campaignInfo, isFetching } = useQuery(
    getCampaignInfo(supabase, id, userId),
    {
      enabled: id !== "new",
    }
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: "",
      description: "",
      passphrase: "",
      banner_url: "",
    },
  });
  const { reset, control } = form;
  const bannerUrl = useWatch({
    control,
    name: "banner_url",
  });
  const deletingUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!campaignInfo) return;
    reset({
      name: campaignInfo?.name ?? "",
      description: campaignInfo?.description ?? "",
      passphrase: campaignInfo?.passphrase ?? "",
      banner_url: campaignInfo?.banner_url ?? "",
    });
  }, [campaignInfo, reset]);

  const { mutateAsync: createCampaig } = useInsertMutation(
    // @ts-ignore
    supabase.from("campaigns"),
    ["id"]
  );

  const { mutateAsync: updateCampaign } = useUpsertMutation(
    // @ts-ignore
    supabase.from("campaigns"),
    ["id"]
  );

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    let errorMessage: string | undefined;
    setIsLoading(true);
    if (deletingUrl.current) {
      await imageManager.deleteImageByUrl(deletingUrl.current);
    }

    if (file) {
      const imageUrl = await imageManager.uploadImage(
        file,
        `campaigns/${id}/images`
      );
      data.banner_url = imageUrl;
    }

    if (!file && deletingUrl.current) {
      data.banner_url = undefined;
    }
    setFile(null);
    deletingUrl.current = null;

    switch (id) {
      case "new":
        await createCampaig([
          {
            gm_id: userId,
            name: data.name,
            description: data.description,
            passphrase: data.passphrase,
            banner_url: data.banner_url,
            status: "ACTIVE",
          },
        ]).catch((e) => {
          errorMessage = e.message;
        });
        break;
      default:
        if (!id) {
          errorMessage = "Campaign ID is required";
          break;
        }
        await updateCampaign([
          {
            id,
            gm_id: userId,
            name: data.name,
            description: data.description,
            passphrase: data.passphrase,
            banner_url: data.banner_url,
            status: "ACTIVE",
          },
        ]).catch((e) => {
          errorMessage = e.message;
        });
    }

    setIsLoading(false);
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

        <ImageUploadFormItem
          url={bannerUrl}
          file={file}
          setFile={(f) => {
            setFile(f);
            deletingUrl.current = campaignInfo?.banner_url ?? null;
          }}
          onSetFileCancelled={() => {
            form.setValue("banner_url", campaignInfo?.banner_url ?? "");
            deletingUrl.current = null;
          }}
          onUrlClear={() => {
            form.setValue("banner_url", undefined);
            deletingUrl.current = campaignInfo?.banner_url ?? null;
          }}
          label={t("bannerUrl")}
          placeholder={t("bannerUrlPlaceholder")}
          type="banner"
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
      {(isLoading || isFetching) && <OverlayLoading />}
    </Form>
  );
}
