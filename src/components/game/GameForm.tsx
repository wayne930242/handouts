"use client";

import { useEffect, useRef, useState } from "react";
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
  useUpdateMutation,
  useUpsertMutation,
} from "@supabase-cache-helpers/postgrest-react-query";
import { getGameInfo } from "@/lib/supabase/query/gamesQuery";
import ImageManager from "@/lib/ImageManager";
import ImageUploadFormItem from "@/components/form/ImageUploadFormItem";
import OverlayLoading from "@/components/layout/OverlayLoading";
import { useClient } from "@/lib/supabase/client";

const FormSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  banner_url: z.string().optional(),
  content: z.string().optional(),
});

export default function GameForm({
  id,
  userId,
}: {
  id: string;
  userId: string;
}) {
  const supabase = useClient();
  const t = useTranslations("GameForm");

  const router = useRouter();

  const { data: gameInfo, isFetching } = useQuery(
    getGameInfo(supabase, id, userId),
    { enabled: id !== "new" }
  );

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      title: "",
      description: "",
      banner_url: "",
    },
  });
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const imageManager = new ImageManager({
    maxSizeMB: 1.5,
  });

  const { reset, control } = form;
  const bannerUrl = useWatch({
    control,
    name: "banner_url",
  });
  const deletingUrl = useRef<string | null>(null);

  useEffect(() => {
    if (!gameInfo) return;
    reset({
      title: gameInfo?.title ?? "",
      description: gameInfo?.description ?? "",
      banner_url: gameInfo?.banner_url ?? "",
    });
  }, [gameInfo, reset]);

  const { mutateAsync: createGame } = useInsertMutation(
    // @ts-ignore
    supabase.from("games"),
    ["id"]
  );

  const { mutateAsync: updateGame } = useUpsertMutation(
    // @ts-ignore
    supabase.from("games"),
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
        `games/${id}/images`
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
        await createGame([
          {
            title: data.title,
            description: data.description,
            banner_url: data.banner_url || null,
            gm_id: userId,
          },
        ]).catch((e) => {
          errorMessage = e.message;
        });
        break;
      default:
        await updateGame([
          {
            id,
            gm_id: userId,
            title: data.title,
            description: data.description,
            banner_url: data.banner_url || null,
          },
        ]).catch((e) => {
          errorMessage = e.message;
        });
    }

    setIsLoading(false);
    if (errorMessage) {
      toast({
        title: t("error"),
        description:
          "An error occurred while updating the game. Please try again later.",
        variant: "destructive",
      });
    } else {
      router.push("/games");
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
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("gameName")}</FormLabel>
              <FormControl>
                <Input placeholder={t("gameNamePlaceholder")} {...field} />
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
              <FormLabel>{t("gameDescription")}</FormLabel>
              <FormControl>
                <Textarea
                  placeholder={t("gameDescriptionPlaceholder")}
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
            deletingUrl.current = gameInfo?.banner_url ?? null;
          }}
          onSetFileCancelled={() => {
            form.setValue("banner_url", gameInfo?.banner_url ?? "");
            deletingUrl.current = null;
          }}
          onUrlClear={() => {
            form.setValue("banner_url", undefined);
            deletingUrl.current = gameInfo?.banner_url ?? null;
          }}
          label={t("bannerUrl")}
          placeholder={t("bannerUrlPlaceholder")}
          type="banner"
        />

        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              form.reset();
              router.push("/games");
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
