"use client";

import { useTranslations } from "next-intl";
import { useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import ImageUploadFormItem from "@/components/form/ImageUploadFormItem";
import ImageManager from "@/lib/s3/ImageManager";
import { Input } from "@/components/ui/input";
import { useClient } from "@/lib/supabase/client";
import useProfileStore from "@/lib/store/useProfileStore";
import { useEffect, useRef, useState } from "react";
import { toast } from "@/components/ui/use-toast";
import OverlayLoading from "@/components/layout/OverlayLoading";
import useSessionUser from "@/lib/hooks/useSession";

const FormSchema = z.object({
  display_name: z.string().min(1),
  avatar_url: z.string().optional(),
});

export default function ProfileForm() {
  const supabase = useClient();
  const user = useSessionUser();
  const userId = user?.id;

  const imageManager = new ImageManager({
    maxSizeMB: 0.5,
    maxWidthOrHeight: 640,
  });
  const [isLoading, setIsLoading] = useState(false);

  const [file, setFile] = useState<File | null>(null);
  const { profile, setProfile } = useProfileStore((state) => ({
    profile: state.profile,
    setProfile: state.setProfile,
  }));

  const t = useTranslations("ProfileForm");
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      display_name: profile?.display_name ?? "",
      avatar_url: profile?.avatar_url ?? "",
    },
  });
  const { reset, control } = form;
  const avatarUrl = useWatch({
    control,
    name: "avatar_url",
  });
  const deletingUrl = useRef<string | null>(null);

  useEffect(() => {
    if (profile) {
      reset({
        display_name: profile.display_name ?? "",
        avatar_url: profile.avatar_url ?? "",
      });
    }
  }, [profile, reset]);

  const onSubmit = async (data: z.infer<typeof FormSchema>) => {
    if (!userId) return;
    setIsLoading(true);
    if (deletingUrl.current) {
      await imageManager.deleteImageByUrl(deletingUrl.current);
    }

    if (file) {
      const imageUrl = await imageManager.uploadImage(
        file,
        `profile/${userId}/images`
      );
      data.avatar_url = imageUrl;
    }

    if (!file && deletingUrl.current) {
      data.avatar_url = undefined;
    }
    setFile(null);
    deletingUrl.current = null;

    const { data: _data, error } = await supabase
      .from("profiles")
      .update({
        display_name: data.display_name,
        avatar_url: data.avatar_url,
      })
      .eq("id", userId);
    setIsLoading(false);

    if (error) {
      toast({
        title: t("errorTitle"),
        description: t("errorDescription"),
        variant: "destructive",
      });
    } else {
      toast({
        title: t("successTitle"),
        description: t("successDescription"),
      });
    }

    if (_data) {
      setProfile(_data);
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
          name="display_name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("displayName")}</FormLabel>
              <FormControl>
                <Input placeholder={t("displayNamePlaceholder")} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <ImageUploadFormItem
          url={avatarUrl}
          file={file}
          setFile={(f) => {
            setFile(f);
            deletingUrl.current = profile?.avatar_url ?? null;
          }}
          onSetFileCancelled={() => {
            form.setValue("avatar_url", profile?.avatar_url ?? "");
            deletingUrl.current = null;
          }}
          onUrlClear={() => {
            form.setValue("avatar_url", "", { shouldValidate: true });
            deletingUrl.current = profile?.avatar_url ?? null;
          }}
          label={t("avatarUrl")}
          placeholder={t("avatarUrlPlaceholder")}
          type="avatar"
        />
        <div className="flex justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="destructive"
            onClick={() => {
              form.reset();
            }}
          >
            {t("cancel")}
          </Button>

          <Button
            type="submit"
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/80"
          >
            {t("save")}
          </Button>
        </div>
      </form>
      {isLoading && <OverlayLoading />}
    </Form>
  );
}
