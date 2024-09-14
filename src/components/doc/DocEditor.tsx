"use client";
import { useUpsertMutation } from "@supabase-cache-helpers/postgrest-react-query";
import { DocInList } from "@/types/interfaces";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslations } from "next-intl";
import { useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";

import { useRouter } from "@/navigation";
import ImageManager from "@/lib/s3/ImageManager";
import { useClient } from "@/lib/supabase/client";
import usePreventLeave from "@/lib/hooks/usePreventLeave";

import { toast } from "@/components/ui/use-toast";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import MyMDXEditor from "@/components/form/MyMDXEditor";
import OverlayLoading from "@/components/layout/OverlayLoading";
import ImageUploadFormItem from "@/components/form/ImageUploadFormItem";
import useSaveShortcut from "@/lib/hooks/useSaveShortcut";

const formSchema = z.object({
  title: z.string().min(1).max(255),
  description: z.string().optional(),
  banner_url: z.string().optional(),
  content: z.string().optional(),
});

export default function DocEditor({ doc, callback }: Props) {
  const supabase = useClient();
  const t = useTranslations("DocEditor");

  const router = useRouter();

  const submitButton = useRef<HTMLButtonElement>(null);

  useSaveShortcut(() => {
    submitButton.current?.click();
  });

  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const imageManager = new ImageManager({
    maxSizeMB: 1.5,
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: doc.title,
      description: doc.description ?? undefined,
      banner_url: doc.banner_url ?? undefined,
      content: doc.content ?? undefined,
    },
  });

  const {
    formState: { isDirty },
    control,
  } = form;

  const bannerUrl = useWatch({
    control,
    name: "banner_url",
  });
  const deletingUrl = useRef<string | null>(null);

  usePreventLeave(isDirty, t("leaveAlert"));

  // @ts-ignore
  const { mutateAsync: updateDoc } = useUpsertMutation(supabase.from("docs"), [
    "id",
  ]);

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    if (deletingUrl.current) {
      await imageManager.deleteImageByUrl(deletingUrl.current);
    }

    if (file) {
      const imageUrl = await imageManager.uploadImage(
        file,
        `docs/${doc.id}/images`
      );
      data.banner_url = imageUrl;
    }

    if (!file && deletingUrl.current) {
      data.banner_url = undefined;
    }
    setFile(null);
    deletingUrl.current = null;

    await updateDoc([
      {
        id: doc.id,
        title: data.title,
        description: data.description,
        banner_url: data.banner_url,
        content: data.content,
      },
    ])
      .then(async () => {
        imageManager.cleanImages(
          `docs/${doc.id}/images`,
          data.content,
          data.banner_url ? [data.banner_url] : undefined
        );

        callback?.();

        toast({
          title: t("successTitle"),
          description: t("successDescription"),
        });

        form.reset({
          title: data.title,
          description: data.description,
          banner_url: data.banner_url,
          content: data.content,
        });
      })
      .catch(() => {
        toast({
          title: t("errorTitle"),
          description: t("errorDescription"),
          variant: "destructive",
        });
      });
    setIsLoading(false);
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
              <FormLabel>{t("docName")}</FormLabel>
              <FormControl>
                <Input placeholder={t("docNamePlaceholder")} {...field} />
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
            deletingUrl.current = doc.banner_url ?? null;
          }}
          onSetFileCancelled={() => {
            form.setValue("banner_url", doc.banner_url ?? "");
            deletingUrl.current = null;
          }}
          onUrlClear={() => {
            form.setValue("banner_url", undefined);
            deletingUrl.current = doc.banner_url ?? null;
          }}
          label={t("bannerUrl")}
          placeholder={t("bannerUrlPlaceholder")}
          type="banner"
        />

        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("docContent")}</FormLabel>
              <FormControl>
                <MyMDXEditor
                  markdown={field.value ?? ""}
                  oldMarkdown={doc.content ?? ""}
                  onChange={(value) => field.onChange(value)}
                  imageUploadHandler={async (image: File) => {
                    setIsLoading(true);
                    return imageManager
                      .uploadImage(image, `docs/${doc.id}/images`)
                      .then((url) => url)
                      .catch((e) => {
                        toast({
                          title: t("uploadFailed"),
                          description: t("uploadFailedDescription"),
                          variant: "destructive",
                        });
                        throw new Error("Failed to upload image");
                      })
                      .finally(() => setIsLoading(false));
                  }}
                />
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
              router.push("/docs");
            }}
          >
            {t("cancel")}
          </Button>

          <Button
            ref={submitButton}
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            {t("save")}
          </Button>
        </div>
        <div className="flex justify-end p-4">
          {isDirty && (
            <div className="text-sm text-destructive">
              {t("unsavedChanges")}
            </div>
          )}
        </div>
      </form>
      {isLoading && <OverlayLoading />}
    </Form>
  );
}

interface Props {
  doc: DocInList;
  callback?: () => any;
}
